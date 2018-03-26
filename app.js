//app.js
var config = require('config')
var wxApi = require('utils/wxApi')
var wxRequest = require('utils/wxRequest')
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
  },
  globalData: {
    userInfo: null,
    version: '1.0.0'
  }
})