/* eslint-disable func-names */
/* eslint-disable no-bitwise */
/* eslint-disable promise/param-names */
/* eslint-disable class-methods-use-this */

// import initClient from './Request/Client/dist/index';

const Store = require('electron-store');
const fetch = require('node-fetch');
const Request = require('./Request');
// let requestClient;

// (async () => {
//   requestClient = await initClient();
// })();

const NotifyMonitor = require('./modules/notify');

const Monitor = new NotifyMonitor();
class Tasks {
  constructor(props) {
    // eslint-disable-next-line no-restricted-syntax, guard-for-in
    for (const counter in props) {
      this.counter = props[counter];
    }
    // this.stripTrailingSlash();
    this.previousStatus = null;
    this.cancelled = false;
    this.errorDelay = 3000;
    this.store = new Store();
    this.webhook = this.getWebhook();
    this.Monitor = Monitor;
    this.Monitor.on('monitor-result', async (sku, oid) => {
      if (
        this.taskInfo?.sku === sku &&
        this.taskInfo?.mode !== 'amazonMonitor' &&
        !this.cancelled
      ) {
        this.listingId = oid;
        await this.realInitialize();
      }
    });
  }

  sleep(ms) {
    return new Promise((r) => setTimeout(r, ms));
  }

  sendStatus(status) {
    // !this.cancelled ||
    // status === 'Stopped' &&
    //   status !== this.previousStatus &&
    //   ((this.previousStatus = status), this.log(status, true));

    if (status !== this.previousStatus) {
      this.previousStatus = status;
      this.log(status, true);
    }
  }

  async getRandomProxy() {
    try {
    const proxies = this.store.get(`proxies.${this.taskInfo.proxy}.proxies`);
    const keys = Object.keys(proxies);
    const proxyObject = proxies[keys[(keys.length * Math.random()) << 0]];
    if (!proxyObject?.user && !proxyObject.password) {
      this.proxy = `${proxyObject.ip}:${proxyObject.port}`;
    }
    this.proxy = `${proxyObject.ip}:${proxyObject.port}:${proxyObject.user}:${proxyObject.password}`;
  } catch (e) {
    this.proxy = '';
  }
  }

  sendProduct(product) {
    if (!this.cancelled) this.updateProduct(product);
  }

  async sendRequest(arg) {
    if (!arg.proxy) {
      arg.proxy = this.proxy;
    }
    if (!arg.timeout) {
      arg.timeout = 30000;
    }
    if (!arg.headers) {
      arg.headers = {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.141 Safari/537.36',
        Accept: '*/*',
        Connection: 'Keep-Alive',
      };
    }

    if (arg.forceHttp1) {
      return Request({
        simple: false,
        resolveWithFullResponse: true,
        gzip: true,
        agentOptions: {
          secureProtocol: 'TLSv1_2_method',
        },
        ...arg,
      });
    }

    return Request({
      simple: false,
      resolveWithFullResponse: true,
      gzip: true,
      agentOptions: {
        secureProtocol: 'TLSv1_2_method',
      },
      ...arg,
    });
  }

  sendLog(log) {
    if (!this.cancelled) this.log(log, false);
  }

  monitorDelay() {
    return new Promise(async (r) =>
      setTimeout(r, await this.getMonitorDelay())
    );
  }

  getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  errorDelay() {
    return new Promise(async (r) => setTimeout(r, await this.getErrorDelay()));
  }

  async getMonitorDelay() {
    return this.errorDelay;
  }

  async getErrorDelay() {
    return this.errorDelay;
  }

  getWebhook() {
    return this.store.get('settings.WebhookURL');
  }

  stop() {
    this.sendStatus('Stopped');
    this.cancelled = true;
  }

  stripTrailingSlash() {
    if (this.url.substr(-1) === '/')
      this.url = this.url.substr(0, this.url.length - 1);
  }

  async sendSuccess(json) {
    // add success to store items
    let items
    try {
      items = this.store.get('analytics.items')
    } catch (e){
      this.store.set('analytics.items', [])
      items = this.store.get('analytics.items')
    }

    items.push({
      title: json?.product,
      image: json?.imageURL ?? 'https://semantic-ui.com/images/wireframe/image.png',
      date: Date.now(),
      site: json?.store,
      price: json?.price,
    })

    this.store.set('analytics.items', items)
    
    fetch('https://aladdin-aio.com/api/success', {
      method: 'POST',
      headers: { 
        'content-type': 'application/json',
        Accept: '*/*',
     },
      body: JSON.stringify({
        "content": json
      })
    });

    const content = {
      content: null,
      embeds: [
        {
          title: `Successful Checkout - ${json.store}`,
          description: `[${json.product}](${json.link})`,
          color: 1761917,
          fields: [
            {
              name: 'SKU',
              value: json.sku,
              inline: true,
            },
            {
              name: 'Price',
              value: json.price,
              inline: true,
            },
            {
              name: 'Profile',
              value: json.profile,
              inline: true,
            },
            {
              name: 'Proxy Group',
              value: `||${json.proxy}||`,
              inline: true,
            },
            {
              name: 'Mode',
              value: json.mode,
              inline: true,
            },
            {
              name: 'Quantity',
              value: json.quantity,
              inline: true,
            },
          ],
          footer: {
            text: 'Aladdin AIO © 2021',
            "icon_url": "https://cdn.discordapp.com/attachments/458401204381155359/876613694782603295/alternative.png",
          },
          thumbnail: {
            url: json.imageURL,
          },
        },
      ],
      username: 'Aladdin AIO',
    };
    fetch(this.webhook, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(content),
    });
  }

  async getKey() {
    return 'RANDOM-KEYXD';
  }
}
module.exports = Tasks;
