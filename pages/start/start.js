// pages/start/start.js
//获取应用实例
const app = getApp()
var wxLogin = require('../../utils/wxLogin')
var wxApi = require('../../utils/wxApi')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isBtnEnterEnable: false,
    remind: '',
    angle: 0,
    userInfo: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    wx.setNavigationBarTitle({
      title: wx.getStorageSync('mallName')
    })
    wxLogin.login((res)=>{
      console.log("===========");
      that.setData({
        userInfo: res,
        isBtnEnterEnable: true
      })
      //提前申请地理位置权限
      wxApi.wxAuthorize("scope.userLocation").then(()=>{
        console.log("获取定位成功");
      },()=>{
        console.log("获取定位失败");
      })
    });
  },
  
  /**
   * 跳转到首页
   */
  goToIndex: function () {
    wx.navigateTo({
      url: '/pages/index/index',
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    var that=this;
    // wx.onAccelerometerChange(function (res) {
    //   var angle = -(res.x * 30).toFixed(1);
    //   if (angle > 14) { angle = 14; }
    //   else if (angle < -14) { angle = -14; }
    //   if (that.data.angle !== angle) {
    //     that.setData({
    //       angle: angle
    //     });
    //   }
    // });
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    setTimeout(()=>{
      wx.stopPullDownRefresh();
    },2000);
   
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})