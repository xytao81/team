import http from "../../../../utils/http.js";
import utils from "../../../../utils/index.js";
import teamConfig from "../../../../utils/team_config.js";
import config from '../../../../config/config.js'

const app = getApp();

Page({

  // 页面的初始数据
  data: {
    teamId: '',
    phone: '',
    team: null,

  },

  // 生命周期函数--监听页面加载
  onLoad(options) {
    this.setData({
      teamId: options.team_id
    })

    this.loadTeam(options.team_id);
  },
  loadTeam(teamId) {
    var self = this;
    wx.showLoading()
    http.post('TEAM_API_INDEX_DETAIL', {
      id: teamId
    }, function(res) {
      wx.hideLoading();
      if (res.code != 200) {
        return wx.showModal({
          title: '',
          content: res.err,
          confirmText: '确定', confirmColor: '#00a7f2', 
          showCancel: false
        });
      }
      self.setData({
        team: res.info
      })
    });
  },
  inputPhoneNumber: function(e) {
    let phone = e.detail.value;
    this.setData({
      phone: phone
    })
  },
  clickJoinUs() {
    joinUS(this);
  },
  formSubmit(e) {
    console.log('form发生了submit事件，携带数据为：', e)
  },
});

function joinUS(self) {
  wx.showLoading()
  http.post('TEAM_API_PLAYER_QUICK_JOIN', {
    team_id: self.data.teamId,
    phone: self.data.phone
  }, function(res) {
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
      content: res.info.message,
      confirmText: '确定', confirmColor: '#00a7f2', 
      showCancel: false,
      success: function(res) {
        wx.reLaunch({
          url: '/pages/index/index',
        })
      }
    });
  });
}