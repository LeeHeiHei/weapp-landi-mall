//app.js
var config = require('config')
App({
  onLaunch: function () {
    var that = this;
    //  获取商城名称
    wx.request({
      url: config.service.getValue,
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
    var token = that.globalData.token;
    if (token) {
      wx.request({
        url: config.service.checkToken,
        data: {
          token: token
        },
        success: function (res) {
          if (res.data.code != 0) {
            that.globalData.token = null;
            that.login();
          }
        }
      })
      return;
    }
    wx.login({
      success: function (res) {
        //服务端登录，根据微信临时登录凭证
        wx.request({
          url: config.service.login,
          data: {
            code: res.code //用户登录凭证（有效期五分钟）；根据code结合服务端的appid和secret获取session_key 和 openid-->获取对应的用户信息
          },
          success: function (res) {
            if (res.data.code == 10000) {
              // 如果还没注册，去注册
              that.registerUser(res);
              return;
            }
            if (res.data.code != 0) {
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
              return;
            }
            console.log(res.data.data);
            //开发者服务器使用 临时登录凭证code 获取 token 和 uid
            that.globalData.token = res.data.data.token;
            that.globalData.uid = res.data.data.uid;
            //获取用户信息
            that.getUserInfo();
          }
        })
      }
    })
  },
  registerUser: function (res) {
    var that = this;
    var code = res.code; // 微信临时登录凭证
    wx.getUserInfo({
      success: function (res) {
        var iv = res.iv;
        var encryptedData = res.encryptedData;
        //用户信息对象，不包含 openid 等敏感信息
        that.globalData.userInfo = res.userInfo;
        // 下面开始调用注册接口
        wx.request({
          //解密加密的用户信息来自动注册用户，并生成token
          url: config.service.register,
          data: {
            code: code, //用户登录凭证（有效期五分钟）
            encryptedData: encryptedData, //包括敏感数据在内的完整用户信息的加密数据
            iv: iv //加密算法的初始向量
          },
          success: (res) => {
            wx.hideLoading();
            that.login();
          }
        })
      },
      fail: function () {
        that.checkAuth(that.registerUser);
      }
    })
  },
  //获取用户信息
  getUserInfo: function () {
    var that = this
    if (this.globalData.userInfo) {
      if (that.userInfoReadyCallback) {
        that.userInfoReadyCallback(res)
      }
    } else {
      wx.getUserInfo({
        success: function (res) {
          that.globalData.userInfo = res.userInfo
          if (that.userInfoReadyCallback) {
            that.userInfoReadyCallback(res)
          }
        },
        fail: function () {
          that.checkAuth(that.getUserInfo);
        }
      })
    }
  },
  //验证用户授权
  checkAuth: function (cb) {
    var that = this;
    wx.getSetting({
      success: res => {
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
      }
    })
  },
  //重新获取授权
  reCheckAuth: function (cb) {
    var that = this;
    wx.openSetting({
      success: (res) => {
        /*
         * res.authSetting = {
         *   "scope.userInfo": true,
         *   "scope.userLocation": true
         * }
         */
        if (res.authSetting["scope.userInfo"]) {
          typeof cb == "function" && cb()
        }else{
          that.checkAuth(cb);
        }
      }
    })
  },
  globalData: {
    userInfo: null,
    version: '1.0.0'
  }
})