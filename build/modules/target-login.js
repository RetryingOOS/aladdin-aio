/* eslint-disable guard-for-in */
/* eslint-disable vars-on-top */
/* eslint-disable no-restricted-syntax */
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

// const proxy = 'http://127.0.0.1:8866';

// import initClient from '../backend/Request/Client/dist/index';

// import { Server } from 'ws';

const tough = require('tough-cookie');
const got = require('got');
const { BrowserWindow } = require('electron');
// const EventEmitter = require("events");
const { HttpsProxyAgent } = require('hpagent');
const puppeteer = require('puppeteer-core');
const chromePaths = require('chrome-paths');
const Tasks = require('../tasks');

// const WebsocketServer = new Server({ port: 9988 });

// WebsocketServer.on('connection', function connection(ws) {
//   ws.on('message', function incoming(message) {
//     console.log('received: %s', message);
//     if (message.type === 'headers') {
//       currentHeaders = JSON.parse(message.headers);
//       updated = true;
//       console.log(`\n ${currentHeaders} \n`);
//     }
//   });
//   // ws.send('something');
// });

class TargetLogin extends Tasks {
  constructor(props) {
    super(props);
    this.randomport = Math.floor(Math.random() * 250);
    // this.proxy = `45.66.117.${this.randomport}:3120:johnnie:stat`;
    this.proxy = '127.0.0.1:8866';
    this.proxyFormatted = 'http://127.0.0.1:8866';
    // this.proxy = 'http://127.0.0.1:8866'
    this.initialCookie = '';
    this.email = 'randomusername1593@gmail.com';
    this.password = 'RandomUser278';
    // this.proxyFormatted = `http://johnnie:stat@45.66.117.${this.randomport}:3120`;
    this.cookieJar = new tough.CookieJar();
    // this.headersEmitter = new EventEmitter();
    // this.WebsocketServer = new Server({ port: 9988 });
    // this.startProcess = this.startProcess.bind(this);
    this.userAgent =
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36';
    // this.currentHeaders = {
    //   'X-GyJwza5Z-z': 'q',
    //   'X-GyJwza5Z-f': 'A0u8K3N6AQAAr5bce12Xrq8LvkZHD_eiyYsA6Pa4vYgBGjwaJNHXxSKjxBreAZ7esraucsP1wH8AAEB3AAAAAA==',
    //   'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
    //   'Content-Type': 'application/json',
    //   'X-GyJwza5Z-d': 'ABaChIjBDKGNgUGAQZIQhISi0eIApJmBDgDOGB6EJR5yTP_____xW-A9ALB2ltZudwEovOoCYFKt0S4',
    //   'X-GyJwza5Z-b': 'i88jrj',
    //   'X-GyJwza5Z-c': 'AAAyG3N6AQAAvD-GIAPeiFbKkF9Cair9j2AbnPbDF3UhlSeLfc4YHoQlHnJM',
    //   'X-GyJwza5Z-a': '_7ZVOKoEEVzDP89VS0bnowjtwzzRoRtHi1tXiyo6NeUbBeRv7ROezd9Vt0P3uD7KOFQ99K0U3P2sUhYRdqljbARxQBdMCN76WcYxHmFPILcbRgV_O-N4a_64ytxHY6aPPHrYMSsVNKS_arVpkYxYRW0KOeFDbghyQI23_bjPc0Nfk_JkxkUov7O_K7N7C9R1fiUWm2MqQUCysC4AsdP2yki_BqzBHCetC2EUVwmLcEviW_yRnA2eJx=oF7nx_KJVRt7mvwbq1gtPVsggLNETuvjtVhgQTPOelm4TWbB0Jow4rtYf-I5d03Q3lx==XNeKSAJIOL1TYr2ZS57LvOqx1--KdiWdMtJ2QTD7QcTWX9SIB_F2xQflZevV=XSnBf=xqU7Nf4JxjVTxATRA9jj2K8PECXpc1OZYv-nBe0-dE2mJdI1W01UAX7nUsvPgvJ4tAn_OTO9Roradkq8C12=zSafpr4udqeFLxAnfdx6ji5Pdz6oiMBTeOC0E8k=zhtMBpB63HKKQ0TwPcSNS8QAwpwUcU2EVLR_g7xnrqpgo3EEeH-2aU2eoK7hjXOTPEzrW24lcYZW77nmhdxHpbpcc=fd2fzu8Eh2Uj8A9eKYA6lEjQlJnf8pXHgoNwvNR3Mb6bEnWB8abYVS4oYH-dwC-wL54=RcszfE0FWWdDZuFBsxiiEBg6BHMqWKTtK3Ho6UleYmIXr1rW57a7CxZNKp0s_Y0tc-aE-l8=hWBUpjLCr2p-nOosS2sbQeAwFUXPo=2dvO1UvnePeBrxEssko7Shg=hzFcDYvsht5Oj05BMweKvUg3uztWuDg6JiYvRh6esnIqIqkrefmNWLg2sEBjrMdPbZesdyOccTVqqY1udOy2=KNglwBm8aXN_Q4zPRnl1RRBd0MpOrxP6SC4MuC6oeCDc9bheSQwNey6tfyMTCyNken=mM0Fnwu2bTlJJ-f6AYNKZT_RhajRXREqDDZ2WhKCU0c7pMY-yfKmzmUl2pyj9Tbejm0YSiSCb=BWazWCv4OtebR0AqPOMWCFp92tE4w4u9hreX547QdsXEWxyC1nU00Urlw-RooDO7aP_IJo1hI82COWaJk5=uuLQMSQv9l4LFCS0wHtZrm-EsFbmKXhjTb7ngQJVnucmSexLFhHElInKg8BVd3Vqrkndyl=ptl2PRvpXal=7DoeTc12229YsYECgOREgD2rnyFiF_Tx3PU=HFdgaeCcPRHouPexS9InjJR95tkhrIAeUBH7QVSiX9ekeSo4b8Ac6l479=YSDJD3CzSsBlXBPb=eFZPw9lH1X=NU6OgiPkO8PDXMyHF5NPoOXWZDe=RFiqtfpb_fXDK7utUX2PNj6ZUZoi2=yBQ=UFsKiyl1mZ2y6dFrkqj4s7t4NQLw3tjZiDMnNjdtf0kW4CK94OzZl05bKNB9aSMiEdy=pxKMit-JM_YwMwkNWcuEZUdEJ2AaHrStAM0gTdOdsJ9JfWBl9kAh52=Ui7blkXKgNcT4AZ4uksQy_P_6bZtfiflHqNqQMopJT5WpEqUFDtjNFsuNaatcX1L8Drw0_gbLhk1Nt5ytIKmYneVTNYOg29qBd3Hq9yDypIqPC5hMfZpisTshQqzcBm0dM_MR0o=3UzKAO5kTmPtNgUVqzgt7fspJcg7hh-ap=tP1EsB-qXJ=Eydjj1SDy1B37UO6mrrfVQ_ocpiUQt69nvllXXCw3JLvwR-90QODYYfAtPYw',
    //   Accept: '*/*',
    //   'Sec-Fetch-Site': 'same-site',
    //   'Sec-Fetch-Mode': 'cors',
    //   'Sec-Fetch-Dest': 'empty',
    //   Referer: 'https://www.target.com/co-login?shouldMergeCart=false&redirectToStep=PRECHECKOUT',
    //   'Accept-Encoding': 'gzip, deflate, br',
    //   'Accept-Language': 'en-US',
    //   Cookie: 'TealeafAkaSid=4IrxD_wDIgCn6NkHm9ar5USkK8LHcG9z; visitorId=017A732BBAD402018B1CA9760CCF96F8; sapphire=1; UserLocation=11209|40.620|-74.040|NY|US; egsSessionId=758e084b-55dd-4d03-9c72-27bc8c0e795c; accessToken=eyJraWQiOiJlYXMyIiwiYWxnIjoiUlMyNTYifQ.eyJzdWIiOiJjZWEyZGI5YS1kZjM5LTQxYjgtOWFjNy03ODQ1NDg1NDdkMjkiLCJpc3MiOiJNSTYiLCJleHAiOjE2MjU1MTYyODUsImlhdCI6MTYyNTQyOTg4NSwianRpIjoiVEdULmM1MWZlMWUyMmIyMDQ4Mjg4NTg4N2VjNjkwYmJjZTUyLWwiLCJza3kiOiJlYXMyIiwic3V0IjoiRyIsImRpZCI6IjIwZDhmMzI1NTNhZTZkMjQyZjA4ZTBkZjA5ZDZlMDc4NTcyODFmMzQzYjhiN2Q1MGI3YmVlNmI2NThiMTQ3YWUiLCJzY28iOiJlY29tLm5vbmUsb3BlbmlkIiwiY2xpIjoiZWNvbS13ZWItMS4wLjAiLCJhc2wiOiJMIn0.TnrxdXjFQ_wkOnt6Xxq4FLvEbtHVtY3dtZV7etkhKAhZKwIxzK1C9DL5rnVOHRFnm3xuVXT2hmHew30JVSpW0Fl6o2kARxJ_4-MnN7IOR6y4HkeR_FvwboZSoslOBp-AfY2w56visz2gERChTc5CTAbn5QBd7mIc3kfi4D-hHDrEX9mZzDobeX4NlPo5df4RJjOpcFYETRVEcYr2x89aIAVZpXdYNTxJZrqucwsn9a76G12G0-NfnTDDG-c8aEpH544ekGPhaXObl9l4estW8kl03zZniOT8cJArvb7Kbmcx8Kiv-MZlxouTBDGx-2MUCABzHpob7XAywe-TbK0mnA; idToken=eyJhbGciOiJub25lIn0.eyJzdWIiOiJjZWEyZGI5YS1kZjM5LTQxYjgtOWFjNy03ODQ1NDg1NDdkMjkiLCJpc3MiOiJNSTYiLCJleHAiOjE2MjU1MTYyODUsImlhdCI6MTYyNTQyOTg4NSwiYXNzIjoiTCIsInN1dCI6IkciLCJjbGkiOiJlY29tLXdlYi0xLjAuMCIsInBybyI6eyJmbiI6bnVsbCwiZW0iOm51bGwsInBoIjpmYWxzZSwibGVkIjpudWxsLCJsdHkiOmZhbHNlfX0.; refreshToken=agmOLGGKNDgEjahQqKcGuF8zhjVZgTGkx4C1Bw-MMImGAFqXEqT9EbHV2zenSvdc2zy-ItbngEUKzZeZVaWPhg'
    // }
  }

  getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  initWS() {
    this.WebsocketServer.on('connection', function connection(ws) {
      ws.on('message', function incoming(message) {
        console.log('received: %s', message);
        message = JSON.parse(message);
        if (message.type === 'headers') {
          this.currentHeaders = message.headers;
          this.updated = true;
          console.log(`\n ${this.currentHeaders} \n`);
        }
      });
      // ws.send('something');
    });
  }

  formatProxy(proxy) {
    if (proxy === null) return;
    const [ip, portNumber, user, password] = proxy.split(':');
    if (user === undefined || password === undefined) {
      this.ip = ip;
      this.port = portNumber;
      this.proxyFormatted = `http://${this.ip}:${this.port}`;
    } else {
      this.ip = ip;
      this.port = portNumber;
      this.user = user;
      this.password = password;
      this.proxyFormatted = `http://${this.user}:${this.password}@${this.ip}:${this.port}`;
    }
  }

  stop() {
    this.sendStatus('Stopped');
    this.cancelled = true;
  }

  async initialize() {
    // this.requestClient = await initClient({ port:9120 })
    this.sessionStatus('Awaiting Browser Login');
    await this.loginIn();
    // this.headersEmitter.on("Headers", async () => {
    //   console.log('Starting')
    //   await this.initialGet();
    //   await this.clientTokens();
    //   // await this.getTokens()
    //   // // await this.getTokens2()
    //   await this.login();
    //   await this.loginTokens();
    //   await this.authorizationTokens();
    // })
    // await this.loginIn();
    // await this.getHeaders();
    // await this.close()
  }

  async startProcess() {
    console.log('Starting');
    this.formatProxy(this.proxy);
    await this.initialGet();
    await this.clientTokens();
    await this.getTokens();
    await this.getTokens2();
    await this.login();
    await this.loginTokens();
    await this.authorizationTokens();
  }

  async getAccountInfo() {
    const accounts = this.store.get('accounts.target');
    try {
      this.accountInfo = accounts.filter(
        (item) => item.id === this.info.account
      )[0];
      this.ip = this.accountInfo.proxy?.split(':')[0];
      this.port = this.accountInfo.proxy?.split(':')[1];
      this.user = this.accountInfo.proxy?.split(':')[2];
      this.password = this.accountInfo.proxy?.split(':')[3];
    } catch (e) {
      this.sessionStatus('Account not found');
      throw new Error('Account not found');
    }
  }

  async loginIn() {
    if (this.info.proxy) {
      this.browser = await puppeteer.launch({
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-web-security',
        ],
        executablePath: chromePaths.chrome,
        headless: false,
        proxy: {
          server: `http://${this.ip}:${this.port}`,
          username: this.user,
          password: this.password,
        },
      });
    } else {
      this.browser = await puppeteer.launch({
        executablePath: chromePaths.chrome,
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-web-security',
        ],
        headless: false,
      });
    }

    this.page = await this.browser.newPage();
    this.page.setUserAgent(this.userAgent);
    await this.page.setRequestInterception(true);
    this.page.on('request', async (interceptedRequest) => {
      if (
        interceptedRequest.url.indexOf(
          'https://gsp.target.com/gsp/authentications/v2/accounts?client_id=ecom-web-1.0.0'
        ) > -1
      ) {
        if (interceptedRequest.method !== 'OPTIONS') {
          console.log(interceptedRequest.headers);
          this.currentHeaders = interceptedRequest.headers;
          interceptedRequest.abort();
          this.browser.close();
          await this.startProcess();
        } else {
          interceptedRequest.abort();
        }
      } else interceptedRequest.continue();
    });

    this.page.goto(
      'https://www.target.com/co-login?shouldMergeCart=false&redirectToStep=PRECHECKOUT',
      {
        waitUntil: 'networkidle2',
      }
    );

    await this.page
      .evaluate(`data = {"firstname":"Pogar","lastname":"Soaso","username":"randomusername1923411@gmail.com","password":"2138mdma9a123!","clientId":"ecom-web-1.0.0","keep_me_signed_in":true,"device_info":{"user_agent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36","language":"en-US","color_depth":"24","device_memory":"8","pixel_ratio":"unknown","hardware_concurrency":"8","resolution":"[1920,1080]","available_resolution":"[1707,1067]","timezone_offset":"240","session_storage":"1","local_storage":"1","indexed_db":"1","add_behavior":"unknown","open_database":"1","cpu_class":"unknown","navigator_platform":"Win32","do_not_track":"unknown","regular_plugins":"['Chrome PDF Plugin::Portable Document Format::application/x-google-chrome-pdf~pdf','Chrome PDF Viewer::::application/pdf~pdf','Native Client::::application/x-nacl~,application/x-pnacl~']","adblock":"false","has_lied_languages":"false","has_lied_resolution":"false","has_lied_os":"false","has_lied_browser":"false","touch_support":"[0,false,false]","js_fonts":"['Arial','Arial Black','Arial Narrow','Book Antiqua','Bookman Old Style','Calibri','Cambria','Cambria Math','Century','Century Gothic','Century Schoolbook','Comic Sans MS','Consolas','Courier','Courier New','Georgia','Helvetica','Impact','Lucida Bright','Lucida Calligraphy','Lucida Console','Lucida Fax','Lucida Handwriting','Lucida Sans','Lucida Sans Typewriter','Lucida Sans Unicode','Microsoft Sans Serif','Monotype Corsiva','MS Gothic','MS PGothic','MS Reference Sans Serif','MS Sans Serif','MS Serif','Palatino Linotype','Segoe Print','Segoe Script','Segoe UI','Segoe UI Light','Segoe UI Semibold','Segoe UI Symbol','Tahoma','Times','Times New Roman','Trebuchet MS','Verdana','Wingdings','Wingdings 2','Wingdings 3']","navigator_vendor":"Google Inc.","navigator_app_name":"Netscape","navigator_app_code_name":"Mozilla","navigator_app_version":"5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36","navigator_languages":"['en-US','en','zh-CN','zh']","navigator_cookies_enabled":"true","navigator_java_enabled":"false","visitor_id":"%s","tealeaf_id":"%s","webgl_vendor":"Google Inc. (Intel)~ANGLE (Intel, Intel(R) Iris(R) Plus Graphics Direct3D11 vs_5_0 ps_5_0, D3D11-27.20.100.9510)","browser_name":"Chrome","browser_version":"91.0.4472.124","cpu_architecture":"amd64","device_vendor":"Unknown","device_model":"Unknown","device_type":"Unknown","engine_name":"Blink","engine_version":"91.0.4472.124","os_name":"Windows","os_version":"10"}};
                xhr = new XMLHttpRequest();
                xhr.open("POST", "https://gsp.target.com/gsp/authentications/v2/accounts?client_id=ecom-web-1.0.0", true);
                xhr.setRequestHeader("Content-Type", "application/json");
                xhr.send(JSON.stringify(data));`);

    // this.target.webContents.session.webRequest.onHeadersReceived(
    //   urls,
    //   async (details, callback) => {
    //     if (details.method !== 'OPTIONS') {
    //       // @TODO store headers here
    //       this.sessionStatus('Got Shape Headers');
    //       console.log(this.currentHeaders);
    //       // this.headersEmitter.emit("Headers")
    //       await this.close();
    //       await this.startProcess();
    //     }
    //     callback({ cancel: details.method !== 'OPTIONS' });
    //   }
    // );

    // this.target.loadURL(
    //   'https://www.target.com/co-login?shouldMergeCart=false&redirectToStep=PRECHECKOUT',
    //   {
    //     userAgent:
    //       'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
    //   }
    // );

    this.page.on(
      'login',
      (event, authenticationResponseDetails, authInfo, callback) => {
        callback(this.user, this.password);
      }
    );
  }

  async getHeaders() {
    this.target.webContents
      .executeJavaScript(`data = {"firstname":"Pogar","lastname":"Soaso","username":"randomusername1923411@gmail.com","password":"2138mdma9a123!","clientId":"ecom-web-1.0.0","keep_me_signed_in":true,"device_info":{"user_agent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36","language":"en-US","color_depth":"24","device_memory":"8","pixel_ratio":"unknown","hardware_concurrency":"8","resolution":"[1920,1080]","available_resolution":"[1707,1067]","timezone_offset":"240","session_storage":"1","local_storage":"1","indexed_db":"1","add_behavior":"unknown","open_database":"1","cpu_class":"unknown","navigator_platform":"Win32","do_not_track":"unknown","regular_plugins":"['Chrome PDF Plugin::Portable Document Format::application/x-google-chrome-pdf~pdf','Chrome PDF Viewer::::application/pdf~pdf','Native Client::::application/x-nacl~,application/x-pnacl~']","adblock":"false","has_lied_languages":"false","has_lied_resolution":"false","has_lied_os":"false","has_lied_browser":"false","touch_support":"[0,false,false]","js_fonts":"['Arial','Arial Black','Arial Narrow','Book Antiqua','Bookman Old Style','Calibri','Cambria','Cambria Math','Century','Century Gothic','Century Schoolbook','Comic Sans MS','Consolas','Courier','Courier New','Georgia','Helvetica','Impact','Lucida Bright','Lucida Calligraphy','Lucida Console','Lucida Fax','Lucida Handwriting','Lucida Sans','Lucida Sans Typewriter','Lucida Sans Unicode','Microsoft Sans Serif','Monotype Corsiva','MS Gothic','MS PGothic','MS Reference Sans Serif','MS Sans Serif','MS Serif','Palatino Linotype','Segoe Print','Segoe Script','Segoe UI','Segoe UI Light','Segoe UI Semibold','Segoe UI Symbol','Tahoma','Times','Times New Roman','Trebuchet MS','Verdana','Wingdings','Wingdings 2','Wingdings 3']","navigator_vendor":"Google Inc.","navigator_app_name":"Netscape","navigator_app_code_name":"Mozilla","navigator_app_version":"5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36","navigator_languages":"['en-US','en','zh-CN','zh']","navigator_cookies_enabled":"true","navigator_java_enabled":"false","visitor_id":"%s","tealeaf_id":"%s","webgl_vendor":"Google Inc. (Intel)~ANGLE (Intel, Intel(R) Iris(R) Plus Graphics Direct3D11 vs_5_0 ps_5_0, D3D11-27.20.100.9510)","browser_name":"Chrome","browser_version":"91.0.4472.124","cpu_architecture":"amd64","device_vendor":"Unknown","device_model":"Unknown","device_type":"Unknown","engine_name":"Blink","engine_version":"91.0.4472.124","os_name":"Windows","os_version":"10"}};
                xhr = new XMLHttpRequest();
                xhr.open("POST", "https://gsp.target.com/gsp/authentications/v2/accounts?client_id=ecom-web-1.0.0", true);
                xhr.setRequestHeader("Content-Type", "application/json");
                xhr.send(JSON.stringify(data));`);
  }

  async close() {
    this.browser.close();
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
    console.log('Initial GET');
  }

  async clientTokens() {
    const clientTokens = await this.requestClient(
      'https://gsp.target.com/gsp/oauth_tokens/v2/client_tokens',
      {
        jar: this.cookieJar,
        proxy: this.proxy,
        headers: {
          accept: '*/*',
          'accept-encoding': 'gzip, deflate, br',
          'accept-language': 'en-US,en;q=0.9',
          'content-type': 'application/json',
          origin: 'https://www.target.com',
          referer: 'https://www.target.com/',
          'sec-fetch-dest': 'empty',
          'sec-fetch-mode': 'cors',
          'sec-fetch-site': 'same-site',
          'user-agent': this.userAgent,
          cookie: this.initCookie,
        },
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
            // tealeaf_id: '_Q4TfqUIM7cVKjSELOWAH0LHA8ZNfILa',
            timezone_offset: '240',
            touch_support: '[0,false,false]',
            user_agent:
              'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            // visitor_id: '017A5ED70134010098D6C0557DB31E1C',
            webgl_vendor:
              'Google Inc. (Intel)~ANGLE (Intel, Intel(R) Iris(R) Plus Graphics Direct3D11 vs_5_0 ps_5_0, D3D11-27.20.100.9510)',
            grant_type: 'authorization_code',
          },
        }),
      },
      'POST'
    );
    const responseJson = JSON.parse(clientTokens.body);
    console.log(responseJson);

    this.loginCookies += `accessToken=${responseJson.access_token}; `;
    this.accessToken = `accessToken=${responseJson.access_token}; `;
    this.loginCookies += `refreshToken=${responseJson.refresh_token}; `;
    this.loginCookies += `idToken=${responseJson.id_token}; `;
  }

  async getTokens() {
    try {
      const getTokens = await got.get(
        `https://gsp.target.com/gsp/authentications/v1/auth_codes?client_id=ecom-web-1.0.0&redirect_uri=https%3A%2F%2Fwww.target.com%2Faccount&acr=create_session_signin&state=${Date.now()}&assurance_level=M`,
        {
          cookieJar: this.cookieJar,
          proxy: this.proxy,
          rejectUnauthorized: false,
          headers: {
            accept:
              'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
            'accept-language': 'en-US,en;q=0.9',
            'sec-ch-ua':
              '" Not;A Brand";v="99", "Google Chrome";v="91", "Chromium";v="91"',
            'sec-ch-ua-mobile': '?0',
            'sec-fetch-dest': 'document',
            'sec-fetch-mode': 'navigate',
            'sec-fetch-site': 'same-site',
            'sec-fetch-user': '?1',
            'upgrade-insecure-requests': '1',
            referer: 'https://www.target.com/account',
            'user-agent': this.userAgent,
          },
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
    } catch (error) {
      console.log(this.cookieJar.getCookieStringSync('https://www.target.com'));
      // for (const cookie of error.headers["set-cookie"]) {
      //   if (cookie.indexOf("login-session") > -1) {
      //     this.login_session = `login-session=${cookie.split("=")[1].split(";")[0]};`;
      //     break;
      //   }
      // }
    }
  }

  async getTokens2() {
    const getTokens2 = await this.requestClient(
      'https://gsp.target.com/gsp/authentications/v1/session_validations',
      {
        proxy: this.proxy,
        headers: {
          accept:
            'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
          'accept-encoding': 'gzip, deflate, br',
          'accept-language': 'en-US,en;q=0.9',
          'sec-ch-ua':
            '"Google Chrome";v="89", "Chromium";v="89", ";Not A Brand";v="99"',
          'sec-ch-ua-mobile': '?0',
          'sec-fetch-dest': 'document',
          'sec-fetch-mode': 'navigate',
          'sec-fetch-site': 'none',
          'sec-fetch-user': '?1',
          'upgrade-insecure-requests': '1',
          'user-agent': this.userAgent,
        },
        jar: this.cookieJar,
      },
      'GET'
    );
  }

  async login() {
    this.sessionStatus('Signing in');
    // this.cookieJar.setCookieSync(this.login_session, 'https://www.target.com/')

    const headers = {
      'user-agent': this.userAgent,
      'content-type': 'application/json',
      accept: 'application/json',
      'accept-encoding': 'gzip, deflate, br',
      origin: 'https://login.target.com',
      'sec-ch-ua':
        '"Google Chrome";v="89", "Chromium";v="89", ";Not A Brand";v="99"',
      'sec-fetch-site': 'same-site',
      'sec-fetch-mode': 'cors',
      'sec-fetch-dest': 'empty',
      referer:
        'https://login.target.com/gsp/static/v1/login/?client_id=ecom-web-1.0.0&ui_namespace=ui-default&back_button_action=browser',
      'accept-language': 'en-US,en;q=0.9',
      'X-GyJwza5Z-a': this.currentHeaders['X-GyJwza5Z-a'],
      'X-GyJwza5Z-a0': this.currentHeaders['X-GyJwza5Z-a0'],
      'X-GyJwza5Z-b': this.currentHeaders['X-GyJwza5Z-b'],
      'X-GyJwza5Z-c': this.currentHeaders['X-GyJwza5Z-c'],
      'X-GyJwza5Z-d': this.currentHeaders['X-GyJwza5Z-d'],
      'X-GyJwza5Z-f': this.currentHeaders['X-GyJwza5Z-f'],
      'X-GyJwza5Z-z': this.currentHeaders['X-GyJwza5Z-z'],
      'x-username': this.email,
    };

    this.currentHeaders['X-GyJwza5Z-a0'] &&
      (headers['X-GyJwza5Z-a0'] = this.currentHeaders['X-GyJwza5Z-a0']);
    const login = await this.requestClient(
      'https://gsp.target.com/gsp/authentications/v1/credential_validations?client_id=ecom-web-1.0.0',
      {
        proxy: this.proxy,
        headers,
        jar: this.cookieJar,
        body: JSON.stringify({
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
            tealeaf_id: '_Q4TfqUIM7cVKjSELOWAH0LHA8ZNfILa',
            timezone_offset: '240',
            touch_support: '[0,false,false]',
            user_agent:
              'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            visitor_id: '017A5ED70134010098D6C0557DB31E1C',
            webgl_vendor:
              'Google Inc. (Intel)~ANGLE (Intel, Intel(R) Iris(R) Plus Graphics Direct3D11 vs_5_0 ps_5_0, D3D11-27.20.100.9510)',
          },
          keep_me_signed_in: true,
          password: this.password,
          username: this.email,
        }),
      },
      'POST'
    );
  }

  async loginTokens() {
    try {
      const response = await got.get(
        'https://gsp.target.com/gsp/authentications/v1/auth_codes?client_id=ecom-web-1.0.0&keep_me_signed_in=true',
        {
          agent: {
            https: new HttpsProxyAgent({
              keepAlive: true,
              keepAliveMsecs: 1000,
              maxSockets: 256,
              maxFreeSockets: 256,
              proxy: this.proxyFormatted,
            }),
          },
          rejectUnauthorized: false,
          headers: {
            accept:
              'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
            'accept-language': 'en-US,en;q=0.9',
            'sec-ch-ua':
              '" Not;A Brand";v="99", "Google Chrome";v="91", "Chromium";v="91"',
            'sec-ch-ua-mobile': '?0',
            'sec-fetch-dest': 'document',
            'sec-fetch-mode': 'navigate',
            'sec-fetch-site': 'same-site',
            'sec-fetch-user': '?1',
            'upgrade-insecure-requests': '1',
            'user-agent': this.userAgent,
            referer:
              'https://login.target.com/gsp/static/v1/login/?client_id=ecom-web-1.0.0&ui_namespace=ui-default&back_button_action=browser&keep_me_signed_in=true&kmsi_default=false&actions=create_session_signin',
          },
          cookieJar: this.cookieJar,
        }
      );

      this.loginID = response.headers.location.split('?code=')[1].split('&')[0];
      console.log(this.loginID);
    } catch (error) {
      this.loginID = error.response.headers.location
        .split('?code=')[1]
        .split('&')[0];
      console.log(this.loginID);
    }
  }

  async authorizationTokens() {
    this.sessionStatus('Verifying Login');
    const authorizationTokens = await this.requestClient(
      'https://gsp.target.com/gsp/oauth_tokens/v2/client_tokens',
      {
        proxy: this.proxy,
        headers: {
          accept: '*/*',
          'accept-encoding': 'gzip, deflate, br',
          'accept-language': 'en-US,en;q=0.9',
          'content-type': 'application/json',
          origin: 'https://www.target.com',
          referer: 'https://www.target.com/',
          'sec-fetch-dest': 'empty',
          'sec-fetch-mode': 'cors',
          'sec-fetch-site': 'same-site',
          'user-agent': this.userAgent,
        },
        jar: this.cookieJar,
        body: JSON.stringify({
          grant_type: 'authorization_code',
          client_credential: {
            client_id: 'ecom-web-1.0.0',
          },
          code: this.loginID,
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
            tealeaf_id: '_Q4TfqUIM7cVKjSELOWAH0LHA8ZNfILa',
            timezone_offset: '240',
            touch_support: '[0,false,false]',
            user_agent:
              'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            visitor_id: '017A5ED70134010098D6C0557DB31E1C',
            webgl_vendor:
              'Google Inc. (Intel)~ANGLE (Intel, Intel(R) Iris(R) Plus Graphics Direct3D11 vs_5_0 ps_5_0, D3D11-27.20.100.9510)',
          },
          merge: 'cart',
        }),
      },
      'POST'
    );

    const responseJSON = JSON.parse(authorizationTokens.body);
    this.sessionStatus('Logged in');
    this.accessToken = responseJSON.access_token;
    this.idToken = responseJSON.id_token;
    this.refreshToken = responseJSON.refresh_token;
    // this.requestClient.exit()
    this.updated = false;
    const original = this.store.get(`sessions.target.${this.info.id}`);
    this.cookiesArray = [];
    for (let i = 0; i < authorizationTokens.headers['Set-Cookie'].length; i++) {
      this.cookiesArray.push(
        authorizationTokens.headers['Set-Cookie'][i].split(';')[0]
      );
    }
    original.cookies = this.cookiesArray;
    this.store.set(`sessions.target.${this.info.id}`, original);
  }
}

module.exports = TargetLogin;
