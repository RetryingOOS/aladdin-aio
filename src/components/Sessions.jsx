import React from 'react';
import {
  Input,
  Form,
  IconButton,
  Icon,
  Panel,
  Button,
  Modal,
  FormGroup,
  FormControl,
  ControlLabel,
  InputPicker,
} from 'rsuite';
import Clock from 'react-live-clock';
import cogoToast from 'cogo-toast';
import { connect } from 'react-redux';

import EmptySVG from '../account.svg';

const { ipcRenderer } = require('electron');

class Sessions extends React.Component {
  constructor(props) {
    super(props);
    this.close = this.close.bind(this);
    this.open = this.open.bind(this);
    this.state = {
      selectedSessionSite: 'amazon',
      show: false,
      formValue: {
        site: this.props.state.selectedSessionSite,
        account: '',
        proxy: '',
        cookies: [],
      },
    };
    this.getAccounts = this.getAccounts.bind(this);
    this.addSession = this.addSession.bind(this);
  }

  componentDidMount() {
    this.getAccounts();
    this.getSessions();
  }

  setSelectedSite(site) {
    this.props.dispatch({ type: 'update', obj: { selectedSessionSite: site } });
  }

  makeID(length) {
    let result = '';
    const characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  objectToArray = () => {
    const sessions =
      this.props.state.sessions[this.props.state.selectedSessionSite];
    const array = [];
    for (const property in sessions) {
      array.push(sessions[property]);
    }
    return array;
  };

  addSession() {
    if (
      !this.state.formValue?.site ||
      !this.state.formValue?.account ||
      this.state.formValue?.site === '' ||
      this.state.formValue?.account === ''
    ) {
      cogoToast.error(`Please fill all fields`, {
        position: 'top-right',
        heading: 'Error',
      });
      return;
    }
    const sendInfo = this.state?.formValue;
    sendInfo.id = this.makeID(5);

    ipcRenderer.sendSync('add:session', sendInfo);

    cogoToast.success(`Added Session`, {
      position: 'top-right',
      heading: 'Success',
    });
    this.getAccounts();
    this.getSessions();
  }

  getAccounts = () => {
    const accounts = ipcRenderer.sendSync('get:accounts');
    this.props.dispatch({ type: 'update', obj: { accounts } });
  };

  getSessions = () => {
    const sessions = ipcRenderer.sendSync('get:sessions');
    this.props.dispatch({ type: 'update', obj: { sessions } });
  };

  close = () => {
    this.setState({ show: false });
  };

  open = () => {
    this.setState({ show: true });
  };

  arrayToLabel = (array) => {
    const labels = [];
    for (const i in array) {
      labels.push({ value: array[i].id, label: array[i].alias });
    }
    return labels;
  };

  capitalizeFirstLetter(string) {
    try {
      return string.charAt(0).toUpperCase() + string.slice(1);
    } catch (e) {
      return string;
    }
  }

  returnEmail(id, site) {
    for (let i = 0; i < this.props.state.accounts[site].length; i++) {
      if (this.props.state.accounts[site][i].id === id) {
        return this.props.state.accounts[site][i].email;
      }
    }
    return '';
  }

  returnAccountName(id, site) {
    for (let i = 0; i < this.props.state.accounts[site].length; i++) {
      console.log(this.props.state.accounts[site][i].id, id);
      if (this.props.state.accounts[site][i].id === id) {
        console.log('matched');
        return this.props.state.accounts[site][i].alias;
      }
    }
    return '';
  }

  render() {
    const { formValue } = this.state;
    return (
      <>
        <Modal show={this.state.show} onHide={this.close} size="md">
          <Modal.Header>
            <Modal.Title>Create A Session</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form
              fluid
              onChange={(formValue) => {
                this.setState({ formValue });
              }}
              formValue={formValue}
            >
              <FormGroup style={{ marginLeft: '5%' }}>
                <ControlLabel>Site</ControlLabel>
                <FormControl
                  name="site"
                  placeholder="Site"
                  data={[
                    { value: 'amazon', label: 'Amazon' },
                    { value: 'target', label: 'Target' },
                  ]}
                  accepter={InputPicker}
                />
              </FormGroup>

              <FormGroup
                style={{ position: 'absolute', left: '55%', top: '0%' }}
              >
                <ControlLabel>Login Proxy</ControlLabel>
                <FormControl
                  style={{ width: '100%' }}
                  name="proxy"
                  placeholder="Login Proxy"
                />
              </FormGroup>
              <FormGroup style={{ marginLeft: '5%' }}>
                <FormControl
                  name="account"
                  style={{ width: '38%' }}
                  placeholder="Account"
                  accepter={InputPicker}
                  data={
                    this.props.state.accounts[this.state.formValue.site]?.length
                      ? this.arrayToLabel(
                          this.props.state.accounts[this.state.formValue.site]
                        )
                      : []
                  }
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
              onClick={this.addSession}
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
          style={{
            width: '90%',
            position: 'absolute',
            top: '50px',
            left: '8%',
          }}
        >
          <h5>
            {this.capitalizeFirstLetter(this.props.state.selectedSessionSite)}{' '}
            Sessions
          </h5>
          <Clock
            format="HH:mm:ss"
            interval={1000}
            ticking
            style={{ position: 'absolute', top: '-25px', fontSize: '1rem' }}
          />
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              placeContent: 'center',
              marginRight: '2rem',
              marginLeft: '-2rem',
            }}
          >
            <Panel
              style={{
                color: 'white',
                marginTop: '2rem',
                backgroundColor: 'rgb(50 53 75)',
                position: 'relative',
                borderRadius: '15px',
                width: '20%',
                marginRight: '2rem',
                border:
                  this.props.state.selectedSessionSite === 'amazon'
                    ? 'dotted'
                    : 'none',
              }}
              onClick={(e) => this.setSelectedSite('amazon')}
            >
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg"
                alt="Amazon"
                width="200"
                style={{
                  display: 'block',
                  marginLeft: 'auto',
                  marginRight: 'auto',
                  marginTop: '18%',
                }}
              />
            </Panel>
            <Panel
              style={{
                color: 'white',
                marginTop: '2rem',
                backgroundColor: 'rgb(50 53 75)',
                position: 'relative',
                borderRadius: '15px',
                width: '20%',
                marginRight: '2rem',
                border:
                  this.props.state.selectedSessionSite === 'target'
                    ? 'dotted'
                    : 'none',
              }}
              onClick={(e) => this.setSelectedSite('target')}
            >
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/9/9a/Target_logo.svg"
                alt="Target_logo"
                width="70"
                style={{
                  display: 'block',
                  marginLeft: 'auto',
                  marginRight: 'auto',
                  marginTop: '8%',
                }}
              />
            </Panel>
          </div>
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              overflowY: 'scroll',
            }}
          >
            <div
              style={{
                color: 'white',
                marginTop: '2rem',
                backgroundColor: '#292c3e',
                width: '17rem',
                height: '15rem',
                position: 'relative',
                borderRadius: '15px',
                marginRight: '2rem',
                border: '1px dashed grey',
              }}
              onClick={this.open}
            >
              <div
                style={{
                  width: '200px',
                  textAlign: 'center',
                  marginLeft: '28px',
                }}
              >
                <img src={EmptySVG} alt="Accounts" />
              </div>
              <div
                style={{
                  textAlign: 'center',
                  bottom: '20px',
                  position: 'relative',
                }}
              >
                Add New Session
              </div>
            </div>
            {Object.keys(this.props.state.sessions).length ? (
              this.objectToArray().map((row) => (
                <Panel
                  style={{
                    color: 'white',
                    marginTop: '2rem',
                    backgroundColor: '#292c3e',
                    width: '17rem',
                    height: '15rem',
                    position: 'relative',
                    marginRight: '2rem',
                  }}
                >
                  <div
                    style={{
                      position: 'absolute',
                      top: '0',
                      width: '100%',
                      right: '0',
                    }}
                  />
                  <Form style={{ position: 'relative', marginTop: '15px' }}>
                    <span style={{ textAlign: 'center' }}>Email</span>
                    <Input
                      style={{ width: 224 }}
                      label="Proxy"
                      disabled
                      value={this.returnEmail(
                        this.props.state.sessions[row.site][row.id].account,
                        row.site
                      )}
                    />
                    <span style={{ textAlign: 'center' }}>Account Name</span>
                    <Input
                      style={{ width: 224 }}
                      label="Proxy"
                      disabled
                      value={this.returnAccountName(
                        this.props.state.sessions[row.site][row.id].account,
                        row.site
                      )}
                    />
                  </Form>
                  <div
                    className="captchaButtons"
                    style={{
                      position: 'relative',
                      textAlign: 'center',
                      marginTop: '1rem',
                    }}
                  >
                    <Button
                      size="lg"
                      color="blue"
                      onClick={async (event) => {
                        ipcRenderer.send(`${row.site}-login`, row);
                        console.log(row);
                      }}
                    >
                      Login
                    </Button>
                    <IconButton
                      icon={<Icon icon="pencil" size="lg" />}
                      size="lg"
                      color="cyan"
                    />
                    <IconButton
                      icon={<Icon icon="trash" size="lg" />}
                      color="red"
                      size="lg"
                    />
                  </div>
                </Panel>
              ))
            ) : (
              <></>
            )}
          </div>
        </div>
      </>
    );
  }
}
const mapStateToProps = (state) => ({ state });
export default connect(mapStateToProps)(Sessions);
