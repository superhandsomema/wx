// pages/withdraw/withdraw.js
const config = require('../../config')
const md5 = require('../../utils/md5.js')
const statis = require('../../utils/statis')

// 获取应用实例
const app = getApp()

Page({
  /**
   * 页面的初始数据
   */

  data: {
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    userInfo: {},
    cont: {},
    key: '',
    hasUserInfo: false,
    money: 0,
    inputMoney: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(app.globalData)
    let curpage = this
    // 获取用户信息
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
      this.setData({
        key: md5.hexMD5(
          app.globalData.openid + 'd44e922afca54f801ba1b90b67760554'
        )
      })
      console.log(app.app.globalData)
    }
    // 获取用户信息 金额 助力列表 抽过的档位
    wx.request({
      url: app.getUrl('host2', 'api/getUserInfo'),
      data: {
        // openid: 'oBUor5P2k3Jqh7NWhZ1sfTO8tXTU',
        openid: app.globalData.openid,
        key: md5.hexMD5(
          app.globalData.openid + 'd44e922afca54f801ba1b90b67760554'
        )
      },
      success: function(res) {
        curpage.setData({
          money: res.data.data.cash
        })
      }
    })
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
  onPullDownRefresh: function() {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {},
  // 点击全部提现 输入框值变化
  moneyTx: function() {
    this.setData({
      inputMoney: this.data.money
    })
  },
  // 检查金额大小 并改变
  inputMoney: function(e) {
    if (e.detail.value > this.data.money) {
      this.setData({
        inputMoney: this.data.money
      })
    }
  },
  // 点击提现按钮
  openWithdraw: function() {
    statis.appAction({
      spot: 'WITHDRAW_TX'
    })
    if (this.data.money < 5) {
      wx.showModal({
        title: '温馨提示',
        content: '最低提现金额为5元，您的金额不足。'
      })
    }
  }
})
