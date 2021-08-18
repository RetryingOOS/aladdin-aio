import React from 'react';
import { Form, IconButton, Icon, Panel, Input, CheckPicker } from 'rsuite';
import cogoToast from 'cogo-toast';
import { connect } from 'react-redux';
import $ from 'jquery';

import ContentEditable from 'react-contenteditable';

import Clock from 'react-live-clock';
import EmptySVG from '../empty.svg';

const { ipcRenderer } = require('electron');

class Captcha extends React.Component {
  constructor(props) {
    super(props);
    this.showHarvester = this.showHarvester.bind(this);
    this.addHarvester = this.addHarvester.bind(this);
    this.saveHarvester = this.saveHarvester.bind(this);
    this.contentEditable = React.createRef();
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    this.getHarvesters();
  }

  showHarvester(arg, name) {
    ipcRenderer.send('show:harvester', arg, name);
  }

  addHarvester() {
    const harvester = this.props.state.harvesters;
    const idNum = harvester[harvester.length - 1].id + 1;

    ipcRenderer.sendSync('set:harvesters', {
      id: idNum,
      store: [],
      name: `Captcha Harvester ${idNum}`,
      proxy: '',
    });
    cogoToast.success(`Added Captcha Harvester`, {
      position: 'top-right',
      heading: 'Success',
    });
    this.getHarvesters();
  }

  getHarvesters = () => {
    const harvesters = ipcRenderer.sendSync('get:harvesters');
    this.props.dispatch({ type: 'update', obj: { harvesters } });
  };

  saveHarvester(event, id, name, site, proxy) {
    const arg = {
      id,
      store: site,
      name,
      proxy,
    };
    ipcRenderer.sendSync('save:harvesters', id, arg);
    this.getHarvesters();
    cogoToast.success(`Saved Captcha Harvester`, {
      position: 'top-right',
      heading: 'Success',
    });
    this.getHarvesters();
  }

  handleChange(value) {
    console.log(value);
  }

  render() {
    const { state } = this.props;
    const { harvesterSites, harvesters } = state;
    return (
      <div
        className="SettingsPage"
        style={{
          width: '90%',
          position: 'absolute',
          top: '50px',
          left: '8%',
        }}
      >
        <h5>Captcha Harvesters</h5>

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
            onClick={() => this.addHarvester()}
          >
            <div
              style={{
                width: '80%',
                textAlign: 'center',
                top: '27%',
                position: 'relative',
                marginLeft: '28px',
                height: '100%',
              }}
            >
              <img src={EmptySVG} alt="Harvester" />
            </div>
            <div
              style={{
                textAlign: 'center',
                bottom: '30%',
                position: 'relative',
              }}
            >
              Add New Harvester
            </div>
          </div>
          {harvesters.map((row) => (
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
                  html={`<div id='Harvester${row.id}'>${row.name}</div>`}
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
                <CheckPicker
                  onChange={(value) => (row.store = value)}
                  searchable={false}
                  data={harvesterSites}
                  defaultValue={row.store || []}
                  style={{ width: 224, marginBottom: '10px' }}
                />
                <span style={{ textAlign: 'center' }}>Proxy</span>
                <Input
                  style={{ width: 224 }}
                  placeholder="Proxy"
                  name="proxy"
                  label="Proxy"
                  onChange={(value) => (row.proxy = value)}
                  defaultValue={row.proxy}
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
                  icon={<Icon icon="external-link" size="lg" />}
                  size="lg"
                  color="blue"
                  onClick={(e) =>
                    this.showHarvester(`${row.id}`, `${row.name}`)
                  }
                />
                <IconButton
                  icon={<Icon icon="youtube-play" size="lg" />}
                  size="lg"
                  color="red"
                />
                <IconButton
                  icon={<Icon icon="save" size="lg" />}
                  color="cyan"
                  size="lg"
                  onClick={(event) =>
                    this.saveHarvester(
                      event,
                      row.id,
                      $(`#Harvester${row.id}`).text(),
                      row.store,
                      row.proxy
                    )
                  }
                />
              </div>
            </Panel>
          ))}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({ state });
export default connect(mapStateToProps)(Captcha);
