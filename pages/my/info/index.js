import http from "../../../utils/http.js";
import utils from "../../../utils/index.js";
import config from '../../../config/config.js'
import teamConfig from '../../../utils/team_config.js';

const app = getApp();

Page({

  // 页面的初始数据
  data: {

    info: null,

  },

   // 生命周期函数--监听页面加载
  onLoad(options) {
    const self = this;
    self.setData({ from: config.FROM });
  },

  onShow() {
    loadData(this);
  }

});

function loadData(self) {
  wx.showLoading();
  http.post('ACCOUNT_API_INDEX_DETAIL', {}, function (res) {
    wx.hideLoading();
    if (res.code != 200) {
      return wx.showModal({ content: res.err, confirmText: '确定', confirmColor: '#00a7f2', showCancel: false });
    }
    self.setData({ info: res.info });

    self.selectComponent("#base").onShow(res.info.uid);
    self.selectComponent("#size").onShow(res.info.uid);
    self.selectComponent("#edu").onShow(res.info.uid);
    self.selectComponent("#work").onShow(res.info.uid);
    self.selectComponent("#contacts").onShow(res.info.uid);
    self.selectComponent("#tqi").onShow(res.info.uid);
  });
}
