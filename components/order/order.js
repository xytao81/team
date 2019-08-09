import http from "../../utils/http.js";

const app = getApp();

Component({

  options: {
    addGlobalClass: true,
  },
  /**
   * 组件的属性列表
   */
  properties: {
    list: {
      type: Array
    },
    isHideLoadMore: {
      type: Boolean
    },
    max_count: {
      type: Number,
    },
    current_page: {
      type: Number,
    },
    limit: {
      type: Number,
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
    
    deleteClick(e) {
      let self = this;
      wx.showModal({
        content: "确定删除订单吗？",
        confirmText: '确定', confirmColor: '#00a7f2', 
        confirmColor: "#00a7f2",
        showCancel: true,
        success: function (res) {
          if (res.confirm) {
            self.deleteOrder(e);
          }
        }
      });
    },

    //删除订单
    deleteOrder: function (e) {
      let self = this;
      let id = e.currentTarget.dataset.item.id
      http.post('PAY_API_PAY_CANCEL_ORDER', {
        order_number: e.currentTarget.dataset.item.order_number,
        group_id: e.currentTarget.dataset.item.group_id
      }, function (res) {
        if (res.code != 200) {
          return wx.showModal({
            title: '',
            content: res.err,
            confirmText: '确定', confirmColor: '#00a7f2', 
            showCancel: false,
            success: function (res) { } // res.confirm
          });
        }
        self.triggerEvent('deleteItem', id);
      });
    },

    //支付
    payClick: function (e) {
      let self = this;
      http.post('PAY_API_PAY_PREPAY', {
        order_number: e.currentTarget.dataset.item.order_number,
        openid: app.globalData.openid
      }, function (res) {
        if (res.code != 200) {
          return wx.showModal({
            title: '',
            content: res.err,
            confirmText: '确定', confirmColor: '#00a7f2', 
            showCancel: false,
            success: function (res) { } // res.confirm
          });
        }
        console.log("timeStamp ", res.info.wx_prepay_order.timeStamp)
        console.log("nonceStr ", res.info.wx_prepay_order.nonceStr)
        console.log("package ", res.info.wx_prepay_order.package)
        console.log("paySign ", res.info.wx_prepay_order.paySign)

        //微信支付
        wx.requestPayment({
          'timeStamp': res.info.wx_prepay_order.timeStamp,
          'nonceStr': res.info.wx_prepay_order.nonceStr,
          'package': res.info.wx_prepay_order.package,
          'signType': 'MD5',
          'paySign': res.info.wx_prepay_order.paySign,
          'success': function (res) {
            wx.showModal({
              content: "支付成功",
              confirmText: '确定', confirmColor: '#00a7f2', 
              confirmColor: "#00a7f2",
              showCancel: false,
              success: function (res) {
                if (res.confirm) {
                  wx.navigateBack({
                    delta: 1
                  });
                }
              }
            });
            console.log('支付成功');
          },
          'fail': function (res) {
            console.log(res);
            console.log('支付失败');
            return;
          },
          'complete': function (res) {
            console.log('支付完成');
            return;
          }
        });

      });
    }

  }
})
