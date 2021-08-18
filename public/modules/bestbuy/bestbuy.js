/* eslint-disable no-var */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-return-assign */
/* eslint-disable no-multi-assign */
/* eslint-disable prettier/prettier */
/* eslint-disable no-bitwise */
/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable no-useless-concat */
/* eslint-disable no-useless-escape */
/* eslint-disable consistent-return */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-plusplus */
/* eslint-disable prefer-destructuring */
/* eslint-disable @typescript-eslint/no-useless-constructor */
/* eslint-disable class-methods-use-this */
// const Request = require('better-electron-fetch');
const tough = require('tough-cookie');
const got = require('got');
const { HttpsProxyAgent } = require('hpagent');
const forge = require('node-forge');
const Tasks = require('../../tasks');
// const proxy = 'http://127.0.0.1:8866';

class Bestbuy extends Tasks {
  constructor(props) {
    super(props);
    this.itemID = 'B00006IFB4';
    // this.addressID = 'ngjppsjpnkkq';
    this.initialSensor = '';
    this.fingerprintSensor = '';
    this.challengeSensor = '';
    this.abck = '';
    this.randomport = Math.floor(Math.random() * 250);
    this.proxy = `45.66.117.${this.randomport}:3120:johnnie:stat`;
    // this.proxy = '127.0.0.1:8866';
    // this.proxy = 'http://127.0.0.1:8866'

    this.proxyFormatted = `http://johnnie:stat@45.66.117.${this.randomport}:3120`;
    this.proxy1 = `johnnie:stat@45.66.117.${this.randomport}:3120`
    this.returnedAbck = '';
    this.publicKey = `-----BEGIN PUBLIC KEY-----
    MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA3NdCG0m22ru2c0jFJIYq
    1WlnutxQ+fq0EgFYeDR/ZatsH76exsFtncyuyFQZvCnSB2MbSHJ0w4NH5NRAEvHc
    WX+TxyAf3YGS+t//kLogn/uHVvxCBKCiHO1Wej6uOde1iXjAzMyK/fYkDDTQlRfI
    ro5cpMcG8wSnjpnnmoqx7YabohBt0f9PluSN3jrBTmDy7fNsyp7/Y618GSUKpfFV
    IHpKCioBZukMlccmaz68+YeTKssMS2zgHEyWWBbRKJqILDh4ay+9u1tJyFQS0iby
    IVnFwqCvwQhmkY4PjCJNSE2dZBpWWh2heObyRAXUO0xf/a/rvUL1QuXHh1FIncvw
    5wIDAQAB
    -----END PUBLIC KEY-----`;
    this.keyID = '735818052';
    this.cookieJar = new tough.CookieJar();
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
    await this.sensorReqs();
    await this.requestClient(
      'https://www.bestbuy.com/',
      {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:89.0) Gecko/20100101 Firefox/89.0',
          Accept: 'application/json',
          'Accept-Language': 'en-US,en;q=0.5',
          'Content-Type': 'application/json; charset=UTF-8',
          'user-agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.114 Safari/537.36',
        },
        jar: this.cookieJar,
        proxy: this.proxy,
      },
      'GET'
    );
    // await this.getSensor();
    await this.addToCart();
    await this.startingCheckout();
    // await this.sensorReqs();
    await this.checkoutPatch();
    await this.checkoutPatch1();
    await this.paymentEncryption();
    await this.submitPayment();
    await this.refreshPayment();
    await this.preLookup();
    await this.ThreeDReference();
    await this.submitOrder();
  }

  async getSensor(type, abck) {
    if (this.cancelled) return;
    // await this.sleep(this.getRandomInt(1000, 2000));
    const req = await this.requestClient(
      `http://127.0.0.1:3000/akamai/sensor?type=${type}`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ abck, key: 'RANDOM AIO' }),
      },
      'POST'
    );
    // console.log(req.body);
    this.sendStatus('Getting Sensor');
    return req.body;
    // const req = await this.requestClient('https://akamai.solarsystems.software/gen_akamai', {
    //   headers: {
    //     "ss-api-key": "Zd(*+NCXF&34n4@-NS)8HHn43", 
    //     "ss-include-pixel": "false",
    //     "ss-target": "bestbuy_us",
    //     "ss-proxy": this.proxy1
    //   }
    // })
    // console.log(req.headers._abck)
    // this.cookieJar.setCookieSync(req.headers._abck, "https://www.bestbuy.com")
  }

  async postSensor(sensor) {
    if (this.cancelled) return;
    const sensorPostReq = await this.requestClient(
      'https://www.bestbuy.com/WEs-Q2pRiNpSvniZQhPd/raw3tmNt/dR5QFScB/GXIeXSk5/az4',
      {
        jar: this.cookieJar,
        headers: {
          accept: '*/*',
          'accept-language': 'en-US,en;q=0.9',
          'content-type': 'text/plain;charset=UTF-8',
          'accept-encoding': 'gzip, deflate, br',
          'sec-ch-ua':
            '" Not;A Brand";v="99", "Google Chrome";v="91", "Chromium";v="91"',
          'sec-ch-ua-mobile': '?0',
          'sec-fetch-dest': 'empty',
          'sec-fetch-mode': 'cors',
          'sec-fetch-site': 'same-origin',
          'user-agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.114 Safari/537.36',
        },
        body: sensor,
        proxy: this.proxy,
      },
      'POST'
    );

    console.log(sensorPostReq.body);
    for (let i = 0; i < sensorPostReq.headers['Set-Cookie'].length; i++) {
      if (sensorPostReq.headers['Set-Cookie'][i].indexOf('_abck') > -1) {
        const cookie = sensorPostReq.headers['Set-Cookie'][i]
          .split('_abck=')[1]
          .split('; Domain')[0];
        console.log(`\n${cookie}\n`);
        return cookie;
      }
    }
  }

  async sensorReqs(existingCookie) {
    if (this.cancelled) return;
    let abck;
    console.log('POSTING SENSOR')
    if (!existingCookie) {
      const getHome = await this.requestClient('https://www.bestbuy.com/WEs-Q2pRiNpSvniZQhPd/raw3tmNt/dR5QFScB/GXIeXSk5/az4', {
        jar: this.cookieJar,
        headers: {
          accept:
            'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
          'accept-encoding': 'gzip, deflate, br',
          'accept-language': 'en-US,en;q=0.9',
          dnt: '1',
          'sec-ch-ua':
            '" Not;A Brand";v="99", "Google Chrome";v="91", "Chromium";v="91"',
          'sec-ch-ua-mobile': '?0',
          'sec-fetch-dest': 'document',
          'sec-fetch-mode': 'navigate',
          'sec-fetch-site': 'none',
          'sec-fetch-user': '?1',
          'upgrade-insecure-requests': '1',
          'user-agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.114 Safari/537.36',
          // cookie: this.cookieJar.getCookieStringSync('https://www.bestbuy.com'),
        },
        proxy: this.proxy,
      });
      this.sendStatus('Getting Homepage');
      console.log(getHome.headers);
      for (let i = 0; i < getHome.headers['Set-Cookie'].length; i++) {
        if (getHome.headers['Set-Cookie'][i].indexOf('_abck') > -1) {
          abck = getHome.headers['Set-Cookie'][i]
            .split('_abck=')[1]
            .split('; Domain')[0];
          console.log(`\n${abck}\n`);
        }
      }
    } else {
      abck = existingCookie;
    }
    await this.sleep(this.getRandomInt(200, 500));
    this.initialSensor = await this.getSensor('initial', abck);
    abck = await this.postSensor(this.initialSensor);
    await this.sleep(this.getRandomInt(200, 500));
    this.fingerprintSensor = await this.getSensor('fingerprint', abck);
    abck = await this.postSensor(this.fingerprintSensor);
    await this.sleep(this.getRandomInt(200, 500));
    this.challengeSensor = await this.getSensor('challenge', abck);
    abck = await this.postSensor(this.challengeSensor);
    this.sendStatus('Getting Challenge Cookies');
    await this.sleep(this.getRandomInt(200, 500));
    this.abck = abck;
    // while (
    //   (!abck.endsWith("~-1~-1~-1") || (!abck.endsWith('~-1~||-1||~-1') && abck.includes('||'))) ||
    //   abck.endsWith('==~-1~-1~-1')
    // ) {
    //   await this.sleep(this.getRandomInt(200, 500));
    //   this.challengeSensor = await this.getSensor('challenge', abck);
    //   abck = await this.postSensor(this.challengeSensor);
    //   this.abck = abck;
    // }

    console.log(this.abck);
  }

  async addToCart() {
    if (this.cancelled) return;
    await this.sleep(this.getRandomInt(2500, 3000));
    const atc = await got.post(
      'https://www.bestbuy.com/cart/api/v1/addToCart',
      {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:89.0) Gecko/20100101 Firefox/89.0',
          Accept: 'application/json',
          'Accept-Language': 'en-US,en;q=0.5',
          'Content-Type': 'application/json; charset=UTF-8',
          'user-agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.114 Safari/537.36',
        },
        cookieJar: this.cookieJar,
        body: '{"items":[{"skuId":"6444076"}]}',
        agent: {
          https: new HttpsProxyAgent({
            keepAlive: true,
            keepAliveMsecs: 1000,
            maxSockets: 256,
            maxFreeSockets: 256,
            proxy: this.proxyFormatted,
          }),
        },
      }
    );
    console.log(atc.status);
    console.log(this.cookieJar.getCookieStringSync('https://www.bestbuy.com'));
    // console.log(`\n${this.abck}`);
    if (atc.status >= 400) {
      await this.getSensor()
      await this.addToCart()
    }
    this.sendStatus('Added to Cart');
  }

  async getCart() {
    await this.sleep(this.getRandomInt(1000, 2000));
    if (this.cancelled) return;
    let getCart = await this.requestClient(
      'https://www.bestbuy.com/cart/json?isDeviceApplePayEligible=false',
      {
        headers: {
          accept: 'application/json, text/javascript, */*; q=0.01',
          'accept-language': 'en-US,en;q=0.9',
          'content-type': 'application/json',
          'sec-ch-ua':
            '" Not;A Brand";v="99", "Google Chrome";v="91", "Chromium";v="91"',
          'sec-ch-ua-mobile': '?0',
          'sec-fetch-dest': 'empty',
          'sec-fetch-mode': 'cors',
          'sec-fetch-site': 'same-origin',
          'x-order-id': '',
        },
        jar: this.cookieJar,
        proxy: this.proxy,
      }
    );

    getCart = JSON.parse(getCart.body);
    this.orderID = getCart.cart.id;
    this.itemID = getCart.cart.lineItems[0].id;
  }

  async startingCheckout() {
    if (this.cancelled) return;
    this.sendStatus('Starting Checkout');
    await this.sleep(this.getRandomInt(1000, 2000));

    const startingCheckout = await got.get(
      'https://www.bestbuy.com/checkout/r/fulfillment',
      {
        headers: {
          accept:
            'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
          'accept-language': 'en-US,en;q=0.9',
          'content-type': 'application/json',
          'cache-control': 'max-age=0',
          'sec-ch-ua':
            '" Not;A Brand";v="99", "Google Chrome";v="91", "Chromium";v="91"',
          'sec-ch-ua-mobile': '?0',
          'sec-fetch-dest': 'empty',
          'sec-fetch-mode': 'cors',
          'sec-fetch-site': 'same-origin',
          'Sec-Fetch-Dest': 'document',
          Referer: 'https://www.bestbuy.com/checkout/r/fast-track',
          'user-agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.114 Safari/537.36',
        },
        cookieJar: this.cookieJar,
        agent: {
          https: new HttpsProxyAgent({
            keepAlive: true,
            keepAliveMsecs: 1000,
            maxSockets: 256,
            maxFreeSockets: 256,
            proxy: this.proxyFormatted,
          }),
        },
      }
    );

    // console.log(startingCheckout.body);

    this.orderId = startingCheckout?.body
      .split('var orderData = {"id":"')[1]
      .split('"')[0];
    this.itemId = startingCheckout.body
      .split('var orderData = ')[1]
      .split(';')[0]
      .split('"items":[{"id":"')[1]
      .split('"')[0];
    this.customerOrderID = startingCheckout.body
      .split('var orderData = ')[1]
      .split(';')[0]
      .split('"items":[{"id":"')[1]
      .split('"customerOrderId":"')[1]
      .split('"')[0];
    this.sendStatus('Starting Fulfillment');
    console.log(this.orderId);
  }

  async startCheckout() {
    await this.sleep(this.getRandomInt(1000, 2000));
    const startCheckout = await this.requestClient(
      'https://www.bestbuy.com/cart/checkout',
      {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:89.0) Gecko/20100101 Firefox/89.0',
          Accept: 'application/json, text/javascript, */*; q=0.01',
          'Accept-Language': 'en-US,en;q=0.5',
          'Content-Type': 'application/json',
          'X-ORDER-ID': this.orderID,
          referrer: 'https://www.bestbuy.com/cart',
          'sec-ch-ua':
            '" Not;A Brand";v="99", "Google Chrome";v="91", "Chromium";v="91"',
          'sec-ch-ua-mobile': '?0',
          'sec-fetch-dest': 'empty',
          'sec-fetch-mode': 'cors',
          'sec-fetch-site': 'same-origin',
        },
        jar: this.cookieJar,
        body: 'null',
        proxy: this.proxy,
      },
      'POST'
    );

    if (startCheckout.status >= 400) {
      await this.getSensor()
      await this.startCheckout()
    }
  }

  async checkoutPatch() {
    await this.sleep(this.getRandomInt(1000, 2000));
    // let bestbuyCookies = this.cookieJar.getCookieStringSync(
    //   'https://www.bestbuy.com'
    // );
    // if (bestbuyCookies.indexOf('~-1~') > -1) {
    //   const targetAbck = bestbuyCookies.split('_abck=')[1].split(';')[0];
    //   await this.sensorReqs(targetAbck);
    // }
    const checkoutPatch = await this.requestClient(
      `https://www.bestbuy.com/checkout/orders/${this.orderId}/`,
      {
        jar: this.cookieJar,
        proxy: this.proxy,
        headers: {
          'user-agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:89.0) Gecko/20100101 Firefox/89.0',
          accept: 'application/com.bestbuy.order+json',
          'accept-encoding': 'gzip, deflate, br',
          'accept-language': 'en-US,en;q=0.9',
          'content-type': 'application/json',
          'sec-ch-ua':
            '" Not;A Brand";v="99", "Google Chrome";v="91", "Chromium";v="91"',
          'sec-ch-ua-mobile': '?0',
          'sec-fetch-dest': 'empty',
          'sec-fetch-mode': 'cors',
          'sec-fetch-site': 'same-origin',
          'x-user-interface': 'DotCom-Optimized',
          origin: 'https://www.bestbuy.com',
          referrer: 'https://www.bestbuy.com/checkout/r/fulfillment',
        },
        body: JSON.stringify({
          items: [
            {
              id: this.itemId,
              type: 'DEFAULT',
              selectedFulfillment: {
                shipping: {
                  address: {
                    country: 'US',
                    saveToProfile: false,
                    street2: '',
                    useAddressAsBilling: true,
                    middleInitial: '',
                    lastName: 'Cohe',
                    street: '349 58th St',
                    city: 'Brooklyn',
                    override: false,
                    zipcode: '11220',
                    state: 'NY',
                    firstName: 'Dav',
                    isWishListAddress: false,
                    dayPhoneNumber: '9172343413',
                    type: 'RESIDENTIAL',
                  },
                },
              },
              giftMessageSelected: false,
            },
          ],
        }),
      },
      'PATCH'
    );

    if (checkoutPatch.status >= 400) {
      await this.getSensor()
      await this.checkoutPatch()
    }
    const responseBody = JSON.parse(checkoutPatch.body);
    // console.log(checkoutPatch.body)
    // console.log('\n CheckoutPatch\n');
    // console.log(this.cookieJar.getCookieStringSync('https://www.bestbuy.com'));
    // bestbuyCookies = this.cookieJar.getCookieStringSync(
    //   'https://www.bestbuy.com'
    // );
    // if (bestbuyCookies.indexOf('~-1~') > -1) {
    //   const targetAbck = bestbuyCookies.split('_abck=')[1].split(';')[0];
    //   await this.sensorReqs(targetAbck);
    // }
    this.sendStatus('Submitted Shipping Info');
    this.paymentID = responseBody.payment.id;
    console.log(this.paymentID);
  }

  async checkoutPatch1() {
    await this.sleep(this.getRandomInt(1000, 2000));
    // let bestbuyCookies = this.cookieJar.getCookieStringSync(
    //   'https://www.bestbuy.com'
    // );
    // if (bestbuyCookies.indexOf('~-1~') > -1) {
    //   const targetAbck = bestbuyCookies.split('_abck=')[1].split(';')[0];
    //   await this.sensorReqs(targetAbck);
    // }
    const checkoutPatch1 = await this.requestClient(
      `https://www.bestbuy.com/checkout/orders/${this.orderId}/`,
      {
        jar: this.cookieJar,
        proxy: this.proxy,
        headers: {
          'user-agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:89.0) Gecko/20100101 Firefox/89.0',
          accept: 'application/com.bestbuy.order+json',
          'accept-language': 'en-US,en;q=0.9',
          'content-type': 'application/json',
          'sec-ch-ua':
            '" Not;A Brand";v="99", "Google Chrome";v="91", "Chromium";v="91"',
          'sec-ch-ua-mobile': '?0',
          'sec-fetch-dest': 'empty',
          'sec-fetch-mode': 'cors',
          'sec-fetch-site': 'same-origin',
          'x-user-interface': 'DotCom-Optimized',
          referrer: 'https://www.bestbuy.com/checkout/r/fulfillment',
        },
        body:
          '{"phoneNumber":"9172831234","smsNotifyNumber":"","smsOptIn":false,"emailAddress":"randomusername1593@gmail.com"}',
      },
      'PATCH'
    );

    if (checkoutPatch1.status >= 400) {
      await this.getSensor()
      await this.checkoutPatch1()
    }
    console.log('\n CheckoutPatch1\n');
    console.log(this.cookieJar.getCookieStringSync('https://www.bestbuy.com'));
    // bestbuyCookies = this.cookieJar.getCookieStringSync(
    //   'https://www.bestbuy.com'
    // );
    // if (bestbuyCookies.indexOf('~-1~') > -1) {
    //   const targetAbck = bestbuyCookies.split('_abck=')[1].split(';')[0];
    //   await this.sensorReqs(targetAbck);
    // }
  }

  async submitPayment() {
    await this.sleep(this.getRandomInt(1000, 2000));
    // const bestbuyCookies = this.cookieJar.getCookieStringSync(
    //   'https://www.bestbuy.com'
    // );
    // if (bestbuyCookies.indexOf('~-1~') > -1) {
    //   const targetAbck = bestbuyCookies.split('_abck=')[1].split(';')[0];
    //   await this.sensorReqs(targetAbck);
    // }
    const creditNumber = '5313671665600457';
    this.binNumber = creditNumber.substring(0x0, 0x6);
    const encryptedPart =
      creditNumber.slice(0x0, 0x6) +
      Array(creditNumber.length - 0x9).join('0') +
      creditNumber.slice(creditNumber.length - 0x4);
    const submitPayment = await this.requestClient(
      `https://www.bestbuy.com/payment/api/v1/payment/${this.paymentID}/creditCard`,
      {
        jar: this.cookieJar,
        proxy: this.proxy,
        headers: {
          accept: 'application/com.bestbuy.order+json',
          'accept-language': 'en-US,en;q=0.9',
          'content-type': 'application/json',
          'sec-ch-ua':
            '" Not;A Brand";v="99", "Google Chrome";v="91", "Chromium";v="91"',
          'sec-ch-ua-mobile': '?0',
          'sec-fetch-dest': 'empty',
          'sec-fetch-mode': 'cors',
          'sec-fetch-site': 'same-origin',
          pragma: 'no-cache',
          'x-client': 'CHECKOUT',
          'x-context-id': this.customerOrderID,
          referrer: 'https://www.bestbuy.com/checkout/r/payment',
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:89.0) Gecko/20100101 Firefox/89.0',
        },
        body: JSON.stringify({
          billingAddress: {
            addressLine1: '349 58th St',
            addressLine2: '',
            city: 'Brooklyn',
            country: 'US',
            dayPhone: '9177238412',
            firstName: 'Kevin',
            isWishListAddress: true,
            lastName: 'Chen',
            middleInitial: '',
            postalCode: '11220',
            standardized: true,
            state: 'NY',
            useAddressAsBilling: true,
            userOverridden: true,
          },
          creditCard: {
            number: `${this.bigNumber}:3:${this.keyID}:${encryptedPart}`,
            orderId: this.customerOrderID,
            binNumber: this.binNumber,
            cardType: 'VISA',
            cvv: '809',
            expMonth: '06',
            expYear: `2027`,
            govPurchaseCard: true,
            hasCID: true,
            international: true,
            invalidCard: true,
            isCustomerCard: true,
            isNewCard: true,
            isPWPRegistered: true,
            isVisaCheckout: true,
            virtualCard: false,
            saveToProfile: true,
          },
        }),
      },
      'PUT'
    );

    
    if (submitPayment.status >= 400) {
      await this.getSensor()
      await this.submitPayment()
    }
    console.log('\n submitPayment\n');

    console.log(this.cookieJar.getCookieStringSync('https://www.bestbuy.com'));

    this.sendStatus('Submitted Payment');
  }

  async refreshPayment() {
    await this.sleep(this.getRandomInt(1000, 2000));
    // const bestbuyCookies = this.cookieJar.getCookieStringSync(
    //   'https://www.bestbuy.com'
    // );
    // if (bestbuyCookies.indexOf('~-1~') > -1) {
    //   const targetAbck = bestbuyCookies.split('_abck=')[1].split(';')[0];
    //   await this.sensorReqs(targetAbck);
    // }
    const refreshPayment = await this.requestClient(
      `https://www.bestbuy.com/checkout/orders/${this.paymentID}/paymentMethods/refreshPayment`,
      {
        jar: this.cookieJar,
        proxy: this.proxy,
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:89.0) Gecko/20100101 Firefox/89.0',
          accept: 'application/com.bestbuy.order+json',
          'accept-language': 'en-US,en;q=0.9',
          'content-type': 'application/json',
          'sec-ch-ua':
            '" Not;A Brand";v="99", "Google Chrome";v="91", "Chromium";v="91"',
          'sec-ch-ua-mobile': '?0',
          'sec-fetch-dest': 'empty',
          'sec-fetch-mode': 'cors',
          'sec-fetch-site': 'same-origin',
          'x-context-id': this.customerOrderID,
          referrer: 'https://www.bestbuy.com/checkout/r/payment',
        },
        body: JSON.stringify({}),
      },
      'POST'
    );

    if (refreshPayment.status >= 400) {
      await this.getSensor()
      await this.refreshPayment()
    }
    console.log('\n refreshPayment\n');

    console.log(this.cookieJar.getCookieStringSync('https://www.bestbuy.com'));

    this.sendStatus('Confirmed Payment Info');
  }

  async preLookup() {
    await this.sleep(this.getRandomInt(1000, 2000));
    // const bestbuyCookies = this.cookieJar.getCookieStringSync(
    //   'https://www.bestbuy.com'
    // );
    // if (bestbuyCookies.indexOf('~-1~') > -1) {
    //   const targetAbck = bestbuyCookies.split('_abck=')[1].split(';')[0];
    //   await this.sensorReqs(targetAbck);
    // }
    const preLookup = await this.requestClient(
      `https://www.bestbuy.com/payment/api/v1/payment/${this.paymentID}/threeDSecure/preLookup`,
      {
        jar: this.cookieJar,
        proxy: this.proxy,
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:89.0) Gecko/20100101 Firefox/89.0',
          accept: 'application/com.bestbuy.order+json',
          'accept-language': 'en-US,en;q=0.9',
          'content-type': 'application/json',
          'sec-ch-ua':
            '" Not;A Brand";v="99", "Google Chrome";v="91", "Chromium";v="91"',
          'sec-ch-ua-mobile': '?0',
          'sec-fetch-dest': 'empty',
          'sec-fetch-mode': 'cors',
          'sec-fetch-site': 'same-origin',
          'x-context-id': this.customerOrderID,
          referrer: 'https://www.bestbuy.com/checkout/r/payment',
        },
        body: JSON.stringify({
          binNumber: this.binNumber,
          orderId: this.customerOrderID,
          paymentId: this.paymentID,
          browserInfo: {
            javaEnabled: false,
            language: 'en-US',
            userAgent:
              'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.114 Safari/537.36',
            height: '1067',
            width: '1067',
            timeZone: '240',
            colorDepth: '24',
          },
        }),
      },
      'POST'
    );

    if (preLookup.status >= 400) {
      await this.getSensor()
      await this.preLookup()
    }
    console.log('\n preLookup\n');

    console.log(this.cookieJar.getCookieStringSync('https://www.bestbuy.com'));

    this.threeDSReferenceId = preLookup.body.threeDSReferenceId;
  }

  async ThreeDReference() {
    await this.sleep(this.getRandomInt(1000, 2000));
    // const bestbuyCookies = this.cookieJar.getCookieStringSync(
    //   'https://www.bestbuy.com'
    // );
    // if (bestbuyCookies.indexOf('~-1~') > -1) {
    //   const targetAbck = bestbuyCookies.split('_abck=')[1].split(';')[0];
    //   await this.sensorReqs(targetAbck);
    // }
    try {
      const ThreeDReference = await this.requestClient(
        `https://www.bestbuy.com/checkout/api/1.0/paysecure/submitCardAuthentication`,
        {
          jar: this.cookieJar,
          proxy: this.proxy,
          headers: {
            'User-Agent':
              'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:89.0) Gecko/20100101 Firefox/89.0',
            accept: 'application/com.bestbuy.order+json',
            'accept-language': 'en-US,en;q=0.9',
            'content-type': 'application/json',
            'sec-ch-ua':
              '" Not;A Brand";v="99", "Google Chrome";v="91", "Chromium";v="91"',
            'sec-ch-ua-mobile': '?0',
            'sec-fetch-dest': 'empty',
            'sec-fetch-mode': 'cors',
            'sec-fetch-site': 'same-origin',
            'x-context-id': this.customerOrderID,
            referrer: 'https://www.bestbuy.com/checkout/r/payment',
          },
          body: JSON.stringify({
            orderId: this.paymentID,
            threeDSecureStatus: {
              threeDSReferenceId: this.threeDSReferenceId,
            },
          }),
        },
        'POST'
      );

      
    if (ThreeDReference.status >= 400) {
      await this.getSensor()
      await this.ThreeDReference()
    }
      console.log('\n ThreeDReference\n');

      console.log(
        this.cookieJar.getCookieStringSync('https://www.bestbuy.com')
      );
    } catch (e) {
      this.sendStatus(e);
      await this.sleep(this.getRandomInt(1000, 2000));
      await this.ThreeDReference();
    }
  }

  async submitOrder() {
    await this.sleep(this.getRandomInt(1000, 2000));
    // const bestbuyCookies = this.cookieJar.getCookieStringSync(
    //   'https://www.bestbuy.com'
    // );
    // if (bestbuyCookies.indexOf('~-1~') > -1) {
    //   const targetAbck = bestbuyCookies.split('_abck=')[1].split(';')[0];
    //   await this.sensorReqs(targetAbck);
    // }
    this.sendStatus('Submitting Order');
    const submitOrder = await this.requestClient(
      `https://www.bestbuy.com/checkout/orders/${this.orderId}/`,
      {
        jar: this.cookieJar,
        proxy: this.proxy,
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:89.0) Gecko/20100101 Firefox/89.0',
          accept: 'application/com.bestbuy.order+json',
          'accept-language': 'en-US,en;q=0.9',
          'content-type': 'application/json',
          'sec-ch-ua':
            '" Not;A Brand";v="99", "Google Chrome";v="91", "Chromium";v="91"',
          'sec-ch-ua-mobile': '?0',
          'sec-fetch-dest': 'empty',
          'sec-fetch-mode': 'cors',
          'sec-fetch-site': 'same-origin',
          'x-context-id': this.customerOrderID,
          referrer: 'https://www.bestbuy.com/checkout/r/payment',
        },
        body: JSON.stringify({
          browserInfo: {
            javaEnabled: false,
            language: 'en-US',
            userAgent:
              'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.114 Safari/537.36',
            height: '1067',
            width: '1067',
            timeZone: '240',
            colorDepth: '24',
          },
        }),
      },
      'POST'
    );

    if (submitOrder.status >= 400) {
      await this.getSensor()
      await this.submitOrder()
    }
    console.log(submitOrder.body);
    console.log('\n submitOrder\n');
    console.log(this.cookieJar.getCookieStringSync('https://www.bestbuy.com'));

    this.sendStatus('Processing Order');
    this.sendStatus('Placed Order');
  }

  async paymentEncryption() {
    const forgePki = forge.pki;
    const cardNum = '00960001' + '5313671665600457';
    const publicKeyPem = forgePki.publicKeyFromPem(this.publicKey.trim());

    const encryptedCard = publicKeyPem.encrypt(cardNum, 'RSA-OAEP', {
      mgf1: {
        md: forge.md.sha1.create(),
      },
      md: forge.md.sha1.create(),
    });

    this.bigNumber = this.bigNumberGen(encryptedCard);
    this.keyID = '735818052';
  }

  bigNumberGen(_0x40ff0e, _0x35c0d2) {
    const _0x286bf9 =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
    const _0x8685b3 = [
      0x3e,
      -0x1,
      -0x1,
      -0x1,
      0x3f,
      0x34,
      0x35,
      0x36,
      0x37,
      0x38,
      0x39,
      0x3a,
      0x3b,
      0x3c,
      0x3d,
      -0x1,
      -0x1,
      -0x1,
      0x40,
      -0x1,
      -0x1,
      -0x1,
      0x0,
      0x1,
      0x2,
      0x3,
      0x4,
      0x5,
      0x6,
      0x7,
      0x8,
      0x9,
      0xa,
      0xb,
      0xc,
      0xd,
      0xe,
      0xf,
      0x10,
      0x11,
      0x12,
      0x13,
      0x14,
      0x15,
      0x16,
      0x17,
      0x18,
      0x19,
      -0x1,
      -0x1,
      -0x1,
      -0x1,
      -0x1,
      -0x1,
      0x1a,
      0x1b,
      0x1c,
      0x1d,
      0x1e,
      0x1f,
      0x20,
      0x21,
      0x22,
      0x23,
      0x24,
      0x25,
      0x26,
      0x27,
      0x28,
      0x29,
      0x2a,
      0x2b,
      0x2c,
      0x2d,
      0x2e,
      0x2f,
      0x30,
      0x31,
      0x32,
      0x33,
    ];
    const _0xe32370 =
      '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
    for (
      var _0x371ce0,
        _0x123a06,
        _0x33a8a3,
        _0x390988 = '',
        _0x3d4ab9 = '',
        _0x23201c = 0x0;
      _0x23201c < _0x40ff0e.length;

    )
      (_0x371ce0 = _0x40ff0e.charCodeAt(_0x23201c++)),
        (_0x123a06 = _0x40ff0e.charCodeAt(_0x23201c++)),
        (_0x33a8a3 = _0x40ff0e.charCodeAt(_0x23201c++)),
        (_0x390988 += _0x286bf9.charAt(_0x371ce0 >> 0x2)),
        (_0x390988 += _0x286bf9.charAt(
          ((0x3 & _0x371ce0) << 0x4) | (_0x123a06 >> 0x4)
        )),
        isNaN(_0x123a06)
          ? (_0x390988 += '==')
          : ((_0x390988 += _0x286bf9.charAt(
              ((0xf & _0x123a06) << 0x2) | (_0x33a8a3 >> 0x6)
            )),
            (_0x390988 += isNaN(_0x33a8a3)
              ? '='
              : _0x286bf9.charAt(0x3f & _0x33a8a3))),
        _0x35c0d2 &&
          _0x390988.length > _0x35c0d2 &&
          ((_0x3d4ab9 += `${_0x390988.substr(0x0, _0x35c0d2)}\x0d\x0a`),
          (_0x390988 = _0x390988.substr(_0x35c0d2)));
    return (_0x3d4ab9 += _0x390988);
  }

  async placeOrder() {
    await this.sleep(this.getRandomInt(3000, 5000));
  }

  async webhook(msg) {
    const content = {
      content: msg,
    };

    await Request(
      'https://discord.com/api/webhooks/798655800431738885/gzpTO29OlnqHTPKskCTRr48u2h8ziPxZC2CxBODIr3Bsk0L0lJMNs2wJjojGYpk5_vDI',
      {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(content),
      }
    );
  }

  async postSensor1(sensor) {
    console.log(sensor);
    const sensorPostReq = await got.post(
      'https://www.bestbuy.com/WEs-Q2pRiNpSvniZQhPd/raw3tmNt/dR5QFScB/GXIeXSk5/az4',
      {
        cookieJar: this.cookieJar,
        headers: {
          accept: '*/*',
          'accept-language': 'en-US,en;q=0.9',
          'content-type': 'text/plain;charset=UTF-8',
          'sec-ch-ua':
            '" Not;A Brand";v="99", "Google Chrome";v="91", "Chromium";v="91"',
          'sec-ch-ua-mobile': '?0',
          'sec-fetch-dest': 'empty',
          'sec-fetch-mode': 'cors',
          'sec-fetch-site': 'same-origin',
          'user-agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.114 Safari/537.36',
        },
        body: sensor,
        agent: {
          https: new HttpsProxyAgent({
            keepAlive: true,
            keepAliveMsecs: 1000,
            maxSockets: 256,
            maxFreeSockets: 256,
            proxy: this.proxy,
          }),
        },
      }
    );

    for (let i = 0; i < sensorPostReq.headers['set-cookie'].length; i++) {
      if (sensorPostReq.headers['set-cookie'][i].indexOf('_abck') > -1) {
        const cookie = sensorPostReq.headers['set-cookie'][i]
          .split('_abck=')[1]
          .split('; Domain')[0];
        console.log(`\n${cookie}\n`);
        return cookie;
      }
    }
  }

  async sensorReqs1() {
    const getHome = await got.get('https://www.bestbuy.com', {
      cookieJar: this.cookieJar,
      headers: {
        accept:
          'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
        'accept-encoding': 'gzip, deflate, br',
        'accept-language': 'en-US,en;q=0.9',
        dnt: '1',
        'sec-ch-ua':
          '" Not;A Brand";v="99", "Google Chrome";v="91", "Chromium";v="91"',
        'sec-ch-ua-mobile': '?0',
        'sec-fetch-dest': 'document',
        'sec-fetch-mode': 'navigate',
        'sec-fetch-site': 'none',
        'sec-fetch-user': '?1',
        'upgrade-insecure-requests': '1',
        'user-agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.114 Safari/537.36',
      },
      agent: {
        https: new HttpsProxyAgent({
          keepAlive: true,
          keepAliveMsecs: 1000,
          maxSockets: 256,
          maxFreeSockets: 256,
          proxy,
        }),
      },
    });
    this.sendStatus('Getting Homepage');
    let abck;
    console.log(getHome.headers);
    for (let i = 0; i < getHome.headers['set-cookie'].length; i++) {
      if (getHome.headers['set-cookie'][i].indexOf('_abck') > -1) {
        abck = getHome.headers['set-cookie'][i]
          .split('_abck=')[1]
          .split('; Domain')[0];
        console.log(`\n${abck}\n`);
      }
    }
    await this.sleep(this.getRandomInt(2500, 4000));

    this.initialSensor = await this.getSensor('initial', abck);
    abck = await this.postSensor1(this.initialSensor);

    await this.sleep(this.getRandomInt(2500, 4000));

    console.log(abck);
    this.fingerprintSensor = await this.getSensor('fingerprint', abck);
    abck = await this.postSensor1(this.fingerprintSensor);

    console.log(abck);

    await this.sleep(this.getRandomInt(2500, 4000));

    this.challengeSensor = await this.getSensor('challenge', abck);
    abck = await this.postSensor1(this.challengeSensor);

    console.log(abck);
    await this.sleep(this.getRandomInt(2500, 4000));
    while (
      (!abck.endsWith('~-1~||-1||~-1') && abck.includes('||')) ||
      abck.endsWith('==~-1~-1~-1')
    ) {
      await this.sleep(this.getRandomInt(2500, 4000));
      this.challengeSensor = await this.getSensor('challenge', abck);
      abck = await this.postSensor1(this.challengeSensor);
      console.log(abck);
      this.abck = abck;
    }

    console.log(this.abck);
  }
}

module.exports = Bestbuy;
