const app = getApp()
var config = require('../config')
var wxApi = require('wxApi')
var wxRequest = require('wxRequest')
var callback;

/**
 * login
 */
function login(cb) {
  callback = cb;
  if (app.globalData.userInfo) {
    callback && getUserInfo();
    return;
  }
  wx.showNavigationBarLoading();
  wxApi.wxLogin().then((res) => {
    //登录获取用户登录凭证（有效期五分钟）；
    //根据code结合服务端的appid和secret获取session_key 和 openid-->获取对应的用户信息
    //验证Token
    return checkToken(res);
  }).then(() => {
    //验证成功，获取用户信息
    getUserInfo();
  }, res => {
    //验证失败，走服务端登录注册流程
    serLogin(res);
  })
}
/**
 * 验证用户Token
 */
function checkToken(opts) {
  return new Promise((resolve, reject) => {
    var token = app.globalData.token;
    if (token) {
      //验证Token
      wxRequest.postRequest(config.api.checkToken, { token: token })
        .then(res => {
          //Token验证成功
          resolve(res);
        }, res => {
          //Token验证失败
          app.globalData.token = null;
          reject(opts);
        })
    } else {
      //没有Token
      reject(opts);
    }
  })
}
/**
 * 服务端登录
 */
function serLogin(opts) {
  wxRequest.postRequest(config.api.login, { code: opts.code })
    .then(res => {
      if (res.data.code == 10000) {
        // 如果还没注册，去注册
        registerUser(opts);
      } else {
        //登录成功
        console.log(res.data.data);
        //开发者服务器使用 临时登录凭证code 获取 token 和 uid
        app.globalData.token = res.data.data.token;
        app.globalData.uid = res.data.data.uid;
        //获取用户信息
        getUserInfo();
      }
    }, res => {
      // 登录错误
      wx.hideLoading();
      wx.showModal({
        title: '提示',
        content: '无法登录，请重试',
        showCancel: false,
        success: function (res) {
          login();
        }
      })
    })
}
/**
 * 自动注册
 */
function registerUser(opts) {
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
    checkAuth(registerUser);
  }).then(() => {
    //注册成功,重新登录
    login();
  })

}
/**
 * 获取用户信息
 */
function getUserInfo() {
  if (app.globalData.userInfo) {
    //获取用户信息成功
    wx.hideNavigationBarLoading();
    app.isLogin = true;
    callback && callback(app.globalData.userInfo);
  } else {
    wxApi.wxGetUserInfo().then(res => {
      //获取成功
      app.globalData.userInfo = res.userInfo
      getUserInfo();
    }, res => {
      //获取失败
      checkAuth(getUserInfo);
    })
  }
}
/**
 * 验证授权
 */
function checkAuth(cb) {
  wxApi.wxGetSetting().then(res => {
    if (!res.authSetting['scope.userInfo']) {
      // 未授权提示用户授权
      wx.showModal({
        title: '用户未授权',
        content: '无法获取权限，如需正常使用小程序功能，请按确定并勾选用户信息。',
        showCancel: false,
        success: function (res) {
          reCheckAuth(cb);
        }
      })
    }
  })
}
/**
 * 重新授权
 */
function reCheckAuth(cb) {
  wxApi.wxOpenSetting().then(res => {
    if (res.authSetting["scope.userInfo"]) {
      typeof cb == "function" && cb()
    } else {
      checkAuth(cb);
    }
  })
}

module.exports = {
  login: login
}