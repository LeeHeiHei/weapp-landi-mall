// pages/index/index.js
var config = require('../../config')
//获取应用实例
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    banners: [],
    categories: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    this.getBannerList();
    this.getGoodsCategory();
    app.onLoginSuccess = res => {
      console.log("++++++++++++++");
     
    }
  },
  /**
   * 获取Banner
   */
  getBannerList: function () {
    var that = this;
    wx.request({
      url: config.api.getBannerList,
      data: {
        key: 'mallName'
      },
      success: function (res) {
        if (res.data.code == 404) {
          wx.showModal({
            title: '提示',
            content: '请在后台添加 banner 轮播图片',
            showCancel: false
          })
        } else {
          that.setData({
            banners: res.data.data
          });
        }
      }
    });
  },
  /**
   * 获取商品分类
   */
  getGoodsCategory:function(){
    var that = this;
    wx.request({
      url: config.api.getGoodsCategory,
      success: function (res) {
        that.setData({
          categories: res.data.data
        });
      }
    });
  },
  /**
   * 分类改变
   */
  onCategoryChanged: function (e) {
    console.log(e.detail);
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

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

  },
  btnClick: function () {

  }
})