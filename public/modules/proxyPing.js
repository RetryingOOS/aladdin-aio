/* eslint-disable class-methods-use-this */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-useless-constructor */
const Tasks = require('../tasks');

class ProxyPing extends Tasks {
  constructor(config) {
    super(config);
  }

  async initialize() {
    await this.ping();
  }

  async ping() {
    const firstTime = process.hrtime();
    console.log(`[${this.id}] Pinging... ${this.proxy}`);
    const req = await this.requestClient(
      'https://kith.com/',
      {
        headers: {
          'user-agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 Safari/537.36',
        },
        proxy: this.proxy,
      },
      'GET'
    );
    const lastTime = process.hrtime(firstTime);
    const time = this.getProcessingTimeInMS(lastTime);
    this.sendPing([{ id: this.id, groupID: this.groupID, ping: time }]);
    await this.changeSpeed(time);
    return time;
  }

  async changeSpeed(speed) {
    const original = this.store.get(
      `proxies.${this.groupID}.proxies.${this.id}`
    );
    original.speed = speed;
    this.store.set(`proxies.${this.groupID}.proxies.${this.id}`, original);
  }

  getProcessingTimeInMS(time) {
    return Math.round(time[0] * 1000 + time[1] / 1e6);
  }
}

module.exports = ProxyPing;
