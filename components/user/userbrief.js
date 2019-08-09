// components/user/userbrief.js
Component({
  /**
   * 组件的属性列表
   */
  options: {
    addGlobalClass: true,
  },
  properties: {
    name: {
      type: String,
      value: ''
    },
    uid:{
      type: String,
      value: ''
    },
    photo:{
      type:String,
      value:''
    },
    settings:{
      type:String,
      value:''
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

    onTap(e) {
      const myEventDetail = {}
      const myEventOption = {}
      this.triggerEvent('tap', myEventDetail, myEventOption);
    } 

  }
})
