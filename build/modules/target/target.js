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
const jwtDecode = require('jwt-decode');
const Tasks = require('../../tasks');

class Target extends Tasks {
  constructor(props) {
    super(props);

    this.randomport = Math.floor(Math.random() * 250);
    this.proxy = '127.0.0.1:8866';
    // this.proxy = 'http://127.0.0.1:8866''
    this.initialCookie = '';
    this.cookieJar = new tough.CookieJar();
    this.userAgent =
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36';
  }

  getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  stop() {
    this.sendStatus('Stopped');
    this.cancelled = true;
  }

  async getCookies() {
    this.itemID = this.taskInfo.sku;
    this.cookies = this.store.get(
      `sessions.target.${this.taskInfo.session}.cookies`
    );
    this.cookiesJoined = this.cookies.join(';');
    this.accessToken = this.cookiesJoined
      .split('accessToken=')[1]
      .split(';')[0];
    this.refreshToken = this.cookiesJoined
      .split('refreshToken=')[1]
      .split(';')[0];
    for (let i = 0; i < this.cookies.length; i++) {
      this.cookieJar.setCookie(this.cookies[i], 'https://www.target.com');
    }
  }

  async changeAccessToken(newToken) {
    this.cookies = this.store.get(
      `sessions.target.${this.taskInfo.session}.cookies`
    );
    for (let i = 0; i < this.cookies; i++) {
      if (this.cookies[i].indexOf('accessToken') > -1) {
        this.cookies[i] = `accessToken=${newToken}`;
      }
    }
    this.store.set(
      `sessions.target.${this.taskInfo.session}.cookies`,
      this.cookies
    );
    await this.getCookies();
  }

  async updateCookies(array) {
    const original = this.store.get(`sessions.target.${this.taskInfo.session}`);
    this.cookiesArray = [];
    for (let i = 0; i < array.length; i++) {
      this.cookiesArray.push(array[i]);
    }
    original.cookies = this.cookiesArray;
    this.store.set(`sessions.target.${this.taskInfo.session}`, original);
    // await this.getCookies();
  }

  async initialize() {
    this.sendStatus('Starting Task');
    // await this.initialGet();
    await this.getCookies();
    await this.getRefreshToken();
    await this.login();
    await this.getCart();
    await this.initiateRegistration1();
    await this.initiateRegistration();
    await this.getIDs();
    // await this.submitCVV();
    // await this.submitOrder();
  }

  async getRefreshToken() {
    const signin = await this.requestClient(
      'https://gsp.target.com/gsp/oauth_tokens/v2/client_tokens',
      {
        headers: {
          accept: 'application/json',
          pragma: 'no-cache',
          'x-application-name': 'web',
          'sec-ch-ua-mobile': '?0',
          'user-agent': this.userAgent,
          'sec-ch-ua':
            '"Google Chrome";v="89", "Chromium";v="89", ";Not A Brand";v="99"',
          origin: 'https://www.target.com',
          'sec-fetch-site': 'same-site',
          'sec-fetch-mode': 'cors',
          'sec-fetch-dest': 'empty',
          'content-type': 'application/json',
          referer: 'https://www.target.com/co-cart',
          'accept-encoding': 'gzip, deflate, br',
          'accept-language': 'en-US,en;q=0.9',
        },
        jar: this.cookieJar,
        proxy: this.proxy,
        body: JSON.stringify({
          grant_type: 'refresh_token',
          client_credential: {
            client_id: 'ecom-web-1.0.0',
          },
          device_info: {
            adblock: 'false',
            add_behavior: 'unknown',
            available_resolution: '[1707,1067]',
            browser_name: 'Unknown',
            browser_version: 'Unknown',
            color_depth: '24',
            cpu_architecture: 'Unknown',
            cpu_class: 'unknown',
            device_memory: '8',
            device_model: 'Unknown',
            device_type: 'Unknown',
            device_vendor: 'Unknown',
            do_not_track: 'unknown',
            engine_name: 'Unknown',
            engine_version: 'Unknown',
            hardware_concurrency: '8',
            has_lied_browser: 'false',
            has_lied_languages: 'false',
            has_lied_os: 'false',
            has_lied_resolution: 'false',
            indexed_db: '1',
            js_fonts:
              '["Arial","Arial Black","Arial Narrow","Book Antiqua","Bookman Old Style","Calibri","Cambria","Cambria Math","Century","Century Gothic","Century Schoolbook","Comic Sans MS","Consolas","Courier","Courier New","Georgia","Helvetica","Impact","Lucida Bright","Lucida Calligraphy","Lucida Console","Lucida Fax","Lucida Handwriting","Lucida Sans","Lucida Sans Typewriter","Lucida Sans Unicode","Microsoft Sans Serif","Monotype Corsiva","MS Gothic","MS PGothic","MS Reference Sans Serif","MS Sans Serif","MS Serif","Palatino Linotype","Segoe Print","Segoe Script","Segoe UI","Segoe UI Light","Segoe UI Semibold","Segoe UI Symbol","Tahoma","Times","Times New Roman","Trebuchet MS","Verdana","Wingdings","Wingdings 2","Wingdings 3"]',
            language: 'en-US',
            local_storage: '1',
            navigator_app_code_name: 'Mozilla',
            navigator_app_name: 'Netscape',
            navigator_app_version:
              '5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            navigator_cookies_enabled: 'true',
            navigator_java_enabled: 'false',
            navigator_languages: '["en-US","en"]',
            navigator_platform: 'Win32',
            navigator_vendor: 'Google Inc.',
            open_database: '1',
            os_name: 'Unknown',
            os_version: 'Unknown',
            pixel_ratio: 'unknown',
            regular_plugins:
              '["Chrome PDF Plugin::Portable Document Format::application/x-google-chrome-pdf~pdf","Chrome PDF Viewer::::application/pdf~pdf","Native Client::::application/x-nacl~,application/x-pnacl~"]',
            resolution: '[1707,1067]',
            session_storage: '1',
            timezone_offset: '240',
            touch_support: '[0,false,false]',
            user_agent:
              'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            webgl_vendor:
              'Google Inc. (Intel)~ANGLE (Intel, Intel(R) Iris(R) Plus Graphics Direct3D11 vs_5_0 ps_5_0, D3D11-27.20.100.9510)',
          },
        }),
      },
      'POST'
    );
  }

  async login() {
    this.sendStatus('Refreshing Tokens');
    try {
      const signin = await this.requestClient(
        'https://gsp.target.com/gsp/oauth_tokens/v2/client_tokens',
        {
          headers: {
            accept: 'application/json',
            pragma: 'no-cache',
            'x-application-name': 'web',
            'sec-ch-ua-mobile': '?0',
            'user-agent': this.userAgent,
            'sec-ch-ua':
              '"Google Chrome";v="89", "Chromium";v="89", ";Not A Brand";v="99"',
            origin: 'https://www.target.com',
            'sec-fetch-site': 'same-site',
            'sec-fetch-mode': 'cors',
            'sec-fetch-dest': 'empty',
            'content-type': 'application/json',
            referer: 'https://www.target.com/co-cart',
            'accept-encoding': 'gzip, deflate, br',
            'accept-language': 'en-US,en;q=0.9',
            cookie: `accessToken=${this.accessToken}`,
          },
          jar: this.cookieJar,
          proxy: this.proxy,
          body: JSON.stringify({
            grant_type: 'refresh_token',
            refresh_token: jwtDecode(this.accessToken).jti,
            client_credential: {
              client_id: 'ecom-web-1.0.0',
            },
            device_info: {
              adblock: 'false',
              add_behavior: 'unknown',
              available_resolution: '[1707,1067]',
              browser_name: 'Unknown',
              browser_version: 'Unknown',
              color_depth: '24',
              cpu_architecture: 'Unknown',
              cpu_class: 'unknown',
              device_memory: '8',
              device_model: 'Unknown',
              device_type: 'Unknown',
              device_vendor: 'Unknown',
              do_not_track: 'unknown',
              engine_name: 'Unknown',
              engine_version: 'Unknown',
              hardware_concurrency: '8',
              has_lied_browser: 'false',
              has_lied_languages: 'false',
              has_lied_os: 'false',
              has_lied_resolution: 'false',
              indexed_db: '1',
              js_fonts:
                '["Arial","Arial Black","Arial Narrow","Book Antiqua","Bookman Old Style","Calibri","Cambria","Cambria Math","Century","Century Gothic","Century Schoolbook","Comic Sans MS","Consolas","Courier","Courier New","Georgia","Helvetica","Impact","Lucida Bright","Lucida Calligraphy","Lucida Console","Lucida Fax","Lucida Handwriting","Lucida Sans","Lucida Sans Typewriter","Lucida Sans Unicode","Microsoft Sans Serif","Monotype Corsiva","MS Gothic","MS PGothic","MS Reference Sans Serif","MS Sans Serif","MS Serif","Palatino Linotype","Segoe Print","Segoe Script","Segoe UI","Segoe UI Light","Segoe UI Semibold","Segoe UI Symbol","Tahoma","Times","Times New Roman","Trebuchet MS","Verdana","Wingdings","Wingdings 2","Wingdings 3"]',
              language: 'en-US',
              local_storage: '1',
              navigator_app_code_name: 'Mozilla',
              navigator_app_name: 'Netscape',
              navigator_app_version:
                '5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
              navigator_cookies_enabled: 'true',
              navigator_java_enabled: 'false',
              navigator_languages: '["en-US","en"]',
              navigator_platform: 'Win32',
              navigator_vendor: 'Google Inc.',
              open_database: '1',
              os_name: 'Unknown',
              os_version: 'Unknown',
              pixel_ratio: 'unknown',
              regular_plugins:
                '["Chrome PDF Plugin::Portable Document Format::application/x-google-chrome-pdf~pdf","Chrome PDF Viewer::::application/pdf~pdf","Native Client::::application/x-nacl~,application/x-pnacl~"]',
              resolution: '[1707,1067]',
              session_storage: '1',
              timezone_offset: '240',
              touch_support: '[0,false,false]',
              user_agent:
                'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
              webgl_vendor:
                'Google Inc. (Intel)~ANGLE (Intel, Intel(R) Iris(R) Plus Graphics Direct3D11 vs_5_0 ps_5_0, D3D11-27.20.100.9510)',
            },
          }),
        },
        'POST'
      );

      const responseJSON = JSON.parse(signin.body);
      await this.updateCookies(signin.headers['Set-Cookie']);
    } catch (e) {}
  }

  async initialGet() {
    const initialGet = await this.requestClient('https://www.target.com/', {
      jar: this.cookieJar,
      proxy: this.proxy,
      headers: {
        'user-agent': this.userAgent,
        accept:
          'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
        'accept-encoding': 'gzip, deflate, br',
        'accept-language': 'en-US,en;q=0.9',
      },
    });
  }

  async getCart() {
    await this.sleep(this.getRandomInt(1000, 2000));
    this.sendStatus('Adding to Cart');
    const atc = await this.requestClient(
      `https://carts.target.com/web_checkouts/v1/cart_items?field_groups=CART%2CCART_ITEMS%2CSUMMARY%2CFINANCE_PROVIDERS&key=feaf228eb2777fd3eee0fd5192ae7107d6224b39`,
      {
        jar: this.cookieJar,
        proxy: this.proxy,
        headers: {
          'User-Agent': this.userAgent,
          accept: 'application/json',
          'accept-language': 'en-US,en;q=0.9',
          'content-type': 'application/json',
          'sec-ch-ua':
            '" Not;A Brand";v="99", "Google Chrome";v="91", "Chromium";v="91"',
          'sec-ch-ua-mobile': '?0',
          'sec-fetch-dest': 'empty',
          'sec-fetch-mode': 'cors',
          'sec-fetch-site': 'same-origin',
          'x-application-name': 'web',
          cookie: this.cookieJar.getCookieStringSync('https://www.target.com'),
        },
        body: JSON.stringify({
          cart_type: 'REGULAR',
          channel_id: '10',
          shopping_context: 'DIGITAL',
          cart_item: {
            tcin: this.itemID,
            quantity: 1,
            item_channel_id: '10',
          },
        }),
      },
      'POST'
    );
    this.sendStatus('Added to Cart');
  }

  async initiateRegistration() {
    const initiateRegistration = await this.requestClient(
      'https://carts.target.com/web_checkouts/v1/cart?field_groups=CART%2CCART_ITEMS%2CSUMMARY%2CPROMOTION_CODES%2CADDRESSES%2CFINANCE_PROVIDERS&key=feaf228eb2777fd3eee0fd5192ae7107d6224b39',
      {
        headers: {
          accept: 'application/json',
          'user-agent': this.userAgent,
          'content-type': 'application/json',
          'accept-encoding': 'gzip, deflate, br',
          'x-application-name': 'web',
          'sec-ch-ua':
            '" Not;A Brand";v="99", "Google Chrome";v="91", "Chromium";v="91"',
          'sec-ch-ua-mobile': '?0',
          'sec-fetch-dest': 'empty',
          'sec-fetch-mode': 'cors',
          'sec-fetch-site': 'same-origin',
          referer: 'https://www.target.com/co-review?precheckout=true',
          cookie: this.cookieJar.getCookieStringSync('https://www.target.com'),
        },
        jar: this.cookieJar,
        proxy: this.proxy,
        body: JSON.stringify({
          cart_type: 'REGULAR',
          channel_id: 10,
          shopping_context: 'DIGITAL',
          guest_location: {
            country: 'US',
            latitude: 1,
            longitude: 1,
            state: 'NYs',
            zip_code: '11220',
          },
        }),
      },
      'PUT'
    );
  }

  async initiateRegistration1() {
    const initiateRegistration1 = await this.requestClient(
      'https://carts.target.com/web_checkouts/v1/shipt_orders?key=feaf228eb2777fd3eee0fd5192ae7107d6224b39',
      {
        headers: {
          accept: 'application/json',
          'user-agent': this.userAgent,
          'content-type': 'application/json',
          'accept-encoding': 'gzip, deflate, br',
          'x-application-name': 'web',
          'sec-ch-ua':
            '" Not;A Brand";v="99", "Google Chrome";v="91", "Chromium";v="91"',
          'sec-ch-ua-mobile': '?0',
          'sec-fetch-dest': 'empty',
          'sec-fetch-mode': 'cors',
          'sec-fetch-site': 'same-origin',
          referer: 'https://www.target.com/co-review?precheckout=true',
          cookie: this.cookieJar.getCookieStringSync('https://www.target.com'),
        },
        jar: this.cookieJar,
        proxy: this.proxy,
      },
      'GET'
    );
  }

  async getIDs() {
    const getIDsReq = await this.requestClient(
      'https://carts.target.com/web_checkouts/v1/pre_checkout?field_groups=ADDRESSES%2CCART%2CCART_ITEMS%2CDELIVERY_WINDOWS%2CPAYMENT_INSTRUCTIONS%2CPICKUP_INSTRUCTIONS%2CPROMOTION_CODES%2CSUMMARY%2CFINANCE_PROVIDERS&key=feaf228eb2777fd3eee0fd5192ae7107d6224b39',
      {
        headers: {
          accept: 'application/json',
          'user-agent': this.userAgent,
          'content-type': 'application/json',
          'x-application-name': 'web',
          'sec-ch-ua':
            '" Not;A Brand";v="99", "Google Chrome";v="91", "Chromium";v="91"',
          'sec-ch-ua-mobile': '?0',
          'sec-fetch-dest': 'empty',
          'sec-fetch-mode': 'cors',
          'sec-fetch-site': 'same-origin',
          referer: 'https://www.target.com/co-review?precheckout=true',
          cookie: this.cookieJar.getCookieStringSync('https://www.target.com'),
        },
        jar: this.cookieJar,
        proxy: this.proxy,
        body: JSON.stringify({
          cart_type: 'REGULAR',
        }),
      },
      'POST'
    );
    console.log(getIDsReq.body);
    const responseJSON = JSON.parse(getIDsReq.body);
    this.sendStatus('Got Payment ID');
    this.productImage = responseJSON.cart_items[0].item_attributes.image_path;
    this.productName = responseJSON.cart_items[0].item_attributes.description;
    this.productPrice = responseJSON.cart_items[0].unit_price;
    this.cartID = responseJSON.cart_id;
    if (responseJSON && responseJSON.payment_instructions) {
      this.paymentID =
        responseJSON.payment_instructions[0].payment_instruction_id;
    }

    if (responseJSON.payment_instructions[0].payment_verified === false) {
      await this.submitCard();
      await this.submitCVV();
      await this.submitOrder();
    } else if (responseJSON.payment_instructions[0].is_cvv_required === true) {
      await this.submitCVV();
      await this.submitOrder();
    }
  }

  async submitCard() {
    this.sendStatus('Verifying Card');
    const submitCard = await this.requestClient(
      'https://carts.target.com/checkout_payments/v1/credit_card_compare?key=feaf228eb2777fd3eee0fd5192ae7107d6224b39',
      {
        jar: this.cookieJar,
        headers: {
          accept: 'application/json',
          'accept-language': 'en-US,en;q=0.9',
          'content-type': 'application/json',
          'sec-ch-ua':
            '" Not;A Brand";v="99", "Google Chrome";v="91", "Chromium";v="91"',
          'sec-ch-ua-mobile': '?0',
          'sec-fetch-dest': 'empty',
          'sec-fetch-mode': 'cors',
          'sec-fetch-site': 'same-site',
          'user-agent': this.userAgent,
          'x-application-name': 'web',
          referer: 'https://www.target.com/co-payment',
          cookie: this.cookieJar.getCookieStringSync('https://www.target.com'),
        },
        proxy: this.proxy,
        body: JSON.stringify({
          cart_id: this.cartID,
          card_number: '5313676697534525',
        }),
      },
      'POST'
    );
  }

  async submitCVV() {
    const submitCVV = await this.requestClient(
      `https://carts.target.com/checkout_payments/v1/payment_instructions/${this.paymentID}?key=feaf228eb2777fd3eee0fd5192ae7107d6224b39`,
      {
        jar: this.cookieJar,
        headers: {
          accept: 'application/json',
          'accept-language': 'en-US,en;q=0.9',
          'content-type': 'application/json',
          'sec-ch-ua':
            '" Not;A Brand";v="99", "Google Chrome";v="91", "Chromium";v="91"',
          'sec-ch-ua-mobile': '?0',
          'sec-fetch-dest': 'empty',
          'sec-fetch-mode': 'cors',
          'sec-fetch-site': 'same-site',
          'user-agent': this.userAgent,
          'x-application-name': 'web',
          referer: 'https://www.target.com/co-review',
          cookie: this.cookieJar.getCookieStringSync('https://www.target.com'),
        },
        proxy: this.proxy,
        body: JSON.stringify({
          cart_id: this.cartID,
          wallet_mode: 'NONE',
          payment_type: 'CARD',
          card_details: {
            cvv: '628',
          },
        }),
      },
      'PUT'
    );

    this.sendStatus('Submitted CVV');
  }

  async submitOrder() {
    await this.sleep(this.getRandomInt(1000, 2000));
    this.sendStatus('Submitting Order');
    const submitOrder = await this.requestClient(
      'https://carts.target.com/web_checkouts/v1/checkout?field_groups=ADDRESSES%2CCART%2CCART_ITEMS%2CDELIVERY_WINDOWS%2CPAYMENT_INSTRUCTIONS%2CPICKUP_INSTRUCTIONS%2CPROMOTION_CODES%2CSUMMARY&key=feaf228eb2777fd3eee0fd5192ae7107d6224b39',
      {
        headers: {
          accept: 'application/json',
          'user-agent': this.userAgent,
          'content-type': 'application/json',
          'x-application-name': 'web',
          referer: 'https://www.target.com/co-delivery',
          cookie: this.cookieJar.getCookieStringSync('https://www.target.com'),
        },
        body: JSON.stringify({
          cart_type: 'REGULAR',
          channel_id: 10,
        }),
        jar: this.cookieJar,
        proxy: this.proxy,
      },
      'POST'
    );

    this.sendStatus('Processing Order');
    const responseJSON = JSON.parse(submitOrder.body);
    if (submitOrder.status < 250) {
      this.sendStatus('Checkout Successful');
    } else if (
      responseJSON.code === 'MISSING_OR_INVALID_PAYMENT_DETAILS' ||
      responseJSON.code === 'PAYMENT_DECLINED_EXCEPTION'
    ) {
      this.sendStatus('Card Declined');
    } else if (
      responseJSON.code === 'EMPTY_CART_FOR_ORDER_SUBMIT' ||
      responseJSON.code === 'DEPENDENT_SERVICE_ERROR'
    ) {
      this.sendStatus('OOS on Checkout');
    } else if (
      responseJSON.code === 'CART_LOCKED' ||
      responseJSON.code === 'MISSING_CREDIT_CARD_CVV'
    ) {
      this.sendStatus('Carted Locked');
    } else {
      this.sendStatus('Unknown Checkout Failure');
    }
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
}

module.exports = Target;
