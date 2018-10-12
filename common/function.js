const app = getApp()
const setMyGamesList = game => {
  let list = app.globalData.myGames.list
  let id = game.id
  list.forEach((el, index, arr) => {
    if (el.id === id) {
      arr.splice(index, 1)
    }
  })
  list.unshift(game)
}
//根据g_type字段判断以何种方式打开游戏
const target = game => {
  let type = game.g_type
  switch (type) {
    // case 1: //直接跳转的小游戏
    //   break
    case 2: //扫码游戏
      wx.navigateTo({
        url: `../details/details?id=${game.id}&name=${game.name}`
      })
      break
    case 3: //H5游戏
    default:
      wx.navigateTo({
        url: '../web/web?url=' + game.g_link
      })
      break
  }
}
module.exports = {
  setMyGamesList,
  target
}
