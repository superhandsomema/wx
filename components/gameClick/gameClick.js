//游戏点击组件
const clone = require('../../vendor/lodash.clone/index')
const statis = require('../../utils/statis')
const fn = require('../../common/function')
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    game: {
      type: Object,
      value: {},
      observer(newValue) {
        this.setData({
          gameData: clone(newValue)
        })
      }
    },
    subject: {
      type: String
    },
    isPlay: Boolean
  },

  /**
   * 组件的初始数据
   */
  data: {
    gameData: {}
  },

  /**
   * 组件的方法列表
   */
  methods: {
    /**
     * 打开游戏
     * @param game
     * @param subject
     * @param status // 本地控制 是否直接打开游戏 按的是icon或play
     */
    openGame(game, subject, status) {
      if (game.gamemold == 3) {
        // statis.clickGame(game, subject)
      }
      if (status) {
        fn.setMyGamesList(game)
        statis.clickGame(game, subject)
        fn.target(game)
      } else {
        if (this.checkStatus(game.details)) {
          let spot = 'GAME_DETAIL'
          statis.clickGame(game, '', spot)
          wx.navigateTo({
            url: `../details/details?id=${game.id}&name=${game.name}`
          })
        } else {
          fn.setMyGamesList(game)
          statis.clickGame(game, subject)
          fn.target(game)
        }
      }
    },

    checkStatus(str) {
      switch (str) {
        case 'hide':
          return false
          break
        case 'show':
          return true
          break
      }
    },

    /**
     * 监听跳转到小游戏
     */
    onOpenGame: function() {
      let status = this.properties.isPlay
      console.log(Boolean(status), '-------------status')
      this.openGame(this.data.gameData, this.properties.subject, status)
    }
  }
})
