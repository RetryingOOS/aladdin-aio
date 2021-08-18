/* eslint-disable consistent-return */
/* eslint-disable prefer-destructuring */
/* eslint-disable @typescript-eslint/no-useless-constructor */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-plusplus */
/* eslint-disable class-methods-use-this */
// Save Session Cookies
// const puppeteer = require('puppeteer');
const puppeteer = require('puppeteer-core');
const chromePaths = require('chrome-paths');
// puppeteer.use(extra_prefs())
// puppeteer.use(Stealth())
// puppeteer.use(require('puppeteer-extra-plugin-anonymize-ua')())

const Tasks = require('../../tasks');

class AmazonLogin extends Tasks {
  constructor(props) {
    super(props);
    // this.proxy = '45.66.117.7:3120:johnnie:stat';
  }

  async getAccountInfo() {
    const accounts = this.store.get('accounts.amazon');
    try {
      this.accountInfo = accounts.filter(
        (item) => item.id === this.info.account
      )[0];
      this.ip = this.accountInfo.proxy?.split(':')[0];
      this.port = this.accountInfo.proxy?.split(':')[1];
      this.user = this.accountInfo.proxy?.split(':')[2];
      this.password = this.accountInfo.proxy?.split(':')[3];
      console.log(this.accountInfo);
    } catch (e) {
      this.sessionStatus('Account not found');
      throw new Error('Account not found');
    }
  }

  async initialize() {
    await this.getAccountInfo();
    await this.siteLogin();
  }

  async siteLogin() {
    let browser;
    let page;
    try {
      try {
        if (this.info.proxy) {
          browser = await puppeteer.launch({
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
          browser = await puppeteer.launch({
            executablePath: chromePaths.chrome,
            args: [
              '--no-sandbox',
              '--disable-setuid-sandbox',
              '--disable-web-security',
            ],
            headless: false,
          });
        }
        // this.context = await this.browser.newContext({
        //   userAgent:
        //     'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        // });
        page = await browser.newPage();
      } catch (error) {
        console.log(error);
      }
      // if (profile.proxy.indexOf('http://' == -1)) {
      //     console.log('converting proxy: ' + profile.proxy)
      //     profile.proxy = await convertProxy(profile.proxy)
      //      // Removes taks proxy to use local host
      // } else if(profile.proxy.indexOf('http://' != -1)) {
      //     console.log('using existing proxy: ' + profile.proxy)
      //     await useProxy(page, profile.proxy); // Removes taks proxy to use local host
      // await useProxy(page, profile.proxy);
      // }
      try {
        await page.goto('https://www.amazon.com/account', {
          waitUntil: 'networkidle2',
        });
        await page.waitForSelector('#continue');
        await page.waitForSelector('#ap_email');
        await this.sleep(this.getRandomInt(200, 500));
        await page.type('#ap_email', this.accountInfo.email, {
          delay: Math.floor(Math.random() * 50 + 300),
        });
        await this.sleep(this.getRandomInt(200, 500));
        await page.keyboard.press('Enter');
        await page.waitForSelector('#ap_password');
        await this.sleep(this.getRandomInt(200, 500));
        await page.click('#ap_password');
        await this.sleep(this.getRandomInt(200, 500));
        await page.type('#ap_password', this.accountInfo.password, {
          delay: Math.floor(Math.random() * 50 + 300),
        });
        await this.sleep(this.getRandomInt(200, 500));
        await page.click(
          '#authportal-main-section > div:nth-child(2) > div > div > div > form > div > div:nth-child(7) > div > div > label > div > label > input[type=checkbox]'
        );
        await this.sleep(this.getRandomInt(200, 500));
        await page.keyboard.press('Enter');
      } catch (error) {
        console.log(error);
      }

      await page.waitForSelector('#paymentsHubHeaderSection', {
        timeout: 180000,
      });

      await page.goto(
        'https://www.amazon.com/cpe/yourpayments/settings/manageoneclick?ref_=ya_d_l_change_1_click',
        {
          waitUntil: 'networkidle2',
        }
      );

      if (
        page.evaluate(
          "!document.querySelector('#pmts-toggle-this-browser').checked"
        )
      ) {
        await page.click(
          'label[for="pmts-toggle-this-browser"] .a-switch-control'
        );
      }
      await this.sleep(this.getRandomInt(1000, 2000));

      await page.goto(
        'https://www.amazon.com/gp/cart/view.html?ref_=nav_cart',
        {
          waitUntil: 'networkidle2',
        }
      );
      await page.waitForSelector('#sc-retail-cart-container');
      await this.sleep(2500);

      const cookiesObject = await page.cookies();
      console.log(cookiesObject);
      const original = this.store.get(`sessions.amazon.${this.info.id}`);
      this.cookiesArray = [];

      let sid = false;
      for (const cookie of cookiesObject) {
        if (cookie.name === 'session-id') {
          sid = true;
        }
        this.cookiesArray.push({ name: cookie.name, value: cookie.value });
      }

      original.cookies = this.cookiesArray;
      this.store.set(`sessions.amazon.${this.info.id}`, original);

      await browser.close();
      this.sessionStatus('Success');
    } catch (error) {
      console.log(error);
      await browser.close();
      this.sessionStatus('Failed Amazon Sign In');
    }
  }
}

module.exports = AmazonLogin;

// async generateAccount(profile) {
//   try {
//     default_timeout = 10000; // 10 second timeout
//     try {
//       try {
//         browser = await firefox.launch({
//           executablePath: getChrome.path,
//           headless: false,
//           args: [
//             '--no-sandbox',
//             '--disable-setuid-sandbox',
//             '--window-size=1000,600',
//           ],
//           defaultViewport: null,
//         });
//         this.page = await browser.newthis.page();
//       } catch (error) {
//         console.log(error);
//         return {
//           status: 'failed-browser',
//         };
//       }
//       console.log(`Profile proxy: ${profile.proxy}`);
//       // if (profile.proxy.indexOf('http://' == -1)) {
//       //     console.log('converting proxy: ' + profile.proxy)
//       //     profile.proxy = await convertProxy(profile.proxy)
//       //      // Removes taks proxy to use local host
//       // } else if(profile.proxy.indexOf('http://' != -1)) {
//       //     console.log('using existing proxy: ' + profile.proxy)
//       //     await useProxy(this.page, profile.proxy); // Removes taks proxy to use local host
//       // await useProxy(this.page, profile.proxy);
//       // }
//       try {
//         if (!profile.proxy || profile.proxy == 'local') {
//           console.log(`Using local profile: ${profile.proxy}`);
//           profile.proxy = 'local';
//         } else if (profile.proxy.indexOf('//') != -1) {
//           console.log(`Profile using existing proxy: ${profile.proxy}`);
//           await useProxy(this.page, profile.proxy);
//         } else if (profile.proxy.indexOf('//') == -1) {
//           console.log(`Converting Proxy: ${profile.proxy}`);
//           profile.proxy = await convertProxy(profile.proxy);
//           console.log(`Converted Proxy: ${profile.proxy}`);
//           await useProxy(this.page, profile.proxy);
//         }
//       } catch (error) {
//         console.log(error);
//       }

//       await this.page.setUserAgent(
//         'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.114 Safari/537.36'
//       );
//       try {
//         await this.page.goto('https://www.amazon.com/account');
//         await this.page.waitForSelector('#createAccountSubmit');
//         await this.sleep(100);
//         await this.page.click('#createAccountSubmit');
//         await this.sleep(100);
//         await this.page.waitForSelector('#ap_email');
//         await this.sleep(100);
//         await this.page.type('#ap_email', profile.email);
//         await this.sleep(100);
//         await this.page.waitForSelector('#ap_password');
//         await this.page.type('#ap_password', profile.password);
//         await this.sleep(100);
//         await this.page.type('#ap_password_check', profile.password);
//       } catch (error) {
//         console.log(error);
//         return {
//           status: 'failed',
//         };
//       }

//       return {
//         status: 'success',
//         cookie: JSON.stringify(profile.cookiesObject),
//         cookieString: profile.cookieString,
//         sid: profile.sid,
//         proxy: profile.proxy,
//         type: profile.type,
//       };
//     } catch (error) {
//       console.log(error);
//       console.log('Profile could not log in');
//       await browser.close();
//       return {
//         status: 'failed',
//       };
//     }
//   } catch (error) {
//     console.log(error);
//   }
// }
