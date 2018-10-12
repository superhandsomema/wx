// pages/newRank/newRank.js
const dataLoader = require('../../common/dataLoader')
const statis = require('../../utils/statis')
const share = require('../../common/share')
let timer = null
let app = getApp()

Page({
  /**
   * 页面的初始数据
   */
  data: {
    components: [],
    openFalse: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.initData()
    //this.selectComponent('#share').updateState()
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
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    if (timer) return false
    this.initData(true)
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function(res) {
    return share.onShareAppMessage()
  },

  initData: function(refresh) {
    let self = this
    timer = true
    dataLoader.load('api/getPageInfomake', 1).then(data => {
      self.setData({
        components: data.data
      })
      if (refresh) {
        timer = null
        wx.stopPullDownRefresh()
      }
    })
  }
})
