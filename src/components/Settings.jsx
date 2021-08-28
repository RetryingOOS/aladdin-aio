import React from 'react';
import { InputPicker, Input, InputGroup, Panel, Avatar } from 'rsuite';
import Clock from 'react-live-clock';
import { Button } from '@material-ui/core';
import cogoToast from 'cogo-toast';
import { connect } from 'react-redux';
import $ from 'jquery';

const childProcess = require('child_process');
const { ipcRenderer } = require('electron');

const styles = {
  width: 360,
  marginBottom: 10,
  marginTop: 10,
};

const styles1 = {
  width: 700,
  marginBottom: 10,
  marginTop: 10,
};

class Settings extends React.Component {
  constructor(props) {
    super(props);
    this.testWebhook = this.testWebhook.bind(this);
    this.saveSettings = this.saveSettings.bind(this);
    this.deactivate = this.deactivate.bind(this);
    this.onTodoChange = this.onTodoChange.bind(this);
    this.state = {
    };
  }

  testWebhook(event, arg) {
    event.preventDefault();
    ipcRenderer.send('test:webhook', arg);
    cogoToast.success('Webhook Sent Successfully', {
      position: 'top-right',
      heading: 'Success',
    });
  }

  onTodoChange(name, value) {
    this.setState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  }

  getSettings() {
    const settings = ipcRenderer.sendSync('get:settings') || {
      RetryDelays: 2222,
      MonitorDelays: 3333,
      WebhookURL: '',
    };
    console.log(settings);
    this.setState(settings);
  }

  getProfiles = () => {
    const profiles = ipcRenderer.sendSync('get:profiles');
    this.props.dispatch({ type: 'update', obj: { profiles } });
  };

  componentDidMount() {
    this.getSettings();
    this.getProfiles();
  }

  saveSettings(event) {
    event.preventDefault();
    console.log(this.state);
    const arg = this.state;
    ipcRenderer.send('save:settings', arg);
    cogoToast.success('Saved Settings', {
      position: 'top-right',
      heading: 'Success',
    });
  }

  deactivate(event) {
    event.preventDefault();
    ipcRenderer.send('deactivate');
    cogoToast.success('Deactivated Your Instance', {
      position: 'top-right',
      heading: 'Success',
    });
  }

  openLogs() {
    ipcRenderer.send('open:logs');
  }

  render() {
    const { RetryDelays, MonitorDelays, WebhookURL } = this.state;
    return (
      <div
        className="SettingsPage"
        style={{
          width: '90%',
          height: '100%',
          position: 'absolute',
          top: '50px',
          left: '8%',
        }}
      >
        <Button
          id="import-btn"
          style={{ borderWidth: 2, float: 'right' }}
          variant="outlined"
          color="secondary"
        >
          Import All
        </Button>
        <Button
          id="export-btn"
          style={{ borderWidth: 2, float: 'right' }}
          variant="outlined"
          color="primary"
        >
          Export All
        </Button>
        <Button
          id="save-btn"
          variant="outlined"
          justify="flex-end"
          color="primary"
          onClick={(event) => this.saveSettings(event)}
          style={{ borderWidth: 2, float: 'right' }}
        >
          Save
        </Button>
        <Button
          id="open-logs-btn"
          variant="outlined"
          justify="flex-end"
          color="primary"
          onClick={this.openLogs}
          style={{ borderWidth: 2, float: 'right' }}
        >
          Open Logs
        </Button>
        <Button
          id="deactivate-btn"
          variant="outlined"
          justify="flex-end"
          color="primary"
          onClick={(event) => this.deactivate(event)}
          style={{ borderWidth: 2, float: 'right' }}
        >
          Deactivate
        </Button>

        <h5>Settings</h5>

        <Clock
          format="HH:mm:ss"
          interval={1000}
          ticking
          style={{ position: 'absolute', top: '-25px', fontSize: '1rem' }}
        />

        <Panel
          header="License"
          shaded
          collapsible
          defaultExpanded
          style={{ marginTop: '5%', width: '35%' }}
        >
          <h6 style={{ marginBottom: '10px' }}>Discord</h6>
          <div>
            <Avatar
              circle
              size="lg"
              style={{ marginBottom: '10px' }}
              src={this.props.state?.discordAvatar}
              alt="RU"
            />
            <h6
              style={{
                float: 'right',
                fontWeight: '800',
                fontSize: '15px',
                margin: 'auto',
                width: '90%',
                marginTop: '5%',
                marginRight: '-11%',
              }}
            >
              {this.state?.username}
            </h6>
          </div>

          <h6 style={{ marginBottom: '10px' }}>
            License Key: {this.state?.LicenseKey}
          </h6>
          {/* <h6>Type: Lifetime Key</h6>
          <h6>Expiry: Never</h6> */}
        </Panel>

        <Panel
          header="Miscellaneous Settings"
          shaded
          collapsible
          defaultExpanded
          style={{ position: 'absolute', top: '45%', width: '35%' }}
        >
          Discord Webhook
          <InputGroup style={{ marginTop: '3%', marginBottom: '3%' }}>
            <Input
              id="WebhookURL"
              value={WebhookURL}
              onChange={(event) =>
                this.onTodoChange('WebhookURL', $('#WebhookURL').val())
              }
            />
            <InputGroup.Button
              onClick={(event) =>
                this.testWebhook(event, $('#WebhookURL').val())
              }
            >
              Test
            </InputGroup.Button>
          </InputGroup>
          <h6>Delays</h6>
          <Input
            id="RetryDelays"
            name="RetryDelays"
            value={RetryDelays}
            style={styles}
            placeholder="Retry Delays"
            onChange={(event) =>
              this.onTodoChange('RetryDelays', $('#RetryDelays').val())
            }
          />
          <Input
            id="MonitorDelays"
            name="MonitorDelays"
            value={MonitorDelays}
            style={styles}
            placeholder="Monitor Delays"
            onChange={(event) =>
              this.onTodoChange('MonitorDelays', $('#MonitorDelays').val())
            }
          />
        </Panel>

        <Panel
          header="Quick Task Config"
          shaded
          defaultExpanded
          collapsible
          style={{
            position: 'absolute',
            top: '10%',
            left: '50%',
            width: '40%',
          }}
        >
          Account Email
          <InputGroup style={styles}>
            <Input />
          </InputGroup>
          Account Password
          <InputGroup style={styles}>
            <Input />
          </InputGroup>
          Profile
          <InputPicker
            style={styles1}
            data={data}
            placeholder="Select Profile"
          />
          Proxies
          <InputPicker
            style={styles1}
            data={data}
            placeholder="Select Proxies"
          />
          Size
          <InputPicker style={styles1} data={data} placeholder="Select Sizes" />
          Mode
          <InputPicker style={styles1} data={data} placeholder="Select Mode" />
        </Panel>
      </div>
    );
  }
}

const data = [
  // {
  //   label: 'Main Debit',
  //   value: 'Eugenia',
  //   role: 'Master',
  // },
  // {
  //   label: 'Capital One',
  //   value: 'Kariane',
  //   role: 'Master',
  // },
  // {
  //   label: 'Cashapp',
  //   value: 'Louisa',
  //   role: 'Master',
  // },
  // {
  //   label: 'Eno',
  //   value: 'Marty',
  //   role: 'Master',
  // },
  // {
  //   label: 'Privacy',
  //   value: 'Kenya',
  //   role: 'Master',
  // },
  // {
  //   label: 'Slut',
  //   value: 'Hal',
  //   role: 'Developer',
  // },
  // {
  //   label: 'Julius',
  //   value: 'Julius',
  //   role: 'Developer',
  // },
];

const mapStateToProps = (state) => ({ state });
export default connect(mapStateToProps)(Settings);
