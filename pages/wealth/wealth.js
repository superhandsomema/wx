// pages/wealth.js

const config = require('../../config')
const md5 = require('../../utils/md5.js')
const util = require('../../utils/util')
const common = require('../../common/common')
const application = require('../../common/application')
const statis = require('../../utils/statis')
const app = getApp()

Page({
  /**
   * 页面的初始数据
   */
  data: {
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    redPacket: false,
    redPacket1: false,
    userInfo: {},
    redPacketNum: 0,
    hasUserInfo: false,
    gearMoney: [],
    progressBar: 0,
    itemMoney: [
      {
        imgBig: false,
        num: 1,
        imgTrue: true,
        money: 0
      },
      {
        imgBig: false,
        num: 3,
        imgTrue: true,
        money: 0
      },
      {
        imgBig: false,
        num: 8,
        imgTrue: true,
        money: 0
      },
      {
        imgBig: false,
        num: 15,
        imgTrue: true,
        money: 0
      }
    ],
    friends: [], // 好友助力列表
    moneyNumPrize: [], //是否拆过可以拆的红包啦
    moneyNum: 0, //拆红包请求后台红包钱数
    key: '',
    userlist: [],
    cont: {
      cash: '0.00',
      sharenum: 0
    },
    appName: config.appName
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let curPage = this

    if (app.globalData.userInfo) {
      this.onGetUserInfo(app.globalData.userInfo)
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        curPage.onGetUserInfo(res.userInfo)
        curPage.setData({
          userInfo: res.userInfo
        })
        // console.log(res.userInfo)
        // this.onGetUserRawData(res.rawData)
        this.onGetUserInfo(res.userInfo)
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        withCredentials: true,
        success: res => {
          this.onGetUserInfo(res.userInfo)
          console.log(res)
        },
        fail: function() {}
      })
    }
    this.setData({
      key: md5.hexMD5(
        app.globalData.openid + 'd44e922afca54f801ba1b90b67760554'
      )
      // key: md5.hexMD5('oBUor5P2k3Jqh7NWhZ1sfTO8tXTUd44e922afca54f801ba1b90b67760554')
    })

    // 获取红包档位

    wx.request({
      url: app.getUrl('host2', 'api/prizeType'),
      success: function(res) {
        console.log(res.data)
        curPage.setData({
          gearMoney: res.data
        })
        console.log(curPage.data.gearMoney)
      }
    })
    curPage.getusermessage()
  },
  onGetUserInfo: function(userInfo) {
    app.globalData.userInfo = userInfo
    this.setData({
      userInfo: userInfo,
      hasUserInfo: true
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
  onPullDownRefresh: function() {
    this.getusermessage()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {},

  // 获取用户信息 金额 助力列表 抽过的档位
  getusermessage: function() {
    let curPage = this
    let openId = application.getOpenId()
    wx.request({
      url: app.getUrl('host2', 'api/getUserInfo'),
      data: {
        openid: openId,
        key: this.data.key
      },
      success: function(res) {
        console.log(res.data)
        if (res.data != null) {
          let progressBar = 0
          let moneyNumPrize = res.data.prize
          if (!moneyNumPrize) return false
          let itemMoney1 = curPage.data.itemMoney

          if (res.data.data.sharenum == 0) {
            progressBar = 0
          } else if (res.data.data.sharenum == 1) {
            progressBar = 12
            itemMoney1[0].imgBig = true
          } else if (res.data.data.sharenum == 2) {
            progressBar = 25
            itemMoney1[0].imgBig = true
          } else if (res.data.data.sharenum == 3) {
            progressBar = 38
            itemMoney1[1].imgBig = true
          } else if (res.data.data.sharenum > 3 && res.data.data.sharenum < 8) {
            progressBar = 50
            itemMoney1[1].imgBig = true
          } else if (res.data.data.sharenum == 8) {
            progressBar = 62
            itemMoney1[2].imgBig = true
          } else if (
            res.data.data.sharenum > 8 &&
            res.data.data.sharenum < 15
          ) {
            progressBar = 75
            itemMoney1[2].imgBig = true
          } else if (res.data.data.sharenum >= 15) {
            progressBar = 100
            itemMoney1[3].imgBig = true
          }

          for (let a = 0; a < moneyNumPrize.length; a++) {
            if (parseInt(moneyNumPrize[a].type) == itemMoney1[a].num) {
              itemMoney1[a].imgTrue = false
              itemMoney1[a].money = moneyNumPrize[a].money
              itemMoney1[a].imgBig = false
            }
          }
          curPage.setData({
            friends: res.data.userlist,
            cont: res.data.data,
            progressBar: progressBar,
            moneyNumPrize: res.data.prize,
            itemMoney: itemMoney1
          })
          console.log(curPage.data.itemMoney)
          console.log(res.data.prize)
        }

        wx.stopPullDownRefresh()
      }
    })
  },

  // 点击红包图片出现动画
  clickenvelope: function(event) {
    statis.appAction({
      spot: 'WEALTH_RED' + event.currentTarget.dataset.index
      //src: 'pages/wealth/wealth',
    })

    let moneyTf = true
    let moneyNumPrize = this.data.moneyNumPrize
    for (let a = 0; a < moneyNumPrize.length; a++) {
      if (
        parseInt(moneyNumPrize[a].type) == event.currentTarget.dataset.index
      ) {
        moneyTf = false
      }
    }
    if (
      parseInt(this.data.cont.sharenum) >= event.currentTarget.dataset.index &&
      moneyTf == true
    ) {
      this.setData({
        redPacket: true,
        redPacketNum: event.currentTarget.dataset.index
      })
    } else {
      if (moneyTf) {
        wx.showModal({
          title: '温馨提示',
          content: '好友助力不足，邀请好友来助力'
        })
      } else {
        // wx.showModal({
        // 	title: '温馨提示',
        // 	content: '您已经领过了',
        // })

        let curPage = this
        let idNum = 0

        switch (event.currentTarget.dataset.index) {
          case 1:
            idNum = 0
            break
          case 3:
            idNum = 1
            break
          case 8:
            idNum = 2
            break
          case 15:
            idNum = 3
            break
        }
        let moneyNum = curPage.data.itemMoney[idNum].money
        curPage.setData({
          moneyNum: moneyNum,
          redPacket1: true
        })
      }
    }

    console.log(event)
  },
  // 点击拆红包获取后台数据
  redPacket: function() {
    let curPage = this
    curPage.setData({
      redPacket: false,
      redPacket1: true
    })
    wx.request({
      url: app.getUrl('host2', 'api/userPrize'),
      data: {
        openid: app.globalData.openid,
        key: md5.hexMD5(
          app.globalData.openid +
            this.data.redPacketNum +
            'd44e922afca54f801ba1b90b67760554'
        ),
        type: this.data.redPacketNum
      },
      success: function(res) {
        curPage.setData({
          moneyNum: res.data.money
        })
        curPage.getusermessage()
      }
    })
  },
  // 关闭红包领取后页面
  redPacketClose: function() {
    let curPage = this
    console.log('dainjiguanbi')
    curPage.setData({
      redPacket1: false
    })
    curPage.getusermessage()
  },

  // 邀请好友前来助力传值后台
  onShareAppMessage: function(res) {
    return common.onShareAppMessage(
      res,
      app,
      this,
      'pages/wealth/wealth',
      'SHARE'
    )
  },
  // 点击提现跳转提现页面
  moneyOpen: function() {
    wx.navigateTo({
      url: '../withdraw/withdraw',
      success: function(res) {
        statis.appAction({
          spot: 'WEALTH_WITHRAW'
          // src: 'pages/wealth/wealth'
        })
      },
      fail: function(res) {},
      complete: function(res) {}
    })
  }
})
