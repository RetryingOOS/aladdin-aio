import React from 'react';
import { HashRouter as Router, Route, Redirect } from 'react-router-dom';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import './App.global.css';
import { createBrowserHistory } from 'history';
import { ipcRenderer } from 'electron';
// import { datadogLogs } from '@datadog/browser-logs';
import { Alert } from 'rsuite';
import SidebarReact from './components/Navbar';
import TasksTable from './components/App';
import Settings from './components/Settings';
import Dashboard from './components/Dashboard';
import Proxies from './components/Proxies';
import Profiles from './components/Profiles';
import Captcha from './components/Harvester';
import Accounts from './components/Accounts';
import Sessions from './components/Sessions';
import Login from './components/Login';
import TopBar from './components/TopBar';

const history = createBrowserHistory();
// const Sentry = require('@sentry/node');
// or use es6 import statements
// import * as Sentry from '@sentry/node';

// const Tracing = require('@sentry/tracing');
// or use es6 import statements
// import * as Tracing from '@sentry/tracing';

// Sentry.init({
//   dsn:
//     'https://160acd89026246f78def21d2fe63d136@o849007.ingest.sentry.io/5815937',

//   // Set tracesSampleRate to 1.0 to capture 100%
//   // of transactions for performance monitoring.
//   // We recommend adjusting this value in production
//   tracesSampleRate: 1.0,
// });

// datadogLogs.init({
//   clientToken: 'pub2407437efef61d9bab24254d4cf60497',
//   site: 'datadoghq.com',
//   forwardErrorsToLogs: true,
//   sampleRate: 100,
// });

const store = createStore(function (
  state = {
    activated: false,
    key: {},
    tasks: [],
    activeTasks: [],
    filteredTasks: [],
    filteredProxies: [],
    filteredProfiles: [],
    taskGroups: [],
    profileSearch: false,
    announcements: [],
    search: false,
    sessions: [],
    logs: {},
    pingSpeeds: {},
    statuses: {},
    taskGroupStatuses: {},
    profiles: [],
    products: {},
    checkedKeys: [],
    selectedSessionSite: 'amazon',
    siteToModes: {
      amazon: [
        { value: 'amazonTurbo', label: 'Turbo' },
        { value: 'amazonNormal', label: 'Normal' },
        // { value: 'amazonMobile', label: 'Mobile' },
        { value: 'amazonMonitor', label: 'Monitor' },
      ],
      target: [{ value: 'targetSafe', label: 'Safe' }],
      bestbuy: [{ value: 'bestbuySafe', label: 'Regular' }],
    },
    siteToImages: {
      amazon: './assets/icons8-amazon-480.png',
      target: './assets/icons8-target-app-256.png',
      bestbuy: './assets/bestbuy.png',
    },
    sites: [
      { value: 'amazon', label: 'Amazon' },
      { value: 'bestbuy', label: 'Bestbuy' },
      { value: 'target', label: 'Target' },
      { value: 'customShopify', label: 'Custom Shopify' },
    ],
    proxies: {},
    analytics: [],
    inputtedProxies: [],
    selectedProxies: [],
    listPings: {},
    harvesters: [],
    accounts: {},
    harvesterSites: [
      { value: 'shopifyCheckpoint', label: 'Shopify Checkpoint' },
      { value: 'shopifyCheckout', label: 'Shopify Checkout' },
      { value: 'walmart', label: 'Walmart' },
      { value: 'newegg', label: 'Newegg' },
    ],
    progress: {},
    selectedGroup: null,
    selectedGroups: [],
    showDeleteGroup: false,
    groups: [],
    discordAvatar:
      'https://external-preview.redd.it/4PE-nlL_PdMD5PrFNLnjurHQ1QKPnCvg368LTDnfM-M.png?auto=webp&s=ff4c3fbc1cce1a1856cff36b5d2a40a6d02cc1c3',
    cookiesUsed: 0,
    cookieInfo: {
      'FootLocker US': {},
      'FootLocker CA': {},
      'Kids FootLocker': {},
      FootAction: {},
      EastBay: {},
      'Champs Sports': {},
    },
  },
  action
) {
  switch (action.type) {
    case 'update':
      return { ...state, ...action.obj };
    case 'set-active-tasks':
      var newState = { ...state };
      newState.activeTasks.concat(action.obj.activeTasks);
      return newState;
    case 'addProduct':
      var newState = { ...state, ...action.obj };
      for (const i of action.info) {
        newState.products[i.id] = i.product;
      }
      return newState;
    case 'deleteProduct':
      var newState = { ...state, ...action.obj };
      delete newState.products[action.id];
      return newState;
    case 'addLog':
      var newState = { ...state };
      for (const i of action.info) {
        // if (!newState.logs[i.taskId]) {
        //     newState.logs[i.taskId] = []
        // }
        // newState.logs[i.taskId].push(i.time + ' ' + i.log)
        if (i.sendToStatus) newState.statuses[i.taskId] = i.log;
      }
      return newState;
    case 'addStatus':
      var newState = { ...state };
      for (const i of action.info) {
        if (newState.taskGroupStatuses[i.taskGroupID]) {
          newState.taskGroupStatuses[i.taskGroupID][i.type] += 1;
        } else {
          newState.taskGroupStatuses[i.taskGroupID][i.type] = 0;
        }
      }
      return newState;
    case 'pingSpeed':
      var newState = { ...state };
      for (const i of action.info) {
        newState.pingSpeeds[i.id] = i.ping;
      }
      return newState;
    default:
      return state;
  }
});

window.store = store;

class Index extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activated: false,
      version: '1.1.9',
    };
  }

  login = (key) => {
    var activate = ipcRenderer.sendSync('activated', key);
    this.setState({ activated: true, key });
  };


  componentDidMount() {
    // this.checkActivation();
    const checkActivation = ipcRenderer.sendSync('checkAuth');
    if (checkActivation.success) {
      this.setState({ activated: true });
    } else {
      this.setState({ activated: false });
    }
    ipcRenderer.on('log', (e, info) => {
      store.dispatch({ type: 'addLog', info });
    });

    ipcRenderer.on('groupStatus', (e, info) => {
      store.dispatch({ type: 'addStatus', info });
    });

    ipcRenderer.on('session-msg', (e, msg) => {
      Alert.info(msg);
    });

    ipcRenderer.on('proxySpeed', (e, info) => {
      // store.dispatch({ type: 'pingSpeed', info });
      const proxies = ipcRenderer.sendSync('get:proxies');
      store.dispatch({ type: 'update', obj: { proxies } });
    });

    this.fetchAnnouncements();

    const info = ipcRenderer.sendSync('get:info');
    store.dispatch({
      type: 'update',
      obj: {
        discordAvatar: info.avatar,
        discordUsername: info.username,
        licenseKey: info.LicenseKey,
      },
    });
  }

  fetchAnnouncements() {
    fetch('https://aladdin-aio.com/api/announcements')
      .then((response1) => response1.json())
      .then((json) =>
        store.dispatch({
          type: 'update',
          obj: { announcements: json.announcements },
        })
      );
  }

  render() {
    return (
      <Provider store={store}>
        {/* <React.StrictMode> */}
        <Router history={history}>
          <div className="app">
            {this.state.activated ? (
              <div
                style={{ height: '100%', width: '100%' }}
                className="page-background"
              >
                <TopBar />
                <SidebarReact />
                <Route exact path="/dashboard" component={Dashboard} />
                <Route exact path="/tasks" component={TasksTable} />
                <Route exact path="/captcha" component={Captcha} />
                <Route exact path="/proxies" component={Proxies} />
                <Route exact path="/profiles" component={Profiles} />
                <Route exact path="/accounts" component={Accounts} />
                <Route exact path="/sessions" component={Sessions} />
                <Route exact path="/settings" component={Settings} />
                <Redirect path="*" to="/tasks" />
              </div>
            ) : (
              <>
                <Route
                  exact
                  path="/login"
                  key="test"
                  component={() => (
                    <Login
                      activated={this.state.activated}
                      onLogin={this.login}
                    />
                  )}
                />
              </>
            )}
          </div>
        </Router>
        {/* </React.StrictMode> */}
      </Provider>
    );
  }
}

export default Index;
