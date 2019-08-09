import http from "../../../utils/http.js";
import utils from "../../../utils/index.js";
import config from '../../../config/config.js'
import teamConfig from '../../../utils/team_config.js';

const app = getApp();

Page({

  // 页面的初始数据
  data: {

    from:'',
    teamId: '',
    teamRights: 0,

    playerId: '',
    playerInfo: {},

    position: { id: '', name: '' }

  },

  // 移出队员
  kickPlayer() {
    let self = this;
    wx.showModal({
      content: "确定移出队员吗？",
      confirmText: '移出',
      showCancel: true,
      success: function (res) {
        if (res.confirm) {
          self.kickPlayerExecute();
        }
      } // res.confirm
    });
  },
  kickPlayerExecute() {
    const self = this;
    http.post('TEAM_API_PLAYER_KICK', { team_id: self.data.teamId, player_id: self.data.playerId }, function (res) {
      if (res.code != 200) {
        return wx.showModal({ content: res.err, confirmText: '确定', confirmColor: '#00a7f2', showCancel: false });
      }

      wx.setStorageSync('updateMyTeams', 1);
      wx.setStorageSync('removedPlayerId_'+self.data.teamId, self.data.playerId);

      return wx.showModal({
        content: "移除成功",
        confirmText: '确定', confirmColor: '#00a7f2', 
        showCancel: false,
        success: function (res) {
          wx.navigateBack({ delta: 1 });
         }
      });
      
    });
    
    // return wx.navigateTo({ url: '/pages/team/players/detail?player_id=' + this.data.teamId });
  },

  loadRights(callback) {
    const self = this;
    wx.showLoading();
    http.post('TEAM_API_PLAYER_MYRIGHTS', { team_id: self.data.teamId }, function (res) {
      wx.hideLoading();
      if (res.code != 200) {
        return wx.showModal({ content: res.err, confirmText: '确定', confirmColor: '#00a7f2', showCancel: false });
      }
      self.setData({ teamRights: res.info.rights });
      if (callback) callback();
    });
  },

  // 生命周期函数--监听页面加载
  onLoad(options) {
    const self = this;
    self.setData({ from: config.FROM, teamId: options.team_id, playerId: options.player_id });
    
  },

  onShow() {
    const self = this;
    self.loadRights(function () {
      http.post('TEAM_API_PLAYER_DETAIL', { team_id: self.data.teamId, player_id: self.data.playerId }, function (res) {
        if (res.code != 200) {
          return wx.showModal({ content: res.err, confirmText: '确定', confirmColor: '#00a7f2', showCancel: false });
        }
        const playerInfo = res.info;
        var position = { id: '', name: '' };
        if (playerInfo.is_player) {
          position = teamConfig.getPosition(playerInfo.position);
        }
        // const job = teamConfig.getJob(playerInfo.rights);
        // playerInfo.job = job;
        self.setData({ playerInfo: playerInfo, position: position });

        self.selectComponent("#base").onShow(playerInfo.uid);

      });
    });
  }
  
});
