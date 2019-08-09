import http from "../utils/http.js";
import utils from "../utils/index.js";
import config from '../config/config.js'

const app = getApp();

Page({

  // 页面的初始数据
  data: {
   
  },

  // 生命周期函数--监听页面初次渲染完成
  onReady: function() {},

  // 生命周期函数--监听页面显示
  onShow: function() {},

  // 生命周期函数--监听页面隐藏
  onHide: function() {},

  // 生命周期函数--监听页面卸载
  onUnload: function() {},

  // 页面相关事件处理函数--监听用户下拉动作
  onPullDownRefresh: function() {},

  // 页面上拉触底事件的处理函数
  onReachBottom: function() {},

  // 用户点击右上角分享
  onShareAppMessage: function() {},

  // 生命周期函数--监听页面加载
  onLoad: function(options) {
    console.log(app.globalData.openid);
    app.globalData.openid = 'o65gZ0cfAH_RrjHe3YggCu2RCYco';
    // app.globalData.openid = 'osY5_wD3vRbfWOSXtehV2dQtgCtY';
    
    // http.post('PAY_API_COUPON_TOTAL', { group_id: 13945 });
    // http.post('PAY_API_COUPON_GET_REMAIN_LIST', { group_id: 13945 });
    // http.post('PAY_API_PRICE_CALCULATE', { price_id: 10, count: 3, coupon_id: 191 });
    // http.post('PAY_API_PAY_PURCHASE', { group_id: 13093, price_id: 10, count: 2, pay_type: 2, openid: app.globalData.openid });
    // http.post('PAY_API_PAY_PREPAY', { order_number: '201905160943268259', openid: app.globalData.openid }, function(res) {
    //   let prepay = res.info.wx_prepay_order;
    //   wx.requestPayment({
    //     'timeStamp': prepay.timeStamp,
    //     'nonceStr': prepay.nonceStr,
    //     'package': prepay.package,
    //     'signType': 'MD5',
    //     'paySign': prepay.paySign,
    //     'success': function (res) {
    //       console.log('支付成功');
    //     },
    //     'fail': function (res) {
    //       console.log(res);
    //       console.log('支付失败');
    //       return;
    //     },
    //     'complete': function (res) {
    //       return console.log('支付完成');
    //     }
    //   });

    // });
    // http.post('PAY_API_PAY_CANCEL_ORDER', { order_number: '201905160944049453', group_id: 13093 });
    // http.post('PAY_API_PAY_GET_MEAL_RESULT', { group_id: 13945 });
    // http.post('PAY_API_PAY_GET_MEAL', { group_id: 13945 });
    // http.post('PAY_API_PAY_GET_ORDER_STATISTICS', { group_id: 13093 });

    // http.post('SCHEDULE_API_LIVE_GET_BY_DATE', { group_id: 13892, date: '2019-05-22' });
    http.post('SCHEDULE_API_LIVE_GET_BY_DATE', { date: '2019-06-16' });
    // http.post('SCHEDULE_API_LIVE_DETAIL', { schedule_id: 277 });

    // http.post('TEST', { schedule_id: 277 });
  }

});