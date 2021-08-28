/* eslint-disable prefer-destructuring */
/* eslint-disable @typescript-eslint/no-useless-constructor */
/* eslint-disable class-methods-use-this */
// const Request = require('better-electron-fetch');
const cheerio = require('cheerio');
const Tasks = require('../../tasks');

class AmazonMonitor extends Tasks {
  constructor(props) {
    super(props);
    this.count = 0
  }

  getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  stop() {
    this.cancelled = true;
    this.sendStatus('Stopped');
  }

  async getInfo() {
    const original = this.store.get(`sessions.amazon.${this.taskInfo.session}`);
    let firstCookie = true;
    const cookies = original.cookies;
    for (let i = 0; i < cookies.length; i++) {
      if (firstCookie) {
        const cookieValue = cookies[i].value;
        this.cookieString += `${cookies[i].name}=${cookieValue}`;
        firstCookie = false;
      } else {
        const cookieValue = cookies[i].value;
        this.cookieString += ` ;${cookies[i].name}=${cookieValue}`;
      }
      if (cookies[i].name === 'session-id') {
        this.sessionID = cookies[i].value;
      }
    }
  }

  async initialize() {
    this.itemID = this.taskInfo.sku;
    await this.getInfo()
    this.sendStatus('Starting Task');
    await this.getRandomProxy();
    await this.monitor();
  }

  sleep_60 = () => new Promise((resolve, reject) => {
    var interval = setInterval(async () => {
        this.sendStatus(`Sleeping for ${60 - this.count} seconds`);
        this.count += 1;
        if (this.cancelled) {
          clearInterval(interval);
          this.count = 0;
          this.sendStatus('Stopped');
          resolve();
          return
        }

        if (this.count === 60) { // if it has been run 5 times, we resolve the promise
            clearInterval(interval);
            this.count = 0
            resolve(true); // result of promise
        }
    }, 1000); // 1 min interval
  });

  async monitor() {
    if (this.cancelled) return;
    this.sendStatus('Monitoring');
    const req = await this.requestClient(
      `https://www.amazon.com/portal-migration/aod?asin=${this.itemID}&m=ATVPDKIKX0DER`,
      {
        userAgent:
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 Safari/537.36',
        headers: {
          accept:
            'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
          'accept-language': 'en-US,en;q=0.9',
          'cache-control': 'max-age=0',
          downlink: '10',
          ect: '4g',
          rtt: '0',
          'sec-ch-ua':
            '" Not A;Brand";v="99", "Chromium";v="90", "Google Chrome";v="90"',
          'sec-ch-ua-mobile': '?0',
          'sec-fetch-dest': 'document',
          'sec-fetch-mode': 'navigate',
          'sec-fetch-site': 'none',
          'sec-fetch-user': '?1',
          'upgrade-insecure-requests': '1',
          cookie: this.cookieString
        },
        proxy: this.proxy ? this.proxy : '',
      },
      'GET'
    );

    // console.log(req.body);
    const $ = cheerio.load(req.body);
    // this.listingId = $('input[name="offeringID.1"]').first().val();
    try {
      const price0 = $('#aod-price-0 > span > span.a-offscreen').text();
      const listingIDArray = $('span[class="a-declarative"]')
        .map((i, x) => $(x).attr('data-aod-atc-action'))
        .toArray();
      this.listingId = JSON.parse(listingIDArray[0]).oid;
      this.Monitor.notify(this.itemID, this.listingId);
      this.sendStatus('Got Item');
    } catch (e) {
      await this.sleep_60();
      await this.monitor();
    }

    // const listingIDArray = $('span[class="a-declarative"]')
    //   .map((i, x) => $(x).attr('data-aod-atc-action'))
    //   .toArray();
    // this.listingId = JSON.parse(listingIDArray[0]).oid;
    // this.Monitor.notify(this.itemID, this.listingId);
    // this.sendStatus('Got Item');
  }
}

module.exports = AmazonMonitor;
