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
    
    is_weixinphone: 0,

    redirectUrl: '',

    registerSmsTimer: 0
   
  },

  inputChangeCode: function(e) {
    this.setData({ code: e.detail.value })
  },
  inputChangePhone:function(e){
    this.setData({phone:e.detail.value})
  },
  nextSubmit:function(e){
    wx.redirectTo({ url: '/pages/index/setpassword?phone='+this.data.phone+"&code="+this.data.code+"&is_weixinphone="+this.data.is_weixinphone+"&redirect_url="+encodeURIComponent(this.data.redirectUrl) });
  },

  // 倒计时
  countdown() {
    const self = this;
    if (self.data.registerSmsTimer == 0) return;
    const newRegisterSmsTimer = self.data.registerSmsTimer - 1;
    self.setData({ registerSmsTimer: newRegisterSmsTimer });
    if (newRegisterSmsTimer > 0) {
      var timer = setTimeout(function () {
        self.countdown();
      }, 1000);
    }
  },
  sendSmsCodeRegister: function(e) {
    var self = this;
    self.setData({ registerSmsTimer: 60 });
    self.countdown();
    http.post('ACCOUNT_API_INDEX_GETCODE', {
      phone: self.data.phone
    }, function (res) {
      if (res.code != 200) {
        self.setData({ registerSmsTimer: 0 });
        return wx.showModal({ content: '发送失败:' + res.err, confirmText: '确定', confirmColor: '#00a7f2', showCancel: false });
      }
      return wx.showToast({ title: '已发送', icon: 'success', duration: 3000 });
    });
  },

  wxGetPhoneNumber: function (res) {
    var self = this;
    utils.wxDecrypt(res.detail.encryptedData, res.detail.iv).then(function (data) {
      console.log('data', data);
      if (!data.phoneNumber) return;
      self.setData({ 'phone': data.phoneNumber.replace(' ', ''), 'is_weixinphone': 1 });
    });
    // getCode(this, e.detail.iv, e.detail.encryptedData);
  },
  resetPhoneNumber: function () {
    this.setData({ 'phone': '', 'is_weixinphone': 0 });
  },

  // 生命周期函数--监听页面加载
  onLoad: function(options) {
    const redirectUrl = options.redirect_url ? decodeURIComponent(options.redirect_url) : '';
    this.setData({ redirectUrl: redirectUrl });
  }

});
