const dataLoader = require('./dataLoader')
const statis = require('../utils//statis')
const config = require('../config')
const md5 = require('../utils/md5.js')
const share = require('./share')

class Application {
  constructor() {
    this.promote = null //来源渠道
    this.directOpenParams = {} //二跳参数
    this.shareUserInfo = {} //从分享进来的用户的相关信息

    this.openId = null //用户的openid

    this.scene = null

    //分享出去时用的图文
    this.shareInfoList = []

    //用户信息
    this.userInfo = {}

    this.fakeStatus = 1

    this.isShare = 0

    this.isIphoneX = null

    this.shareGame = null
  }

  /**
   * 获取渠道
   * @returns {null|*}
   */
  getPromote() {
    if (this.promote == null) {
      this.promote = wx.getStorageSync('channel')
    }

    return this.promote
  }

  /**
   * 设置渠道
   * @private
   * @param promote
   * @private
   */
  _setPromote(promote) {
    if (promote != null) {
      wx.setStorage({
        key: 'channel',
        data: promote
      })
    }

    this.promote = promote
  }
  _setOpenId(openId) {
    this.openId = openId
    wx.setStorage({
      key: 'openId',
      data: openId
    })
  }

  /**
   * openId
   * @param openId
   */
  getOpenId() {
    if (this['openId'] == null) {
      let value = wx.getStorageSync('openId')
      this['openId'] = value ? value : ''
    }
    return this['openId']
  }
  /**
   * 场景值
   * @private
   * @param scene
   * @private
   */
  _setScene(scene) {
    this.scene = scene

    wx.setStorage({
      key: 'scene',
      data: scene
    })
  }

  getDirectOpenParams() {
    return this.directOpenParams
  }

  getShareUserInfo() {
    return this.shareUserInfo
  }

  /**
   * 分享信息列表
   * @returns {Array|*}
   */
  getShareInfoList() {
    return this.shareInfoList
  }

  /**
   * 拉取远程配置
   */
  getRemoteConfig(that) {
    let self = this
    dataLoader.request('api/takeoff').then(data => {
      share.init(data.isshare, data.share, that)
    })
  }

  /**
   * 解析参数
   * @param {object} options
   */
  parseQuery(options) {
    wx.removeStorageSync('channel')
    this._setScene(options.scene)
    let query = null

    if (options.query) {
      if (options.query.scene) {
        let qrCodeParam = decodeURIComponent(options.query.scene)
        query = util.parseUrl(qrCodeParam)
      } else {
        query = options.query
      }
    }

    // 1.获取投放参数(CP用)
    let arrQuery = []
    for (let item in query) {
      let cpTag = item.substr(0, 2).toLowerCase()
      if (cpTag === 'c_') {
        console.log(query[item])
        let key = item.substr(2, item.length - 1)
        arrQuery.push(key + '=' + query[item])
      }
    }
    let pathUrl = '?' + arrQuery.join('&')

    // 2.渠道标识
    if (query.c) {
      this._setPromote(query.c)
    }

    // 3.直接打开小游戏
    if (query.g) {
      this.directOpenParams = {
        gameId: query.g,
        pathUrl: pathUrl
      }
    }

    // 4.分享
    if (query.shareid) {
      this.shareUserInfo = {
        shareId: query.shareid,
        nickName: query.nickName,
        hasShareId: 1
      }
    }
  }

  /**
   * 登陆
   */
  login(that) {
    this.wxLogin().then(result => {
      if (result) {
        this.getMyGames(that)
        this.getUserInfo(that).then(userInfo => {
          this.uploadUserInfo()
        })
      }
    })
  }

  /**
   * 微信登陆
   * @returns {Promise<any>}
   */
  wxLogin() {
    let self = this
    return new Promise((resolve, reject) => {
      wx.login({
        success(response) {
          if (response.code) {
            dataLoader
              .request('getUserInfo', {
                code: response.code,
                appid: config.appId,
                promote: self.getPromote()
              })
              .then(data => {
                self._setOpenId(data.openid)
                statis.appAction({
                  spot: 'LOGIN_SUCC'
                })

                resolve(self.openId)
              })
          } else {
            console.error('登录失败！' + response.errMsg)
            statis.appAction({
              spot: 'LOGIN_FAIL',
              err: response.errMsg
            })
            reject(response.errMsg)
          }
        },
        fail(error) {
          statis.appAction({
            spot: 'LOGIN_FAIL',
            err: error
          })
          reject(error)
        }
      })
    })
  }

  /**
   * 获取用户信息
   * @returns {Promise<any>}
   */
  getUserInfo(that) {
    let self = this
    return new Promise((resolve, reject) => {
      wx.getSetting({
        success: res => {
          if (res.authSetting['scope.userInfo']) {
            // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
            wx.getUserInfo({
              success: res => {
                // 可以将 res 发送给后台解码出 unionId
                self.userInfo = res.userInfo

                // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
                // 所以此处加入 callback 以防止这种情况
                if (that.globalData.infoReadyCallback) {
                  that.globalData.infoReadyCallback(res)
                }
                statis.appAction({
                  spot: 'AUTH_SUCC'
                })
                resolve(res.userInfo)
              },
              fail: function(res) {
                statis.appAction({
                  spot: 'LOGIN_FAIL'
                })
                reject(res)
              }
            })
          }
        },
        fail: function(res) {
          statis.appAction('LOGIN_FAIL')
          reject(res)
        }
      })
    })
  }

  /**
   * 上传用户信息
   * @returns {Promise}
   */
  uploadUserInfo() {
    return dataLoader.request('api/uploadUserInfo', {
      openid: this.openId,
      key: md5.hexMD5(this.openid + config.encryptStr),
      openname: this.userInfo.nickName,
      headimgurl: this.userInfo.avatarUrl
    })
  }

  /**
   * 检测白包状态
   * @param data
   * @returns {boolean}
   */
  checkFakeStatus(data) {
    if (String(data.fake_status) === '1') {
      return true
    } else {
      return false
    }
  }

  /**
   * 拿到首屏数据后后续操作
   * @param data
   *
   */
  directional(data) {
    //如果是白包，则查看是否有url，如果有，则跳转到相应url，打开web页
    if (this.checkFakeStatus(data)) {
      if (data['url']) {
        wx.redirectTo({
          url: '../info/info?url=' + data.url
        })
      }
    } else {
      //否则就检测是否有二跳
      console.log(data)
      if (data.is_turn_app == 0) {
        wx.redirectTo({
          url: '../info/info?url=' + data.url
        })
      }
      this.checkDirectOpenGame()
    }
  }
  /**
   * 检测是否有二跳游戏
   */
  checkDirectOpenGame() {
    let directGameParams = this.getDirectOpenParams()
    if (directGameParams['gameId'] && directGameParams['pathUrl']) {
      wx.navigateToMiniProgram({
        appId: directGameParams['gameId'],
        path: directGameParams['pathUrl'],
        success(res) {
          statis.appAction({
            spot: 'DIRECT_OPEN',
            target_app_id: directGameParams['gameId']
          })
        }
      })
    }
  }
  //获取是否iphoneX并存入本地
  getSystemInfo() {
    let self = this
    wx.getSystemInfo({
      success: function(res) {
        if (res.model && res.model.indexOf('iPhone X') != -1) {
          self.isIphoneX = true
          wx.setStorage({
            key: 'isIphoneX',
            data: true
          })
        } else {
          self.isIphoneX = false
          wx.setStorage({
            key: 'isIphoneX',
            data: false
          })
        }
      }
    })
  }

  mobileModel() {
    return this.isIphoneX
  }

  //拉取我的游戏数据
  getMyGames(that) {
    let self = this
    let page = 1
    dataLoader
      .request('api/myplaygame', {
        page,
        openid: self.openId,
        appid: config.appId
      })
      .then(res => {
        let list = res.data
        that.globalData.myGames.list = list
        that.globalData.myGames.flag = true
        if (that.globalData.myGames.cb) {
          that.globalData.myGames.cb()
        }
      })
  }
}

module.exports = new Application()
