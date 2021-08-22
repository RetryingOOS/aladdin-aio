/* eslint-disable prefer-destructuring */
/* eslint-disable @typescript-eslint/no-useless-constructor */
/* eslint-disable class-methods-use-this */
// const Request = require('better-electron-fetch');
const cheerio = require('cheerio');
const got = require('got');
const { HttpsProxyAgent } = require('hpagent');
const Tasks = require('../../tasks');

class AmazonMobile extends Tasks {
  constructor(props) {
    super(props);
    this.itemID = 'B00006IFB4';
    this.proxyModified = 'http://127.0.0.1:8866';
    // this.addressID = 'ngjppsjpnkkq';
    this.cookieString =
      'session-id=138-4961397-2098842; session-id-time=2082787201l; ubid-main=131-5594381-4092768; session-token="zV/+kdGwltNvIFHvCZik7kxHMuewIEdE5fXTpxQdBXkNjoaySi20Uu4fqNbmtplagI3bzwH3TH/8HV6z4ErB1OgWU26vxkMNMowFtP9GxgU6lFtqbQoGv2HPeO0w28zwQy4QBrYQm/ccmW1JmeIKpZj+RuqZ6hi8VzKpR7y4YR5dmxz7juxSAqwLbwC3g9a28qd9eYI0dN6JGhbMH+pzOpwjbdnZEYlk0tSM3XplpXzSCB1FBpLQEc7A28N5khBbWXqm9mCaH8jVywoipSYUNw=="; x-main="HDl?TgE1nVqO3axTBv4eRmlh8CglXXIQrjnOTCo8?IBIvBUT6PCCI6txlgpfeOIJ"; at-main=Atza|IwEBIFajTGK8q5SwH-eCO9PJjbQ9nIrGthDyA-Ffg1xORtVEZIubNqIy0_-s5TYx3lXb7Lbz1-p1C4jhFCO5cOBevJam94_ySzYENEx8lTu7ad-OparNp56rVVxfz_7LwAF816HVfqclQnNEM0GWUQB3sG8eIQo8iSlx9gwjUxtZVr2wGfWpP-BZGCB9b3amJwVoqq3d3BHw4nbpMy9EVAjiFQqH; sess-at-main="hw78994Yxd9Zi/S9u10rsSxzfwCk/HfBY9y1l/H3KG4="; sst-main=Sst1|PQHryEMSDTqIgaNbN1zkg3n_CRoV7x0GQXli1505WcIbwhatBy7m3oXv2wHRFiHyhhVJtP91dtoeI5KGcbY89ReuDM_ajae4O4yJ1GS9AA6kslM9lqEOci8czQGdNNXDQiM801ieXkIJu2VWRlrP6yJPqcC0otcn4CBVH6XlWoP1fFr3GSBev3ZtqCJLIH6akD_bg9MPDqc2rwBAMTEwjdtmb-2W5bk8ZAYQuPaPUWca77zv8o0KPxdpnjD13260ohryjq5F-EsBfWIpzsJ8qtP4rI1YhlcRRqfdLPK7DQ4Hlfc; lc-main=en_US; i18n-prefs=USD';
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
    await this.monitor();
    // await this.getTokens();
    await this.addToCart();
    await this.fastCheckout();
    await this.staticDecoupledReq();
    // await this.addToCart();
    // await this.submitShipping();
    // await this.submitBilling();
    // await this.calculateTax();
    // await this.checkoutURL();
    // await this.submitOrder();
  }

  async monitor() {
    if (this.cancelled) return;
    const req = await this.requestClient(
      `https://smile.amazon.com/portal-migration/aod?asin=${this.itemID}&m=ATVPDKIKX0DER`,
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
          cookie:
            'session-id=138-4961397-2098842; session-id-time=2082787201l; i18n-prefs=USD; skin=noskin; ubid-main=131-5594381-4092768',
        },
        proxy: '127.0.0.1:8866',
      },
      'GET'
    );

    console.log(req.body);
    const $ = cheerio.load(req.body);
    this.listingId = $('input[name="offeringID.1"]').first().val();
    console.log(this.listingId);
  }

  async getTokens() {
    if (this.cancelled) return;
    await this.sleep(this.getRandomInt(1000, 2000));
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
          // 'accept-encoding': 'gzip, deflate, br',
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
        proxy: '127.0.0.1:8866',
      },
      'GET'
    );
    // console.log(req.body);
    this.sendStatus('Getting tokens');
    this.sendStatus(req.status);
    // console.log(req.body);
    const startTime = new Date();
    const $ = cheerio.load(req.body);
    console.log($('#ubbShipTo').val());
    this.addressID = $('#ubbShipTo').val();
    const endTime = new Date();
  }

  async getCookies() {
    if (this.cancelled) return;
    await this.sleep(this.getRandomInt(1000, 2000));

    const req = await this.requestClient(
      'https://www.amazon.com/checkout/triggerWeblab?ref_=dp_start-bbf_1_glance_buyNow_1-0&referrer=detail&weblab=RCX_CHECKOUT_TURBO_DESKTOP_PRIME_87783&weblabAllocation=T2',
      {
        headers: {
          authority: 'www.amazon.com',
          pragma: 'no-cache',
          'cache-control': 'no-cache',
          'sec-ch-ua': '^^',
          'x-amz-checkout-entry-referer-url':
            'https://www.amazon.com/SHININGFATESETB-Pokemon-Shining-Fates-Trainer/dp/B08RP8NDPR/?_encoding=UTF8&pd_rd_w=lymQ9&pf_rd_p=38316967-9a6c-4cf3-acd3-6269fd389669&pf_rd_r=N1KN6HAZQ9S6T24Q3S4Q&pd_rd_r=b00b278d-4cd8-4863-b753-f2be535e92be&pd_rd_wg=OIbgy&ref_=pd_gw_ci_mcx_mr_hp_d',
          'x-amz-turbo-checkout-dp-url':
            'https://www.amazon.com/SHININGFATESETB-Pokemon-Shining-Fates-Trainer/dp/B08RP8NDPR/?_encoding=UTF8&pd_rd_w=lymQ9&pf_rd_p=38316967-9a6c-4cf3-acd3-6269fd389669&pf_rd_r=N1KN6HAZQ9S6T24Q3S4Q&pd_rd_r=b00b278d-4cd8-4863-b753-f2be535e92be&pd_rd_wg=OIbgy&ref_=pd_gw_ci_mcx_mr_hp_d',
          rtt: '50',
          'sec-ch-ua-mobile': '?0',
          'user-agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 Safari/537.36',
          'content-type': 'application/x-www-form-urlencoded',
          'x-amz-support-custom-signin': '1',
          accept: '*/*',
          'x-requested-with': 'XMLHttpRequest',
          'x-amz-checkout-csrf-token': this.sessionID,
          downlink: '10',
          ect: '4g',
          origin: 'https://www.amazon.com',
          'sec-fetch-site': 'same-origin',
          'sec-fetch-mode': 'cors',
          'sec-fetch-dest': 'empty',
          referer:
            'https://www.amazon.com/SHININGFATESETB-Pokemon-Shining-Fates-Trainer/dp/B08RP8NDPR/?_encoding=UTF8&pd_rd_w=lymQ9&pf_rd_p=38316967-9a6c-4cf3-acd3-6269fd389669&pf_rd_r=N1KN6HAZQ9S6T24Q3S4Q&pd_rd_r=b00b278d-4cd8-4863-b753-f2be535e92be&pd_rd_wg=OIbgy&ref_=pd_gw_ci_mcx_mr_hp_d',
          'accept-language': 'en-US,en;q=0.9',
          cookie: `${this.cookieString}session-id=${
            this.sessionID
          }; x-amz-captcha-1=${new Date().getTime()};`,
        },
      },
      'POST'
    );
  }

  async addToCart() {
    const body = {
      id: '39261345120278',
      quantity: 1,
    };
    if (this.cancelled) return;
    await this.sleep(this.getRandomInt(1000, 2000));

    const req = await this.requestClient(
      'https://www.amazon.com/gp/add-to-cart/html/ref=aod_dpdsk_new_0',
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
          'x-amz-checkout-csrf-token': '137-4178342-7052624',
          'x-amz-checkout-entry-referer-url': `https://www.amazon.com/gp/product/${this.itemID}/ref=trb_chk_auth?ie=UTF8&psc=1&openid.assoc_handle=amazon_checkout_us&openid.claimed_id=https%3A%2F%2Fwww.amazon.com%2Fap%2Fid%2Famzn1.account.AHBWDMEEHIAUYPYDZ5UWRIZXSXNQ&openid.identity=https%3A%2F%2Fwww.amazon.com%2Fap%2Fid%2Famzn1.account.AHBWDMEEHIAUYPYDZ5UWRIZXSXNQ&openid.mode=id_res&openid.ns=http%3A%2F%2Fspecs.openid.net%2Fauth%2F2.0&openid.op_endpoint=https%3A%2F%2Fwww.amazon.com%2Fap%2Fsignin&openid.response_nonce=2021-05-23T18%3A52%3A46Z-1240728894965196594&openid.return_to=https%3A%2F%2Fwww.amazon.com%2Fgp%2Fproduct%2FB00006IFB4%2Fref%3Dtrb_chk_auth%3Fie%3DUTF8%26psc%3D1%26trb_auth%3D1%26trb_open%3D1%26trb_bid%3Dbuy-now-button&openid.signed=assoc_handle%2Cclaimed_id%2Cidentity%2Cmode%2Cns%2Cop_endpoint%2Cresponse_nonce%2Creturn_to%2CsiteState%2Cns.pape%2Cpape.auth_policies%2Cpape.auth_time%2Csigned&openid.ns.pape=http%3A%2F%2Fspecs.openid.net%2Fextensions%2Fpape%2F1.0&openid.pape.auth_policies=http%3A%2F%2Fschemas.openid.net%2Fpape%2Fpolicies%2F2007%2F06%2Fnone&openid.pape.auth_time=2021-05-23T18%3A52%3A46Z&openid.sig=O67%2BtIzNbh6sZYjXPy%2Fh36%2FzOb0AkdOsSoptQJTG1OE%3D&serial=&siteState=%7ChasWorkingJavascript.1`,
          'user-agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 Safari/537.36',
          'x-amz-support-custom-signin': '1',
          'x-amz-turbo-checkout-dp-url': `https://www.amazon.com/gp/product/${this.itemID}/ref=trb_chk_auth?ie=UTF8&psc=1&openid.assoc_handle=amazon_checkout_us&openid.claimed_id=https%3A%2F%2Fwww.amazon.com%2Fap%2Fid%2Famzn1.account.AHBWDMEEHIAUYPYDZ5UWRIZXSXNQ&openid.identity=https%3A%2F%2Fwww.amazon.com%2Fap%2Fid%2Famzn1.account.AHBWDMEEHIAUYPYDZ5UWRIZXSXNQ&openid.mode=id_res&openid.ns=http%3A%2F%2Fspecs.openid.net%2Fauth%2F2.0&openid.op_endpoint=https%3A%2F%2Fwww.amazon.com%2Fap%2Fsignin&openid.response_nonce=2021-05-23T18%3A52%3A46Z-1240728894965196594&openid.return_to=https%3A%2F%2Fwww.amazon.com%2Fgp%2Fproduct%2FB00006IFB4%2Fref%3Dtrb_chk_auth%3Fie%3DUTF8%26psc%3D1%26trb_auth%3D1%26trb_open%3D1%26trb_bid%3Dbuy-now-button&openid.signed=assoc_handle%2Cclaimed_id%2Cidentity%2Cmode%2Cns%2Cop_endpoint%2Cresponse_nonce%2Creturn_to%2CsiteState%2Cns.pape%2Cpape.auth_policies%2Cpape.auth_time%2Csigned&openid.ns.pape=http%3A%2F%2Fspecs.openid.net%2Fextensions%2Fpape%2F1.0&openid.pape.auth_policies=http%3A%2F%2Fschemas.openid.net%2Fpape%2Fpolicies%2F2007%2F06%2Fnone&openid.pape.auth_time=2021-05-23T18%3A52%3A46Z&openid.sig=O67%2BtIzNbh6sZYjXPy%2Fh36%2FzOb0AkdOsSoptQJTG1OE%3D&serial=&siteState=%7ChasWorkingJavascript.1`,
          cookie:
            'session-id=137-4178342-7052624; ubid-main=134-4083507-7705729; lc-main=en_US; csd-key=eyJ3YXNtVGVzdGVkIjp0cnVlLCJ3YXNtQ29tcGF0aWJsZSI6dHJ1ZSwid2ViQ3J5cHRvVGVzdGVkIjpmYWxzZSwidiI6MSwia2lkIjoiMDQ2YzljIiwia2V5IjoiWThkdURRcWNzRml0OFRBazh2OXprL0I3Kzk5SzFtcEpkQ1lnTENMakZoaVpHeDZjMGNscDN2QlFKK1ZxTjJqWWdsSmtHSURZdDFOa3hydlFpUksyQXNIR2lrcHJXSEpoMW94dFJiMEE4UFVubSsvQUFySHppOWdUOGdLWXd0aEFJMlR4RVFaa1I1NUMxRE54Wnh1eVhVdE5PczlMZ0dFaVBjRy9QZmRFVzIvQ01XK0doSmQwL2gxZzd6SWhPMFFJYkVJdDVuL01PS2ZOUkJjeitvMGpjZ0FYMGRUVkRkdjNmU0VyV2pxZkdWeWwxWmN4eVNhc0d1OW0vY0dHcGN4YU5vZEJSK0pEQlh2dWtwZkdqVmFwZWZXMG40T2ZtUzhmVzEzUExqZmVBdVpUNWRJczR1ajZseHFJYUdsY1UrcHpub2RqQ0gvUjA4SHZVRFhsN3NTdWNRPT0ifQ==; session-token=/HAK6BkvYhG3E8H5qOQGEzEW83wStKKgKuTsn5DFkWFAaqFwigVl18QtUkPmEGnOAhqcjpx7XHpor4P2KFRWta/tq9XDUOlmx4NRnFw01t10ErS4it4GhNNnQ7mlfTqRSbL3fiuiCVCq+LAC8wQ8dkcj7QdSINfG6m3re7pQrFof0r+wLCC8quTmopNZaG8UYzxfGPX3wlIbUY4b2hJj/S75Ejd3Uj0dl/mT3Td6YH2Dm0tdwzCSGcAejOmzKJIBD5lNToB49oYbFDUAJ0GdK6dqHk/0ci+a; x-main="NgLNNxaOTC7J7yM4lSQJ4vS?qerPq?fgb2XhwczwxWaqebM0ccKsGOJ8Do6we0jh"; at-main=Atza|IwEBIFq9zTXz1ogSOBP77lGpOkwc9EO62JM39_4-hrqoezAExwK792FfpHdWDCINuLoHEjtfv98zZRwBMfSi7J01kyv7_mtnvlE1ppo87eSr83FRlecD58YzXAhHwLrTpRIuQcHxK11zbytSCvQCJLHF1Esnig9eyrTPBxRp2JrBYetiKe3g5piLDLNgjsuT8b5uNDAhoHUS4OS-kBduaTTzmalt; sess-at-main="+l6cl5XePjJfUuatNdH4haXP4/6VekoSIgldYcYzKdM="; sst-main=Sst1|PQG6IrJn0yCPfMRz2JdsOTXvCXhJBIfRVTo7uLuQpGB4OVacD8naRIBHqyV3bp2xusxNC788BQ6LH_heLP08gbta98yRSeT20602m5Ky5cM5eWPoVnGRF9M6jPe_SmHGJPzJfWp987K0hXp83OexWk_ahaZ9j1oBEqxtgt608qJYBfEZtpbY82W76Q0FRBxhjtvvYeJWZN_Eq8YU2F5LeGcPEugaVSwzxJtdXwejhYO-PR9Tbp4FPjCfNIseyiWKxPRYc63iNmqlpugHaETWj828d8qwJ-9dqhJyM34yMH4FYv0; session-id-time=2082787201l; i18n-prefs=USD; csm-hit=tb:s-HM7EJQ3CR7AZ9VJNV3QY|1621795968277&t:1621795968277&adb:adblk_no',
        },
        proxy: '127.0.0.1:8866',
        body: `session-id=137-4178342-7052624&qid=&sr=&signInToHUC=0&metric-asin.${this.itemID}=1&registryItemID.1=&registryID.1=&itemCount=1&offeringID.1=${this.listingId}&quantity.1=1&isAddon=1&submit.addToCart=Submit`,
      },
      'POST'
    );
    if (this.cancelled) return;

    if (req.status === 200) {
      const page = req.body;
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
      console.log(this.anti_csrf);
      console.log(this.listingId);
      this.sendStatus('OK initiating');
    } else {
      /* log.error(e)
      log.error(res) */
      await this.sendStatus('Error getting not 200', false);
      await this.sendStatus('Retrying', false);
      await this.sleep(5000);
      await this.addToCart();
    }
    // console.log(req);
    // this.sendStatus('Adding to Cart');
    // this.sendStatus(req.body);
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

  async placeOrder() {
    await this.sleep(this.getRandomInt(3000, 5000));
    if (this.cancelled) return;
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
          cookie:
            'session-id=137-4178342-7052624; ubid-main=134-4083507-7705729; lc-main=en_US; csd-key=eyJ3YXNtVGVzdGVkIjp0cnVlLCJ3YXNtQ29tcGF0aWJsZSI6dHJ1ZSwid2ViQ3J5cHRvVGVzdGVkIjpmYWxzZSwidiI6MSwia2lkIjoiMDQ2YzljIiwia2V5IjoiWThkdURRcWNzRml0OFRBazh2OXprL0I3Kzk5SzFtcEpkQ1lnTENMakZoaVpHeDZjMGNscDN2QlFKK1ZxTjJqWWdsSmtHSURZdDFOa3hydlFpUksyQXNIR2lrcHJXSEpoMW94dFJiMEE4UFVubSsvQUFySHppOWdUOGdLWXd0aEFJMlR4RVFaa1I1NUMxRE54Wnh1eVhVdE5PczlMZ0dFaVBjRy9QZmRFVzIvQ01XK0doSmQwL2gxZzd6SWhPMFFJYkVJdDVuL01PS2ZOUkJjeitvMGpjZ0FYMGRUVkRkdjNmU0VyV2pxZkdWeWwxWmN4eVNhc0d1OW0vY0dHcGN4YU5vZEJSK0pEQlh2dWtwZkdqVmFwZWZXMG40T2ZtUzhmVzEzUExqZmVBdVpUNWRJczR1ajZseHFJYUdsY1UrcHpub2RqQ0gvUjA4SHZVRFhsN3NTdWNRPT0ifQ==; session-token=/HAK6BkvYhG3E8H5qOQGEzEW83wStKKgKuTsn5DFkWFAaqFwigVl18QtUkPmEGnOAhqcjpx7XHpor4P2KFRWta/tq9XDUOlmx4NRnFw01t10ErS4it4GhNNnQ7mlfTqRSbL3fiuiCVCq+LAC8wQ8dkcj7QdSINfG6m3re7pQrFof0r+wLCC8quTmopNZaG8UYzxfGPX3wlIbUY4b2hJj/S75Ejd3Uj0dl/mT3Td6YH2Dm0tdwzCSGcAejOmzKJIBD5lNToB49oYbFDUAJ0GdK6dqHk/0ci+a; x-main="NgLNNxaOTC7J7yM4lSQJ4vS?qerPq?fgb2XhwczwxWaqebM0ccKsGOJ8Do6we0jh"; at-main=Atza|IwEBIFq9zTXz1ogSOBP77lGpOkwc9EO62JM39_4-hrqoezAExwK792FfpHdWDCINuLoHEjtfv98zZRwBMfSi7J01kyv7_mtnvlE1ppo87eSr83FRlecD58YzXAhHwLrTpRIuQcHxK11zbytSCvQCJLHF1Esnig9eyrTPBxRp2JrBYetiKe3g5piLDLNgjsuT8b5uNDAhoHUS4OS-kBduaTTzmalt; sess-at-main="+l6cl5XePjJfUuatNdH4haXP4/6VekoSIgldYcYzKdM="; sst-main=Sst1|PQG6IrJn0yCPfMRz2JdsOTXvCXhJBIfRVTo7uLuQpGB4OVacD8naRIBHqyV3bp2xusxNC788BQ6LH_heLP08gbta98yRSeT20602m5Ky5cM5eWPoVnGRF9M6jPe_SmHGJPzJfWp987K0hXp83OexWk_ahaZ9j1oBEqxtgt608qJYBfEZtpbY82W76Q0FRBxhjtvvYeJWZN_Eq8YU2F5LeGcPEugaVSwzxJtdXwejhYO-PR9Tbp4FPjCfNIseyiWKxPRYc63iNmqlpugHaETWj828d8qwJ-9dqhJyM34yMH4FYv0; session-id-time=2082787201l; i18n-prefs=USD; csm-hit=tb:s-HM7EJQ3CR7AZ9VJNV3QY|1621795968277&t:1621795968277&adb:adblk_no',
        },
        proxy: '127.0.0.1:8866',
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
    await this.sleep(this.getRandomInt(3000, 5000));
    if (this.cancelled) return;
    const req = await this.requestClient(
      `https://www.amazon.com/gp/buy/spc/handlers/static-submit-decoupled.html/ref=ox_spc_place_order?ie=UTF8&amp;hasWorkingJavascript=0`,
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
          referrer: `https://www.amazon.com/gp/buy/spc/handlers/display.html?hasWorkingJavascript=1`,
          // referer: `https://www.amazon.com/checkout/spc?pid=106-3366120-2152264&pipelineType=turbo&clientId=retailwebsite&temporaryAddToCart=1&hostPage=detail&weblab=RCX_CHECKOUT_TURBO_DESKTOP_PRIME_87783`,
          'accept-language': 'en-US,en;q=0.9',
          //   'anti-csrftoken-a2z': this.anti_csrf,
          cookie:
            'session-id=137-4178342-7052624; ubid-main=134-4083507-7705729; lc-main=en_US; csd-key=eyJ3YXNtVGVzdGVkIjp0cnVlLCJ3YXNtQ29tcGF0aWJsZSI6dHJ1ZSwid2ViQ3J5cHRvVGVzdGVkIjpmYWxzZSwidiI6MSwia2lkIjoiMDQ2YzljIiwia2V5IjoiWThkdURRcWNzRml0OFRBazh2OXprL0I3Kzk5SzFtcEpkQ1lnTENMakZoaVpHeDZjMGNscDN2QlFKK1ZxTjJqWWdsSmtHSURZdDFOa3hydlFpUksyQXNIR2lrcHJXSEpoMW94dFJiMEE4UFVubSsvQUFySHppOWdUOGdLWXd0aEFJMlR4RVFaa1I1NUMxRE54Wnh1eVhVdE5PczlMZ0dFaVBjRy9QZmRFVzIvQ01XK0doSmQwL2gxZzd6SWhPMFFJYkVJdDVuL01PS2ZOUkJjeitvMGpjZ0FYMGRUVkRkdjNmU0VyV2pxZkdWeWwxWmN4eVNhc0d1OW0vY0dHcGN4YU5vZEJSK0pEQlh2dWtwZkdqVmFwZWZXMG40T2ZtUzhmVzEzUExqZmVBdVpUNWRJczR1ajZseHFJYUdsY1UrcHpub2RqQ0gvUjA4SHZVRFhsN3NTdWNRPT0ifQ==; session-token=/HAK6BkvYhG3E8H5qOQGEzEW83wStKKgKuTsn5DFkWFAaqFwigVl18QtUkPmEGnOAhqcjpx7XHpor4P2KFRWta/tq9XDUOlmx4NRnFw01t10ErS4it4GhNNnQ7mlfTqRSbL3fiuiCVCq+LAC8wQ8dkcj7QdSINfG6m3re7pQrFof0r+wLCC8quTmopNZaG8UYzxfGPX3wlIbUY4b2hJj/S75Ejd3Uj0dl/mT3Td6YH2Dm0tdwzCSGcAejOmzKJIBD5lNToB49oYbFDUAJ0GdK6dqHk/0ci+a; x-main="NgLNNxaOTC7J7yM4lSQJ4vS?qerPq?fgb2XhwczwxWaqebM0ccKsGOJ8Do6we0jh"; at-main=Atza|IwEBIFq9zTXz1ogSOBP77lGpOkwc9EO62JM39_4-hrqoezAExwK792FfpHdWDCINuLoHEjtfv98zZRwBMfSi7J01kyv7_mtnvlE1ppo87eSr83FRlecD58YzXAhHwLrTpRIuQcHxK11zbytSCvQCJLHF1Esnig9eyrTPBxRp2JrBYetiKe3g5piLDLNgjsuT8b5uNDAhoHUS4OS-kBduaTTzmalt; sess-at-main="+l6cl5XePjJfUuatNdH4haXP4/6VekoSIgldYcYzKdM="; sst-main=Sst1|PQG6IrJn0yCPfMRz2JdsOTXvCXhJBIfRVTo7uLuQpGB4OVacD8naRIBHqyV3bp2xusxNC788BQ6LH_heLP08gbta98yRSeT20602m5Ky5cM5eWPoVnGRF9M6jPe_SmHGJPzJfWp987K0hXp83OexWk_ahaZ9j1oBEqxtgt608qJYBfEZtpbY82W76Q0FRBxhjtvvYeJWZN_Eq8YU2F5LeGcPEugaVSwzxJtdXwejhYO-PR9Tbp4FPjCfNIseyiWKxPRYc63iNmqlpugHaETWj828d8qwJ-9dqhJyM34yMH4FYv0; session-id-time=2082787201l; i18n-prefs=USD; csm-hit=tb:s-HM7EJQ3CR7AZ9VJNV3QY|1621795968277&t:1621795968277&adb:adblk_no',
        },
        proxy: '127.0.0.1:8866',
        body: this.checkout_body,
      },
      'POST'
    );
  }

  async fastCheckout() {
    await this.sleep(this.getRandomInt(3000, 5000));
    if (this.cancelled) return;
    const fastCheckoutReq = await got.get(
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
          // referer: `https://www.amazon.com/checkout/spc?pid=106-3366120-2152264&pipelineType=turbo&clientId=retailwebsite&temporaryAddToCart=1&hostPage=detail&weblab=RCX_CHECKOUT_TURBO_DESKTOP_PRIME_87783`,
          'accept-language': 'en-US,en;q=0.9',
          //   'anti-csrftoken-a2z': this.anti_csrf,
          cookie:
            'session-id=137-4178342-7052624; ubid-main=134-4083507-7705729; lc-main=en_US; csd-key=eyJ3YXNtVGVzdGVkIjp0cnVlLCJ3YXNtQ29tcGF0aWJsZSI6dHJ1ZSwid2ViQ3J5cHRvVGVzdGVkIjpmYWxzZSwidiI6MSwia2lkIjoiMDQ2YzljIiwia2V5IjoiWThkdURRcWNzRml0OFRBazh2OXprL0I3Kzk5SzFtcEpkQ1lnTENMakZoaVpHeDZjMGNscDN2QlFKK1ZxTjJqWWdsSmtHSURZdDFOa3hydlFpUksyQXNIR2lrcHJXSEpoMW94dFJiMEE4UFVubSsvQUFySHppOWdUOGdLWXd0aEFJMlR4RVFaa1I1NUMxRE54Wnh1eVhVdE5PczlMZ0dFaVBjRy9QZmRFVzIvQ01XK0doSmQwL2gxZzd6SWhPMFFJYkVJdDVuL01PS2ZOUkJjeitvMGpjZ0FYMGRUVkRkdjNmU0VyV2pxZkdWeWwxWmN4eVNhc0d1OW0vY0dHcGN4YU5vZEJSK0pEQlh2dWtwZkdqVmFwZWZXMG40T2ZtUzhmVzEzUExqZmVBdVpUNWRJczR1ajZseHFJYUdsY1UrcHpub2RqQ0gvUjA4SHZVRFhsN3NTdWNRPT0ifQ==; session-token=/HAK6BkvYhG3E8H5qOQGEzEW83wStKKgKuTsn5DFkWFAaqFwigVl18QtUkPmEGnOAhqcjpx7XHpor4P2KFRWta/tq9XDUOlmx4NRnFw01t10ErS4it4GhNNnQ7mlfTqRSbL3fiuiCVCq+LAC8wQ8dkcj7QdSINfG6m3re7pQrFof0r+wLCC8quTmopNZaG8UYzxfGPX3wlIbUY4b2hJj/S75Ejd3Uj0dl/mT3Td6YH2Dm0tdwzCSGcAejOmzKJIBD5lNToB49oYbFDUAJ0GdK6dqHk/0ci+a; x-main="NgLNNxaOTC7J7yM4lSQJ4vS?qerPq?fgb2XhwczwxWaqebM0ccKsGOJ8Do6we0jh"; at-main=Atza|IwEBIFq9zTXz1ogSOBP77lGpOkwc9EO62JM39_4-hrqoezAExwK792FfpHdWDCINuLoHEjtfv98zZRwBMfSi7J01kyv7_mtnvlE1ppo87eSr83FRlecD58YzXAhHwLrTpRIuQcHxK11zbytSCvQCJLHF1Esnig9eyrTPBxRp2JrBYetiKe3g5piLDLNgjsuT8b5uNDAhoHUS4OS-kBduaTTzmalt; sess-at-main="+l6cl5XePjJfUuatNdH4haXP4/6VekoSIgldYcYzKdM="; sst-main=Sst1|PQG6IrJn0yCPfMRz2JdsOTXvCXhJBIfRVTo7uLuQpGB4OVacD8naRIBHqyV3bp2xusxNC788BQ6LH_heLP08gbta98yRSeT20602m5Ky5cM5eWPoVnGRF9M6jPe_SmHGJPzJfWp987K0hXp83OexWk_ahaZ9j1oBEqxtgt608qJYBfEZtpbY82W76Q0FRBxhjtvvYeJWZN_Eq8YU2F5LeGcPEugaVSwzxJtdXwejhYO-PR9Tbp4FPjCfNIseyiWKxPRYc63iNmqlpugHaETWj828d8qwJ-9dqhJyM34yMH4FYv0; session-id-time=2082787201l; i18n-prefs=USD; csm-hit=tb:s-HM7EJQ3CR7AZ9VJNV3QY|1621795968277&t:1621795968277&adb:adblk_no',
        },
        agent: {
          https: new HttpsProxyAgent({
            keepAlive: true,
            keepAliveMsecs: 1000,
            maxSockets: 256,
            maxFreeSockets: 256,
            proxy: this.proxyModified,
          }),
        },
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
    this.csrfToken = encodeURIComponent(
      $('input[name="csrfToken"]').attr('value')
    );
    this.purchaseTotal = encodeURIComponent(
      $('input[name="purchaseTotal"]').attr('value')
    );
    console.log(`Purchase total is ${this.purchaseTotal}`);

    console.log(`CSRF TOKEN IS ${this.csrfToken}`);
  }

  async staticDecoupledReq() {
    await this.sleep(this.getRandomInt(3000, 5000));
    if (this.cancelled) return;
    const req = await this.requestClient(
      `https://www.amazon.com/gp/buy/spc/handlers/static-submit-decoupled.html?ie=UTF8&groupcount=1`,
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
          //   'x-amz-checkout-csrf-token': '137-4178342-7052624',
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
          // referer: `https://www.amazon.com/checkout/spc?pid=106-3366120-2152264&pipelineType=turbo&clientId=retailwebsite&temporaryAddToCart=1&hostPage=detail&weblab=RCX_CHECKOUT_TURBO_DESKTOP_PRIME_87783`,
          'accept-language': 'en-US,en;q=0.9',
          //   'anti-csrftoken-a2z': this.anti_csrf,
          cookie:
            'session-id=137-4178342-7052624; ubid-main=134-4083507-7705729; lc-main=en_US; csd-key=eyJ3YXNtVGVzdGVkIjp0cnVlLCJ3YXNtQ29tcGF0aWJsZSI6dHJ1ZSwid2ViQ3J5cHRvVGVzdGVkIjpmYWxzZSwidiI6MSwia2lkIjoiMDQ2YzljIiwia2V5IjoiWThkdURRcWNzRml0OFRBazh2OXprL0I3Kzk5SzFtcEpkQ1lnTENMakZoaVpHeDZjMGNscDN2QlFKK1ZxTjJqWWdsSmtHSURZdDFOa3hydlFpUksyQXNIR2lrcHJXSEpoMW94dFJiMEE4UFVubSsvQUFySHppOWdUOGdLWXd0aEFJMlR4RVFaa1I1NUMxRE54Wnh1eVhVdE5PczlMZ0dFaVBjRy9QZmRFVzIvQ01XK0doSmQwL2gxZzd6SWhPMFFJYkVJdDVuL01PS2ZOUkJjeitvMGpjZ0FYMGRUVkRkdjNmU0VyV2pxZkdWeWwxWmN4eVNhc0d1OW0vY0dHcGN4YU5vZEJSK0pEQlh2dWtwZkdqVmFwZWZXMG40T2ZtUzhmVzEzUExqZmVBdVpUNWRJczR1ajZseHFJYUdsY1UrcHpub2RqQ0gvUjA4SHZVRFhsN3NTdWNRPT0ifQ==; session-token=/HAK6BkvYhG3E8H5qOQGEzEW83wStKKgKuTsn5DFkWFAaqFwigVl18QtUkPmEGnOAhqcjpx7XHpor4P2KFRWta/tq9XDUOlmx4NRnFw01t10ErS4it4GhNNnQ7mlfTqRSbL3fiuiCVCq+LAC8wQ8dkcj7QdSINfG6m3re7pQrFof0r+wLCC8quTmopNZaG8UYzxfGPX3wlIbUY4b2hJj/S75Ejd3Uj0dl/mT3Td6YH2Dm0tdwzCSGcAejOmzKJIBD5lNToB49oYbFDUAJ0GdK6dqHk/0ci+a; x-main="NgLNNxaOTC7J7yM4lSQJ4vS?qerPq?fgb2XhwczwxWaqebM0ccKsGOJ8Do6we0jh"; at-main=Atza|IwEBIFq9zTXz1ogSOBP77lGpOkwc9EO62JM39_4-hrqoezAExwK792FfpHdWDCINuLoHEjtfv98zZRwBMfSi7J01kyv7_mtnvlE1ppo87eSr83FRlecD58YzXAhHwLrTpRIuQcHxK11zbytSCvQCJLHF1Esnig9eyrTPBxRp2JrBYetiKe3g5piLDLNgjsuT8b5uNDAhoHUS4OS-kBduaTTzmalt; sess-at-main="+l6cl5XePjJfUuatNdH4haXP4/6VekoSIgldYcYzKdM="; sst-main=Sst1|PQG6IrJn0yCPfMRz2JdsOTXvCXhJBIfRVTo7uLuQpGB4OVacD8naRIBHqyV3bp2xusxNC788BQ6LH_heLP08gbta98yRSeT20602m5Ky5cM5eWPoVnGRF9M6jPe_SmHGJPzJfWp987K0hXp83OexWk_ahaZ9j1oBEqxtgt608qJYBfEZtpbY82W76Q0FRBxhjtvvYeJWZN_Eq8YU2F5LeGcPEugaVSwzxJtdXwejhYO-PR9Tbp4FPjCfNIseyiWKxPRYc63iNmqlpugHaETWj828d8qwJ-9dqhJyM34yMH4FYv0; session-id-time=2082787201l; i18n-prefs=USD; csm-hit=tb:s-HM7EJQ3CR7AZ9VJNV3QY|1621795968277&t:1621795968277&adb:adblk_no',
        },
        proxy: '127.0.0.1:8866',
        body: `csrfToken=${this.csrfToken}&needsThirdPartyRedirect=&isCC=&isWeChatPayment=&isAlipayAppPayment=&purchaseTotal=${this.purchaseTotal}&paymentDisplayName=&purchaseTotalCurrency=USD&needsAipsRedirect=&requiresUpfrontCharge=&forcePlaceOrder=Place+this+duplicate+order&hasWorkingJavascript=1`,
      },
      'POST'
    );

    this.sendStatus('Checked Out');
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

module.exports = AmazonMobile;
