import http from "../../utils/http.js";
import utils from "../../utils/index.js";
import config from '../../config/config.js'

const app = getApp();

var sliderWidth = 96;

Page({

  // 页面的初始数据
  data: {

    phone: '',
    code:'',
   
  },

  inputChangeCode: function(e) {
    this.setData({ code: e.detail.value })
  },
  inputChangePhone:function(e){
    this.setData({phone:e.detail.value})
  },
  nextSubmit:function(e){
    var self = this;
    http.post('ACCOUNT_API_INDEX_FORGET_USERNAME', {
      phone: self.data.phone,
      code: self.data.code,
    }, function (res) {
      if (res.code != 200) {
        return wx.showModal({
          title: '',
          content: '发送失败:' + res.err,
          confirmText: '确定', confirmColor: '#00a7f2', 
          showCancel: false,
          success: function (res) { } // res.confirm
        });
      }
      return wx.showModal({
        content: '设置成功',
        confirmText: '确定', confirmColor: '#00a7f2', 
        showCancel: false,
        success: function (res) {
          wx.reLaunch({
            url: '/pages/index/index',
          })
        } // res.confirm
      });
    });
  },
  sendSmsCodeRegister: function(e) {
    var self = this;
    http.post('ACCOUNT_API_INDEX_GETCODE', {
      phone: self.data.phone
    }, function (res) {
      if (res.code != 200) {
        return wx.showModal({
          title: '',
          content: '发送失败:' + res.err.code,
          confirmText: '确定', confirmColor: '#00a7f2', 
          showCancel: false,
          success: function (res) { } // res.confirm
        });
      }
      return wx.showToast({
        title: res.info.message,
        icon: 'success',
        duration: 3000
      });
    });
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
    

  }

});