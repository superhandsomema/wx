const application = require('../../../common/application')

const app = getApp()
Component({
  /**
   * 组件的属性列表
   */
  properties: {},

  /**
   * 组件的初始数据
   */
  data: {
    top: 20,
    ever: false,
    list: [],
    myGamesShow: false
  },

  /**
   * 页面布局加载完成
   */
  ready() {
    this.setMyGamesState()
  },

  /**
   * 组件的方法列表
   */
  methods: {
    setMyGamesState() {
      let self = this

      if (app.globalData.myGames.flag) {
        if (app.globalData.myGames.list.length)
          this.setData({ myGamesShow: true })
        else this.setData({ myGamesShow: false })
      } else {
        app.globalData.myGames.cb = function() {
          if (app.globalData.myGames.list.length)
            self.setData({ myGamesShow: true })
          else self.setData({ myGamesShow: false })
        }
      }
    },
    move: function() {
      this.setData({
        top: 20
      })
    },
    //我的游戏
    everTit: function() {
      this.setData({
        ever: true
      })
      this.getDatas()
    },
    everClose: function() {
      this.setData({
        ever: false
      })
    },
    getDatas() {
      let myList = app.globalData.myGames.list
      let list = myList.length > 7 ? myList.slice(0, 7) : myList
      this.setData({
        list
      })
    },
    jump() {
      wx.navigateTo({
        url: '../myGame/myGame'
      })
    }
  }
})
