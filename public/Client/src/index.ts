/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable no-underscore-dangle */
/* eslint-disable prefer-promise-reject-errors */
/* eslint-disable no-empty */
/* eslint-disable guard-for-in */
/* eslint-disable no-restricted-syntax */
/* eslint-disable promise/param-names */
import { spawn, exec, ChildProcessWithoutNullStreams } from 'child_process';
import path from 'path';
import { EventEmitter } from 'events';
import { Server } from 'ws';
import { CookieJar } from 'tough-cookie';
import { nanoid } from 'nanoid';

const tough = require('tough-cookie');

export interface CycleTLSRequestOptions {
  headers?: {
    [key: string]: any;
  };
  cookies?: {
    [key: string]: any;
  };
  body?: string;
  ja3?: string;
  userAgent?: string;
  proxy?: string;
  headerOrder?: Array<string>;
  PHeaderOrder?: Array<string>;
  jar?: CookieJar;
  json?: Record<string, unknown>;
  fingerprint?: string;
}

const Fingerprints = [
  'CHROME_58',
  'CHROME_62',
  'CHROME_70',
  'CHROME_72',
  'CHROME_83',
  'CHROME_89',
  'CHROME_91',
  'FIREFOX_55',
  'FIREFOX_56',
  'FIREFOX_63',
  'FIREFOX_65',
  'IOS_11_1',
  'IOS_12_1',
  'IOS_13',
  'IOS_14',
];

export interface CycleTLSResponse {
  status: number;
  body: string;
  headers: {
    [key: string]: any;
  };
}

let child: ChildProcessWithoutNullStreams;

const cleanExit = (message?: string | Error) => {
  if (message) console.log(message);
  child.kill();
  process.exit();
};
process.on('SIGINT', () => cleanExit());
process.on('SIGTERM', () => cleanExit());

class Golang extends EventEmitter {
  server: Server;

  constructor(port: number, debug: boolean) {
    super();

    this.server = new Server({ port });

    let executableFilename;

    if (process.platform === 'win32') {
      executableFilename = 'index.exe';
    } else if (process.platform === 'linux') {
      executableFilename = 'index';
    } else if (process.platform === 'darwin') {
      executableFilename = 'index-mac';
    } else {
      cleanExit(new Error('Operating system not supported'));
    }

    child = spawn(path.join(__dirname, executableFilename).replace('app.asar', 'app.asar.unpacked'), {
      env: { WS_PORT: port.toString() },
      shell: true,
      windowsHide: true,
      execArgv: ['--max-http-header-size=80000000'],
    });

    child.stderr.on('data', (stderr) => {
      if (stderr.toString().includes('Request_Id_On_The_Left')) {
        const splitRequestIdAndError = stderr
          .toString()
          .split('Request_Id_On_The_Left');
        const [requestId, error] = splitRequestIdAndError;
        this.emit(requestId, { error: new Error(error) });
      } else {
        console.log(stderr.toString());
        // debug
        //   ? cleanExit(new Error(stderr))
        //   : cleanExit(new Error('Invalid JA3 hash. Exiting...'));
      }
    });

    this.server.on('connection', (ws) => {
      this.emit('ready');

      ws.on('message', (data: string) => {
        const message = JSON.parse(data);
        this.emit(message.RequestID, message.Response);
      });
    });
  }

  request(
    requestId: string,
    options: {
      [key: string]: any;
    }
  ) {
    [...this.server.clients][0].send(JSON.stringify({ requestId, options }));
  }

  exit() {
    this.server.close();
  }
}

const initCycleTLS = async (
  initOptions: {
    port?: number;
    debug?: boolean;
  } = {}
): Promise<{
  (
    url: string,
    options: CycleTLSRequestOptions,
    method?:
      | 'head'
      | 'get'
      | 'post'
      | 'put'
      | 'delete'
      | 'trace'
      | 'options'
      | 'connect'
      | 'patch'
  ): Promise<CycleTLSResponse>;
  head(url: string, options: CycleTLSRequestOptions): Promise<CycleTLSResponse>;
  get(url: string, options: CycleTLSRequestOptions): Promise<CycleTLSResponse>;
  post(url: string, options: CycleTLSRequestOptions): Promise<CycleTLSResponse>;
  put(url: string, options: CycleTLSRequestOptions): Promise<CycleTLSResponse>;
  delete(
    url: string,
    options: CycleTLSRequestOptions
  ): Promise<CycleTLSResponse>;
  trace(
    url: string,
    options: CycleTLSRequestOptions
  ): Promise<CycleTLSResponse>;
  options(
    url: string,
    options: CycleTLSRequestOptions
  ): Promise<CycleTLSResponse>;
  connect(
    url: string,
    options: CycleTLSRequestOptions
  ): Promise<CycleTLSResponse>;
  patch(
    url: string,
    options: CycleTLSRequestOptions
  ): Promise<CycleTLSResponse>;
}> => {
  return new Promise((resolveReady) => {
    let { port, debug } = initOptions;

    if (!port) port = 9119;
    if (!debug) debug = false;

    const instance = new Golang(port, debug);

    instance.on('ready', () => {
      const CycleTLS = (() => {
        const CycleTLS = async (
          url: string,
          options: CycleTLSRequestOptions,
          method:
            | 'head'
            | 'get'
            | 'post'
            | 'put'
            | 'delete'
            | 'trace'
            | 'options'
            | 'connect'
            | 'patch' = 'get'
        ): Promise<CycleTLSResponse> => {
          return new Promise((resolveRequest, rejectRequest) => {
            // const requestId = `${url}${Math.floor(Date.now() * Math.random())}`;
            const requestId = nanoid();

            function formatProxy(proxy: string) {
              const [ip, portNumber, user, password] = proxy.split(':');
              if (user === undefined || password === undefined) {
                return `http://${ip}:${portNumber}`;
              }
              return `http://${user}:${password}@${ip}:${portNumber}`;
            }

            if (!options.ja3)
              options.ja3 =
                '771,255-49195-49199-49196-49200-49171-49172-156-157-47-53,0-10-11-13,23-24,0';
            if (!options.body) options.body = '';
            if (!options.proxy) options.proxy = '';
            if (options.proxy) options.proxy = formatProxy(options.proxy);
            if (options.jar) {
              if (!options.headers.cookie) {
                options.headers.cookie = options.jar.getCookieStringSync(
                  new URL(url).origin
                );
              }
            }
            if (!options.userAgent)
              options.userAgent =
                'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.114 Safari/537.36';

            if (options.json) {
              options.body = JSON.stringify(options.json);
            }
            // if (!options.headerOrder) {
            //   options.headerOrder = [];
            //   for (const header in options.headers) {
            //     options.headerOrder.push(header);
            //   }
            // }

            // if (options.headerOrder) {
            //   console.log(options.headerOrder);
            // }

            instance.request(requestId, {
              url,
              ...options,
              method,
            });

            instance.once(requestId, (response) => {
              if (response.error)
                return rejectRequest(`Request Error - ${response.error}`);

              const { Status: status, Body: body, Headers: headers } = response;
              let Cookies;
              if (headers['Set-Cookie']) {
                headers['Set-Cookie'] = headers['Set-Cookie'].split('/,/');
                if (options.jar) {
                  // console.log('Cookie Jar is here \n');
                  // for (const cookies of headers['Set-Cookie']) {
                  //   try {
                  //     options.jar.setCookie(
                  //       cookies.toString(),
                  //       new URL(url).origin
                  //     );
                  //   } catch (e) {
                  //     console.log(e);
                  //   }
                  // }
                  if (headers['Set-Cookie'] instanceof Array)
                    Cookies = headers['Set-Cookie'].map(tough.Cookie.parse);
                  else
                    Cookies = [
                      tough.Cookie.parse(response.headers['Set-Cookie']),
                    ];
                  for (const cookiesCounter of Cookies) {
                    const urlOrigin = new URL(url).origin;
                    (urlOrigin.includes(cookiesCounter.cdomain()) ||
                      !cookiesCounter.cdomain()) &&
                      options.jar.setCookie(
                        cookiesCounter.toString(),
                        urlOrigin
                      );
                  }
                }
              }

              resolveRequest({
                status,
                body,
                headers,
              });
            });
          });
        };
        CycleTLS.head = (
          url: string,
          options: CycleTLSRequestOptions
        ): Promise<CycleTLSResponse> => {
          return CycleTLS(url, options, 'head');
        };
        CycleTLS.get = (
          url: string,
          options: CycleTLSRequestOptions
        ): Promise<CycleTLSResponse> => {
          return CycleTLS(url, options, 'get');
        };
        CycleTLS.post = (
          url: string,
          options: CycleTLSRequestOptions
        ): Promise<CycleTLSResponse> => {
          return CycleTLS(url, options, 'post');
        };
        CycleTLS.put = (
          url: string,
          options: CycleTLSRequestOptions
        ): Promise<CycleTLSResponse> => {
          return CycleTLS(url, options, 'put');
        };
        CycleTLS.delete = (
          url: string,
          options: CycleTLSRequestOptions
        ): Promise<CycleTLSResponse> => {
          return CycleTLS(url, options, 'delete');
        };
        CycleTLS.trace = (
          url: string,
          options: CycleTLSRequestOptions
        ): Promise<CycleTLSResponse> => {
          return CycleTLS(url, options, 'trace');
        };
        CycleTLS.options = (
          url: string,
          options: CycleTLSRequestOptions
        ): Promise<CycleTLSResponse> => {
          return CycleTLS(url, options, 'options');
        };
        CycleTLS.connect = (
          url: string,
          options: CycleTLSRequestOptions
        ): Promise<CycleTLSResponse> => {
          return CycleTLS(url, options, 'options');
        };
        CycleTLS.patch = (
          url: string,
          options: CycleTLSRequestOptions
        ): Promise<CycleTLSResponse> => {
          return CycleTLS(url, options, 'patch');
        };
        CycleTLS.exit = async (): Promise<undefined> => {
          if (process.platform === 'win32') {
            return new Promise((resolve, reject) => {
              exec(
                `taskkill /pid ${child.pid} /T /F`,
                (error: any, stdout: any, stderr: any) => {
                  if (error) {
                    console.warn(error);
                  }
                  instance.exit();
                  resolve(stdout || stderr);
                }
              );
            });
          }
          return new Promise((resolve, reject) => {
            process.kill(-child.pid);
            instance.exit();
          });
        };

        return CycleTLS;
      })();
      resolveReady(CycleTLS);
    });
  });
};

export default initCycleTLS;

// CommonJS support for default export
module.exports = initCycleTLS;
module.exports.default = initCycleTLS;
module.exports.__esModule = true;
