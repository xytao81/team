// components/schedule/users.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    list:{
      type: Array,
      value: [],
      observer: function(newVal) {
        //Object.keys(newVal).length==0判断是不是空对象
        if (Object.keys(newVal).length==0) return;
      }
    },
    showSignedStatus: {
      type: Boolean,
      value: true
    },
    isAdmin: {
      type: Boolean,
      value: false
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

    onClickUser(e) {
      const myEventDetail = {
        user: e.detail.user
      };
      const myEventOption = {} 
      this.triggerEvent('clickuser', myEventDetail, myEventOption);
    },

    onUserUpdate(e) {
      const myEventDetail = {};
      const myEventOption = {} 
      this.triggerEvent('update', myEventDetail, myEventOption);
    }

  }
})
