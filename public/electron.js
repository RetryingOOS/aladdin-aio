/* eslint-disable import/order */
/* eslint global-require: off, no-console: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `yarn build` or `yarn build:main`, this file is compiled to
 * `./src/main.js` using webpack. This gives us some performance wins.
 */
// require('core-js/stable')
// require( 'regenerator-runtime/runtime')
const path = require('path');
const { app, BrowserWindow, shell } = require('electron');
const { autoUpdater } = require('electron-updater');
const { log } = require('electron-log');
const fs = require('fs');
const initClient = require('./Client/dist/index');
const isDev = require('electron-is-dev');
let requestClient;
(async () => {
  requestClient = await initClient();
})();

console.log(process.versions);
// import { app, BrowserWindow, shell } from 'electron';
//  import { autoUpdater } from 'electron-updater';
//  import log from 'electron-log';
//  import MenuBuilder from './menu';
//  import { resolveHtmlPath } from './util';
//  import fs from 'fs'

const fetch = require('node-fetch');
const Store = require('electron-store');

const store = new Store();

const packageJson = require('../package.json');

const activity = {
  details: 'Working Magic',
  state: `Version ${packageJson.version}`,
  timestamps: {
    start: Date.now(),
  },
  assets: {
    large_image: 'logo', // large image key from developer portal > rich presence > art assets
    large_text: 'Working Magic',
  },
  buttons: [
    { label: 'Twitter', url: 'https://github.com' },
    { label: 'Discord', url: 'https://github.com' },
  ],
};
process.setMaxListeners(Infinity);
// const client = require('discord-rich-presence')('753302024623489085');
const RPC = require('discord-rpc');

const client = new RPC.Client({
  transport: 'ipc',
});

const { ipcMain } = require('electron');
// const Main = require('./Main');
// const TaskClient = require('./TaskClient');

// class AppUpdater {
//    constructor() {
//      log.transports.file.level = 'info';
//      autoUpdater.logger = log;
//      autoUpdater.checkForUpdatesAndNotify();
//    }
//  }

let mainWindow = null;
let loginWindow = null;

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

const isDevelopment =
  process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

if (isDevelopment) {
  require('electron-debug')();
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS'];

  return installer
    .default(
      extensions.map((name) => installer[name]),
      forceDownload
    )
    .catch(console.log);
};
const RESOURCES_PATH = app.isPackaged
  ? path.join(process.resourcesPath, 'assets')
  : path.join(__dirname, '../build/assets');

const getAssetPath = (...paths) => {
  return path.join(RESOURCES_PATH, ...paths);
};

const createLoginWindow = async () => {
  loginWindow = new BrowserWindow({
    show: false,
    width: 700,
    height: 400,
    frame: false,
    transparent: true,
    resizable: false,
    icon: getAssetPath('icon.png'),
    webPreferences: {
      nodeIntegration: true,
      webSecurity: false,
      devTools: false,
      contextIsolation: false,
    },
  });

  //  loginWindow.loadURL(`file://${path.join(__dirname, '../build/index.html')}#/login`);
  //  loginWindow.loadURL(resolveHtmlPath('index.html'));
  loginWindow.loadURL(
    isDev
      ? 'http://localhost:3000'
      : `file://${path.join(__dirname, '../build/index.html')}#/login')}`
  );
  loginWindow.setMenu(null);
  loginWindow.setFullScreenable(false);
  loginWindow.setFullScreen(true);
  loginWindow.removeMenu(); // #TODO
  // mainWindow.webContents.openDevTools();
  for (let i = 0; i < process.argv.length; i++) {
    const arg = process.argv[i].toLowerCase();
    if (
      arg.startsWith('--inspect') ||
      arg.startsWith('--remote-debugging-port') ||
      arg.startsWith('--inspect-brk') ||
      arg.startsWith('--inspect-port') ||
      arg.startsWith('--debug') ||
      arg.startsWith('--debug-brk') ||
      arg.startsWith('--debug-port') ||
      arg.startsWith('--inspect-brk-node') ||
      arg.startsWith('--inspect-publish-uid') ||
      arg.startsWith('--javascript-harmony') ||
      arg.startsWith('--js-flags') ||
      arg.startsWith('--remote-debugging-pipe') ||
      arg.startsWith('--remote-debugging-port') ||
      arg.startsWith('--wait-for-debugger-children')
    ) {
      app.quit();
    }
  }
  // @TODO: Use 'ready-to-show' event
  //        https://github.com/electron/electron/blob/master/docs/api/browser-window.md#using-ready-to-show-event
  loginWindow.webContents.on('did-finish-load', () => {
    if (!loginWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      loginWindow.minimize();
    } else {
      loginWindow.show();
      loginWindow.focus();
    }

    // client.updatePresence({
    //   details: 'Lifetime Copy',
    //   state: `Version ${packageJson.version}`,
    //   startTimestamp: Date.now(),
    //   largeImageKey: 'logo',
    //   largeImageText: '3.141592653589703',
    //   instance: !1,
    // });
  });

  loginWindow.webContents.on('did-frame-finish-load', () => {
    loginWindow.webContents.openDevTools();
  });

  loginWindow.on('closed', () => {
    mainWindow = null;
  });

  // Open urls in the user's browser
  // eslint-disable-next-line @typescript-eslint/no-shadow
  loginWindow.webContents.on('new-window', (event, url) => {
    event.preventDefault();
    shell.openExternal(url);
  });
};

const checkLogin = async () => {
  const hwid = await getHWID();
  const key = store.get('settings.LicenseKey');
  fetch('https://aladdin-aio.com/api/license/auth', {
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ license: key, machineID: hwid }),
    method: 'POST',
  })
    .then((response1) => response1.json())
    .then((json) => {
      console.log(json);
      if (json.success) {
        console.log('Login success');
        return createWindow();
      }
      return createLoginWindow();
    })
    .catch(createLoginWindow);
};

const intervalAuth = async () => {
  const key = store.get('settings.LicenseKey');
  const hwid = await getHWID();
  fetch('https://aladdin-aio.com/api/license/auth', {
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ license: key, machineID: hwid }),
    method: 'POST',
  })
    .then((response1) => response1.json())
    .then((json) => {
      console.log(json);
      if (!json.success) {
        app.quit();
      }
    });
};

const createWindow = async () => {
  mainWindow = new BrowserWindow({
    show: false,
    width: 1440,
    height: 900,
    frame: false,
    transparent: true,
    maximizable: false,
    resizable: true,
    icon: getAssetPath('icon.png'),
    webPreferences: {
      nodeIntegration: true,
      webSecurity: false,
      enableRemoteModule: true,
      devTools: false,
      contextIsolation: false,
      allowRunningInsecureContent: true,
    },
  });
  // TaskClient.setWindow(mainWindow);
  // Main.setWindow(mainWindow);
  //  mainWindow.loadURL(
  //   `file://${path.join(__dirname, '../build/index.html')}#/dashboard`
  // );
  mainWindow.loadURL(
    isDev
      ? 'http://localhost:3000'
      : `file://${path.join(__dirname, '../build/index.html')}#/login')}`
  );

  mainWindow.setMenu(null);
  mainWindow.setFullScreenable(false);
  mainWindow.setFullScreen(true);
  mainWindow.removeMenu(); // #TODO
  if (isDev) {
    mainWindow.webContents.openDevTools();
  }

  mainWindow.webContents.on('devtools-opened', () => {
    mainWindow.webContents.closeDevTools();
  });

  for (let i = 0; i < process.argv.length; i++) {
    const arg = process.argv[i].toLowerCase();
    if (
      arg.startsWith('--inspect') ||
      arg.startsWith('--remote-debugging-port') ||
      arg.startsWith('--inspect-brk') ||
      arg.startsWith('--inspect-port') ||
      arg.startsWith('--debug') ||
      arg.startsWith('--debug-brk') ||
      arg.startsWith('--debug-port') ||
      arg.startsWith('--inspect-brk-node') ||
      arg.startsWith('--inspect-publish-uid') ||
      arg.startsWith('--javascript-harmony') ||
      arg.startsWith('--js-flags') ||
      arg.startsWith('--remote-debugging-pipe') ||
      arg.startsWith('--remote-debugging-port') ||
      arg.startsWith('--wait-for-debugger-children')
    ) {
      app.quit();
    }
  }

  // @TODO: Use 'ready-to-show' event
  //        https://github.com/electron/electron/blob/main/docs/api/browser-window.md#using-ready-to-show-event
  mainWindow.webContents.on('did-finish-load', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      mainWindow.show();
      mainWindow.focus();
    }

    const dateNow = Date.now();

    function setActivity() {
      client.request('SET_ACTIVITY', {
        pid: process.pid,
        activity: {
          details: 'Working Magic',
          state: `Version ${packageJson.version}`,
          timestamps: {
            start: dateNow,
          },
          assets: {
            large_image: 'logo',
            large_text: 'Working Magic',
          },
          buttons: [
            { label: 'Twitter', url: 'https://twitter.com/AladdinAIO' },
            { label: 'Discord', url: 'https://github.com' },
          ],
        },
      });
    }
    client.on('ready', () => {
      setActivity();
      setInterval(setActivity, 20000);
    });

    client.login({
      clientId: '753302024623489085', // put the client id from the dev portal here
    });
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  // const menuBuilder = new MenuBuilder(mainWindow);
  // menuBuilder.buildMenu();

  // Open urls in the user's browser
  mainWindow.webContents.on('new-window', (event, url) => {
    event.preventDefault();
    shell.openExternal(url);
  });

  // Remove this if your app does not use auto updates
  // eslint-disable-next-line
  //  new AppUpdater();
  setInterval(intervalAuth, 60000);
};

/**
 * Add event listeners...
 */
process.on('uncaughtException', function (error) {
  console.trace(error);
});
app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.whenReady().then(createWindow).catch(console.log);

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) createWindow();
});

ipcMain.on('activated', async (event, arg) => {
  loginWindow.close();
  loginWindow = null;
  await createWindow();
});

ipcMain.on('start:tasks', async (event, arg) => {
  startTask(arg);
});

ipcMain.on('amazon:login', async (event, arg) => {
  console.log('amazon login');
});

ipcMain.on('stop:tasks', async (event, arg) => {
  stopTask(arg.id);
});

ipcMain.on('asynchronous-message', (event, arg) => {
  console.log(arg); // prints "ping"
});

ipcMain.on('close', (event) => {
  mainWindow = null;
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

ipcMain.on('minimize-window', () => {
  // mainWindow.minimize();
  mainWindow.isMaximized() ? mainWindow.unmaximize() : mainWindow.maximize();
});

ipcMain.on('deactivate', async (event) => {
  const response = await fetch('https://aladdin-aio.com/api/license/reset', {
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      license: store.get('settings.LicenseKey'),
    }),
    method: 'POST',
  });
  app.quit();
});

ipcMain.on('open:logs', async (event) => {
  await shell.openPath(path.join(app.getPath('userData'), '/logs'));
});

ipcMain.on('test:webhook', (event, arg) => {
  // eslint-disable-next-line @typescript-eslint/no-use-before-define,promise/catch-or-return,@typescript-eslint/no-unused-vars
  testWebhook(arg).then((r) => console.log('Sent to Webhook'));
});

ipcMain.on('module:taskUpdate', (event, arg) => {
  event.preventDefault();
  console.log(arg);
});

ipcMain.on('captcha:solved', async (event, arg) => {
  // eslint-disable-next-line @typescript-eslint/no-use-before-define,promise/catch-or-return,@typescript-eslint/no-unused-vars
  console.log(arg);
});

ipcMain.on('nike:login', async (event, arg) => {
  // eslint-disable-next-line @typescript-eslint/no-use-before-define,promise/catch-or-return,@typescript-eslint/no-unused-vars
  console.log('request');
  // eslint-disable-next-line promise/catch-or-return
  const time1 = Date.now();
  // await Request('https://ja3er.com/json', {
  //   method: 'GET',
  //   headers: {
  //     'user-agent':
  //       'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.72 Safari/537.36',
  //   },
  //   // proxy: 'http://127.0.0.1:8888',
  //   followAllRedirects: false,
  // })
  //   .then((res: any) => res.text())
  //   .then((body: any) => console.log(body));

  const time2 = Date.now() - time1;
});

const testWebhook = async (hook) => {
  const hookcontent = {
    content: null,
    embeds: [
      {
        title: 'Test Webhook :sunglasses:',
        description:
          '[EVGA GeForce RTX 3080 Ti FTW3 Ultra Gaming, 12G-P5-3967-KR](https://www.twitter.com/AladdinAIO)',
        color: 1761917, // 65511
        fields: [
          {
            name: 'SKU',
            value: 'B09622N253',
            inline: true,
          },
          {
            name: 'Price',
            value: '$1400',
            inline: true,
          },
          {
            name: 'Profile',
            value: 'Test',
            inline: true,
          },
          {
            name: 'Proxy Group',
            value: `||Aladdin||`,
            inline: true,
          },
          {
            name: 'Mode',
            value: 'Fast',
            inline: true,
          },
          {
            name: 'Quantity',
            value: '1',
            inline: true,
          },
        ],
        footer: {
          text: 'Aladdin AIO © 2021',
          icon_url:
            'https://cdn.discordapp.com/attachments/458401204381155359/876613694782603295/alternative.png',
        },
        timestamp: `${new Date()}`,
        thumbnail: {
          url: 'https://m.media-amazon.com/images/I/81B2tCDJWgS._AC_SL1500_.jpg',
        },
      },
    ],
    username: 'Aladdin AIO',
  };
  await fetch(hook, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(hookcontent),
  });
};

//TaskClient
const moment = require('moment');
const ShopifyTask = require('./modules/shopify/shopify');
const amazonSmile = require('./modules/amazon/amazon-smile');
const Bestbuy = require('./modules/bestbuy/bestbuy');
const AmazonRegular = require('./modules/amazon/amazon-regular');
const Target = require('./modules/target/target');
const AmazonMonitor = require('./modules/amazon/amazon-monitor');

//  import moment from 'moment';
//  import ShopifyTask from './modules/shopify/shopify';
//  import amazonSmile from './modules/amazon/amazon-smile';
//  import Bestbuy from './modules/bestbuy/bestbuy';
//  import AmazonRegular from './modules/amazon/amazon-regular';
//  import Target from './modules/target/target';
//  import AmazonMonitor from './modules/amazon/amazon-monitor';

const logs = {};
const tasks = {};
const inputs = {};
const sitekeys = {
  'http://checkout.shopify.com': {
    site: 'shopify',
    token: '6LeoeSkTAAAAAA9rkZs5oS82l69OEYjKRZAiKdaF',
  },
  'http://www.supremenewyork.com': {
    site: 'supreme',
    token: '6LeWwRkUAAAAAOBsau7KpuC9AV-6J8mhw4AjC3Xz',
  },
  'http://www.yeezysupply.com': {
    site: 'yeezysupply',
    token: '6Ld3O6AUAAAAADqh1WiPplk5KOAGgU0WfHWAmAxD',
  },
  'http://www.footlocker.com/': {
    site: 'FootLocker US',
    token: '6Lcj-R8TAAAAABs3FrRPuQhLMbp5QrHsHufzLf7b',
  },
  'http://www.champssports.com/': {
    site: 'Champs Sports',
    token: '6Lcj-R8TAAAAABs3FrRPuQhLMbp5QrHsHufzLf7b',
  },
  'http://www.kidsfootlocker.com/': {
    site: 'Kids FootLocker',
    token: '6Lcj-R8TAAAAABs3FrRPuQhLMbp5QrHsHufzLf7b',
  },
  'http://www.footaction.com/': {
    site: 'FootAction',
    token: '6Lcj-R8TAAAAABs3FrRPuQhLMbp5QrHsHufzLf7b',
  },
  'http://www.eastbay.com/': {
    site: 'EastBay',
    token: '6Lcj-R8TAAAAABs3FrRPuQhLMbp5QrHsHufzLf7b',
  },
  'http://www.footlocker.ca/': {
    site: 'FootLocker CA',
    token: '6Lcj-R8TAAAAABs3FrRPuQhLMbp5QrHsHufzLf7b',
  },
};
const scheduled = {};
let statusQueue = [];
let productQueue = [];
let taskGroupQueues = [];
// eslint-disable-next-line prefer-const
let globalLogs = [];

function stripTrailingSlash(url) {
  if (url.substr(-1) === '/') url = url.substr(0, url.length - 1);
  return url;
}

setInterval(() => {
  if (statusQueue.length > 0) {
    mainWindow.webContents.send('log', statusQueue);
    statusQueue = [];
  }
  if (productQueue.length > 0) {
    mainWindow.webContents.send('log', productQueue);
    productQueue = [];
  }
  if (taskGroupQueues.length > 0) {
    mainWindow.webContents.send('groupStatus', taskGroupQueues);
    taskGroupQueues = [];
  }
}, 200);

const logName = `/${new Date().toISOString().split(':').join('.')}-LOG.txt`;

function writeLogs() {
  if (globalLogs.length > 0) {
    fs.writeFileSync(
      path.join(app.getPath('userData'), '/logs', logName),
      globalLogs.join('\n')
    );
  }
}
setInterval(writeLogs, 60000);

const startTask = async (task) => {
  const taskID = task.id;
  const { taskGroupID } = task;
  function addLog(log, logArray) {
    logs[taskID].push(
      `[${taskID}] [${moment().format('HH:mm:ss.SSS')}] ${log}`
    );
    globalLogs.push(
      `[Aladdin AIO] [${taskID}] [${moment().format('HH:mm:ss.SSS')}] ${log}`
    );
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    logArray &&
      statusQueue.push({
        taskId: taskID,
        time: `[${moment().format('HH:mm:ss.SSS')}]`,
        log: `${log}`,
        sendToStatus: logArray,
      });
  }

  function updateProduct(product) {
    productQueue.push({
      id: taskID,
      product,
    });
  }

  // running, carted, success, decline
  function updateTaskGroup(type) {
    taskGroupQueues.push({
      taskGroupID,
      type,
    });
  }

  function addSitekey(url, token) {
    url = stripTrailingSlash(url);
    url = url.replace('https', 'http');
    sitekeys[url] = token;
    console.log('Updated sitekey info:', sitekeys);
    mainWindow.webContents.send('sitekeys', sitekeys);
  }

  function getSitekey(siteURL) {
    siteURL = stripTrailingSlash(siteURL);
    siteURL = siteURL.replace('https', 'http');
    return sitekeys[siteURL].token;
  }

  if (tasks[taskID]) return;

  if (task.mode === 'amazonNormal') {
    tasks[taskID] = new AmazonRegular(taskID);
  } else if (task.mode === 'amazonMobile') {
    console.log('Amazon Mobile mode not implemented yet');
  } else if (task.mode === 'amazonTurbo') {
    console.log('Amazon Turbo mode not implemented yet');
  } else if (task.mode === 'amazonMonitor') {
    tasks[taskID] = new AmazonMonitor(taskID);
  } else if (task.mode === 'targetSafe') {
    tasks[taskID] = new Target(taskID);
  } else if (task.mode === 'bestbuySafe') {
    tasks[taskID] = new Bestbuy(taskID);
  } else {
    return;
  }

  tasks[taskID].taskInfo = task;

  tasks[taskID].requestClient = requestClient;

  tasks[taskID].log = addLog;

  tasks[taskID].updateProduct = updateProduct;

  tasks[taskID].updateTaskGroup = updateTaskGroup;

  tasks[taskID].addSitekey = addSitekey;

  tasks[taskID].getSitekey = getSitekey;

  logs[taskID] = [];

  tasks[taskID].initialize();
};

const stopTask = async (taskID) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-expressions
  if (tasks[taskID]) {
    if (scheduled[taskID]) {
      clearTimeout(scheduled[taskID]);
      delete scheduled[taskID];
    }
    tasks[taskID].stop();
    delete tasks[taskID];
  }
};

ipcMain.on('getSites', (event) => {
  event.returnValue = sitekeys;
});

ipcMain.on('getLogs', (event, taskID) => {
  event.returnValue = logs[taskID];
});

//Main

/* eslint-disable promise/catch-or-return */
/* eslint-disable guard-for-in */
/* eslint-disable no-restricted-syntax */
// import TaskClient from './TaskClient'
//  import { Server, WebSocketServer  } from 'ws';
const TargetLogin = require('./modules/target-login');
const AmazonLogin = require('./modules/amazon/amazon-login');
const ProxyPing = require('./modules/proxyPing');
import { getHWID } from 'hwid'
//  import TargetLogin from './modules/target-login';
//  import AmazonLogin from './modules/amazon/amazon-login';
//  import ProxyPing from './modules/proxyPing';
//  import initClient from './Client/dist/index';

const captchaWindows = {};

const { v4: uuidv4 } = require('uuid');
const url = require('url');

const io = require('socket.io-client');

// const WebsocketServer = new WebSocketServer({ port: 9988 });

const license = store.get('settings.LicenseKey');

// Handle auth server websocket
const ioClient = io.connect('http://localhost:8000', {
  auth: {
    token: license,
  },
});

ioClient.on('connect', () => {
  console.log('Connected to server');
});

ioClient.on('get:tasks:desktop', () => {
  ioClient.emit('desktop:reply', store.get('taskgroups'));
});

ioClient.on('start:tasks:desktop', (taskGroupID) => {
  console.log('Starting taskgroup', taskGroupID);
  const tasks = store.get('tasks');
  for (let i = 0; i < tasks.length; i++) {
    if (tasks[i].taskGroupID === taskGroupID) {
      startTask(tasks[i]);
    }
  }
});

ioClient.on('stop:tasks:desktop', (taskGroupID) => {
  console.log('Stopping taskgroup', taskGroupID);
  const tasks = store.get('tasks');
  for (let i = 0; i < tasks.length; i++) {
    if (tasks[i].taskGroupID === taskGroupID) {
      stopTask(tasks[i].id);
    }
  }
});

if (!fs.existsSync(path.join(app.getPath('userData'), 'logs'))) {
  fs.mkdirSync(path.join(app.getPath('userData'), 'logs'));
}

if (!fs.existsSync(path.join(app.getPath('userData'), 'config.json'))) {
  store.set('profiles', {});
  store.set('captcha', [
    {
      id: 0,
      store: [],
      name: 'Captcha Harvester 0',
      proxy: '',
    },
  ]);
  store.set('analytics', {
    checkouts: 0,
    declines: 0,
    totalSpent: 0,
  });
  store.set('accounts', [
    {
      id: 0,
      store: '',
      region: '',
      cookies: [],
      name: 'Account 0',
      proxy: '',
      status: '',
    },
  ]);
  store.set('settings', {
    LicenseKey: 'RANDOM-UJII2-231JS-163DA',
    RetryDelays: 3333,
    MonitorDelays: 3333,
    WebhookURL: '',
  });
  store.set('proxies', {});
  store.set('sessions', {});
  store.set('tasks', []);
  store.set('taskgroups', [
    {
      id: 'NEE2LE',
      store: 'amazon',
      groupName: 'gpus',
      tasks: 0,
    },
  ]);
}

// Tasks Management
ipcMain.on('create:tasks', async (event, arg) => {
  const original = store.get('tasks');
  for (let i = 0; i < arg.length; i++) {
    original.push(arg[i]);
  }
  store.set(`tasks`, original);
  const taskGroups = store.get('taskgroups');

  for (let i = 0; i < taskGroups.length; i++) {
    if (taskGroups[i].id === arg[0].taskGroupID) {
      taskGroups[i].tasks += arg.length;
    }
  }
  store.set('taskgroups', taskGroups);
  event.returnValue = true;
});

ipcMain.on('get:tasks', async (event, arg) => {
  event.returnValue = store.get('tasks');
});

ipcMain.on('delete:tasks', async (event, arg) => {
  const original = store.get('tasks');
  for (let i = 0; i < original.length; i++) {
    if (original[i].taskGroupID === arg) {
      original.splice(i, 1);
    }
  }
  store.set('tasks', original);

  const taskGroups = store.get('taskgroups');
  for (let i = 0; i < taskGroups.length; i++) {
    if (taskGroups[i].id === arg) {
      taskGroups[i].tasks = 0;
    }
  }
  store.set('taskgroups', taskGroups);
  event.returnValue = true;
});

ipcMain.on('delete:some:tasks', async (event, arg) => {
  const original = store.get('tasks');
  console.log(arg);
  for (let i = original.length - 1; i >= 0; --i) {
    if (arg.includes(original[i].id)) {
      original.splice(i, 1);
    }
  }
  store.set(`tasks`, original);
  const taskGroups = store.get('taskgroups');
  for (let i = 0; i < taskGroups.length; i++) {
    if (taskGroups[i].id === arg[0].taskGroupID) {
      taskGroups[i].tasks -= 1;
    }
  }
  store.set('taskgroups', taskGroups);
  event.returnValue = true;
});

// profiles
ipcMain.on('set:profiles', async (event, arg) => {
  const profileUUID = uuidv4().toString();
  arg.id = profileUUID;
  store.set(`profiles.${profileUUID}`, arg);
  console.log(store.get(`profiles.${profileUUID}`));
  event.returnValue = true;
});

ipcMain.on('get:profiles', async (event, arg) => {
  event.returnValue = store.get('profiles');
});

ipcMain.on('duplicate-profile', async (event, arg) => {
  const profileUUID = uuidv4().toString();
  const duplicateTarget = store.get(`profiles.${arg}`);
  duplicateTarget.id = profileUUID;
  duplicateTarget.profileName += ' Copy';
  store.set(`profiles.${profileUUID}`, duplicateTarget);
  event.returnValue = true;
});

ipcMain.on('delete-profile', async (event, arg) => {
  store.delete(`profiles.${arg}`);
  event.returnValue = true;
});

ipcMain.on('edit:profile', async (event, arg) => {
  let original = store.get(`profiles.${arg.id}`);
  original = arg;
  store.set(`profiles.${arg.id}`, original);
  event.returnValue = true;
});
// captcha
ipcMain.on('set:harvesters', async (event, arg) => {
  const original = store.get('captcha');
  original.push(arg);
  store.set(`captcha`, original);
  event.returnValue = true;
});

ipcMain.on('get:harvesters', async (event, arg) => {
  event.returnValue = store.get('captcha');
});

ipcMain.on('save:harvesters', async (event, id, arg) => {
  const original = store.get('captcha');
  for (const i in original) {
    if (original[i].id === id) {
      original[i] = arg;
      break;
    }
  }
  store.set('captcha', original);
  event.returnValue = true;
});

// Settings
ipcMain.on('save:settings', async (event, arg) => {
  store.set('settings', arg);
  mainWindow.webContents.send('log', 'test message');
});

ipcMain.on('get:settings', async (event, arg) => {
  event.returnValue = store.get('settings');
});

// Analytics 'get:analytics'
ipcMain.on('get:analytics', async (event, arg) => {
  event.returnValue = store.get('analytics');
});

// Accounts
ipcMain.on('set:accounts', async (event, arg) => {
  const original = store.get(`accounts.${arg.site}`);
  original.push(arg);
  store.set(`accounts.${arg.site}`, original);
  event.returnValue = true;
});

ipcMain.on('get:accounts', async (event, arg) => {
  event.returnValue = store.get('accounts');
});

ipcMain.on('save:accounts', async (event, id, arg) => {
  const original = store.get('accounts');
  for (const i in original) {
    if (original[i].id === id) {
      original[i] = arg;
      break;
    }
  }
  store.set('accounts', original);
  event.returnValue = true;
});

ipcMain.on('delete:account', async (event, id) => {
  const original = store.get('accounts');
  let altered = original;
  for (const i in original) {
    if (original[i].id === id) {
      altered = original.filter((el) => el.id !== id);
    }
  }

  store.set('accounts', altered);
  event.returnValue = true;
});

ipcMain.on('get:sessions', async (event) => {
  event.returnValue = store.get('sessions');
});

ipcMain.on('add:session', async (event, arg) => {
  store.set(`sessions.${arg.site}.${arg.id}`, arg);
  event.returnValue = true;
});

ipcMain.on('create:taskgroup', async (event, arg) => {
  const original = store.get('taskgroups');
  original.push(arg);
  store.set('taskgroups', original);
  event.returnValue = true;
});

ipcMain.on('get:taskgroups', async (event, arg) => {
  event.returnValue = store.get('taskgroups');
});

ipcMain.on('delete:taskgroup', async (event, arg) => {
  const original = store.get('taskgroups');
  const originalTasks = store.get('tasks');
  for (let i = original.length - 1; i >= 0; --i) {
    if (original[i].id === arg) {
      original.splice(i, 1);
    }
  }
  for (let i = originalTasks.length - 1; i >= 0; --i) {
    if (originalTasks[i].taskGroupID === arg) {
      originalTasks.splice(i, 1);
    }
  }
  store.set('taskgroups', original);
  store.set('tasks', originalTasks);
  event.returnValue = true;
});

// Proxies
ipcMain.on('get:proxies', async (event, arg) => {
  event.returnValue = store.get('proxies');
});

ipcMain.on('add:proxies', async (event, arg) => {
  const proxiesUUID = uuidv4().toString();
  arg.id = proxiesUUID;
  const proxiesArray = arg.proxies.split('\n');
  const proxiesObject = {};
  for (let i = 0; i < proxiesArray.length; i++) {
    const [ip, port, user, password] = proxiesArray[i].split(':');
    const proxyID = uuidv4().toString();
    if (user === undefined || password === undefined) {
      proxiesObject[proxyID] = {
        ip,
        port,
        user: null,
        password: null,
        id: proxyID,
      };
    } else if (
      user === undefined &&
      password === undefined &&
      port === undefined &&
      ip === undefined
    ) {
      break;
    } else {
      proxiesObject[proxyID] = { ip, port, user, password, id: proxyID };
    }
  }
  arg.proxies = proxiesObject;
  store.set(`proxies.${proxiesUUID}`, arg);
  event.returnValue = true;
});

ipcMain.on('delete:proxies', async (event, arg) => {
  const proxies = store.get('proxies');
  for (const i in proxies) {
    if (proxies[i].id === arg) {
      delete proxies[i];
    }
  }
  store.set('proxies', proxies);
  event.returnValue = true;
});

ipcMain.on('edit:proxy', async (event, arg) => {
  const proxiesArray = arg.proxies.split('\n');
  const proxiesObject = {};
  for (let i = 0; i < proxiesArray.length; i++) {
    const [ip, port, user, password] = proxiesArray[i].split(':');
    const proxyID = uuidv4().toString();
    if (user === undefined || password === undefined) {
      proxiesObject[proxyID] = {
        ip,
        port,
        user: null,
        password: null,
        id: proxyID,
      };
    } else if (
      user === undefined &&
      password === undefined &&
      port === undefined &&
      ip === undefined
    ) {
      break;
    } else {
      proxiesObject[proxyID] = { ip, port, user, password, id: proxyID };
    }
  }
  arg.proxies = proxiesObject;
  store.set(`proxies.${arg.id}`, arg);
  event.returnValue = true;
});

ipcMain.on('delete:specific:proxy', async (event, groupID, id) => {
  const proxies = store.get('proxies');
  for (const i in proxies[groupID].proxies) {
    if (proxies[groupID].proxies[i].id === id) {
      delete proxies[groupID].proxies[i];
    }
  }
  store.set('proxies', proxies);
  event.returnValue = true;
});

// let requestClient;
let targetLogin;
// (async () => {
//   requestClient = await initClient({ port: 9120 });
// })();

const pings = [];

function sendPing(info) {
  mainWindow.webContents.send('proxySpeed', info);
}

ipcMain.on('test:proxy', async (event, groupID, id, proxy) => {
  pings[id] = new ProxyPing();
  pings[id].id = id;
  pings[id].groupID = groupID;
  pings[id].requestClient = requestClient;
  pings[id].proxy = proxy;
  pings[id].sendPing = sendPing;
  pings[id].initialize();
});

ipcMain.on('checkAuth', async (event, info) => {
  const key = store.get('settings.LicenseKey');
  const hwid = await getHWID()
  const response = await requestClient(
    'https://aladdin-aio.com/api/license/auth',
    {
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ license: key, machineID: hwid }),
    },
    'POST'
  );
  const responseJSON = JSON.parse(response.body);
  console.log(responseJSON);

  if (response.status === 200 && responseJSON.success) {
    event.returnValue = true;
  } else {
    event.returnValue = false;
  }
});



ipcMain.on('activate', async (event, key) => {
  const hwid = await getHWID()
  const response = await requestClient(
    'https://aladdin-aio.com/api/license/auth',
    {
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ license: key, machineID: hwid }),
    },
    'POST'
  );

  const responseJSON = JSON.parse(response.body);
  console.log(responseJSON);
  if (response.status === 200 && responseJSON.success) {
    event.returnValue = { key, success: true };
    store.set('settings.LicenseKey', key);
    store.set('settings.avatar', responseJSON.user.image);
    store.set('settings.username', responseJSON.user.name);
  }
  event.returnValue = { key, success: false };
});

ipcMain.on('get:info', async (event) => {
  const settings = store.get('settings');
  event.returnValue = settings;
});

// WebsocketServer.on('connection', function connection(ws) {
//   ws.on('message', function incoming(message) {
//     console.log('received: %s', message);
//   });
//   // ws.send('something');
// });

// WebsocketServer.on('connection', function connection(ws) {
//   ws.on('message', function incoming(message) {
//     console.log('received: %s', message);
//     message = JSON.parse(message)
//     if (message.type === 'headers') {
//       targetLogin.currentHeaders = message.headers
//       targetLogin.updated = true;
//       console.log(`\n ${targetLogin.currentHeaders} \n`);
//     }
//   });
//   // ws.send('something');
// });

let startedTarget = false;

// WebsocketServer.on('connection', function connection(ws) {
//   ws.on('message', async function incoming(message) {
//     console.log('received: %s', message);
//     message = JSON.parse(message);
//     if (message.type === 'headers') {
//       const currentHeaders = message.headers;
//       const headers = currentHeaders;
//       const headersArray = {};
//       for (const header in headers) {
//         // console.log(headers[header].name)
//         headersArray[headers[header].name] = headers[header].value;
//       }
//       if (startedTarget) {
//         targetLogin.currentHeaders = headersArray;
//         targetLogin.initialize();
//         startedTarget = false;
//       }
//     }
//   });
//   // ws.send('something');
// });

function sessionStatus(message) {
  mainWindow.webContents.send('session-msg', message);
}

ipcMain.on('target-login', async (event, info) => {
  sessionStatus('Awaiting Browser Login');
  targetLogin = new TargetLogin();
  targetLogin.info = info;
  targetLogin.sessionStatus = sessionStatus;
  targetLogin.requestClient = requestClient;
  startedTarget = true;
  targetLogin.initialize();
});

ipcMain.on('amazon-login', async (event, info) => {
  sessionStatus('Starting Browser');
  const amazonLogin = new AmazonLogin();
  amazonLogin.info = info;
  amazonLogin.sessionStatus = sessionStatus;
  amazonLogin.requestClient = requestClient;
  amazonLogin.initialize();
});

// Captcha Windows
ipcMain.on('show:harvester', (event, arg, name) => {
  event.preventDefault();
  const captchaWin = new BrowserWindow({
    title: 'Captcha Harvester',
    backgroundColor: '#1a1c2a',
    height: 580, // 580
    width: 400, // 397
    show: true,
    center: true,
    icon: getAssetPath('icon.png'),
    fullscreen: false,
    maximizable: false,
    minimizable: false,
    resizable: false,
    skipTaskbar: false,
    useContentSize: true,
    frame: false,
    webPreferences: {
      nodeIntegration: true,
      webSecurity: false,
      enableRemoteModule: true,
      contextIsolation: false,
      plugins: true,
      devTools: false,
      // partition: `persist:captcha-${arg}`,
      webviewTag: true,
      preload: path.join(__dirname, '../modules/Harvester/preload.js'),
    },
  });
  captchaWin.setMenu(null);
  captchaWin
    .loadURL(
      url.format({
        pathname: path.join(__dirname, `../modules/Harvester/captcha.html`),
        protocol: 'file:',
        slashes: true,
        query: {
          id: arg,
          name,
        },
      })
    )
    .then((r) => console.log('Launched Captcha Window'));
});
