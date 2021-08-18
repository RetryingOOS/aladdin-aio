/* eslint-disable prefer-destructuring */
/* eslint-disable @typescript-eslint/no-useless-constructor */
/* eslint-disable class-methods-use-this */
// const Request = require('better-electron-fetch');
const cheerio = require('cheerio');
const Tasks = require('../../tasks');

class AmazonMonitor extends Tasks {
  constructor(props) {
    super(props);
  }

  getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  stop() {
    this.sendStatus('Stopped');
    this.cancelled = true;
  }

  async initialize() {
    this.itemID = this.taskInfo.sku;
    this.sendStatus('Starting Task');
    await this.getRandomProxy();
    await this.monitor();
  }

  async monitor() {
    if (this.cancelled) return;
    this.sendStatus('Monitoring');
    const req = await this.requestClient(
      `https://amazon.com/portal-migration/aod?asin=${this.itemID}&m=ATVPDKIKX0DER`,
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
        },
        proxy: this.proxy ? this.proxy : '',
      },
      'GET'
    );

    // console.log(req.body);
    const $ = cheerio.load(req.body);
    // this.listingId = $('input[name="offeringID.1"]').first().val();
    const listingIDArray = $('span[class="a-declarative"]')
      .map((i, x) => $(x).attr('data-aod-atc-action'))
      .toArray();
    this.listingId = JSON.parse(listingIDArray[0]).oid;
    this.Monitor.notify(this.itemID, this.listingId);
    this.sendStatus('Got Item');
  }
}

module.exports = AmazonMonitor;
