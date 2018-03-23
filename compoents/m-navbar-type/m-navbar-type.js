// compoents/m-navbar-type/m-navbar-type.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    categories:{
      type: Array,
      value:[],
      observer: "_categoriesChange" 
    },
    activeCategoryId:{
      type:null,
      value:0
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
  },

  /**
   * 组件的方法列表
   */
  methods: {
    _categoriesChange:function(newVal,oldVal){
      var _categories = newVal;
      _categories.unshift({ id: 0, name: "全部" });
      this.setData({
        categories: _categories
      });
    },
    _tabClick:function(e){
      this.setData({
        activeCategoryId: e.currentTarget.id
      });
      this.triggerEvent('changed', e.currentTarget.dataset.item);
    }
  }
})
