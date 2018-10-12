const env = require('./env')
const icon = require('./shareIcon')
let config = env

config.hosts = {
  dev: {
    host: 'https://test.statis.niuqueyou.com/',
    host2: 'https://test.miniapp.niuqueyou.com/'
  },
  release: {
    host: 'https://statis.niuqueyou.com/',
    host2: 'https://miniapp.niuqueyou.com/'
  }
}

config = Object.assign(config, {
  env: 'dev', //dev或release，表示使用的接口是测试环境还是开发环境
  version: '1.1.8',

  apiHost(isOld = false) {
    let hosts = config.hosts[config.env]

    if (isOld) {
      return hosts.host2
    } else {
      return hosts.host
    }
  },
  apiEnv() {
    if (config.env === 'dev') {
      return config.hosts.dev
    } else {
      return config.hosts.release
    }
  },

  retryForLog: 3, //当统计投递失败时，立刻重试的次数
  ad_banner: 'xm655e7b21dbe31ef932d4d9a67ad54b',
  ad_insert: '',
  ad_fixed: '',
  encryptStr: 'd44e922afca54f801ba1b90b67760554'
})

config['shareIcon1'] = icon['shareIcon1']

config['shareIcon2'] = icon['shareIcon2']
console.log('config', config)
module.exports = config
