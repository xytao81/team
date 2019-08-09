import http from "../../../utils/http.js";
import utils from "../../../utils/index.js";
import config from '../../../config/config.js'

const app = getApp();

var sliderWidth = 96;

Page({

  // 页面的初始数据
  data: {

    from: '',
    passwordOld: '',
    passwordNew: '',
    passwordNew2: '',

  },

  inputChangePassword: function (e) {
    this.setData({ passwordOld: e.detail.value, });
  },
  inputChangePassword2: function (e) {
    this.setData({ passwordNew: e.detail.value, });
  },
  inputChangePassword3: function (e) {
    this.setData({ passwordNew2: e.detail.value, });
  },
  nextSubmit: function (e) {
    var self = this;
    if (self.data.passwordNew != self.data.passwordNew2) {
      return wx.showModal({ content: '两次输入的密码不符', confirmText: '确定', confirmColor: '#00a7f2', showCancel: false });
    }
    http.post('ACCOUNT_API_INDEX_CHANGE_PASSWORD', {
      password: self.data.passwordOld,
      password2: self.data.passwordNew
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
      return wx.showModal({
        content: '修改成功',
        confirmText: '确定', confirmColor: '#00a7f2', 
        showCancel: false,
        success: function (res) {
          wx.navigateBack({
            
          })
        } // res.confirm
      });
    });
  },



  // 生命周期函数--监听页面初次渲染完成
  onReady: function () { },

  // 生命周期函数--监听页面显示
  onShow: function () { },

  // 生命周期函数--监听页面隐藏
  onHide: function () { },

  // 生命周期函数--监听页面卸载
  onUnload: function () { },

  // 页面相关事件处理函数--监听用户下拉动作
  onPullDownRefresh: function () { },

  // 页面上拉触底事件的处理函数
  onReachBottom: function () { },

  // 用户点击右上角分享
  onShareAppMessage: function () { },

  // 生命周期函数--监听页面加载
  onLoad: function (options) {
    this.setData({
      phone: options.phone,
      code: options.code,
    });
  }

});