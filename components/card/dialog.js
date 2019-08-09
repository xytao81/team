// components/inputModal.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    price: Number,
    num: Number,
    total_num: Number,
    price_id: Number,
    team_id: String
  },

  /**
   * 组件的初始数据
   */
  data: {
    showDialog: false,
    // 使用data数据对象设置样式名
    minusStatus: 'disabled',
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onShow: function() {
      this.setData({
        showDialog: true,
        num: 1,
        total_num: this.data.total_num,
        price_id: this.data.price_id
      })
    },

    payClick: function(e) {
      if (this.data.num > 0) {
        wx.navigateTo({
          url: '/pages/my/pay/pay?price_id=' + this.data.price_id + "&count=" + this.data.num + "&team_id=" + this.data.team_id
        });
      }
    },

    /* 点击减号 */
    bindMinus: function() {
      var num = this.data.num;
      // 如果大于1时，才可以减
      if (num > 1) {
        num--;
      }
      // 只有大于一件的时候，才能normal状态，否则disable状态
      var minusStatus = num <= 1 ? 'disabled' : 'normal';
      // 将数值与状态写回
      this.setData({
        num: num,
        total_num: (this.data.price * num).toFixed(2),
        minusStatus: minusStatus
      });
    },
    /* 点击加号 */
    bindPlus: function() {
      var num = this.data.num;
      // 不作过多考虑自增1
      num++;
      // 只有大于一件的时候，才能normal状态，否则disable状态
      var minusStatus = num < 1 ? 'disabled' : 'normal';
      // 将数值与状态写回
      this.setData({
        num: num,
        total_num: (this.data.price * num).toFixed(2),
        minusStatus: minusStatus
      });

    },

    /* 输入框事件 */
    // bindManual: function (e) {
    //   var num = e.detail.value;
    //   // 将数值与状态写回
    //   this.setData({
    //     num: num,
    //     total_num: this.data.price * num,
    //   });
    // },
  }
})