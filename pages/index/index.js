//index.js
const statis = require('../../utils/statis')
const share = require('../../common/share')
const PageBehavior = require('../../behaviors/pageBehavior')
const application = require('./../../common/application')
const dataLoader = require('./../../common/dataLoader')
//获取应用实例
const app = getApp()

Page({
  behaviors: [PageBehavior],

  data: {
    iphoneMoule: null,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    falseTrue: false,
    moduleData: null,
    //uploadWrapNum: 0,
    //vedioindex: null,
    //vedioCont: false,
    //ever: false,
    //hasUserInfo: false, //用户信息 顶部栏授权状态
    //redType: false,
    pageData: 1,
    // pageTrue: true,
    //list_tip: '数据更新中',
    //show_tip: false,
    //is_check: 0,
    load_time: 0,
    hide_time: 0,
    //dataLoaded: false,
    support: false,

    hasAdvert: app.globalData.hasAdvert,
    tabBarStatus: false // tabbar 状态
  },
  onReady: function() {
    let self = this
    var curTime = new Date().getTime()
    var loadTime = curTime - this.data.load_time

    statis.appAction({
      spot: 'ON_READY',
      duration: loadTime
      // systeminfo: curPage.data.iphoneMoule
    })
  },
  onShow: function() {
    let curTime = new Date().getTime()
    this.setData({
      hide_time: curTime
    })
    statis.appAction({
      spot: 'SHOW'
    })
  },
  onUnload: function() {
    let thisTime = new Date().getTime()
    let loadTime = thisTime - this.data.hide_time
    statis.appAction({
      spot: 'HIDE',
      target: loadTime,
      targettype: 'page'
    })
  },

  onLoad: function(options) {
    //查看是否有id和name参数如果有就跳转游戏详情页
    this.jumpDetails(options)
    var self = this
    var curTime = new Date().getTime()
    this.setData({
      load_time: curTime
    })

    this.getUserInfo()

    statis.appAction({
      spot: 'LOAD',
      targettype: 'page'
    })
    this.initData()
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {},

  //拉取首页数据
  initData: function(flag) {
    let self = this
    let page = 1
    dataLoader.load('api/getPageInfomake', page).then(res => {
      //先进首页然后根据跳转到其它页面
      application.directional(res)
      let moduleData = res.data
      self.setData({
        moduleData: moduleData,
        // dataLoaded: Boolean(res.app_fake_status),
        tabBarStatus: Boolean(res.app_fake_status)
      })
      // app.globalData.shareTip = function() {
      //     console.log(app.globalData.support, 'app.globalData.support')
      //     self.setData({
      //         support: app.globalData.support
      //     })
      // }
      // self.checkRedBagStatus()
      if (flag) wx.stopPullDownRefresh()
    })
  },

  //改变分享状态
  // checkRedBagStatus: function() {
  //   this.selectComponent('#share').updateState()
  // },

  //分享
  onShareAppMessage(options) {
    return share.onShareAppMessage()
  },

  //好友助力
  supportSuccess: function(e) {
    this.setData({
      support: false
    })
  },

  //获取游戏参数跳转到游戏详情页
  jumpDetails(options) {
    if (options.name && options.id) {
      let id = options.id
      let name = options.name
      wx.navigateTo({
        url: `../details/details?id=${id}&name=${name}`
      })
    }
  },

  //获取用户信息
  getUserInfo: function() {
    let self = this
    if (app.globalData.userInfo != null) {
      this.setUserInfo(app.globalData.userInfo)
    } else {
      if (this.data.canIUse) {
        app.globalData.infoReadyCallback = res => {
          self.setUserInfo(res.userInfo)
        }
      } else {
        // 在没有 open-type=getUserInfo 版本的兼容处理
        wx.getUserInfo({
          withCredentials: true,
          success: res => {
            self.setUserInfo(res.userInfo)
            statis.appAction({
              spot: 'ALLOW',
              targettype: 'clickable'
            })
          },
          fail: function() {
            statis.appAction({
              spot: 'DENY',
              targettype: 'clickable'
            })
          }
        })
      }
    }
  },

  //设置用户信息和顶部状态
  setUserInfo: function(userInfo) {
    app.globalData.userInfo = userInfo
  },

  //设置tabbar红点
  bridge() {
    this.selectComponent('#tabbar').onShowRed()
  },

  //上拉加载更多
  onReachBottom: function() {
    let page = this.data.pageData + 1
    if (this.data.moduleData.more) {
      //  this.initData11(this.data.pageData)
    } else {
      this.getContent(page)
    }
  },

  //下拉刷新
  onPullDownRefresh: function() {
    console.log('下拉刷新')
    this.setData({
      pageData: 1
    })
    this.initData(true)
  },

  // 上拉请求最后一个组件数据
  getContent: function(page) {
    let self = this
    let moduleData = this.data.moduleData
    let len = moduleData.length - 1
    if (moduleData[len].more) {
      dataLoader
        .load('api/pageparts', page, {
          type: moduleData[len].type,
          contentid: moduleData[len].contentid,
          onepage: moduleData[len].onepage
        })
        .then(res => {
          moduleData[len].arr = moduleData[len].arr.concat(res.data)
          moduleData[len].more = res.more
          self.setData({
            moduleData: moduleData,
            pageData: page + 1
          })
        })
    }
  },

  adLoad: function() {
    console.log('广告加载成功了')
  },
  adError: function() {
    console.log('广告加载失败了')
  },
  onClickAd: function() {
    console.log('广告加载失败了')
  }
})
