//app.js

const config = require('./config')

const application = require('./common/application')

const statis = require('./utils/statis')

App({
  globalData: {
    apis: config.apiEnv(),
    //openid: null,
    userInfo: null,
    promote: '',
    //  scene: '',
    // appidd: '',
    appid: config.appId,
    is_check: 1,
    hasShareId: 0,
    hasRedBag: 0,
    hasAdvert: 0,
    shareList: config.shareList,
    shareId: '',
    nickName: '',
    gameId: '',
    pathUrl: '',
    support: false,
    shareTip: null,
    cash: '0.00',
    myGames: {
      flag: false,
      list: [], //我的游戏数据
      cb: null //我的游戏回调
    },
    infoReadyCallback: null,
    shareStatus: {
      flag: false,
      cb: null //分享回调
    }
  },
  onLaunch: function(options) {
    let time = new Date().getTime()
    console.log('app onLaunch time:' + time)

    console.log('version:' + config.version)
    console.log('options.query:')
    console.log(options, 'options')
    console.log('scene = ' + options.scene)
    //获取机型
    application.getSystemInfo()

    //解析参数
    application.parseQuery(options)

    //投递初始化日志
    statis.appAction({
      spot: 'INIT'
      //JSON.stringify(options.query)
    })

    //获取服务端配置
    application.getRemoteConfig(this)

    //用户登陆
    application.login(this)
  },
  onShow: function() {
    console.log(this.globalData)
    // console.log('app onShow time:' + new Date().getTime())
    statis.appAction({
      spot: 'ON_APP_SHOW'
    })
  },
  onHide: function() {
    //console.log('app onHide time:' + new Date().getTime())
    statis.appAction({
      spot: 'ON_APP_HIDE'
    })
  },
  onError: function(msg) {
    // console.log('app onError time:' + new Date().getTime())
    statis.appAction({
      spot: 'ON_APP_ERROR',
      errcode: msg
    })
  },

  getUrl: function(url, api = '') {
    return (
      this.globalData.apis[url] +
      api +
      '?v=' +
      config.version +
      '&pid=' +
      config.appId +
      '&promote=' +
      this.globalData.channel
    )
  }
})
