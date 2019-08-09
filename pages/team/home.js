import http from "../../utils/http.js";
import utils from "../../utils/index.js";
import config from '../../config/config.js'

const app = getApp();

Page({

  // 页面的初始数据
  data: { },

  gotoSearch() {
    return wx.navigateTo({ url: '/pages/team/search' });
  },

  gotoCreate() {
    return wx.navigateTo({ url: '/pages/team/create' });
  },

  // 生命周期函数--监听页面加载
  onLoad(options) {
    // wx.showModal({ content: "token:"+options.token, confirmText: '确定', confirmColor: '#00a7f2', showCancel: true });
  }
  
});
