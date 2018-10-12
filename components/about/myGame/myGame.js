const dataLoader = require('../../../common/dataLoader')

const app = getApp()
Component({
  /**
   * 组件的属性列表
   */
  properties: {
  },

  /**
   * 组件的初始数据
   */
  data: {
    list:[]
  },

  /**
   * 页面布局加载完成
   */
  ready() {
    this.getDatas()
  },

  /**
   * 组件的方法列表
   */
  methods: {
    getDatas() {
     //设置我的游戏数据
    let list = app.globalData.myGames.list.slice(0, 4)
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
