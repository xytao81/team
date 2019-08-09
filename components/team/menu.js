// components/team/menu.js
Component({
  /**
   * 组件的属性列表
   */
  options: {
    addGlobalClass: true,
  },
  properties: {
    title: {
      type: String,
      value: '1'
    },
    image:{
      type: String,
      value: '1'
    },
    number: {
      type: String,
      value: '-1'
    },
    type: {
      type: String,
      value: '-1'
    },
    url: {
      type: String,
      value: ''
    },
    is_badge:{
      type:Boolean,
      value:false
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
    clickMenu:function(){
      if(this.data.type==2){
        this.triggerEvent('refresh',{type:2});
      }
      this.triggerEvent('onClickMenu', { type:1,url:this.data.url});
    }
  }
})
