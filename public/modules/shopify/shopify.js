/* eslint-disable @typescript-eslint/no-useless-constructor */
/* eslint-disable class-methods-use-this */
// const Request = require('better-electron-fetch');
const tough = require('tough-cookie');
const got = require('got');
const Tasks = require('../../tasks');

class ShopifyTask extends Tasks {
  constructor(props) {
    super(props);
    this.url = 'https://www.kith.com/';
  }

  getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  stop() {
    this.sendStatus('Stopped');
    this.cancelled = true;
  }

  async initialize() {
    this.sendStatus('Starting Task');
    await this.visitHomePage();
    await this.addToCart();
    await this.submitShipping();
    await this.submitBilling();
    await this.checkoutURL();
    // await this.submitOrder();
  }

  async visitHomePage() {
    if (this.cancelled) return;
    await this.sleep(this.getRandomInt(100, 300));
    // const req = await this.sendRequest({
    //   url: 'https://ja3er.com/json',
    //   method: 'GET',
    //   proxy: '45.66.117.7:3120:johnnie:stat',
    // });

    // const response = await this.cycleTLS('https://ja3er.com/json', {
    //   body: '',
    //   ja3: '771,4865-4866-4867-49195-49199-49196-49200-52393-52392-49171-49172-156-157-47-53,0-23-65281-10-11-35-16-5-13-18-51-45-43-27-21,29-23-24,0',
    //   userAgent:
    //     'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36',
    // });
    // console.log(req.body);
    this.sendStatus('Monitoring Item');
    const res = await this.requestClient('https://ezdiscord.xyz/fingerprint',{
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:91.0) Gecko/20100101 Firefox/91.0",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.5",
        "Upgrade-Insecure-Requests": "1",
        "Sec-Fetch-Dest": "document",
        "Sec-Fetch-Mode": "navigate",
        "Sec-Fetch-Site": "cross-site",
        "Cache-Control": "max-age=0"
    }
    })
    console.log(res.body);
  }

  async addToCart() {
    // const body = {
    //   id: '39261345120278',
    //   quantity: 1,
    // };
    if (this.cancelled) return;
    await this.sleep(this.getRandomInt(100, 200));

    // const req = await this.sendRequest({
    //   url: 'https://api64.ipify.org?format=json',
    //   proxy: '45.66.117.7:3120:johnnie:stat',
    // });
    // const response = await this.cycleTLS(
    //   'https://api64.ipify.org?format=json',
    //   {
    //     body: '',
    //     proxy: '45.66.117.7:3120:johnnie:stat',
    //     ja3: '771,4865-4866-4867-49195-49199-49196-49200-52393-52392-49171-49172-156-157-47-53,0-23-65281-10-11-35-16-5-13-18-51-45-43-27-21,29-23-24,0',
    //     userAgent:
    //       'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36',
    //   }
    // );

    if (this.cancelled) return;

    this.sendStatus('Adding to Cart');
    // this.sendStatus(response.body);
    // await Request('https://random-aio.myshopify.com/cart/add.js', {
    //   method: 'POST',
    //   headers: {
    //     Accept: 'application/json, text/plain, */*',
    //     'Accept-Encoding': 'gzip, deflate, br',
    //     'Accept-Language': 'en-US,en;q=0.9,es;q=0.8,nl;q=0.7',
    //     Connection: 'keep-alive',
    //     'Content-Type': 'application/json',
    //     DNT: 1,
    //   },
    //   body: JSON.stringify(body),
    //   jar: this.jar,
    //   gzip: true,
    //   proxy: '45.66.117.4:3120:johnnie:stat',
    //   followAllRedirects: false,
    // }).then((res) => res.text());
  }

  async submitShipping() {
    await this.sleep(this.getRandomInt(10, 80));
    if (this.cancelled) return;
    // const req = await this.sendRequest({
    //   url: 'https://cat-fact.herokuapp.com',
    //   proxy: '45.66.117.7:3120:johnnie:stat',
    // });

    // const response = await this.cycleTLS('https://headers.cf/api/headers', {
    //   body: '',
    //   headers: {
    //     'sec-ch-ua':
    //       '" Not A;Brand";v="99", "Chromium";v="90", "Google Chrome";v="90"',
    //     'sec-ch-ua-mobile': '?0',
    //     'upgrade-insecure-requests': '1',
    //     accept: '*/*',
    //     'sec-fetch-site': 'none',
    //     'sec-fetch-mode': 'navigate',
    //   },
    //   headerOrder: [
    //     'sec-ch-ua',
    //     'sec-ch-ua-mobile',
    //     'upgrade-insecure-requests',
    //     'accept',
    //     'sec-fetch-site',
    //     'sec-fetch-mode',
    //   ],
    //   ja3: '771,4865-4866-4867-49195-49199-49196-49200-52393-52392-49171-49172-156-157-47-53,0-23-65281-10-11-35-16-5-13-18-51-45-43-27-21,29-23-24,0',
    //   userAgent:
    //     'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36',
    // });
    // // this.sendStatus('Submitting Shipping');
    // if (this.cancelled) return;
    // console.log(response);
    this.sendStatus('Added To Cart');
  }

  async submitBilling() {
    await this.sleep(this.getRandomInt(10, 80));
    if (this.cancelled) return;
    this.sendStatus('Processing');

    // const response = await this.cycleTLS('https://postman-echo.com/headers', {
    //   body: '',
    //   ja3: '771,4865-4866-4867-49195-49199-49196-49200-52393-52392-49171-49172-156-157-47-53,0-23-65281-10-11-35-16-5-13-18-51-45-43-27-21,29-23-24,0',
    //   userAgent:
    //     'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36',
    //   headers: {
    //     'sec-ch-ua':
    //       '" Not A;Brand";v="99", "Chromium";v="90", "Google Chrome";v="90"',
    //     'sec-ch-ua-mobile': '?0',
    //     'upgrade-insecure-requests': '1',
    //     accept: '*/*',
    //     'sec-fetch-site': 'none',
    //     'sec-fetch-mode': 'navigate',
    //   },
    //   headerOrder: [
    //     'sec-ch-ua',
    //     'sec-ch-ua-mobile',
    //     'upgrade-insecure-requests',
    //     'accept',
    //     'sec-fetch-site',
    //     'sec-fetch-mode',
    //   ],
    //   proxy: '45.66.117.7:3120:johnnie:stat',
    // });

    // console.log(response.body);
  }

  async checkoutURL() {
    await this.sleep(this.getRandomInt(100, 200));
    if (this.cancelled) return;
    this.sendStatus('Successful Checkout');
    await this.sendSuccess({
      sku: '979738052',
      store: 'Walmart',
      product: 'Sony PlayStation 5, Digital Edition Video Game Consoles',
      price: '$399',
      profile: 'Main',
      proxy: 'ISP',
      mode: 'Fast',
      quantity: '1',
      imageURL:
        'https://i5.walmartimages.com/asr/f62842fd-263f-46d4-8954-9fbe1a25d636.fefa1d11a99643573cf756f2ce835c05.png?odnHeight=100&odnWidth=100&odnBg=FFFFFF',
    });
    // const response = await this.cycleTLS(
    //   'https://nghttp2.org/httpbin/anything',
    //   {
    //     body: '',
    //     ja3:
    //       '771,4865-4866-4867-49195-49199-49196-49200-52393-52392-49171-49172-156-157-47-53,0-23-65281-10-11-35-16-5-13-18-51-45-43-27-21,29-23-24,0',
    //     userAgent:
    //       'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36',
    //     headers: {
    //       'sec-ch-ua':
    //         '" Not A;Brand";v="99", "Chromium";v="90", "Google Chrome";v="90"',
    //       'sec-ch-ua-mobile': '?0',
    //       'upgrade-insecure-requests': '1',
    //       accept: '*/*',
    //       'sec-fetch-site': 'none',
    //       'sec-fetch-mode': 'navigate',
    //     },
    //     headerOrder: [
    //       'sec-ch-ua',
    //       'sec-ch-ua-mobile',
    //       'upgrade-insecure-requests',
    //       'accept',
    //       'sec-fetch-site',
    //       'sec-fetch-mode',
    //     ],
    //     proxy: '45.66.117.7:3120:johnnie:stat',
    //   }
    // );

    // console.log(response.body);
    // await Request('https://random-aio.myshopify.com/cart', {
    //   method: 'POST',
    //   headers: {
    //     Accept: 'application/json, text/plain, */*',
    //     'Accept-Encoding': 'gzip, deflate, br',
    //     'Accept-Language': 'en-US,en;q=0.9,es;q=0.8,nl;q=0.7',
    //     Connection: 'keep-alive',
    //     origin: 'https://random-aio.myshopify.com',
    //     referer: 'https://random-aio.myshopify.com/cart',
    //     'Content-Type': 'application/json',
    //     DNT: 1,
    //   },
    //   body: JSON.stringify(body),
    //   jar: this.jar,
    //   gzip: true,
    //   proxy: {
    //     url: 'http://45.66.117.4:3120',
    //     user: 'johnnie',
    //     password: 'stat',
    //   },
    // }).then((res) => res.status);
  }

  async calculateTax() {
    await this.sleep(this.getRandomInt(1200, 2000));
    if (this.cancelled) return;

    // const response = await this.cycleTLS(
    //   'https://client.tlsfingerprint.io:8443/',
    //   {
    //     body: '',
    //     ja3: '771,4865-4866-4867-49195-49199-49196-49200-52393-52392-49171-49172-156-157-47-53,0-23-65281-10-11-35-16-5-13-18-51-45-43-27-21,29-23-24,0',
    //     userAgent:
    //       'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 Safari/537.36',
    //   }
    // );
    // this.sendStatus('Calculating Taxes');
    // // console.log(response);
    // this.sendStatus(response.body);
  }

  async submitOrder() {
    await this.sleep(this.getRandomInt(2000, 3000));
    if (this.cancelled) return;
    this.sendStatus('Checked Out');
  }
}

module.exports = ShopifyTask;
