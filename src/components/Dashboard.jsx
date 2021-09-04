import React from 'react';
import Clock from 'react-live-clock';
import Paper from '@material-ui/core/Paper';
import { Icon, Panel, Avatar, FlexboxGrid, List } from 'rsuite';
import { connect } from 'react-redux';
import cogoToast from 'cogo-toast';

import { Doughnut } from 'react-chartjs-2';

const { ipcRenderer } = require('electron');

const DoughnutData = {
  labels: ['Amazon', 'Target', 'Bestbuy'],
  datasets: [
    {
      label: '# of Votes',
      data: [8, 10, 3],
      backgroundColor: ['#f72585', '#480ca8', '#4895ef'],
      borderColor: [
        'rgba(255, 99, 132, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
      ],
      borderWidth: 1,
    },
  ],
};

// const data = [
// ];
const styleCenter = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '60px',
};

const slimText = {
  fontSize: '0.666em',
  color: '#97969B',
  fontWeight: 'lighter',
  paddingBottom: 5,
};

const titleStyle = {
  paddingBottom: 5,
  whiteSpace: 'nowrap',
  fontWeight: 500,
};

class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  getAnalytics = () => {
    const analytics = ipcRenderer.sendSync('get:analytics');
    this.props.dispatch({ type: 'update', obj: { analytics } });
  };

  componentDidMount() {
    this.getAnalytics();
    // if (!JSON.stringify(this.props.state.announcements).includes('pdate')) {
    //   this.fetchAnnouncements();
    // }
  }

  async fetchAnnouncements() {
    const response = await fetch(
      'https://aladdin-aio.com/api/announcements'
    );
    const responseJSON = await response.json();
    this.announcements = responseJSON.announcements;
    this.props.dispatch({
      type: 'update',
      obj: { announcements: responseJSON.announcements },
    });
  }

  daysAgo(date) {
    const today = new Date();
    const createdOn = new Date(date);
    const msInDay = 24 * 60 * 60 * 1000;

    createdOn.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    const diff = (+today - +createdOn) / msInDay;
    return Math.round(diff);
  }

  render() {
    const data = this.props.state.analytics.items;
    return (
      <div
        className="SettingsPage"
        style={{ width: '90%', position: 'absolute', top: '50px', left: '8%' }}
      >
        <h5>Dashboard | Analytics</h5>

        <Clock
          format="HH:mm:ss"
          interval={1000}
          ticking
          style={{ position: 'absolute', top: '-25px', fontSize: '1rem' }}
        />

        <Paper
          style={{
            color: 'black',
            marginTop: '2rem',
            background:
              'linear-gradient(90deg, hsla(152, 100%, 50%, 1) 0%, hsla(186, 100%, 69%, 1) 100%)',
            width: '16rem',
            height: '6rem',
          }}
        >
          <span
            style={{
              position: 'absolute',
              top: '43%',
              marginLeft: '1.5rem',
              transform: 'translateY(-50%)',
            }}
          >
            <Icon icon="check-circle" size="5x" />
          </span>
          <h5
            style={{
              textAlign: 'center',
              float: 'right',
              paddingTop: '14%',
              paddingRight: '9%',
            }}
          >
            {this.props.state.analytics.checkouts} Checkouts
          </h5>
        </Paper>

        <Paper
          style={{
            color: 'black',
            marginTop: '2rem',
            background:
              'linear-gradient(90deg, hsla(340, 80%, 69%, 1) 0%, hsla(15, 93%, 71%, 1) 100%)',
            position: 'absolute',
            left: '18rem',
            width: '16rem',
            height: '6rem',
            top: '1.6rem',
          }}
        >
          <span
            style={{
              position: 'absolute',
              top: '50%',
              marginLeft: '1.5rem',
              transform: 'translateY(-50%)',
            }}
          >
            <Icon icon="times-circle" size="5x" />
          </span>
          <h5
            style={{
              top: '62%',
              position: 'absolute',
              left: '55%',
              transform: 'translateY(-100%)',
            }}
          >
            {this.props.state.analytics.declines} Declines
          </h5>
        </Paper>

        <Paper
          style={{
            color: 'black',
            marginTop: '2rem',
            background:
              'linear-gradient(90deg, hsla(238, 100%, 71%, 1) 0%, hsla(295, 100%, 84%, 1) 100%)',
            position: 'absolute',
            left: '36rem',
            width: '17rem',
            height: '6rem',
            top: '1.6rem',
          }}
        >
          <span
            style={{
              position: 'absolute',
              top: '50%',
              marginLeft: '1.5rem',
              transform: 'translateY(-50%)',
            }}
          >
            <Icon icon="credit-card" size="5x" />
          </span>
          <h5
            style={{
              top: '62%',
              position: 'absolute',
              left: '51%',
              transform: 'translateY(-100%)',
            }}
          >
            ${this.props.state.analytics.totalSpent} Spent
          </h5>
        </Paper>

        <Panel
          style={{
            width: '30%',
            float: 'right',
            top: '22%',
            position: 'absolute',
            right: '0%',
            height: '600px',
            overflowY: 'scroll',
            overflowX: 'clip',
          }}
          header={
            <>
              Announcements
              <Icon
                style={{ float: 'right', marginTop: '5px' }}
                icon="refresh2"
                onClick={(e) => {
                  e.preventDefault();
                  this.fetchAnnouncements();
                  cogoToast.success(`Fetching Announcements`, {
                    position: 'top-right',
                  });
                }}
              />
            </>
          }
          bordered
        >
          {this.props.state?.announcements.length > 0 ? (
            this.props.state?.announcements.map((item, index) => (
              <div
                style={{
                  background: 'rgb(39 42 66)',
                  marginBottom: '2rem',
                  borderRadius: '6px',
                }}
                key={index}
              >
                <u>
                  <h6 style={{ marginLeft: '2.5rem', paddingTop: '1rem' }}>
                    {item.title}
                  </h6>
                </u>
                <div
                  style={{
                    marginLeft: '1.5rem',
                    padding: '1rem',
                    paddingBottom: '2rem',
                  }}
                >
                  {item.message}
                </div>
                <div
                  style={{
                    position: 'relative',
                    left: '15.5rem',
                    top: '-1rem',
                  }}
                >
                  <div
                    style={{
                      right: '50%',
                      position: 'relative',
                    }}
                  >
                    {/* <Avatar
                      src="./assets/logo_transparent.png"
                      size="sm"
                      circle
                    /> */}
                    {/* <div>
                      &nbsp; Aladdin Updates
                      {this.daysAgo(item.date) === 0
                        ? `Today - ${
                            new Date()
                              .toLocaleString()
                              .split(',')[0]
                              .split('/2021')[0]
                          }`
                        : `${this.daysAgo(item.date)} days ago`}
                    </div> */}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <> </>
          )}
        </Panel>

        <div style={{ marginTop: '5%' }}>
          <h5>Recent Checkouts</h5>
          <List
            size="sm"
            style={{
              marginRight: '1.5rem',
              maxWidth: 'fit-content',
              maxHeight: '400px',
              position: 'absolute',
            }}
          >
            {data?.length ? data?.map((item, index) => (
              <List.Item key={index} index={index}>
                <FlexboxGrid>
                  {/* icon */}
                  <FlexboxGrid.Item colspan={25} style={styleCenter}>
                    <img width="50" src={item.image} alt="" />
                  </FlexboxGrid.Item>
                  {/* base info */}
                  <FlexboxGrid.Item
                    colspan={25}
                    style={{
                      ...styleCenter,
                      flexDirection: 'column',
                      alignItems: 'flex-start',
                      overflow: 'hidden',
                    }}
                  >
                    <div style={titleStyle}>{item.title}</div>
                    <div style={slimText}>
                      <div
                        style={{ fontSize: '14px', fontWeight: 'bold' }}
                      >{` ${item.site} - $${item.price}`}</div>
                      <div style={{ fontSize: '12px' }}>
                        {new Date(item.date).toLocaleDateString()}
                      </div>
                    </div>
                  </FlexboxGrid.Item>
                  {/* peak data */}
                </FlexboxGrid>
              </List.Item>
            )) : <List.Item> No recent checkouts </List.Item> }
          </List>
        </div>

        <div
          style={{
            width: '400px',
            position: 'absolute',
            left: '30%',
            top: '90%',
          }}
        >
          <h5 style={{ marginBottom: '1rem' }}>Checkouts By Site</h5>
          <Doughnut data={DoughnutData} />
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({ state });
export default connect(mapStateToProps)(Dashboard);
