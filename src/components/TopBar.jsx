import React from 'react';
import { Button, Icon } from 'rsuite';

const { remote } = window.require('electron');
const { ipcRenderer } = window.require('electron');

class TopBar extends React.Component {
  constructor(props) {
    super(props);
  }

  close = (e) => {
    e.preventDefault();
    ipcRenderer.send('close');
    return false;
  };

  minimize = (e) => {
    e.preventDefault();
    console.log('minimize');
    const window = remote.getCurrentWindow();
    window.minimize();
    return false;
  };

  render() {
    return (
      <div className="titlebar">
        <div
          style={{
            position: 'absolute',
            height: '1rem',
            '-webkit-app-region': 'drag',
            top: 0,
            width: '95%',
          }}
        >
          <div>
            <div
              style={{ top: '-10px', right: '-38px', position: 'absolute' }}
              className="minimize"
            >
              <Button
                style={{ background: 'transparent' }}
                onClick={this.minimize}
              >
                <Icon icon="window-minimize" />
              </Button>
            </div>
            <div
              style={{ top: '-10px', right: '-67px', position: 'absolute' }}
              className="close"
            >
              <Button
                style={{ background: 'transparent' }}
                onClick={this.close}
              >
                <Icon icon="close" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default TopBar;
