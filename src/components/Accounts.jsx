import React from 'react';
import {
  Input,
  Form,
  IconButton,
  Icon,
  Panel,
  CheckPicker,
  Modal,
  FormGroup,
  FormControl,
  ControlLabel,
  InputPicker,
  Button,
} from 'rsuite';
import Clock from 'react-live-clock';
import cogoToast from 'cogo-toast';
import { connect } from 'react-redux';
import ContentEditable from 'react-contenteditable';

import EmptySVG from '../account.svg';

const { ipcRenderer } = require('electron');

const styles = {
  width: 460,
  marginBottom: 10,
  marginTop: 30,
};

class Accounts extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      accounts: '',
      formValue: {
        email: '',
        site: '',
        password: '',
        alias: '',
      },
    };
    this.getAccounts = this.getAccounts.bind(this);
    this.addAccount = this.addAccount.bind(this);
  }

  componentDidMount() {
    this.getAccounts();
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

  addAccount() {
    const { accounts } = this.props.state;
    if (
      !this.state.formValue?.email ||
      !this.state.formValue?.site ||
      !this.state.formValue?.password ||
      !this.state.formValue?.alias ||
      this.state.formValue?.email === '' ||
      this.state.formValue?.site === '' ||
      this.state.formValue?.password === '' ||
      this.state.formValue?.alias === ''
    ) {
      cogoToast.error(`Please fill all fields`, {
        position: 'top-right',
        heading: 'Error',
      });
      return;
    }
    const sendInfo = this.state?.formValue;
    sendInfo.id = this.makeID(5);

    ipcRenderer.sendSync('set:accounts', sendInfo);

    cogoToast.success(`Added Account`, {
      position: 'top-right',
      heading: 'Success',
    });
    this.getAccounts();
  }

  getAccounts = () => {
    const accounts = ipcRenderer.sendSync('get:accounts');
    this.props.dispatch({ type: 'update', obj: { accounts } });
  };

  deleteAccount = (id) => {
    ipcRenderer.sendSync('delete:account', id);
    this.getAccounts();
  };

  capitalizeFirstLetter(string) {
    try {
      return string.charAt(0).toUpperCase() + string.slice(1);
    } catch (e) {
      return string;
    }
  }

  close = () => {
    this.setState({ show: false });
  };

  open = () => {
    this.setState({ show: true });
  };

  handleChange = (val) => {
    console.log(val);
    console.log(this.state?.formValue);
  };

  render() {
    const { formValue } = this.state;

    return (
      <>
        <Modal show={this.state.show} onHide={this.close} size="md">
          <Modal.Header>
            <Modal.Title>Accounts</Modal.Title>
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
              <FormGroup style={{ marginLeft: '5%' }}>
                <ControlLabel>Site</ControlLabel>
                <FormControl
                  name="site"
                  placeholder="Site"
                  style={{ width: '40%' }}
                  data={[
                    { value: 'amazon', label: 'Amazon' },
                    { value: 'target', label: 'Target' },
                    { value: 'bestbuy', label: 'Bestbuy' },
                  ]}
                  accepter={InputPicker}
                />
              </FormGroup>
              <FormGroup
                style={{
                  marginRight: '5%',
                  position: 'absolute',
                  top: '0',
                  left: '52%',
                  width: '101%',
                }}
              >
                <ControlLabel>Alias</ControlLabel>
                <FormControl
                  style={{ width: '38%' }}
                  name="alias"
                  placeholder="Alias"
                />
              </FormGroup>
              <FormGroup style={{ marginLeft: '5%' }}>
                <ControlLabel>Email</ControlLabel>
                <FormControl
                  style={{ width: '38%' }}
                  name="email"
                  placeholder="Email"
                />
              </FormGroup>
              <FormGroup
                style={{
                  marginLeft: '5%',
                  position: 'absolute',
                  top: '42%',
                  left: '47%',
                  width: '101%',
                }}
              >
                <ControlLabel>Password</ControlLabel>
                <FormControl
                  name="password"
                  style={{ width: '38%' }}
                  placeholder="Password"
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
              onClick={this.addAccount}
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
          <h5>Accounts</h5>
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
              overflowY: 'scroll',
              height: '800px',
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
                Add New Account
              </div>
            </div>
            {Object.keys(this.props.state.accounts).length ? (
              this.props.state.accounts.amazon
                ?.concat(this.props.state.accounts.target)
                .concat(this.props.state.accounts.bestbuy)
                .map((row) => (
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
                    >
                      <ContentEditable
                        innerRef={this.contentEditable}
                        html={`<div>${row?.alias}</div>`}
                        style={{
                          position: 'relative',
                          width: '100%',
                          justifyContent: 'center',
                          display: 'flex',
                          height: '30px',
                          textAlign: 'center',
                          fontSize: '20px',
                          backgroundColor: '#33374e',
                        }}
                      />
                    </div>
                    <Form style={{ position: 'relative', marginTop: '15px' }}>
                      <span style={{ textAlign: 'center' }}>Site</span>
                      <Input
                        style={{ width: 224, marginBottom: '10px' }}
                        value={this.capitalizeFirstLetter(row?.site) || ''}
                        disabled
                      />
                      <span style={{ textAlign: 'center' }}>Email</span>
                      <Input
                        style={{ width: 224 }}
                        disabled
                        value={row?.email}
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
                      <IconButton
                        icon={<Icon icon="pencil" size="lg" />}
                        size="lg"
                        color="blue"
                      />
                      <IconButton
                        icon={<Icon icon="trash" size="lg" />}
                        size="lg"
                        color="red"
                        onClick={(e) => {
                          this.deleteAccount(row?.id);
                        }}
                      />
                    </div>
                  </Panel>
                ))
            ) : (
              <> </>
            )}
          </div>
        </div>
      </>
    );
  }
}
const mapStateToProps = (state) => ({ state });
export default connect(mapStateToProps)(Accounts);
