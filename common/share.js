const config = require('../config')
const dataLoader = require('./dataLoader')
const statis = require('../utils/statis')

class Share {
  constructor() {
    this.shareStatus = null
    this.shareButtonList = [] //分享按钮的素材列表
    this.shareHelpList = [] //分享助力的素材列表
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new Share()
    }

    return this.instance
  }
  /**
   * 初始化设置分享素材列表，一般在APP启动时调用
   * @param shareStatus
   * @param shareList
   */
  init(shareStatus, shareList, that) {
    if (shareList['buttontype1']) {
      this.shareButtonList = shareList['buttontype1']
    }

    if (shareList['buttontype2']) {
      this.shareHelpList = shareList['buttontype2']
    }

    this.shareStatus = shareStatus
    //我的页面 红包
    that.globalData.hasRedBag = shareStatus

    that.globalData.shareStatus.flag = true

    if (that.globalData.shareStatus.cb) {
      that.globalData.shareStatus.cb()
    }
  }

  getShareStatus() {
    return this.shareStatus
  }

  getRandom(len) {
    return Math.floor(Math.random() * len)
  }
  /**
   * 随机获得的一个分享素材
   * @param type
   * @returns {{title: *, path: string, imageUrl: *}}
   */
  getRandomShare(type = 'button') {
    let shareConfig = [],
      shareObject = {}

    if (type === 'button') {
      shareConfig = this.shareButtonList
    } else {
      shareConfig = this.shareHelpList
    }
    if (shareConfig.length) {
      shareObject = shareConfig[this.getRandom(shareConfig.length)]
    }
    return {
      title: shareObject['title'],
      path: '/pages/index/index',
      imageUrl: shareObject['img']
    }
  }

  /**
   * 可以作为页面的分享的回调
   * @param options
   * @returns {{title: *, path: string, imageUrl: *}}
   */
  onShareAppMessage(options) {
    statis.appAction({
      spot: 'SHARE',
      targettype: 'page'
    })
    return this.getRandomShare()
  }
}

module.exports = Share.getInstance()
