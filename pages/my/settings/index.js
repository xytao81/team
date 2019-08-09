import http from "../../../utils/http.js";
import utils from "../../../utils/index.js";
import config from '../../../config/config.js'

const app = getApp();

var sliderWidth = 96;

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

  },

  switchToLogOut: function() {
    let self = this;
    wx.showModal({
      content: "确定要退出吗？",
      confirmText: '退出',
      showCancel: true,
      success: function(res) {
        if (!res.confirm) return;
        logout(self);
      } // res.confirm
    });
  }
});

function logout(self) {
  http.post('ACCOUNT_API_INDEX_LOGOUT', {
    open_id: app.globalData.openid
  }, function(res) {
    if (res.code != 200) {
      return wx.showModal({ content: res.err, confirmText: '确定', confirmColor: '#00a7f2', showCancel: false });
    }

    app.globalData.user= {
      wxUserInfo: {
        nickName: '',
          avatarUrl: ''
      },
      info: {
        token: '',
          name: ''
      }
    };

    wx.clearStorageSync();

    wx.reLaunch({ url: '/pages/index/index' })
  });
}