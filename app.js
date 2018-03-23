//app.js
var config = require('config')
var wxApi = require('utils/wxApi')
var wxRequest = require('utils/wxRequest')
var Promise = require('plugins/es6-promise.js')
App({
  onLaunch: function () {
    var that = this;
    //  获取商城名称
    wx.request({
      url: config.api.getValue,
      data: {
        key: 'mallName'
      },
      success: function (res) {
        if (res.data.code == 0) {
          wx.setStorageSync('mallName', res.data.data.value);
        }
      }
    })

    // 登录
    this.login();
  },
  login: function () {
    var that = this;
    wxApi.wxLogin().then((res) => {
      //登录获取用户登录凭证（有效期五分钟）；
      //根据code结合服务端的appid和secret获取session_key 和 openid-->获取对应的用户信息
      //验证Token
      return that.checkToken(res);
    }).then(() => {
      //验证成功，获取用户信息
      that.getUserInfo();
    }, res => {
      //验证失败，走服务端登录注册流程
      that.serLogin(res);
    })
  },
  checkToken: function (opts) {
    var that = this;
    return new Promise((resolve, reject) => {
      var token = that.globalData.token;
      if (token) {
        //验证Token
        wxRequest.postRequest(config.api.checkToken, { token: token })
          .then(res => {
            //Token验证成功
            resolve(res);
          }, res => {
            //Token验证失败
            that.globalData.token = null;
            reject(opts);
          })
      } else {
        //没有Token
        reject(opts);
      }
    })
  },
  serLogin: function (opts) {
    var that = this;
    wxRequest.postRequest(config.api.login, { code: opts.code })
      .then(res => {
        if (res.data.code == 10000) {
          // 如果还没注册，去注册
          that.registerUser(opts);
        } else {
          //登录成功
          console.log(res.data.data);
          //开发者服务器使用 临时登录凭证code 获取 token 和 uid
          that.globalData.token = res.data.data.token;
          that.globalData.uid = res.data.data.uid;
          //获取用户信息
          that.getUserInfo();
        }
      }, res => {
        // 登录错误
        wx.hideLoading();
        wx.showModal({
          title: '提示',
          content: '无法登录，请重试',
          showCancel: false,
          success: function (res) {
            that.login();
          }
        })
      })
  },
  registerUser: function (opts) {
    var that = this;
    wxApi.wxGetUserInfo().then(res => {
      var code = opts.code;
      var iv = res.iv;
      var encryptedData = res.encryptedData;
      var data = {
        code: code, //用户登录凭证（有效期五分钟）
        encryptedData: encryptedData, //包括敏感数据在内的完整用户信息的加密数据
        iv: iv //加密算法的初始向量
      };
      return wxRequest.postRequest(config.api.register, data);
    }, res => {
      //获取用户信息失败，验证授权
      that.checkAuth(that.registerUser);
    }).then(() => {
      //注册成功,重新登录
      that.login();
    })

  },
  /**
   * 获取用户信息
   */
  getUserInfo: function () {
    var that = this;
    console.log("getUserInfo")
    if (this.globalData.userInfo) {
      that.onLoginSuccess && that.onLoginSuccess(this.globalData.userInfo)
    } else {
      wxApi.wxGetUserInfo().then(res => {
        //获取成功
        that.globalData.userInfo = res.userInfo
        that.onLoginSuccess && that.onLoginSuccess(this.globalData.userInfo)
      }, res => {
        //获取失败
        that.checkAuth(that.getUserInfo);
      })
    }
  },
  /**
   * 验证授权
   */
  checkAuth: function (cb) {
    var that = this;
    wxApi.wxGetSetting().then(res => {
      if (!res.authSetting['scope.userInfo']) {
        // 未授权提示用户授权
        wx.hideLoading();
        wx.showModal({
          title: '用户未授权',
          content: '无法获取权限，如需正常使用小程序功能，请按确定并勾选用户信息。',
          showCancel: false,
          success: function (res) {
            that.reCheckAuth(cb);
          }
        })
      }
    })
  },
  /**
   * 重新授权
   */
  reCheckAuth: function (cb) {
    var that = this;
    wxApi.wxOpenSetting().then(res => {
      if (res.authSetting["scope.userInfo"]) {
        typeof cb == "function" && cb()
      } else {
        that.checkAuth(cb);
      }
    })
  },
  globalData: {
    userInfo: null,
    version: '1.0.0'
  }
})