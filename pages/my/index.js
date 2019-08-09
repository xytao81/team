import http from "../../utils/http.js";
import utils from "../../utils/index.js";
import config from '../../config/config.js'

const app = getApp();

var sliderWidth = 96;

Page({

  // 页面的初始数据
  data: {
    user: {
      name: '',
      uid: ''
    },
    info: null,
    currentTeam: {},
    myTeams: []
  },
  selectTeam(e) {
    const teamId = e.currentTarget.dataset.id;
    wx.setStorageSync('currentTeamId', teamId);
    wx.setStorageSync('updateMyTeams', 1);
    return wx.switchTab({ url: '/pages/team/teamhome/home' });
  },
  loadMyTeams(callback) {
    const self = this;
    // wx.removeStorageSync('updateMyTeams');
    http.post('TEAM_API_INDEX_MY', { }, function (res) {
      if (res.code != 200) {
        return wx.showModal({ content: res.err, confirmText: '确定', confirmColor: '#00a7f2', showCancel: false });
      }
      const currentTeamId = wx.getStorageSync('currentTeamId');
      const myTeams = res.info.list.filter(item => item.id != currentTeamId);
      const currentTeam = myTeams.length > 0 ? res.info.list.filter(item => item.id == currentTeamId)[0] : null;

      self.setData({ myTeams: myTeams, currentTeam: currentTeam });
    });
  },

  onUserbriefTap: function() {
    wx.navigateTo({ url: '/pages/my/info/index' });
  },

  // 生命周期函数--监听页面加载
  onLoad(options) {
    const self = this;
  },
  onShow() {
    const self = this;
    const user = {
      uid: app.globalData.user.info.uid,
      name: app.globalData.user.info.name
    };
    self.setData({ user: user, info: app.globalData.user.info });
    self.loadMyTeams();
  },

  switchToLogOut: function() {
    let self = this;
    wx.showModal({
      content: "确定要退出吗？",
      confirmText: '退出',
      showCancel: true,
      success: function(res) {
        if (!res.confirm) return;
        return logout(self);
      }
    });

  },

  onOfficialLoad(e) {
    console.log('load', e);
  },
  onOfficialError(e) {
    console.log('err', e);
  }

});

function logout(self) {
  http.post('ACCOUNT_API_INDEX_LOGOUT', { open_id: app.globalData.openid }, function(res) {
    if (res.code != 200) {
      return wx.showModal({ content: res.err, confirmText: '确定', confirmColor: '#00a7f2', showCancel: false });
    }

    app.globalData.user = {
      wxUserInfo: {
        nickName: '',
        avatarUrl: ''
      },
      info: {
        token: '',
        name: ''
      }
    };

    wx.reLaunch({ url: '/pages/index/index' });
  });
}
