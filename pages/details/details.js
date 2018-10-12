// pages/info/info.js
const statis = require('../../utils/statis')
const dataLoader = require('./../../common/dataLoader')
const config = require('../../config')
const fn = require('../../common/function')

Page({
  /**
   * 页面的初始数据
   */
  data: {
    id: '',
    name: '',
    list: [],
    share: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getData(options)
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
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {
    let index = Math.floor(Math.random() * this.data.share.length)
    let shareObject = this.data.share[index]
    let path = `/pages/index/index?id=${this.data.id}&name=${this.data.name}`
    console.log(path)
    return {
      title: shareObject['title'],
      path,
      imageUrl: shareObject['img']
    }
  },

  getData(options) {
    let id = options.id
    let title = options.name

    this.setData({
      id,
      name: title
    })
    let self = this
    dataLoader
      .load('/api/gamedetails', 1, {
        game_id: id,
        app_id: config.appId
      })
      .then(res => {
        //res.ad[0] = 'adunit-66c3bbca4b869f93'
        let share = res.catchword
        self.setData({
          list: res,
          share
        })

        // console.log(self.data.share)
      })
    wx.setNavigationBarTitle({ title })
  },
  //点击play 按钮
  play() {
    let game = this.data.list.content
    fn.setMyGamesList(game)
    fn.target(game)
  },

  //点击图片二维码
  clickQrcode() {
    let game = this.data.list.content
    wx.previewImage({
      current: game.g_link,
      urls: [game.g_link]
    })
  },

  //点击图片
  viewImage() {
    let imgs = this.data.list.gameimg
    let urls = []
    imgs.forEach(el => {
      urls.push(el.img)
    })
    wx.previewImage({
      urls
    })
  }
})
