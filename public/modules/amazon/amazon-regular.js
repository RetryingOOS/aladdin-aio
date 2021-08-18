/* eslint-disable no-lonely-if */
/* eslint-disable no-bitwise */
/* eslint-disable no-plusplus */
/* eslint-disable guard-for-in */
/* eslint-disable no-restricted-syntax */
/* eslint-disable prefer-destructuring */
/* eslint-disable @typescript-eslint/no-useless-constructor */
/* eslint-disable class-methods-use-this */
// const Request = require('better-electron-fetch');
const cheerio = require('cheerio');
const Tasks = require('../../tasks');

class AmazonRegular extends Tasks {
  constructor(props) {
    super(props);
    // this.itemID = this.taskInfo.sku;
    this.proxyModified = 'http://127.0.0.1:8866';
    // this.addressID = 'ngjppsjpnkkq';
    this.cookieString = '';
    this.checkoutAttempts = 0;
    this.atcAttempts = 0;
  }

  getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  stop() {
    this.sendStatus('Stopped');
    this.cancelled = true;
  }

  async getInfo() {
    this.itemID = this.taskInfo.sku;

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
    this.sendStatus('Waiting for Monitor');
    // await this.addToCart();
    // await this.submitShipping();
    // await this.submitBilling();
    // await this.calculateTax();
    // await this.checkoutURL();
    // await this.submitOrder();
  }

  async realInitialize() {
    await this.getRandomProxy();
    await this.getInfo();
    // await this.monitor();
    await this.getItem();
    // await this.getTokens();
    await this.addToCart();
    await this.fastCheckout();
    await this.staticDecoupledReq();
  }

  async getItem() {
    const req = await this.requestClient(
      `https://www.amazon.com/dp/${this.itemID}/`,
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
          cookie: this.cookieString,
        },
        proxy: this.proxy ? this.proxy : '',
      },
      'GET'
    );

    this.sendStatus('Getting Item');
    const $ = cheerio.load(req.body);
    this.csrfToken = $('input[name="CSRF"]').val();
    this.listingId = $('input[name="offerListingID"]').val();
    console.log(this.listingId);
  }

  async getTokens() {
    if (this.cancelled) return;
    await this.sleep(this.getRandomInt(0, 500));
    const req = await this.requestClient(
      `https://www.amazon.com/dp/${this.itemID}/`,
      {
        method: 'GET',
        ja3: '771,4865-4866-4867-49195-49199-49196-49200-52393-52392-49171-49172-156-157-47-53,0-23-65281-10-11-35-16-5-13-18-51-45-43-27-21,29-23-24,0',
        userAgent:
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 Safari/537.36',
        headers: {
          accept:
            'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
          'accept-encoding': 'gzip, deflate, br',
          'accept-language': 'en-US,en;q=0.9',
          'cache-control': 'max-age=0',
          Connection: 'keep-alive',
          DNT: '1',
          downlink: '10',
          ect: '4g',
          rtt: '50',
          'sec-ch-ua':
            '"Google Chrome";v="87", " Not;A Brand";v="99", "Chromium";v="87"',
          'sec-ch-ua-mobile': '?0',
          'sec-fetch-dest': 'document',
          'sec-fetch-mode': 'navigate',
          'sec-fetch-site': 'none',
          'sec-fetch-user': '?1',
          'upgrade-insecure-requests': '1',
          cookie: this.cookieString,
        },
        proxy: this.proxy ? this.proxy : '',
      },
      'GET'
    );
    // console.log(req.body);
    this.sendStatus('Getting tokens');
    this.sendStatus(req.status);
    // console.log(req.body);
    const startTime = new Date();
    const $ = cheerio.load(req.body);
    this.addressID = $('#ubbShipTo').val();
    const endTime = new Date();
  }

  async addToCart() {
    if (this.cancelled) return;
    await this.sleep(this.getRandomInt(0, 500));
    this.sendStatus('Adding to cart');
    const req = await this.requestClient(
      'https://www.amazon.com/gp/product/handle-buy-box/ref=dp_start-bbf_1_glance',
      {
        userAgent:
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 Safari/537.36',
        ja3: '771,4865-4866-4867-49195-49199-49196-49200-52393-52392-49171-49172-156-157-47-53,0-23-65281-10-11-35-16-5-13-18-51-45-43-27-21,29-23-24,0',
        headers: {
          accept: '*/*',
          'accept-encoding': 'gzip, deflate, br',
          'accept-language': 'en-US,en;q=0.9',
          'content-type': 'application/x-www-form-urlencoded',
          downlink: '10',
          ect: '4g',
          origin: 'https://www.amazon.com',
          referer: `https://www.amazon.com/gp/product/${this.itemID}?pf_rd_r=93T3ZVFMYYBR3WSE25VZ&pf_rd_p=5ae2c7f8-e0c6-4f35-9071-dc3240e894a8&pd_rd_r=04cfb4ae-5ce0-4c74-a438-00dd2fa05c39&pd_rd_w=dmzCg&pd_rd_wg=qRvAq&ref_=pd_gw_unk`,
          rtt: '50',
          'sec-fetch-dest': 'empty',
          'sec-fetch-mode': 'cors',
          'sec-fetch-site': 'same-origin',
          'x-amz-checkout-entry-referer-url': `https://www.amazon.com/gp/product/${this.itemID}/ref=trb_chk_auth?ie=UTF8&psc=1&openid.assoc_handle=amazon_checkout_us&openid.claimed_id=https%3A%2F%2Fwww.amazon.com%2Fap%2Fid%2Famzn1.account.AHBWDMEEHIAUYPYDZ5UWRIZXSXNQ&openid.identity=https%3A%2F%2Fwww.amazon.com%2Fap%2Fid%2Famzn1.account.AHBWDMEEHIAUYPYDZ5UWRIZXSXNQ&openid.mode=id_res&openid.ns=http%3A%2F%2Fspecs.openid.net%2Fauth%2F2.0&openid.op_endpoint=https%3A%2F%2Fwww.amazon.com%2Fap%2Fsignin&openid.response_nonce=2021-05-23T18%3A52%3A46Z-1240728894965196594&openid.return_to=https%3A%2F%2Fwww.amazon.com%2Fgp%2Fproduct%2FB00006IFB4%2Fref%3Dtrb_chk_auth%3Fie%3DUTF8%26psc%3D1%26trb_auth%3D1%26trb_open%3D1%26trb_bid%3Dbuy-now-button&openid.signed=assoc_handle%2Cclaimed_id%2Cidentity%2Cmode%2Cns%2Cop_endpoint%2Cresponse_nonce%2Creturn_to%2CsiteState%2Cns.pape%2Cpape.auth_policies%2Cpape.auth_time%2Csigned&openid.ns.pape=http%3A%2F%2Fspecs.openid.net%2Fextensions%2Fpape%2F1.0&openid.pape.auth_policies=http%3A%2F%2Fschemas.openid.net%2Fpape%2Fpolicies%2F2007%2F06%2Fnone&openid.pape.auth_time=2021-05-23T18%3A52%3A46Z&openid.sig=O67%2BtIzNbh6sZYjXPy%2Fh36%2FzOb0AkdOsSoptQJTG1OE%3D&serial=&siteState=%7ChasWorkingJavascript.1`,
          'user-agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 Safari/537.36',
          'x-amz-support-custom-signin': '1',
          'x-amz-turbo-checkout-dp-url': `https://www.amazon.com/gp/product/${this.itemID}/ref=trb_chk_auth?ie=UTF8&psc=1&openid.assoc_handle=amazon_checkout_us&openid.claimed_id=https%3A%2F%2Fwww.amazon.com%2Fap%2Fid%2Famzn1.account.AHBWDMEEHIAUYPYDZ5UWRIZXSXNQ&openid.identity=https%3A%2F%2Fwww.amazon.com%2Fap%2Fid%2Famzn1.account.AHBWDMEEHIAUYPYDZ5UWRIZXSXNQ&openid.mode=id_res&openid.ns=http%3A%2F%2Fspecs.openid.net%2Fauth%2F2.0&openid.op_endpoint=https%3A%2F%2Fwww.amazon.com%2Fap%2Fsignin&openid.response_nonce=2021-05-23T18%3A52%3A46Z-1240728894965196594&openid.return_to=https%3A%2F%2Fwww.amazon.com%2Fgp%2Fproduct%2FB00006IFB4%2Fref%3Dtrb_chk_auth%3Fie%3DUTF8%26psc%3D1%26trb_auth%3D1%26trb_open%3D1%26trb_bid%3Dbuy-now-button&openid.signed=assoc_handle%2Cclaimed_id%2Cidentity%2Cmode%2Cns%2Cop_endpoint%2Cresponse_nonce%2Creturn_to%2CsiteState%2Cns.pape%2Cpape.auth_policies%2Cpape.auth_time%2Csigned&openid.ns.pape=http%3A%2F%2Fspecs.openid.net%2Fextensions%2Fpape%2F1.0&openid.pape.auth_policies=http%3A%2F%2Fschemas.openid.net%2Fpape%2Fpolicies%2F2007%2F06%2Fnone&openid.pape.auth_time=2021-05-23T18%3A52%3A46Z&openid.sig=O67%2BtIzNbh6sZYjXPy%2Fh36%2FzOb0AkdOsSoptQJTG1OE%3D&serial=&siteState=%7ChasWorkingJavascript.1`,
          cookie: this.cookieString,
        },
        proxy: this.proxy ? this.proxy : '',
        body: `CSRF=${this.csrfToken}&offerListingID=${this.listingId}&session-id=${this.sessionID}&ASIN=${this.itemID}&isMerchantExclusive=0&merchantID=ATVPDKIKX0DER&isAddon=0&nodeID=&sellingCustomerID=&qid=&sr=&storeID=&tagActionCode=&viewID=glance&rebateId=&ctaDeviceType=desktop&ctaPageType=detail&usePrimeHandler=0&rsid=140-6787661-3131165&sourceCustomerOrgListID=&sourceCustomerOrgListItemID=&wlPopCommand=&quantity=1&submit.add-to-cart=Add+to+Cart&dropdown-selection=mhrmrxplqokq&dropdown-selection-ubb=mhrmrxplqokq&isUSSControl=1`,
      },
      'POST'
    );
    if (this.cancelled) return;

    if (req.status === 200) {
      const $ = cheerio.load(req.body);
      // this.pid = page.split('pid=')[1].split('&')[0];
      // this.pid = $(
      //   '.a-touch-link a-box turbo-checkout-no-border turbo-checkout-suppress-arrow turbo-checkout-panel-link'
      // )
      //   .attr('href')
      //   .split('pid=')[1]
      //   .split('&')[0];
      // console.log(this.pid);
      this.anti_csrf = $("input[name='anti-csrftoken-a2z']").val();
      this.sendStatus('Added to Cart');
    } else {
      /* log.error(e)
      log.error(res) */
      if (this.atcAttempts < 5) {
        this.sendStatus('Error getting not 200', false);
        this.sendStatus('Retrying', false);
        await this.sleep(1000);
        await this.addToCart();
      } else {
        this.sendStatus('Sleeping... Waiting for monitor');
        this.cancelled = true;
      }
    }
  }

  async placeOrder() {
    await this.sleep(this.getRandomInt(0, 500));
    if (this.cancelled) return;
    this.sendStatus('Placing Order');
    const req = await this.requestClient(
      `https://www.amazon.com/gp/cart/desktop/go-to-checkout.html/ref=crt_ewc_proceed_to_chk_huc?hasWorkingJavascript=1&proceedToCheckout.x=1&proceedToCheckout=Submit&fromEWCGiftWrap=1`,
      {
        userAgent:
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 Safari/537.36',
        ja3: '771,4865-4866-4867-49195-49199-49196-49200-52393-52392-49171-49172-156-157-47-53,0-23-65281-10-11-35-16-5-13-18-51-45-43-27-21,29-23-24,0',
        headers: {
          //   'x-amz-checkout-entry-referer-url': `https://www.amazon.com/gp/product/${this.itemID}/ref=trb_chk_auth?ie=UTF8&psc=1&openid.assoc_handle=amazon_checkout_us&openid.claimed_id=https%3A%2F%2Fwww.amazon.com%2Fap%2Fid%2Famzn1.account.AHBWDMEEHIAUYPYDZ5UWRIZXSXNQ&openid.identity=https%3A%2F%2Fwww.amazon.com%2Fap%2Fid%2Famzn1.account.AHBWDMEEHIAUYPYDZ5UWRIZXSXNQ&openid.mode=id_res&openid.ns=http%3A%2F%2Fspecs.openid.net%2Fauth%2F2.0&openid.op_endpoint=https%3A%2F%2Fwww.amazon.com%2Fap%2Fsignin&openid.response_nonce=2021-05-23T18%3A52%3A46Z-1240728894965196594&openid.return_to=https%3A%2F%2Fwww.amazon.com%2Fgp%2Fproduct%2FB00006IFB4%2Fref%3Dtrb_chk_auth%3Fie%3DUTF8%26psc%3D1%26trb_auth%3D1%26trb_open%3D1%26trb_bid%3Dbuy-now-button&openid.signed=assoc_handle%2Cclaimed_id%2Cidentity%2Cmode%2Cns%2Cop_endpoint%2Cresponse_nonce%2Creturn_to%2CsiteState%2Cns.pape%2Cpape.auth_policies%2Cpape.auth_time%2Csigned&openid.ns.pape=http%3A%2F%2Fspecs.openid.net%2Fextensions%2Fpape%2F1.0&openid.pape.auth_policies=http%3A%2F%2Fschemas.openid.net%2Fpape%2Fpolicies%2F2007%2F06%2Fnone&openid.pape.auth_time=2021-05-23T18%3A52%3A46Z&openid.sig=O67%2BtIzNbh6sZYjXPy%2Fh36%2FzOb0AkdOsSoptQJTG1OE%3D&serial=&siteState=%7ChasWorkingJavascript.1`,
          rtt: '50',
          'accept-encoding': 'gzip, deflate, br',
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 Safari/537.36',
          'content-type': 'application/x-www-form-urlencoded',
          'x-amz-support-custom-signin': '1',
          accept: '*/*',
          'x-requested-with': 'XMLHttpRequest',
          //   'x-amz-turbo-checkout-dp-url': `https://www.amazon.com/gp/product/${this.itemID}`,
          downlink: '10',
          'x-amz-checkout-csrf-token': '137-4178342-7052624',
          ect: '4g',
          DNT: '1',
          origin: 'https://www.amazon.com',
          'sec-ch-ua':
            '" Not A;Brand";v="99", "Chromium";v="90", "Google Chrome";v="90"',
          'sec-fetch-site': 'same-origin',
          'sec-fetch-mode': 'cors',
          'sec-fetch-dest': 'empty',
          'sec-ch-ua-mobile': '?0',
          // referer: `https://www.amazon.com/checkout/spc?pid=106-3366120-2152264&pipelineType=turbo&clientId=retailwebsite&temporaryAddToCart=1&hostPage=detail&weblab=RCX_CHECKOUT_TURBO_DESKTOP_PRIME_87783`,
          'accept-language': 'en-US,en;q=0.9',
          //   'anti-csrftoken-a2z': this.anti_csrf,
          cookie: this.cookieString,
        },
        proxy: this.proxy ? this.proxy : '',
      },
      'GET'
    );
    // this.sendStatus('Submitting Shipping');
    const responseBody = req.body;
    const $ = cheerio.load(req.body);

    const submitFromSPC = encodeURIComponent(
      $('input[name="submitFromSPC"]').attr('value')
    );
    const fasttrackExpiration = encodeURIComponent(
      $('input[name="fasttrackExpiration"]').attr('value')
    );
    const countdownThreshold = encodeURIComponent(
      $('input[name="countdownThreshold"]').attr('value')
    );
    const showSimplifiedCountdown = encodeURIComponent(
      $('input[name="showSimplifiedCountdown"]').attr('value')
    );
    const countdownId = encodeURIComponent(
      $('input[name="countdownId"]').attr('value')
    );
    const lineitemids0 = encodeURIComponent(
      $('input[name="lineitemids0"]').attr('value')
    );
    const quantity = encodeURIComponent(
      $(`input[name="quantity.${decodeURIComponent(lineitemids0)}"]`).attr(
        'value'
      )
    );
    const dupOrderCheckArgs = encodeURIComponent(
      $('input[name="dupOrderCheckArgs"]').attr('value')
    );
    const order0 = encodeURIComponent($('input[name="order0"]').attr('value'));
    const shippingofferingid00 = encodeURIComponent(
      $('input[name="shippingofferingid0.0"]').attr('value')
    );
    const shippingofferingid01 = encodeURIComponent(
      $('input[name="shippingofferingid0.1"]').attr('value')
    );
    const previousshippingofferingid0 = encodeURIComponent(
      $('input[name="previousshippingofferingid0"]').attr('value')
    );
    const currentshippingspeed = encodeURIComponent(
      $('input[name="currentshippingspeed"]').attr('value')
    );
    const previousShippingSpeed0 = encodeURIComponent(
      $('input[name="previousShippingSpeed0"]').attr('value')
    );
    const shiptrialprefix = encodeURIComponent(
      $('input[name="shiptrialprefix"]').attr('value')
    );
    // this.csrfToken = encodeURIComponent(
    //   $('input[name="csrfToken"]').attr('value')
    // );
    // this.purchaseTotal = encodeURIComponent(
    //   $('input[name="purchaseTotal"]').attr('value')
    // );
    const purchaseID = encodeURIComponent(
      $('input[name="purchaseID"]').attr('value')
    );
    const purchaseCustomerId = encodeURIComponent(
      $('input[name="purchaseCustomerId"]').attr('value')
    );
    const scopeId = encodeURIComponent(
      $('input[name="scopeId"]').attr('value')
    );
    const promiseTime0 = encodeURIComponent(
      $('input[name="promiseTime-0"]').attr('value')
    );
    const promiseAsin0 = encodeURIComponent(
      $('input[name="promiseAsin-0"]').attr('value')
    );
    const selectedPaymentPaystationId = encodeURIComponent(
      $('input[name="selectedPaymentPaystationId"]').attr('value')
    );
    const isfirsttimecustomer = encodeURIComponent(
      $('input[name="isfirsttimecustomer"]').attr('value')
    );
    this.productImage = $(
      '#spc-orders > div > div > div.a-row.shipment > div > div > div:nth-child(3) > div:nth-child(1) > div > div > div > div > div > div.a-fixed-left-grid-col.a-col-left > img'
    ).attr('src');

    this.checkout_body = `submitFromSPC=${submitFromSPC}&fasttrackExpiration=${fasttrackExpiration}&countdownThreshold=${countdownThreshold}&showSimplifiedCountdown=${showSimplifiedCountdown}&countdownId=${countdownId}&quantity.${lineitemids0}=${quantity}&gift-message-text=&dupOrderCheckArgs=${dupOrderCheckArgs}&order0=${order0}&shippingofferingid0.0=${shippingofferingid00}&guaranteetype0.0=GUARANTEED&issss0.0=0&shipsplitpriority0.0=shipWhenever&isShipWhenCompleteValid0.0=0&isShipWheneverValid0.0=1&shippingofferingid0.1=${shippingofferingid01}&guaranteetype0.1=GUARANTEED&issss0.1=0&shipsplitpriority0.1=shipWhenComplete&isShipWhenCompleteValid0.1=1&isShipWheneverValid0.1=0&previousshippingofferingid0=${previousshippingofferingid0}&previousguaranteetype0=GUARANTEED&previousissss0=0&previousshippriority0=shipWhenever&lineitemids0=${lineitemids0}&currentshippingspeed=${currentshippingspeed}&previousShippingSpeed0=${previousShippingSpeed0}&currentshipsplitpreference=shipWhenever&shippriority.0.shipWhenever=shipWhenever&groupcount=1&shiptrialprefix=${shiptrialprefix}&csrfToken=${this.csrfToken}&fromAnywhere=0&redirectOnSuccess=0&purchaseTotal=${this.purchaseTotal}&purchaseTotalCurrency=USD&purchaseID=${purchaseID}&purchaseCustomerId=${purchaseCustomerId}&useCtb=1&scopeId=${scopeId}&isQuantityInvariant=&promiseTime-0=${promiseTime0}&promiseAsin-0=${promiseAsin0}&selectedPaymentPaystationId=${selectedPaymentPaystationId}&hasWorkingJavascript=1&placeYourOrder1=1&isfirsttimecustomer=${isfirsttimecustomer}&isTFXEligible=&isFxEnabled=&isFXTncShown=`;
  }

  async submitOrder() {
    await this.sleep(this.getRandomInt(0, 500));
    if (this.cancelled) return;
    this.sendStatus('Submitting Order');
    const req = await this.requestClient(
      `https://www.amazon.com/gp/buy/spc/handlers/static-submit-decoupled.html/ref=ox_spc_place_order?ie=UTF8&amp;hasWorkingJavascript=0`,
      {
        userAgent:
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 Safari/537.36',
        ja3: '771,4865-4866-4867-49195-49199-49196-49200-52393-52392-49171-49172-156-157-47-53,0-23-65281-10-11-35-16-5-13-18-51-45-43-27-21,29-23-24,0',
        headers: {
          rtt: '50',
          'accept-encoding': 'gzip, deflate, br',
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 Safari/537.36',
          'content-type': 'application/x-www-form-urlencoded',
          'x-amz-support-custom-signin': '1',
          accept: '*/*',
          'x-requested-with': 'XMLHttpRequest',
          downlink: '10',
          'x-amz-checkout-csrf-token': '137-4178342-7052624',
          ect: '4g',
          DNT: '1',
          origin: 'https://www.amazon.com',
          'sec-ch-ua':
            '" Not A;Brand";v="99", "Chromium";v="90", "Google Chrome";v="90"',
          'sec-fetch-site': 'same-origin',
          'sec-fetch-mode': 'cors',
          'sec-fetch-dest': 'empty',
          'sec-ch-ua-mobile': '?0',
          referrer: `https://www.amazon.com/gp/buy/spc/handlers/display.html?hasWorkingJavascript=1`,
          'accept-language': 'en-US,en;q=0.9',
          cookie: this.cookieString,
        },
        proxy: this.proxy ? this.proxy : '',
        body: this.checkout_body,
      },
      'POST'
    );
  }

  async fastCheckout() {
    await this.sleep(this.getRandomInt(0, 500));
    if (this.cancelled) return;
    this.sendStatus('Submitting Order');
    const fastCheckoutReq = await this.requestClient(
      `https://www.amazon.com/gp/cart/desktop/go-to-checkout.html/ref=crt_ewc_proceed_to_chk_huc?hasWorkingJavascript=1&proceedToCheckout.x=1&proceedToCheckout=Submit&fromEWCGiftWrap=1`,
      {
        userAgent:
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 Safari/537.36',
        ja3: '771,4865-4866-4867-49195-49199-49196-49200-52393-52392-49171-49172-156-157-47-53,0-23-65281-10-11-35-16-5-13-18-51-45-43-27-21,29-23-24,0',
        headers: {
          //   'x-amz-checkout-entry-referer-url': `https://www.amazon.com/gp/product/${this.itemID}/ref=trb_chk_auth?ie=UTF8&psc=1&openid.assoc_handle=amazon_checkout_us&openid.claimed_id=https%3A%2F%2Fwww.amazon.com%2Fap%2Fid%2Famzn1.account.AHBWDMEEHIAUYPYDZ5UWRIZXSXNQ&openid.identity=https%3A%2F%2Fwww.amazon.com%2Fap%2Fid%2Famzn1.account.AHBWDMEEHIAUYPYDZ5UWRIZXSXNQ&openid.mode=id_res&openid.ns=http%3A%2F%2Fspecs.openid.net%2Fauth%2F2.0&openid.op_endpoint=https%3A%2F%2Fwww.amazon.com%2Fap%2Fsignin&openid.response_nonce=2021-05-23T18%3A52%3A46Z-1240728894965196594&openid.return_to=https%3A%2F%2Fwww.amazon.com%2Fgp%2Fproduct%2FB00006IFB4%2Fref%3Dtrb_chk_auth%3Fie%3DUTF8%26psc%3D1%26trb_auth%3D1%26trb_open%3D1%26trb_bid%3Dbuy-now-button&openid.signed=assoc_handle%2Cclaimed_id%2Cidentity%2Cmode%2Cns%2Cop_endpoint%2Cresponse_nonce%2Creturn_to%2CsiteState%2Cns.pape%2Cpape.auth_policies%2Cpape.auth_time%2Csigned&openid.ns.pape=http%3A%2F%2Fspecs.openid.net%2Fextensions%2Fpape%2F1.0&openid.pape.auth_policies=http%3A%2F%2Fschemas.openid.net%2Fpape%2Fpolicies%2F2007%2F06%2Fnone&openid.pape.auth_time=2021-05-23T18%3A52%3A46Z&openid.sig=O67%2BtIzNbh6sZYjXPy%2Fh36%2FzOb0AkdOsSoptQJTG1OE%3D&serial=&siteState=%7ChasWorkingJavascript.1`,
          rtt: '50',
          // 'accept-encoding': 'gzip, deflate, br',
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 Safari/537.36',
          'content-type': 'application/x-www-form-urlencoded',
          'x-amz-support-custom-signin': '1',
          accept: '*/*',
          'x-requested-with': 'XMLHttpRequest',
          downlink: '10',
          // 'x-amz-checkout-csrf-token': '137-4178342-7052624',
          ect: '4g',
          DNT: '1',
          origin: 'https://www.amazon.com',
          'sec-ch-ua':
            '" Not A;Brand";v="99", "Chromium";v="90", "Google Chrome";v="90"',
          'sec-fetch-site': 'same-origin',
          'sec-fetch-mode': 'cors',
          'sec-fetch-dest': 'empty',
          'sec-ch-ua-mobile': '?0',
          referrer: 'https://www.amazon.com/gp/cart/view.html?ref_=nav_cart',
          'accept-language': 'en-US,en;q=0.9',
          //   'anti-csrftoken-a2z': this.anti_csrf,
          cookie: this.cookieString,
        },
        proxy: this.proxy ? this.proxy : '',

        // agent: {
        //   https: new HttpsProxyAgent({
        //     keepAlive: true,
        //     keepAliveMsecs: 1000,
        //     maxSockets: 256,
        //     maxFreeSockets: 256,
        //     proxy: this.proxyModified,
        //   }),
        // },
      }
    );

    const $ = await cheerio.load(fastCheckoutReq.body);
    // this.csrfToken = fastCheckoutReq.body
    //   .split('csrfToken')[1]
    //   .split('value=')[1]
    //   .split('"')[1];

    // this.purchaseTotal = fastCheckoutReq.body
    //   .split('purchaseTotal')[1]
    //   .split('value=')[1]
    //   .split('"')[1];
    try {
      this.closeHref = $('.prime-nothanks-button').first().attr('href').trim();
    } catch (e) {}

    if (this?.closeHref) {
      const req = await this.requestClient(
        `https://amazon.com${this.closeHref}`,
        {
          method: 'GET',
          headers: {
            rtt: '50',
            'accept-encoding': 'gzip, deflate, br',
            'User-Agent':
              'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 Safari/537.36',
            'content-type': 'application/x-www-form-urlencoded',
            'x-amz-support-custom-signin': '1',
            accept: '*/*',
            'x-requested-with': 'XMLHttpRequest',
            downlink: '10',
            ect: '4g',
            DNT: '1',
            origin: 'https://www.amazon.com',
            'sec-ch-ua':
              '" Not A;Brand";v="99", "Chromium";v="90", "Google Chrome";v="90"',
            'sec-fetch-site': 'same-origin',
            'sec-fetch-mode': 'cors',
            'sec-fetch-dest': 'empty',
            'sec-ch-ua-mobile': '?0',
            'accept-language': 'en-US,en;q=0.9',
            cookie: this.cookieString,
          },
          proxy: this.proxy ? this.proxy : '',
        }
      );
      this.closeHref = false;

      await this.fastCheckout();
    }

    this.csrfToken = encodeURIComponent(
      $('input[name="csrfToken"]').attr('value')
    );
    this.purchaseTotal = encodeURIComponent(
      $('input[name="purchaseTotal"]').attr('value')
    );

    this.productImage = $(
      '.shipping-group > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > img:nth-child(1)'
    ).attr('src');

    this.productName = $('.asin-title').first().text();
  }

  async staticDecoupledReq() {
    await this.sleep(this.getRandomInt(0, 500));
    this.sendStatus('Checking out');
    if (this.cancelled) return;
    const req = await this.requestClient(
      `https://www.amazon.com/gp/buy/spc/handlers/static-submit-decoupled.html?ie=UTF8&groupcount=1`,
      {
        userAgent:
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 Safari/537.36',
        ja3: '771,4865-4866-4867-49195-49199-49196-49200-52393-52392-49171-49172-156-157-47-53,0-23-65281-10-11-35-16-5-13-18-51-45-43-27-21,29-23-24,0',
        headers: {
          rtt: '50',
          'accept-encoding': 'gzip, deflate, br',
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 Safari/537.36',
          'content-type': 'application/x-www-form-urlencoded',
          'x-amz-support-custom-signin': '1',
          accept: '*/*',
          'x-requested-with': 'XMLHttpRequest',
          downlink: '10',
          ect: '4g',
          DNT: '1',
          origin: 'https://www.amazon.com',
          'sec-ch-ua':
            '" Not A;Brand";v="99", "Chromium";v="90", "Google Chrome";v="90"',
          'sec-fetch-site': 'same-origin',
          'sec-fetch-mode': 'cors',
          'sec-fetch-dest': 'empty',
          'sec-ch-ua-mobile': '?0',
          referrer:
            'https://www.amazon.com/gp/buy/duplicate-order/handlers/display.html?hasWorkingJavascript=1',
          'accept-language': 'en-US,en;q=0.9',
          cookie: this.cookieString,
        },
        proxy: this.proxy ? this.proxy : '',
        body: `csrfToken=${this.csrfToken}&needsThirdPartyRedirect=&isCC=&isWeChatPayment=&isAlipayAppPayment=&purchaseTotal=${this.purchaseTotal}&paymentDisplayName=&purchaseTotalCurrency=USD&needsAipsRedirect=&requiresUpfrontCharge=&forcePlaceOrder=Place+this+duplicate+order&hasWorkingJavascript=1`,
      },
      'POST'
    );

    if (req.statusCode !== 200 && this.checkoutAttempts < 5) {
      this.sendStatus(req.statusCode, 'Error');
      await this.sleep(this.getRandomInt(1000, 2000));
      this.checkoutAttempts++;
      await this.staticDecoupledReq();
    }
    this.sendStatus('Checked Out');

    await this.sendSuccess({
      sku: this.itemID,
      store: 'Amazon',
      product: this.productName,
      link: `https://www.amazon.com/dp/${this.itemID}`,
      price: this.purchaseTotal,
      profile: this.taskInfo.session,
      proxy: this.taskInfo.proxyName,
      mode: this.taskInfo.mode,
      quantity: '1',
      imageURL: this.productImage,
    });
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

module.exports = AmazonRegular;
