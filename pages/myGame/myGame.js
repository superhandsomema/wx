const dataLoader = require('./../../common/dataLoader')
const application = require('./../../common/application')
const config = require('./../../config')
// 获取应用实例
const app = getApp()

Page({
  /**
   * 页面的初始数据
   */
  data: {
    winHeight: 0,
    list: [],
    more: true,
    page: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.heightNow()
    this.getDatas()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {},
  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    this.userMessage()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  // onReachBottom: function() {

  // },
  getDatas: function() {
    let self = this
    let page = self.data.page
    if (self.data.more) {
      dataLoader
        .load('api/myplaygame', page + 1, {
          openid: application.getOpenId(),
          appid: config.appId
        })
        .then(res => {
          let more = res.more
          let list = res.data
          self.setData({
            list: self.data.list.concat(list),
            more,
            page: self.data.page + 1
          })
        })
    }
  },

  //设置高度
  heightNow: function() {
    let self = this
    wx.getSystemInfo({
      success: function(res) {
        let clientHeight = res.windowHeight,
          clientWidth = res.windowWidth,
          rpxR = 750 / clientWidth
        let winHeight = clientHeight * rpxR
        self.setData({
          winHeight
        })
      }
    })
  }
})
