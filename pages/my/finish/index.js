import http from "../../../utils/http.js";
import utils from "../../../utils/index.js";
import config from '../../../config/config.js'

const app = getApp();

var sliderWidth = 96;

Page({

  // 页面的初始数据
  data: {

    from: '',

    step: 0,

    tipNameVisible: false,
    tipLoginVisible: false,
    tipEmailVisible: false,

    is_show_name: false,
    is_show_login: false,
    is_show_email: false,

    info: {
      login: '',
      name: '',
      email: '',
    }

  },

  inputShowTipName() { this.setData({ tipNameVisible: true }); },
  inputHideTipName() { this.setData({ tipNameVisible: false }); },

  inputShowTipLogin() { this.setData({ tipLoginVisible: true }); },
  inputHideTipLogin() { this.setData({ tipLoginVisible: false }); },

  inputShowTipEmail() { this.setData({ tipEmailVisible: true }); },
  inputHideTipEmail() { this.setData({ tipEmailVisible: false }); },

  inputChangeValue: function (e) {
    let key = e.currentTarget.dataset.key;
    let value = e.detail.value;
    let info = this.data.info;
    info[key] = value;
    this.setData({ info: info });
  },

  gotoOver() {
    if (this.data.redirectUrl) {
      return wx.redirectTo({ url: this.data.redirectUrl }); 
    }
    const openTeamId = wx.getStorageSync('openTeamId');
    if (openTeamId) {
      return wx.redirectTo({ url: '/pages/team/teamhome/view?team_id=' + openTeamId + '&is_share=1' });
    }
    return wx.switchTab({ url: '/pages/team/teamhome/home' });
  },

  step1Submit: function () {
    var self = this;
    const data = {
      login: self.data.info.login
    };
    http.post('ACCOUNT_API_INDEX_FINISH', { data: data }, function (res) {
      if (res.code != 200) {
        return wx.showModal({ content: res.err, confirmText: '确定', confirmColor: '#00a7f2', showCancel: false });
      }
      app.globalData.user.info.login = res.info.login;

      // 要不要完善姓名？
      if (!res.info.realname) {
        return self.setData({ step: 2 });
      }
      return self.gotoOver();

    });
  },
  step2Submit: function () {
    var self = this;
    const data = {
      name: self.data.info.name
    };
    http.post('ACCOUNT_API_INDEX_FINISH', { data: data }, function (res) {
      if (res.code != 200) {
        return wx.showModal({ content: res.err, confirmText: '确定', confirmColor: '#00a7f2', showCancel: false });
      }
      app.globalData.user.info.name = res.info.realname;
      return self.gotoOver();
    });
  },


  // 生命周期函数--监听页面加载
  onLoad: function (options) {
    var self = this;
    const step = options.step ? options.step : 0;
    const redirectUrl = options.redirect_url ? decodeURIComponent(options.redirect_url) : '';

    self.setData({ from: config.FROM, step: step, redirectUrl: redirectUrl });
  },

  onReady: function () {
    let info = this.data.info;
    info.login = app.globalData.user.info.login;
    info.name = app.globalData.user.info.name;
    info.email = app.globalData.user.info.email;

    this.setData({ info: info });

    if (!info.login) {
      this.setData({ is_show_login: true })
    }

    if (!info.name) {
      this.setData({ is_show_name: true })
    }

    if (!info.email) {
      this.setData({ is_show_email: true })
    }
  }

});