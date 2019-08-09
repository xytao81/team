import http from "../../../utils/http.js";
import utils from "../../../utils/index.js";
import config from '../../../config/config.js'
import teamConfig from '../../../utils/team_config.js';
import validate from "../../../utils/validate.js";

const app = getApp();

Page({

  // 页面的初始数据
  data: {

    user: {},
    info: {}

  },

  bindInputChange: function(e) {
    let key = e.currentTarget.dataset.key;
    let value = e.detail.value;
 
    let info = this.data.info;
    info[key] = value;
    this.setData({
      info: info
    });
  },


  saveInfo: function() {
    for(let key in this.data.info){
      if (key == 'uid') continue;
      let value = parseInt(this.data.info[key]);
      if (value < 1 || value > 300) {
        return wx.showModal({ content: "数字不符合 "+value, confirmText: '确定', confirmColor: '#00a7f2', showCancel: false });
      }
    }

    savaData(this);
  },

  onLoad(options) {
    const self = this;
    const user = app.globalData.user.info;
    self.setData({ from: config.FROM, user: user });
  },

  onReady() {
    loadData(this);
  }

});

function loadData(self) {
  wx.showLoading();
  http.post('ACCOUNT_API_INDEX_SIZE_GET', {}, function(res) {
    wx.hideLoading();
    if (res.code != 200) {
      return wx.showModal({ content: res.err, confirmText: '确定', confirmColor: '#00a7f2', showCancel: false });
    }
    let info = res.info;
    self.setData({ info: res.info });
  });
}

function savaData(self) {
  wx.showLoading();
  http.post('ACCOUNT_API_INDEX_SIZE_SET', self.data.info, function(res) {
    wx.hideLoading();
    if (res.code != 200) {
      return wx.showModal({
        title: '',
        content: res.err,
        confirmText: '确定', confirmColor: '#00a7f2', 
        showCancel: false
      });
    }

    wx.showModal({
      content: "信息更新成功",
      confirmText: '确定', confirmColor: '#00a7f2', 
      showCancel: false
    });

  });
}