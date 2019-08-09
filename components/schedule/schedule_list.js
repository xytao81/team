// components/schedule/schedule_list.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {

    schedules: {
      type: Array,
      value:null,
      observer: function(newVal) {
        //Object.keys(newVal).length==0判断是不是空对象
        if (Object.keys(newVal).length==0) return;
        // console.log('接收到来自父组件的值活动详情的值了:::', newVal);
      }
    },
    isAdmin: {
      type: Boolean,
      value: false
    },
    showTeam: {
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

  }
})
