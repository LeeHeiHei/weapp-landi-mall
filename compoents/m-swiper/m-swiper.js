// compoents/m-swiper/m-swiper.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    banners: {
      type: Array,
      value: [],
      observer: "_bannerChange" 
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    autoplay: true,
    interval: 3000,
    duration: 1000,
    swiperCurrent: 0
  },

  /**
   * 组件的方法列表
   */
  methods: {
    _bannerChange: function (newVal, oldVal) {
      // console.log(newVal)
    },
    _swiperchange: function (e) {
      // console.log(e.detail.current)
      this.setData({
        swiperCurrent: e.detail.current
      })
    },
  }
})
