// pages/about.js
const config = require('../../config')
const md5 = require('../../utils/md5.js')

const share = require('../../common/share')
const statis = require('../../utils/statis')
//下拉刷新限制
let timer = null

// 获取应用实例
const app = getApp()

Page({
  /**
   * 页面的初始数据
   */
  data: {
    load_time: 0,
    hide_time: 0,
    falseTrue: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    userInfo: {},
    shareIcon: '../../resources/images/share1.png',
    cash: app.globalData.cash,
    key: '',
    hasUserInfo: false,
    redType: false,
    hasRedBag: app.globalData.hasRedBag,
    myGames: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var curTime = new Date().getTime()
    this.setData({
      load_time: curTime
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    this.checkRedBagStatus()
    var curTime = new Date().getTime()
    var loadTime = curTime - this.data.load_time
    statis.appAction({
      spot: 'READY',
      target: loadTime
      //systeminfo: this.data.iphoneMoule
    })
  },

  checkRedBagStatus: function() {
    this.setData({
      hasRedBag: app.globalData.hasRedBag
    })
    this.selectComponent('#share').updateState()
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    let curTime = new Date().getTime()
    this.setData({
      hide_time: curTime
    })
    statis.appAction({
      spot: 'SHOW'
    })
  },
  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {
    let thisTime = new Date().getTime()
    let loadTime = thisTime - this.data.hide_time
    statis.appAction({
      spot: 'HIDE',
      target: loadTime
    })
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    if (timer) return false
    this.selectComponent('#share').getUserMessage()
    timer = setTimeout(() => {
      wx.stopPullDownRefresh()
      timer = null
    }, 2000)
  },
  refresh: function() {
    this.setData({
      cash: app.globalData.cash
    })
    wx.stopPullDownRefresh()
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {
    return share.onShareAppMessage()
  },

  // 推荐跳转财富页面
  wealthOpen: function() {
    wx.navigateTo({
      url: '../wealth/wealth',
      success: function(res) {
        statis.appAction({
          spot: 'ABOUT_WEALTH'
        })
      },
      fail: function(res) {},
      complete: function(res) {}
    })
  },
  // 点击提现跳转提现页面
  moneyOpen: function() {
    wx.navigateTo({
      url: '../withdraw/withdraw',
      success: function(res) {
        statis.appAction({
          spot: 'ABOUT_WITHDRAW'
        })
      },
      fail: function(res) {},
      complete: function(res) {}
    })
  }
})
