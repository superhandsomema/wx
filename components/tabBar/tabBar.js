// components/share.js
const statis = require('../../utils/statis')
const app = getApp()
const application = require('../../common/application')
const share = require('../../common/share')
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    innerIndex: {
      type: Number,
      value: 0
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    hdian: false,
    isIphoneX: false,
    tabBar: [
      {
        id: 0,
        text: '发现',
        iconPath: '/resources/images/icon101.png',
        selectedIconPath: '/resources/images/icon102.png',
        trueType: false,
        spot: 'OPEN_INDEX',
        url: '/pages/index/index'
      },
      //  {
      //   id: 1,
      //   text: '游戏',
      //   iconPath: '/resources/images/icon201.png',
      //   selectedIconPath: '/resources/images/icon202.png',
      //   trueType: false
      // 	},
      {
        id: 1,
        text: '排行榜',
        iconPath: '/resources/images/ranking101.png',
        selectedIconPath: '/resources/images/ranking102.png',
        trueType: false,
        spot: 'OPEN_RANKING',
        url: '/pages/newRank/newRank'
      },
      {
        id: 2,
        text: '我的',
        iconPath: '/resources/images/icon301.png',
        selectedIconPath: '/resources/images/icon302.png',
        trueType: true,
        spot: 'OPEN_ABOUT',
        url: '/pages/about/about'
      }
    ]
  },
  ready() {
    this.isIPhoneX()
  },
  /**
   * 组件的方法列表
   */
  methods: {
    // 引用页面触发信息
    onMyEvent: function() {
      console.log('about页面引用了')
    },
    //设置红点
    onShowRed: function() {
      if (share.getShareStatus() == 2) {
        this.setData({
          hdian: true
        })
      }
    },
    // 是否是iPhone X
    isIPhoneX: function() {
      if (application.mobileModel()) {
        this.setData({
          isIphoneX: true
        })
      }
    },

    // 点击下方tabBar，切换页面
    clickBar: function(event) {
      let tabBar = this.data.tabBar
      let index = event.currentTarget.dataset.index

      statis.appAction({
        spot: tabBar[index].spot
      })


      wx.redirectTo({
        url: tabBar[index].url
      })

      // this.setData({
      //     tabBar: tabBar1
      // })
    },
    //按钮获取用户信息
    clickGetUserInfo: function(e) {
      if (e.detail.errMsg == 'getUserInfo:fail auth deny') {
        console.log(e.detail)
        statis.appAction({
          spot: 'DENY',
          targettype: 'clickable'
        })
        return
      }

      var rawData = JSON.parse(e.detail.rawData)

      wx.setStorageSync('rawData', rawData)

      statis.appAction({
        spot: 'ALLOW',
        targettype: 'clickable'
      })
    }
  }
})
