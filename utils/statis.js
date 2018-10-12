const util = require('./util.js')
// const app = getApp();
const config = require('../config')
class Statis {
  constructor() {
    this.instance = null
    this.scene = null
    this.promote = null
    this.openId = null
    // this.reqData = {
    //     promote: '', //渠道
    //     unionid: '', //用户唯一ID
    //     spot: '', //数据点
    //     openid: '',
    //     scene: '', //
    //     targettype: '',
    //     systeminfo: '',
    //     subject: '',
    //     src: '', //页面路径
    //     duration: '', //页面加载时间
    //     nickname: '',
    //     sex: '',
    //     province: '',
    //     city: '',
    //     headimgurl: '',
    //     target_app_id: '', //关联的小游戏
    //     appid: '',
    //     source: '',
    //     target: '',
    //     nonce: '',
    //     ts: '', //时间
    //     source_openid: '', //分享人的ID
    //     sign: '',
    //     errcode: '',
    //     retry_times: 0,
    //     req_time_first: '',
    //     req_time_cur: 0
    // }
  }
  /**
   * 获取当前页面
   * @returns {string}
   */
  getCurrentPage() {
    let currentPages = getCurrentPages()
    if (currentPages.length) {
      return currentPages[currentPages.length - 1].route
    }
    return 'none'
  }

  /**
   * 获取参数
   * @param {string}
   * @returns {string}
   */
  getParam(param) {
    if (this[param] == null) {
      let value = wx.getStorageSync(param)
      this[param] = value ? value : ''
    }
    return this[param]
  }
  /**
   * 统计的能用参数
   * @returns {{scene: string, pid: *, promote: string, openid: null, src: string}}
   */
  getCommonParams() {
    let appid = config.appId,
      v = config.version
    return {
      v,
      appid,
      scene: this.getParam('scene'),
      promote: this.getParam('promote'),
      openid: this.getParam('openId'),
      src: this.getCurrentPage()
    }
  }

  /**
   * 发出统计请求
   * @param data
   * @param retryTimes
   */
  request(data, retryTimes = 0) {
    let self = this

    data = Object.assign(data, this.getCommonParams())
    wx.request({
      url: config.apiHost() + 'api/newLogs',
      data,
      method: 'GET',
      success(response) {
        if (response.data.code !== 200) {
          self.archive(data)
        }
      },
      fail: function() {
        console.error('https request fail: ' + retryTimes)
        if (retryTimes < config.retryForLog) {
          retryTimes++
          data['retry_times'] = retryTimes
          self.request(data, retryTimes)
        } else {
          self.archive(data)
        }
      }
    })
  }

  /**
   * 当投递失败时，归档在本地
   * @param data
   */
  archive(data) {
    let failLogs = wx.getStorageSync('failLogs')

    if (!(failLogs instanceof Array)) {
      failLogs = []
    }

    failLogs.push(data)
  }

  /**
   * 点击游戏的统计
   * @param game
   * @param subject
   */
  clickGame(game, subject, spot) {
    let targetType = 0

    switch (game.g_type) {
      case 1:
        targetType = 'game'
        break
      case 2:
        targetType = 'qrcode'
        break
      case 3:
        targetType = 'h5'
        break
    }

    let data = {
      spot: spot || 'CLICK',
      targettype: targetType,
      target: game.id,
      subject: subject,
      target_app_id: game.appid
    }

    this.request(data)
  }

  /**
   * 点击文章
   * @param article
   * @param subject
   */
  clickArticle(article, subject) {
    this.request({
      spot: 'CLICK',
      targettype: 'article',
      target: article.article_id,
      subject: subject
    })
  }

  /**
   * 整个APP的行为
   * @param {object} data
   */
  appAction(data = {}) {
    let statisData = Object.assign(
      {
        target: 'app',
        targettype: 'app'
      },
      data
    )

    this.request(statisData)
  }

  clickAd(ad) {
    this.request({
      spot: 'CLICK',
      targettype: 'ad',
      target: ad.contentid
    })
  }
}

module.exports = new Statis()
