Component({
  /**
   * 组件的属性列表
   */
  options: {
    addGlobalClass: true,
  },
  properties: {
    list: {
      type: Array,
      value: [],
      observer: function (newVal, oldVal, changedPath) {
        if (newVal.length > 0) {
          if (this.properties.currentCouponId) {
            this.selectCouponById(this.properties.currentCouponId);
          }
        }
      }
    },
    currentCouponId: {
      type: Number,
      value: 0,
      observer: function(newVal, oldVal, changedPath) {
        if (!newVal) {
          return console.error('新 cropper 配置无效:', newVal);
        }
        this.selectCouponById(newVal);
      }
    },
    select: {
      type: Boolean
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    select: false,
    index: 0,//当前索引
    currentIndex: -1,
    coupon_id: 0,
    coupon_desc: ""
  },

  

  /**
   * 组件的方法列表
   */
  methods: {
    reset() {
      this.setData({ currentIndex: -1, coupon_id: 0, coupon_desc: '', });
    },
    itemClick: function (res) {
      const self = this;
      if (!res.currentTarget.dataset.item.is_valid) {
        return;
      }
      if (self.data.currentIndex == res.currentTarget.id) {
        return self.reset();
      }
      self.setData({ currentIndex: res.currentTarget.id, coupon_id: res.currentTarget.dataset.item.id, coupon_desc: res.currentTarget.dataset.item.desc });
    },

    ruleClick: function (e) {
      var index = e.currentTarget.dataset.index;
      var now = "list[" + index + "].hidden"
      if (this.data.list[index].hidden == true) {
        this.setData({
          [now]: false,
        });
      } else {
        this.setData({
          [now]: true,
        });
      }
    },

    selectCouponById(id) {
      this.reset();
      for(let k in this.properties.list) {
        let coupon = this.properties.list[k];
        if (coupon.id == id) {
          this.setData({ currentIndex: k, coupon_id: id, coupon_desc: coupon.desc });
          break;
        }
      }
    },

    useCoupon: function (e) {
      wx.setStorageSync('coupon_id', this.data.coupon_id); 
      wx.setStorageSync('coupon_desc', this.data.coupon_desc); 
      wx.navigateBack({ delta: 1 });
    }
  }
})