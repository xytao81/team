import http from "../../utils/http.js";
import utils from "../../utils/index.js";
import config from '../../config/config.js'

const app = getApp();

Page({

  // 页面的初始数据
  data: {

    user: {
      name: '',
      uid: ''
    },

    myTeams: []

  },

  selectTeam(e) {
    const teamId = e.currentTarget.dataset.id;
    wx.setStorageSync('currentTeamId', teamId);
    return wx.switchTab({ url: '/pages/team/teamhome/home' });
  },
  loadMyTeams(callback) {
    const self = this;
    // wx.removeStorageSync('updateMyTeams');
    http.post('TEAM_API_INDEX_MY', {}, function (res) {
      if (res.code != 200) {
        return wx.showModal({ content: res.err, confirmText: '确定', confirmColor: '#00a7f2', showCancel: false });
      }
      if (res.info.list.length == 0) {
        return wx.switchTab({ url: '/pages/team/teamhome/home' });
      }

      self.setData({ myTeams: res.info.list });
    });
  },

  // 生命周期函数--监听页面加载
  onLoad(options) {
    const self = this;
    const user = {
      uid: app.globalData.user.info.uid,
      name: app.globalData.user.info.name,
      photo: app.globalData.user.info.photo
    };
    self.setData({ user: user });

    self.loadMyTeams();
  }
  
});
