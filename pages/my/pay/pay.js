// pages/my/pay.js

import http from "../../../utils/http.js";
import utils from "../../../utils/index.js";
import config from '../../../config/config.js'

const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    price_id: 0,
    count: 0,
    coupon_id: 0,
    info: {},
    total_amout: 0,
    sale_amout: 0,
    discount: 0,
    team_id: "",
    coupon_count: 0,
    coupon_desc: ""
  },

  loadCoupon(callback) {
    const self = this;
    http.post('PAY_API_COUPON_TOTAL', {
      price_id: self.data.price_id,
      group_id: self.data.team_id,
      money: self.data.total_amout,
      count: self.data.count
    }, function(res) {
      if (res.code != 200) {
        return wx.showModal({ content: res.err, confirmText: '确定', confirmColor: '#00a7f2', showCancel: false });
      }
      self.setData({ coupon_count: res.info[4].coupon_count });
      if (callback) callback(); 
    });
  },

  //支付
  payClick() {

    const self = this;
    http.post('PAY_API_PAY_PURCHASE', {
      openid: app.globalData.openid,
      group_id: self.data.team_id,
      price_id: self.data.price_id, 
      count: self.data.count, 
      coupon_id: self.data.coupon_id,
      pay_type: 2
    }, function (res) {
      if (res.code != 200) {
        return wx.showModal({
          content: res.err,
          confirmText: '确定', confirmColor: '#00a7f2', 
          showCancel: false
        });
      }

      if (self.data.sale_amout == 0) {
        wx.showModal({
          content: "支付成功",
          confirmText: '确定', confirmColor: '#00a7f2', 
          confirmColor: "#00a7f2",
          showCancel: false,
          success: function (res) {
            if (res.confirm) {
              wx.navigateBack({
                delta: 2
              });
            }
          }
        });
      } else {
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
                    delta: 2
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
      }
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      price_id: options.price_id,
      count: options.count ? parseInt(options.count) : 0,
      team_id: options.team_id,
      coupon_id: options.coupon_id
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    const self = this;
    calculate(self, function() {
      self.loadCoupon();
    });
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    const self = this;
    let newCouponId = wx.getStorageSync('coupon_id');
    let newCouponDesc = wx.getStorageSync('coupon_desc');
    if (newCouponId !== null) {
      self.setData({ coupon_id: newCouponId, coupon_desc: newCouponDesc, });
      wx.removeStorageSync('coupon_id');
      wx.removeStorageSync('coupon_desc');
      calculate(self);
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },

})

function calculate(self, callback) {
  http.post('PAY_API_PRICE_CALCULATE', {
    price_id: self.data.price_id,
    count: self.data.count,
    coupon_id: self.data.coupon_id
  }, function(res) {
    if (res.code != 200) {
      return wx.showModal({
        title: '',
        content: res.err,
        confirmText: '确定', confirmColor: '#00a7f2', 
        showCancel: false,
        success: function(res) {} // res.confirm
      });
    }
    let info = res.info;
    self.setData({
      info: info,
      total_amout: info.total_amout,
      sale_amout: info.sale_amout,
      discount: info.total_amout - info.sale_amout
    });
    if (callback) callback();
  });
}

