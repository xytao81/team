import http from "../../../../utils/http.js";
import utils from "../../../../utils/index.js";
import config from '../../../../config/config.js'

const app = getApp();

var sliderWidth = 96;

Page({

  // 页面的初始数据
  data: {
    from: '',
    teamId: '',
    team: {},

    redirectUrl: '',
    redirectUrlEncoded: '',

    sliderOffset: 0,
    sliderLeft: 0,


    action: 'login',

    loginType: 1,

    loginButtonVisible: false,
    loginDialogVisible: false,
    loginDialogData: {
      open_id: '',
      phone: '',
      password: '',
      smsCode: ''

    },

    tipLoginVisible: false,
    tipPasswordVisible: false,
    // wxUserInfo: {
    //   nickName: '',
    //   avatarUrl: ''
    // }
  },

  showTopTips: function () {
    var that = this;
    this.setData({
      showTopTips: true
    });
    setTimeout(function () {
      that.setData({
        showTopTips: false
      });
    }, 3000);
  },

  inputShowTipLogin() {
    this.setData({ tipLoginVisible: true });
  },
  inputHideTipLogin() {
    this.setData({ tipLoginVisible: false });
  },
  inputShowTipPassword() {
    this.setData({ tipPasswordVisible: true });
  },
  inputHideTipPassword() {
    this.setData({ tipPasswordVisible: false });
  },
  inputShowTipPhone() {
    this.setData({ tipPhoneVisible: true });
  },
  inputHideTipPhone() {
    this.setData({ tipPhoneVisible: false });
  },
  inputShowTipEmail() {
    this.setData({ tipEmailVisible: true });
  },
  inputHideTipEmail() {
    this.setData({ tipEmailVisible: false });
  },

  inputNamePhone: function (e) {
    this.setData({ 'loginDialogData.phone': e.detail.value });
  },
  inputChangePhone: function (e) {
    this.setData({ 'loginDialogData.phone': e.detail.value });
  },
  inputChangePassword: function (e) {
    this.setData({ 'loginDialogData.password': e.detail.value });
  },
  inputChangeCode: function (e) {
    this.setData({ 'loginDialogData.smsCode': e.detail.value });
  },

  gotoFinish: function () {
    let info = app.globalData.user.info
    if (!info.login) {
      return wx.redirectTo({ url: '/pages/my/finish/index?open_team_id=&step=1&redirect_url='+encodeURIComponent(this.data.redirectUrl) });
    }
    if (!info.name) {
      return wx.redirectTo({ url: '/pages/my/finish/index?open_team_id=&step=2&redirect_url='+encodeURIComponent(this.data.redirectUrl) });
    }
    return joinTeam(this);
  },
  loginSubmit: function () {
    var self = this;
    if (!self.data.loginDialogData.phone) {
      return wx.showModal({ content: '用户名不能为空', confirmText: '确定', confirmColor: '#00a7f2', showCancel: false });
    }
    if (!self.data.loginDialogData.password) {
      return wx.showModal({ content: '密码不能为空', confirmText: '确定', confirmColor: '#00a7f2', showCancel: false });
    }
    var data = {
      open_id: app.globalData.openid ? app.globalData.openid : '',
      union_id: app.globalData.unionid ? app.globalData.unionid : '',
      login: self.data.loginDialogData.phone,
      password: self.data.loginType == 3 ? self.data.loginDialogData.smsCode : self.data.loginDialogData.password,
      type: self.data.loginType
    };
    http.post('ACCOUNT_API_INDEX_LOGIN', data, function (res) {
      if (res.code != 200) {
        return wx.showModal({ content: '登录失败:' + res.err, confirmText: '确定', confirmColor: '#00a7f2', showCancel: false });
      }
      app.globalData.user.info = res.info;
      wx.showToast({ title: '登录成功', icon: 'success', duration: 3000 });
      self.gotoFinish();
      // if (!res.info.login) {
      //   return wx.redirectTo({ url: '/pages/my/finish/index' });
      // }
      // return wx.switchTab({ url: '/pages/team/teamhome/home' });
    });
  },

  loadTeam(teamId, callback) {
    this.setData({ teamId: teamId })

    var self = this;
    http.post('TEAM_API_INDEX_DETAIL', {
      id: teamId
    }, function (res) {
      if (res.code != 200) {
        return wx.showModal({ content: res.err, confirmText: '确定', confirmColor: '#00a7f2', showCancel: false });
      }
      res.info.showname = res.info.name.substring(0, 20);
      self.setData({ teamId: teamId, team: res.info });
      wx.setStorageSync('currentTeamId', teamId);
      if (callback) callback();

    });
  },

  // 生命周期函数--监听页面加载
  onLoad(options) {
    const self = this;

    const teamId = options.team_id ? options.team_id + '' : '';
    const redirectUrl = '/pages/team/teamhome/invite/login?team_id=' + teamId;
    const redirectUrlEncoded = encodeURIComponent('/pages/team/teamhome/invite/login?team_id=' + teamId);

    self.setData({ from: config.FROM, action: 'login', teamId: teamId, redirectUrl: redirectUrl, redirectUrlEncoded: redirectUrlEncoded });
    self.loadTeam(teamId);


    wx.getSystemInfo({
      success: function (res) {
        self.setData({ sliderLeft: (res.windowWidth / 2 - sliderWidth) / 2, sliderOffset: res.windowWidth / 2 * 0 });
      }
    });

    getLocation(function () {
      // 已登录了？
      if (app.globalData.user.info.token != '') {
        // return wx.redirectTo({ url: '/pages/team/teamhome/view?team_id=' + openTeamId + '&is_share=1' });
        return self.gotoFinish();
      }

      return;
      // 自动登录
      wx.showLoading();
      wx.login({
        success: function (res) {
          if (!res.code) return;
          console.log('wx.login:::', res);

          http.post('WX_API_INDEX_GETSESSION', { app_id: app.globalData.appid, app_secret: app.globalData.secret, code: res.code }, function (res) {
            app.globalData.openid = res.info.openid;
            app.globalData.unionid = res.info.unionid;
            app.globalData.sessionKey = res.info.session_key;
            http.post('ACCOUNT_API_INDEX_LOGIN', { login: '', password: '', open_id: app.globalData.openid, union_id: app.globalData.unionid, type: 2 }, function (res2) {
              wx.hideLoading();
              if (res2.code == 200) {
                app.globalData.user.info = res2.info;
                console.log(app.globalData.user.info);
                self.gotoFinish();
              }
              self.setData({ 'loginDialogVisible': true });
            });
          });

        }
      });

    });

  }

});

var getLocation = function (callback) {
  let ak = app.globalData.app_libs_key;
  wx.getLocation({
    type: 'wgs84',
    success: function (res) {
      http.post('COMMON_API_ZONE_GEOCODER', { latitude: res.latitude, longitude: res.longitude, ak: ak, }, function (res) {
        if (res.code != 200) { return; }

        app.globalData.user["location"] = {
          province: '',
          city: ''
        }
        if (res.info.province) app.globalData.user.location.province = res.info.province;
        if (res.info.city) app.globalData.user.location.city = res.info.city;

        if (callback) callback();
      });

    },
    fail: function () {
      // wx.showToast({ title: '授权失败', icon: 'none', duration: 1000 });
      if (callback) callback();
    }
  })
}

function joinTeam(self) {
  wx.showLoading();
  let value = "我是" + app.globalData.user.info.name + ",想加入您的球队~~";
  http.post('TEAM_API_PLAYER_ADD', {
    team_id: self.data.teamId,
    desc: value,
    form_id: '',
    app_id: app.globalData.appid, 
    session_key: app.globalData.secret
  }, function(res) {
    wx.hideLoading();
    if (res.code != 200) {
      return wx.showModal({
        content: res.err,
        confirmText: '确定', confirmColor: '#00a7f2', 
        showCancel: false,
        success: function (res) {
          return wx.redirectTo({ url: '/pages/team/teamhome/view?is_share=1&team_id=' + self.data.teamId });
        }
      });
    }
    return wx.showModal({
      content: "申请成功等待审核",
      confirmText: '确定', confirmColor: '#00a7f2', 
      showCancel: false,
      success: function (res) {
        return wx.redirectTo({ url: '/pages/team/teamhome/view?is_share=1&team_id=' + self.data.teamId });
      }
    });
  });
}