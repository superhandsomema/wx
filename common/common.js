const util = require('../utils/util.js')
const statis = require('../utils/statis')
const application = require('./application')
const share = require('./share')
module.exports = {
  onShareAppMessage: function(resShare, app, curPage, path, spot) {
    let fqnickName
    let tyueFalse =
      app.globalData.userInfo != '' &&
      app.globalData.userInfo != undefined &&
      app.globalData.userInfo != null
    if (tyueFalse) {
      fqnickName = app.globalData.userInfo.nickName
    } else {
      fqnickName = ''
    }
    let openId = application.getOpenId()
    let shareObj = share.getRandomShare('Help')
    var _res = {
      title: shareObj.title,
      path: 'pages/index/index?shareid=' + openId + '&nickName=' + fqnickName,
      imageUrl: shareObj.imageUrl,
      success: function(res) {
        curPage.setData({
          redPacket1: false
        })
        statis.appAction({
          spot: spot,
          src: path
        })
      },
      fail: function(res) {
        // 转发失败
      }
    }
    return _res
  }
}
