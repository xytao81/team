// components/message/list.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    list: {
      type:Array
    },
    isHideLoadMore:{
      type:Boolean
    },

    isTeam:{
      type: Boolean
    },
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
    onClickDetail:function(e){
      console.log('click',e);
      let item = e.currentTarget.dataset.item;
      this.triggerEvent('onClickDetail', item);
    },
  }
})
