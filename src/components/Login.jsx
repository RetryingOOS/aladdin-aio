import React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { FlexboxGrid, Input, Button, Icon, Alert } from 'rsuite';
import { ipcRenderer } from 'electron';

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.activate = this.activate.bind(this);
    this.state = {
      key: '',
    };
  }

  activate(e) {
    const auth = ipcRenderer.sendSync('activate', this.state?.key.trim());
    if (auth.success) {
      this.props.onLogin(auth);
      Alert.success('Success!');
    } else {
      Alert.error('Invalid key');
    }
  }

  handleChange = (value) => {
    this.setState((prevState) => ({
      ...prevState,
      key: value,
    }));
  };

  render() {
    return (
      <div>
        <FlexboxGrid>
          <FlexboxGrid.Item colspan={12}>
            <div>
              <img
                alt=""
                style={{ marginTop: '15%' }}
                width="400"
                src="./assets/undraw_accept_tasks_po1c.svg"
              />
            </div>
          </FlexboxGrid.Item>
          <FlexboxGrid.Item colspan={12}>
            <div style={{ marginTop: '15%', textAlign: 'center' }}>
              <img width="100" src="./assets/logo_transparent.png" alt="logo" />
              <h4 style={{ color: '#9C99F2' }}>
                Welcome To <span style={{ color: 'white' }}>Aladdin AIO</span>
              </h4>
              <div style={{ color: 'lightgray' }}>
                Enter your key to get started
              </div>
            </div>
            <div style={{ textAlign: 'center', margin: '10% 15% 0 15%' }}>
              <Input onChange={this.handleChange} placeholder="License Key" />
              <Button
                onClick={this.activate}
                style={{ background: '#6C63FF', marginTop: '1rem' }}
              >
                <Icon style={{ padding: '0.25rem' }} icon="sign-in" /> Activate
              </Button>
            </div>
          </FlexboxGrid.Item>
        </FlexboxGrid>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({ state });
export default connect(mapStateToProps)(Login);
