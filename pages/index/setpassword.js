import http from "../../utils/http.js";
import utils from "../../utils/index.js";
import config from '../../config/config.js'

const app = getApp();

var sliderWidth = 96;

Page({

  // 页面的初始数据
  data: {

    redirectUrl: '',
    from: '',

    phone: '',
    code: '',
    password:'',
    password2:'',

    is_weixinphone: 0

  },

  inputChangePassword: function(e) {
    this.setData({ password: e.detail.value, });
  },
  inputChangePassword2: function(e) {
    this.setData({ password2: e.detail.value, });
  },
  nextSubmit:function(e){
    var self = this;
    if (self.data.password != self.data.password2) {
      return wx.showModal({ content: '两次输入的密码不符', confirmText: '确定', confirmColor: '#00a7f2', showCancel: false });
    }
    http.post('ACCOUNT_API_INDEX_SET_PASSWORD', {
      phone: self.data.phone,
      code: self.data.code,
      password: self.data.password,
      is_weixinphone: self.data.is_weixinphone
    }, function (res) {
      if (res.code != 200) {
        return wx.showModal({ content: res.err, confirmText: '确定', confirmColor: '#00a7f2', showCancel: false });
      }
      return wx.showModal({
        content: '设置成功',
        confirmText: '确定', confirmColor: '#00a7f2', 
        showCancel: false,
        success: function (res) {
          if (self.data.redirectUrl) {
            return wx.redirectTo({ url: self.data.redirectUrl });
          }
          return wx.reLaunch({ url: '/pages/index/index', });
        } // res.confirm
      });
    });
  },
  
  // 生命周期函数--监听页面加载
  onLoad: function(options) {
    const is_weixinphone = options.is_weixinphone == 1 ? 1 : 0;
    const redirectUrl = options.redirect_url ? decodeURIComponent(options.redirect_url) : '';
    this.setData({ phone: options.phone, code: options.code, is_weixinphone: is_weixinphone, redirectUrl: redirectUrl });
  }

});
