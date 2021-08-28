/* eslint-disable prefer-destructuring */
/* eslint-disable @typescript-eslint/no-useless-constructor */
/* eslint-disable class-methods-use-this */
// const Request = require('better-electron-fetch');
const cheerio = require('cheerio');
const qs = require('qs');
const Tasks = require('../../tasks');

class AmazonSmile extends Tasks {
  constructor(props) {
    super(props);
    this.atcAttempts = 0;
    // this.itemID = 'B00006IFB4';
    // this.addressID = 'ngjppsjpnkkq';
    // this.cookieString =
    //   'session-id=138-4961397-2098842; session-id-time=2082787201l; ubid-main=131-5594381-4092768; session-token="zV/+kdGwltNvIFHvCZik7kxHMuewIEdE5fXTpxQdBXkNjoaySi20Uu4fqNbmtplagI3bzwH3TH/8HV6z4ErB1OgWU26vxkMNMowFtP9GxgU6lFtqbQoGv2HPeO0w28zwQy4QBrYQm/ccmW1JmeIKpZj+RuqZ6hi8VzKpR7y4YR5dmxz7juxSAqwLbwC3g9a28qd9eYI0dN6JGhbMH+pzOpwjbdnZEYlk0tSM3XplpXzSCB1FBpLQEc7A28N5khBbWXqm9mCaH8jVywoipSYUNw=="; x-main="HDl?TgE1nVqO3axTBv4eRmlh8CglXXIQrjnOTCo8?IBIvBUT6PCCI6txlgpfeOIJ"; at-main=Atza|IwEBIFajTGK8q5SwH-eCO9PJjbQ9nIrGthDyA-Ffg1xORtVEZIubNqIy0_-s5TYx3lXb7Lbz1-p1C4jhFCO5cOBevJam94_ySzYENEx8lTu7ad-OparNp56rVVxfz_7LwAF816HVfqclQnNEM0GWUQB3sG8eIQo8iSlx9gwjUxtZVr2wGfWpP-BZGCB9b3amJwVoqq3d3BHw4nbpMy9EVAjiFQqH; sess-at-main="hw78994Yxd9Zi/S9u10rsSxzfwCk/HfBY9y1l/H3KG4="; sst-main=Sst1|PQHryEMSDTqIgaNbN1zkg3n_CRoV7x0GQXli1505WcIbwhatBy7m3oXv2wHRFiHyhhVJtP91dtoeI5KGcbY89ReuDM_ajae4O4yJ1GS9AA6kslM9lqEOci8czQGdNNXDQiM801ieXkIJu2VWRlrP6yJPqcC0otcn4CBVH6XlWoP1fFr3GSBev3ZtqCJLIH6akD_bg9MPDqc2rwBAMTEwjdtmb-2W5bk8ZAYQuPaPUWca77zv8o0KPxdpnjD13260ohryjq5F-EsBfWIpzsJ8qtP4rI1YhlcRRqfdLPK7DQ4Hlfc; lc-main=en_US; i18n-prefs=USD';
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
    await this.getInfo();
    await this.getRandomProxy();
    // await this.getTokens();
    await this.addToCart();
    await this.placeOrder();
  }

  async addToCart() {
    if (this.cancelled) return;
    await this.sleep(this.getRandomInt(0, 500));
    this.sendStatus('Adding to Cart');

    const req = await this.requestClient(
      'https://www.amazon.com/checkout/turbo-initiate?ref_=dp_start-bbf_1_glance_buyNow_2-1&referrer=detail&pipelineType=turbo&clientId=retailwebsite&weblab=RCX_CHECKOUT_TURBO_DESKTOP_PRIME_87783&temporaryAddToCart=1',
      {
        userAgent:
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 Safari/537.36',
        ja3: '771,4865-4866-4867-49195-49199-49196-49200-52393-52392-49171-49172-156-157-47-53,0-23-65281-10-11-35-16-5-13-18-51-45-43-27-21,29-23-24,0',
        headers: {
          accept: '*/*',
          // 'accept-encoding': 'gzip, deflate, br',
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
          'x-amz-checkout-csrf-token': this.sessionID,
          'x-amz-checkout-entry-referer-url': `https://www.amazon.com/gp/product/${this.itemID}/ref=trb_chk_auth?ie=UTF8&psc=1&openid.assoc_handle=amazon_checkout_us&openid.claimed_id=https%3A%2F%2Fwww.amazon.com%2Fap%2Fid%2Famzn1.account.AHBWDMEEHIAUYPYDZ5UWRIZXSXNQ&openid.identity=https%3A%2F%2Fwww.amazon.com%2Fap%2Fid%2Famzn1.account.AHBWDMEEHIAUYPYDZ5UWRIZXSXNQ&openid.mode=id_res&openid.ns=http%3A%2F%2Fspecs.openid.net%2Fauth%2F2.0&openid.op_endpoint=https%3A%2F%2Fwww.amazon.com%2Fap%2Fsignin&openid.response_nonce=2021-05-23T18%3A52%3A46Z-1240728894965196594&openid.return_to=https%3A%2F%2Fwww.amazon.com%2Fgp%2Fproduct%2FB00006IFB4%2Fref%3Dtrb_chk_auth%3Fie%3DUTF8%26psc%3D1%26trb_auth%3D1%26trb_open%3D1%26trb_bid%3Dbuy-now-button&openid.signed=assoc_handle%2Cclaimed_id%2Cidentity%2Cmode%2Cns%2Cop_endpoint%2Cresponse_nonce%2Creturn_to%2CsiteState%2Cns.pape%2Cpape.auth_policies%2Cpape.auth_time%2Csigned&openid.ns.pape=http%3A%2F%2Fspecs.openid.net%2Fextensions%2Fpape%2F1.0&openid.pape.auth_policies=http%3A%2F%2Fschemas.openid.net%2Fpape%2Fpolicies%2F2007%2F06%2Fnone&openid.pape.auth_time=2021-05-23T18%3A52%3A46Z&openid.sig=O67%2BtIzNbh6sZYjXPy%2Fh36%2FzOb0AkdOsSoptQJTG1OE%3D&serial=&siteState=%7ChasWorkingJavascript.1`,
          'user-agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 Safari/537.36',
          'x-amz-support-custom-signin': '1',
          'x-amz-turbo-checkout-dp-url': `https://www.amazon.com/gp/product/${this.itemID}/ref=trb_chk_auth?ie=UTF8&psc=1&openid.assoc_handle=amazon_checkout_us&openid.claimed_id=https%3A%2F%2Fwww.amazon.com%2Fap%2Fid%2Famzn1.account.AHBWDMEEHIAUYPYDZ5UWRIZXSXNQ&openid.identity=https%3A%2F%2Fwww.amazon.com%2Fap%2Fid%2Famzn1.account.AHBWDMEEHIAUYPYDZ5UWRIZXSXNQ&openid.mode=id_res&openid.ns=http%3A%2F%2Fspecs.openid.net%2Fauth%2F2.0&openid.op_endpoint=https%3A%2F%2Fwww.amazon.com%2Fap%2Fsignin&openid.response_nonce=2021-05-23T18%3A52%3A46Z-1240728894965196594&openid.return_to=https%3A%2F%2Fwww.amazon.com%2Fgp%2Fproduct%2FB00006IFB4%2Fref%3Dtrb_chk_auth%3Fie%3DUTF8%26psc%3D1%26trb_auth%3D1%26trb_open%3D1%26trb_bid%3Dbuy-now-button&openid.signed=assoc_handle%2Cclaimed_id%2Cidentity%2Cmode%2Cns%2Cop_endpoint%2Cresponse_nonce%2Creturn_to%2CsiteState%2Cns.pape%2Cpape.auth_policies%2Cpape.auth_time%2Csigned&openid.ns.pape=http%3A%2F%2Fspecs.openid.net%2Fextensions%2Fpape%2F1.0&openid.pape.auth_policies=http%3A%2F%2Fschemas.openid.net%2Fpape%2Fpolicies%2F2007%2F06%2Fnone&openid.pape.auth_time=2021-05-23T18%3A52%3A46Z&openid.sig=O67%2BtIzNbh6sZYjXPy%2Fh36%2FzOb0AkdOsSoptQJTG1OE%3D&serial=&siteState=%7ChasWorkingJavascript.1`,
          cookie: this.cookieString
        },
        proxy: this.proxy ? this.proxy : '',
        body: qs.stringify({
          isAsync: 1,
          'asin.1': this.itemID,
          'offerListing.1': this.listingId,
          'quantity.1': 1,
        }),
      },
      'POST'
    );
    if (this.cancelled) return;
    if (req.status === 200) {
      const $ = cheerio.load(req.body);
      // this.pid = page.split('pid=')[1].split('&')[0];s
      this.pid = $(
        '.turbo-checkout-panel-link'
      ).first().attr('href').split('pid=')[1].split('&')[0];
      this.anti_csrf = $("input[name='anti-csrftoken-a2z']").val();
      this.sendStatus('Added to Cart');
    } else {
      /* log.error(e)
      log.error(res) */
      // await this.sendStatus('Retrying ATC');
      // await this.sleep(5000);
      // await this.addToCart();
      if (this.atcAttempts < 5) {
        await this.sendStatus('Retrying ATC');
        await this.sleep(1000);
        await this.addToCart();
        this.atcAttempts++;
      } else {
        this.sendStatus('Sleeping... Waiting for monitor');
        this.cancelled = true;
      }
    }
  }

  async placeOrder() {
    await this.sleep(this.getRandomInt(3000, 5000));
    if (this.cancelled) return;
    this.sendStatus('Placing Order');
    const req = await this.requestClient(
      `https://www.amazon.com/checkout/spc/place-order?ref_=dp_start-bbf_1_glance_buyNow_4-2&referrer=detail&pipelineType=turbo&cachebuster=${Date.now()}&clientId=retailwebsite&weblab=RCX_CHECKOUT_TURBO_DESKTOP_PRIME_87783&temporaryAddToCart=1`,
      {
        userAgent:
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 Safari/537.36',
        ja3: '771,4865-4866-4867-49195-49199-49196-49200-52393-52392-49171-49172-156-157-47-53,0-23-65281-10-11-35-16-5-13-18-51-45-43-27-21,29-23-24,0',
        headers: {
          'x-amz-checkout-entry-referer-url': `https://www.amazon.com/gp/product/${this.itemID}/ref=trb_chk_auth?ie=UTF8&psc=1&openid.assoc_handle=amazon_checkout_us&openid.claimed_id=https%3A%2F%2Fwww.amazon.com%2Fap%2Fid%2Famzn1.account.AHBWDMEEHIAUYPYDZ5UWRIZXSXNQ&openid.identity=https%3A%2F%2Fwww.amazon.com%2Fap%2Fid%2Famzn1.account.AHBWDMEEHIAUYPYDZ5UWRIZXSXNQ&openid.mode=id_res&openid.ns=http%3A%2F%2Fspecs.openid.net%2Fauth%2F2.0&openid.op_endpoint=https%3A%2F%2Fwww.amazon.com%2Fap%2Fsignin&openid.response_nonce=2021-05-23T18%3A52%3A46Z-1240728894965196594&openid.return_to=https%3A%2F%2Fwww.amazon.com%2Fgp%2Fproduct%2FB00006IFB4%2Fref%3Dtrb_chk_auth%3Fie%3DUTF8%26psc%3D1%26trb_auth%3D1%26trb_open%3D1%26trb_bid%3Dbuy-now-button&openid.signed=assoc_handle%2Cclaimed_id%2Cidentity%2Cmode%2Cns%2Cop_endpoint%2Cresponse_nonce%2Creturn_to%2CsiteState%2Cns.pape%2Cpape.auth_policies%2Cpape.auth_time%2Csigned&openid.ns.pape=http%3A%2F%2Fspecs.openid.net%2Fextensions%2Fpape%2F1.0&openid.pape.auth_policies=http%3A%2F%2Fschemas.openid.net%2Fpape%2Fpolicies%2F2007%2F06%2Fnone&openid.pape.auth_time=2021-05-23T18%3A52%3A46Z&openid.sig=O67%2BtIzNbh6sZYjXPy%2Fh36%2FzOb0AkdOsSoptQJTG1OE%3D&serial=&siteState=%7ChasWorkingJavascript.1`,
          rtt: '50',
          'accept-encoding': 'gzip, deflate, br',
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 Safari/537.36',
          'content-type': 'application/x-www-form-urlencoded',
          'x-amz-support-custom-signin': '1',
          accept: '*/*',
          'x-requested-with': 'XMLHttpRequest',
          'x-amz-turbo-checkout-dp-url': `https://www.amazon.com/gp/product/${this.itemID}`,
          downlink: '10',
          'x-amz-checkout-csrf-token': this.sessionID,
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
          'anti-csrftoken-a2z': this.anti_csrf,
          cookie: this.cookieString
        },
        proxy: this.proxy ? this.proxy : '',

        body: qs.stringify({
          'x-amz-checkout-csrf-token': this.sessionID,
          ref_: 'chk_spc_placeOrder',
          referrer: 'spc',
          pid: this.pid,
          pipelineType: 'turbo',
          clientId: 'retailwebsite',
          // forcePlaceOrder: 'Place this duplicate order',
          temporaryAddToCart: '1',
          hostPage: 'detail',
          weblab: 'RCX_CHECKOUT_TURBO_DESKTOP_PRIME_87784',
          isClientTimeBased: '1',
        }),
      },
      'POST'
    );
    // this.sendStatus('Submitting Shipping');
    if (this.cancelled) return;
    if (req.status === 200) {
      console.log(req.body);
      await this.sendStatus('Placed Order');
    } else {
      console.log(req.status);
      console.log(req.body);
      await this.sendStatus('Error checking out');
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

module.exports = AmazonSmile;
