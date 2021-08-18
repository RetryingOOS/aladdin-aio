import React from 'react';
import {
  Panel,
  Icon,
  Button,
  Avatar,
  IconButton,
  Input,
  FormGroup,
  FormControl,
  ControlLabel,
  List,
  Dropdown,
  Modal,
  Form,
  FlexboxGrid,
} from 'rsuite';
import Clock from 'react-live-clock';
import { connect } from 'react-redux';
import cogoToast from 'cogo-toast';

const { ipcRenderer } = require('electron');

const styleCenter = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '60px',
};

const titleStyle = {
  paddingBottom: 5,
  whiteSpace: 'nowrap',
  fontWeight: 500,
};

class Proxies extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedProxygroup: '',
      edit: false,
      formValue: {
        name: '',
        proxies: '',
      },
    };
  }

  search = (term) => {
    if (term !== '') {
      const filteredProxies = this.props.state.proxies.filter((row) =>
        JSON.stringify(row).toLowerCase().includes(term.toLowerCase())
      );
      this.props.dispatch({
        type: 'update',
        obj: { filteredProxies, search: true },
      });
    } else {
      this.props.dispatch({
        type: 'update',
        obj: { search: false },
      });
    }
  };

  close = () => {
    this.setState({ show: false });
  };

  open = () => {
    this.setState({ show: true });
  };

  editProxyGroup = (e) => {
    this.setState((prevState) => ({
      ...prevState,
      edit: true,
      formValue: {
        id: this.props.state.proxies[prevState.selectedProxygroup].id,
        name: this.props.state.proxies[prevState.selectedProxygroup].name,
        proxies: this.formatProxy(
          this.props.state.proxies[prevState.selectedProxygroup]
        ),
      },
    }));
    this.open();
  };

  sendEditProxies = () => {
    console.log(this.state.formValue);
    ipcRenderer.send('edit:proxy', this.state.formValue);
    this.close();
    this.getProxies();
    cogoToast.success(`Edited Proxy Group`, {
      position: 'top-right',
      heading: 'Success',
    });
  };

  formatProxy = (proxyObject) => {
    let proxyText = '';
    const { proxies } = proxyObject;
    const keys = Object.keys(proxies);
    for (let i = 0; i < keys.length; i += 1) {
      const key = keys[i];
      const value = proxies[key];
      if (!value.user && !value.password) {
        proxyText += `${value.ip}:${value.port}\n`;
      } else {
        proxyText += `${value.ip}:${value.port}:${value.user}:${value.password}\n`;
      }
    }
    return proxyText;
  };

  componentDidMount() {
    this.getProxies();
  }

  objectToArray = (object) => {
    if (Array.isArray(object)) {
      return object;
    }
    const array = [];
    for (const property in object) {
      array.push(object[property]);
    }
    return array;
  };

  setSelectedProxygroup = (id) => {
    this.setState((prevState) => ({
      ...prevState,
      selectedProxygroup: id,
    }));
  };

  getProxies = () => {
    const proxies = ipcRenderer.sendSync('get:proxies');
    this.props.dispatch({ type: 'update', obj: { proxies } });
    if (!this.state.selectedProxygroup) {
      this.setState((prevState) => ({
        ...prevState,
        selectedProxygroup: proxies[Object.keys(proxies)[0]]?.id,
      }));
    }
  };

  addProxies = (e) => {
    ipcRenderer.sendSync('add:proxies', this.state.formValue);
    this.close();
    this.setState((prevState) => ({
      ...prevState,
      formValue: {
        name: '',
        proxies: '',
      },
    }));
    this.getProxies();
  };

  deleteProxies = (e, id) => {
    ipcRenderer.sendSync('delete:proxies', id);
    this.getProxies();
  };

  height = () => {
    const height = window.innerHeight;
    return Math.round(0.75 * height);
  };

  spanColor = (num) => {
    num = parseInt(num, 10);
    if (num < 500) {
      return '#5dd47d';
    }
    return '#e0563a';
  };

  deleteSpecificProxy = (e, groupID, id) => {
    ipcRenderer.sendSync('delete:specific:proxy', groupID, id);
    this.getProxies();
  };

  pingProxy = (e, groupID, id, proxy) => {
    ipcRenderer.send('test:proxy', groupID, id, proxy);
  };

  testAllProxies = (e) => {
    const proxiesObject =
      this.props.state.proxies[this.state.selectedProxygroup].proxies;

    for (const property in proxiesObject) {
      const item = proxiesObject[property];
      this.pingProxy(
        e,
        this.state.selectedProxygroup,
        property,
        item.password
          ? `${item.ip}:${item.port}:${item.user}:${item.password}`
          : `${item.ip}:${item.port}`
      );
    }
  };

  render() {
    const { formValue } = this.state;

    return (
      <>
        <Modal show={this.state.show} onHide={this.close} size="md">
          <Modal.Header>
            <Modal.Title>
              {this.state.edit ? 'Edit Proxy Group' : 'Create Proxy Group'}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body style={{ overflow: 'hidden' }}>
            <Form
              fluid
              // onChange={this.handleChange}
              onChange={(formValue) => {
                this.setState({ formValue });
              }}
              formValue={formValue}
            >
              <FormGroup style={{ marginLeft: '5%', marginRight: '5%' }}>
                <ControlLabel>Name</ControlLabel>
                <FormControl placeholder="Name" block name="name" />
              </FormGroup>
              <FormGroup style={{ marginLeft: '5%', marginRight: '5%' }}>
                <ControlLabel>Proxies</ControlLabel>
                <FormControl
                  componentClass="textarea"
                  placeholder="Paste your proxies here"
                  block
                  rows={5}
                  name="proxies"
                />
              </FormGroup>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button
              onClick={this.close}
              style={{
                color: 'white',
                border: '3px solid white',
                marginRight: '1rem',
              }}
              appearance="ghost"
            >
              Cancel
            </Button>
            <Button
              onClick={
                !this.state.edit ? this.addProxies : this.sendEditProxies
              }
              style={{
                color: 'springgreen',
                border: '3px solid springgreen',
              }}
              appearance="ghost"
            >
              Save
            </Button>
          </Modal.Footer>
        </Modal>
        <div
          className="SettingsPage"
          style={{
            width: '90%',
            position: 'absolute',
            top: '50px',
            left: '8%',
            // overflowX: 'clip',
          }}
        >
          <h5>Proxy Groups</h5>
          <Clock
            format="HH:mm:ss"
            interval={1000}
            ticking
            style={{ position: 'absolute', top: '-25px', fontSize: '1rem' }}
          />
          <div
            style={{
              width: '18%',
              position: 'absolute',
              top: '-25px',
              overflowY: 'scroll',
              display: 'block',
              marginTop: '80px',
              overflowX: 'hidden',
            }}
          >
            <Input
              style={{
                float: 'right',
                position: 'absolute',
                left: '120%',
                top: '-24%',
                width: '172%',
                border: '3px ​solid #3c3f4',
              }}
              onChange={this.search}
              placeholder="Search"
            />
            <Button
              center
              block
              size="lg"
              color="blue"
              style={{ margin: 'auto', marginBottom: '1rem' }}
              onClick={this.open}
            >
              <Icon icon="plus-square" /> Create Proxy Group
            </Button>
            {this.objectToArray(this.props.state.proxies).map((row) => (
              <Panel
                style={{
                  marginBottom: '7%',
                  width: '95%',
                  height: 'min-content',
                  border: `${
                    this.state?.selectedProxygroup === row?.id
                      ? '2px solid #92ade0'
                      : 'none'
                  }`,
                }}
                key={row.id}
                onClick={(e) => this.setSelectedProxygroup(row.id)}
                shaded
                bordered
              >
                <Avatar style={{ marginRight: '5%' }} size="md">
                  {Object.keys(row.proxies).length}
                </Avatar>

                <h5
                  style={{
                    float: 'right',
                    top: '17%',
                    right: '40%',
                    display: 'contents',
                  }}
                >
                  {row.name}
                </h5>
                <div style={{ float: 'right' }}>
                  <Dropdown
                    placement="leftStart"
                    renderTitle={() => {
                      return (
                        <IconButton
                          style={{
                            float: 'right',
                            position: 'sticky',
                            transform: 'translateY(-17px) translateX(18px)',
                            background: 'transparent',
                          }}
                          size="lg"
                          icon={<Icon icon="ellipsis-h" />}
                        />
                      );
                    }}
                  >
                    <Dropdown.Item
                      onSelect={(e) => this.deleteProxies(e, row?.id)}
                    >
                      <Icon icon="trash2" /> Delete Group
                    </Dropdown.Item>
                  </Dropdown>
                </div>
              </Panel>
            ))}
          </div>
          <div
            style={{
              position: 'absolute',
              top: '6%',
              right: '10px',
              width: '79%',
            }}
          >
            <Button
              style={{ position: 'relative', left: '50%' }}
              onClick={this.editProxyGroup}
              appearance="primary"
            >
              <Icon icon="spinner" /> Edit Group
            </Button>
            <Button
              style={{ position: 'relative', left: '80%' }}
              onClick={this.testAllProxies}
              appearance="primary"
            >
              <Icon icon="spinner" /> Test All Proxies
            </Button>

            <div>
              <List style={{ height: `${this.height()}px` }} hover>
                {this.objectToArray(
                  this.objectToArray(this.props.state.proxies).filter(
                    (item) => item.id === this.state.selectedProxygroup
                  )[0]?.proxies
                ).map((item) => (
                  <List.Item key={item.title}>
                    <FlexboxGrid>
                      {/* base info */}
                      <FlexboxGrid.Item
                        colspan={4}
                        // style={{
                        //   ...styleCenter,
                        //   marginLeft: '3rem',
                        //   flexDirection: 'column',
                        //   alignItems: 'flex-start',
                        //   overflow: 'hidden',
                        // }}
                        style={styleCenter}
                      >
                        <div style={titleStyle}>{item?.ip}</div>
                      </FlexboxGrid.Item>
                      {/* peak data */}
                      <FlexboxGrid.Item colspan={3} style={styleCenter}>
                        {item?.port}
                      </FlexboxGrid.Item>
                      {/* uv data */}
                      <FlexboxGrid.Item colspan={4} style={styleCenter}>
                        {item?.user}
                      </FlexboxGrid.Item>
                      <FlexboxGrid.Item colspan={6} style={styleCenter}>
                        {item?.password}
                      </FlexboxGrid.Item>
                      <FlexboxGrid.Item colspan={2} style={styleCenter}>
                        <div
                          style={{
                            color: this.spanColor(
                              item?.speed ? item?.speed : '0'
                            ),
                          }}
                        >
                          {item?.speed ? item?.speed : '0'}
                        </div>
                      </FlexboxGrid.Item>
                      {/* uv data */}
                      <FlexboxGrid.Item
                        colspan={4}
                        style={{
                          ...styleCenter,
                        }}
                      >
                        <span>
                          <Icon
                            icon="trash2"
                            style={{ marginRight: '10px' }}
                            size="lg"
                            onClick={(e) =>
                              this.deleteSpecificProxy(
                                e,
                                this.state.selectedProxygroup,
                                item.id
                              )
                            }
                          />
                        </span>
                        <span>
                          <Icon
                            icon="wifi"
                            size="lg"
                            onClick={(e) =>
                              this.pingProxy(
                                e,
                                this.state.selectedProxygroup,
                                item.id,
                                item.password
                                  ? `${item.ip}:${item.port}:${item.user}:${item.password}`
                                  : `${item.ip}:${item.port}`
                              )
                            }
                          />
                        </span>
                      </FlexboxGrid.Item>
                    </FlexboxGrid>
                  </List.Item>
                ))}
              </List>
            </div>
          </div>
        </div>
      </>
    );
  }
}
const mapStateToProps = (state) => ({ state });
export default connect(mapStateToProps)(Proxies);
