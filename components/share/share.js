const config = require('../../config')
const statis = require('../../utils/statis')
const application = require('../../common/application')
const share = require('../../common/share')
const md5 = require('../../utils/md5')
const dataLoader = require('../../common/dataLoader')
const app = getApp()

var canOnePointMove = false
var startPoint = {}
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    openFalse: {
      type: Boolean
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    isIphoneX: false,
    shareIcon1: config.shareIcon1,
    shareIcon2: config.shareIcon2,
    shareStatus: 0, //分享按钮状态
    top: 0,
    left: 0
  },
  ready() {
    this.isIPhoneX()
    this.getUserMessage()
    this.updateState()
  },
  /**
   * 组件的方法列表
   */
  methods: {
    // 是否是iPhone X
    isIPhoneX: function() {
      if (application.mobileModel()) {
        this.setData({
          isIphoneX: true
        })
      }
    },

    // 获取用户信息 金额 助力列表 抽过的档位
    getUserMessage: function() {
      let self = this
      let openId = application.getOpenId()
      dataLoader
        .request(
          'api/getUserInfo',
          {
            openid: openId,
            key: md5.hexMD5(openId + config.encryptStr)
          },
          'GET',
          true
        )
        .then(res => {
          // console.log(res, '获取用户信息 金额 助力列表 抽过的档位')
          if (res.data == null) return false
          let redType = false
          let cash = res.data && res.data.cash
          if (cash) app.globalData.cash = cash
          let shareNum = res.data && res.data.sharenum
          let prizeCount = res.prize && res.prize.length
          switch (true) {
            case shareNum >= 1 && shareNum < 3 && prizeCount < 1:
              redType = true
              break
            case shareNum >= 3 && shareNum < 8 && prizeCount < 2:
              redType = true
              break
            case shareNum >= 8 && shareNum < 15 && prizeCount < 3:
              redType = true
              break
            case shareNum >= 15 && prizeCount < 4:
              redType = true
              break
          }

          //通知页面刷新完毕
          this.triggerEvent('refresh')

          //通知父组件改变tabbar的红点状态
          if (redType) this.triggerEvent('action')
        })
    },

    //设置分享按钮显示状态
    updateState: function() {
      let self = this
      if (app.globalData.shareStatus.flag) {
        this.setData({
          shareStatus: share.getShareStatus()
        })
      } else {
        app.globalData.shareStatus.cb = function() {
          self.setData({
            shareStatus: share.getShareStatus()
          })
        }
      }
    },
    navigate: function() {
      statis.appAction({
        spot: 'RED_SHARE'
      })
      wx.navigateTo({
        url: '../wealth/wealth'
      })
    },

    touchStart: function(e) {
      startPoint = e.touches[0]
      canOnePointMove = true
    },
    touchMove: function(e) {
      let endPoint = e.touches[e.touches.length - 1]
      let translateX = endPoint.clientX - startPoint.clientX
      let translateY = endPoint.clientY - startPoint.clientY
      startPoint = endPoint
      let top = this.data.top + translateY
      let left = this.data.left + translateX

      this.setData({
        top,
        left
      })
    },
    touchEnd: function(e) {
      canOnePointMove = false
    }
  }
})
