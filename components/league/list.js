// pages/league/components/list.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {

    hideStatus: {
      type: Boolean,
      value: false
    }

  },

  /**
   * 组件的初始数据
   */
  data: {
    list:[],
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onShow:function(list){
      this.setData({list:list});
    },
    handleClick:function(e){
      let item = e.currentTarget.dataset.item;
      this.triggerEvent('click', item)
    }
  }
})
