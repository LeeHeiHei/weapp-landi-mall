var Promise = require('../plugins/es6-promise.js')
function wxPromisify(fn) {
  return function (obj = {}) {
    return new Promise((resolve, reject) => {
      obj.success = function (res) {
        //成功
        resolve(res)
      }
      obj.fail = function (res) {
        //失败
        reject(res)
      }
      fn(obj)
    })
  }
}

//无论promise对象最后状态如何都会执行
Promise.prototype.finally = function (callback) {
  let P = this.constructor;
  return this.then(
    value => P.resolve(callback()).then(() => value),
    reason => P.resolve(callback()).then(() => { throw reason })
  );
};

/**
 * 微信用户登录,获取code
 */
function wxLogin() {
  return wxPromisify(wx.login)
}

/**
 * 获取微信用户信息
 * 注意:须在登录之后调用
 */
function wxGetUserInfo() {
  return wxPromisify(wx.getUserInfo)
}

/**
 * 获取设置信息
 */
function wxGetSetting(){
  return wxPromisify(wx.getSetting)
}

/**
 * 打开权限设置
 */
function wxOpenSetting(){
  return wxPromisify(wx.openSetting)
}

function aa(){
  return new Promise((resolve,reject)=>{
    resolve("1111")
  })
}

/**
 * 获取授权
 */
function wxAuthorize(setting){
  var ss = aa();
  var getSetting = wxGetSetting();
  return new Promise((resolve,reject)=>{
    getSetting().then(res => {
      if (res.authSetting[setting]) {
        resolve(true)
      } else {
        wx.authorize({
          scope: setting,
          success: () => {
            resolve(true)
          },
          fail: () => {
            reject(false)
          }
        })
      }
    })
  })
  
  // return wxGetSetting().then(res=>{
  //   if (res.authSetting[setting]) {
  //     resolve(true)
  //   }else{
  //     wx.authorize({
  //       scope: setting,
  //       success: () => {
  //         resolve(true)
  //       },
  //       fail: () => {
  //         reject(false)
  //       }
  //     })
  //   }
  // })
}

/**
 * 获取系统信息
 */
function wxGetSystemInfo() {
  return wxPromisify(wx.getSystemInfo)
}


module.exports = {
  wxPromisify: wxPromisify,
  wxLogin: wxLogin(),
  wxGetUserInfo: wxGetUserInfo(),
  wxGetSystemInfo: wxGetSystemInfo(),
  wxGetSetting: wxGetSetting(),
  wxOpenSetting: wxOpenSetting(),
  wxAuthorize: wxAuthorize
}