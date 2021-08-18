/* eslint-disable no-void */
/* eslint-disable prefer-destructuring */
/* eslint-disable no-constant-condition */
/* eslint-disable no-plusplus */
/* eslint-disable no-continue */
/* eslint-disable default-case */
/* eslint-disable valid-typeof */
/* eslint-disable no-empty */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-sequences */
/* eslint-disable guard-for-in */
/* eslint-disable no-param-reassign */
/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable global-require */

const defaults = {
    timeout: 15000,
    method: 'GET',
    headers: {},
    redirect: 'manual',
  };
  const uuid = require('uuid');
  const tough = require('tough-cookie');
  
  const formatProxy = (proxy) => {
    const proxyParts = proxy.split(':');
    return `${proxyParts[0]}:${proxyParts[1]}`;
  };
  
  const proxySessions = {};
  
  module.exports = (options) => {
    return new Promise((resolve, reject) => {
      try {
        const { net, session } = require('electron');
        let uuidPartition;
  
        proxySessions[options.proxy]
          ? (uuidPartition = proxySessions[options.proxy])
          : ((uuidPartition = session.fromPartition(uuid.v4())),
            options.proxy && options.proxy.length > 0
              ? uuidPartition.setProxy(
                  {
                    proxyRules: `http://${formatProxy(options.proxy)}`,
                  },
                  () => void 0
                )
              : uuidPartition.setProxy(
                  {
                    proxyRules: '',
                  },
                  () => void 0
                ),
            uuidPartition.webRequest.onBeforeSendHeaders((request, callback) => {
              (options.requestHeaders = options.headers),
                options.requestHeaders['x-referer'] &&
                  ((options.requestHeaders.referer =
                    options.requestHeaders['x-referer']),
                  delete options.requestHeaders['x-referer']),
                callback({
                  requestHeaders: options.requestHeaders,
                });
            }),
            (proxySessions[options.proxy] = uuidPartition));
  
        options = {
          ...defaults,
          ...options,
          url: options.url || options.uri,
          session: uuidPartition,
        };
  
        options.qs &&
          (options.url += `?${Object.entries(options.qs)
            .map(
              ([key, value]) =>
                `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
            )
            .join('&')}`);
  
        const netRequest = net.request(options);
  
        for (let headers in options.headers) {
          const header = options.headers[headers];
          headers.toLowerCase() === 'referer' && (headers = 'x-referer'),
            netRequest.setHeader(headers, header);
        }
  
        options.jar &&
          netRequest.setHeader(
            'Cookie',
            options.jar.getCookieString(options.url || options.uri)
          );
  
        options.body && netRequest.write(options.body);
  
        options.followRedirect === undefined &&
          options.method !== 'GET' &&
          (options.followRedirect = false);
        options.followAllRedirects && (options.followRedirect = true);
  
        if (options.form) {
          netRequest.setHeader(
            'Content-Type',
            'application/x-www-form-urlencoded'
          );
          const formData = Object.entries(options.form)
            .map(
              ([key, value]) =>
                `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
            )
            .join('&');
        }
  
        if (options.json) {
          // netRequest.setHeader('Content-Type', 'application/json');
          netRequest.write(JSON.stringify(options.json));
          console.log('here in json');
        }
  
        netRequest.on('error', (error) => {
          reject(error);
        });
  
        netRequest.on('login', (authInfo, callback) => {
          // const splitProxy = options.proxy
          //   .split('@')[0]
          //   .split('http://')[1]
          //   .split(':');
          const [ip, port, user, password] = options.proxy.split(':');
          callback(user, password);
        });
  
        let TaskURL = options.url;
        let DataString = '';
  
        setTimeout(() => {
          try {
            if (DataString.length === 0) {
              netRequest.abort();
            }
          } catch (err) {}
          reject(new Error('net::ERR_TIMED_OUT'));
        }, options.timeout);
  
        netRequest.on('response', async (response) => {
          if (options.jar && response.headers['set-cookie']) {
            let Cookies;
            if (response.headers['set-cookie'] instanceof Array)
              Cookies = response.headers['set-cookie'].map(tough.Cookie.parse);
            else Cookies = [tough.Cookie.parse(response.headers['set-cookie'])];
            for (const cookiesCounter of Cookies) {
              const urlOrigin = new URL(options.url).origin;
              (urlOrigin.includes(cookiesCounter.cdomain()) ||
                !cookiesCounter.cdomain()) &&
                options.jar.setCookie(cookiesCounter.toString(), urlOrigin);
            }
          }
  
          response.on('error', (error) => {
            reject(error);
          });
  
          response.on('data', (data) => {
            DataString += data.toString();
          });
  
          response.on('end', () => {
            const order = '3|1|2|4|0'.split('|');
            let counter = 0;
            while (true) {
              switch (order[counter++]) {
                case '0':
                  resolve({
                    statusCode: response.statusCode,
                    headers: response.headers,
                    body: DataString,
                    request: {
                      uri: {
                        href: TaskURL,
                      },
                    },
                  });
                  continue;
                case '1':
                  response.headers &&
                    response.headers.location &&
                    (response.headers.location = response.headers.location[0]);
                  continue;
                case '2':
                  netRequest.removeAllListeners();
                  continue;
                case '3':
                  if (options.json)
                    try {
                      DataString = JSON.parse(DataString);
                    } catch (error) {}
                  continue;
                case '4':
                  response.removeAllListeners();
                  continue;
              }
              break;
            }
          });
  
          netRequest.on(
            'redirect',
            (statusCode, method, redirectUrl, responseHeaders) => {
              if (options.followRedirect !== false)
                (TaskURL = redirectUrl), netRequest.followRedirect();
              else {
                responseHeaders.location &&
                  (responseHeaders.location = responseHeaders.location[0]);
                if (options.jar && responseHeaders['set-cookie']) {
                  let redirectCookies;
                  if (responseHeaders['set-cookie'] instanceof Array)
                    redirectCookies = responseHeaders['set-cookie'].map(
                      tough.Cookie.parse
                    );
                  else
                    redirectCookies = [
                      tough.Cookie.parse(responseHeaders['set-cookie']),
                    ];
                  for (const redirectCookie of redirectCookies) {
                    const redirectUrlOrigin = new URL(options.url).origin;
                    (redirectUrlOrigin.includes(redirectCookie.cdomain()) ||
                      !redirectCookie.cdomain()) &&
                      options.jar.setCookie(
                        redirectCookie.toString(),
                        redirectUrlOrigin
                      );
                  }
                }
  
                resolve({
                  statusCode,
                  headers: responseHeaders,
                  body: '',
                  request: {
                    uri: {
                      href: TaskURL,
                    },
                  },
                });
              }
            }
          );
        });
        uuidPartition.clearStorageData();
        uuidPartition.clearCache();
        netRequest.end();
      } catch (e) {
        console.trace(e);
        reject(new Error('Unknown connection error'));
      }
    });
  };
  