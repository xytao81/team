import http from "../../../utils/http.js";
import utils from "../../../utils/index.js";
import config from '../../../config/config.js'
import teamConfig from '../../../utils/team_config.js';

const app = getApp();

Page({

  // 页面的初始数据
  data: {
    from: '',
    teamId: '',
    teamRights: 0,
    team: {},

    playerId: '',
    playerInfo: {},

    rightsList: [],

    saveData: {
      number: '',
      jobs: [],
      position: {
        id: 0,
        name: '-'
      }
    }

  },
  loadRights(callback) {
    const self = this;
    wx.showLoading();
    http.post('TEAM_API_PLAYER_MYRIGHTS', {
      team_id: self.data.teamId
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
        teamRights: res.info.rights
      });
      if (callback) callback();
    });
  },

  openRightsPicker() {
    var rights = this.data.team.rights;
    if (rights != 2) {
      // return wx.showModal({ content: '此功能限超级管理员使用', confirmText: '确定', confirmColor: '#00a7f2', showCancel: false });
    }
    const targetRights = this.data.playerInfo.rights;
    if (targetRights == 2) {
      // return wx.showModal({ content: '不能对超级管理员使用', confirmText: '确定', confirmColor: '#00a7f2', showCancel: false });
      this.setData({
        rightsList: ['移交超级管理员权限', '设为普通队员']
      });
    }
    if (targetRights == 0) {
      this.setData({
        rightsList: ['移交超级管理员权限', '设为管理员']
      });
    }
    if (targetRights == 1) {
      this.setData({
        rightsList: ['移交超级管理员权限', '设为普通队员']
      });
    }
    const self = this;
    wx.showActionSheet({
      itemList: this.data.rightsList,
      success: function(res) {
        if (res.cancel) return;
        const text = self.data.rightsList[res.tapIndex];
        self.selectRights(text);
      }
    });
  },
  selectRights(text) {
    if (text == '移交超级管理员权限') {
      this.setData({
        'saveData.rights': teamConfig.getRights(2)
      });
    }
    if (text == '设为管理员') {
      this.setData({
        'saveData.rights': teamConfig.getRights(1)
      });
    }
    if (text == '设为普通队员') {
      this.setData({
        'saveData.rights': teamConfig.getRights(0)
      });
    }
  },

  bindNumberChange(e) {
    if (e.detail.value > 99) {
      return wx.showModal({ content: '球衣号不能大于 99', confirmText: '确定', confirmColor: '#00a7f2', showCancel: false });
    }
    this.setData({ 'saveData.number': e.detail.value });
  },
  bindPositionChange(e) {
    const id = e.detail.value;
    const position = teamConfig.getPosition(id);
    this.setData({
      'saveData.position': position
    });
  },
  bindJobChange(e) {
    this.setData({
      'saveData.jobs': e.detail.checked
    });
  },
  bindRightsChange(e) {
    const id = e.detail.value;
    const rights = teamConfig.getRights(id);
    this.setData({
      'saveData.rights': rights
    });
  },


  savePlayerInfo() {
    var self = this;
    if (self.data.saveData.jobs.length == 0) {
      return wx.showModal({ content: '队员至少需要有一个职务', confirmText: '确定', confirmColor: '#00a7f2', showCancel: false });
    }
    var data = {
      team_id: self.data.teamId,
      player_id: self.data.playerId,
      data: {
        number: self.data.saveData.number,
        position: self.data.saveData.position.id,
        jobs: self.data.saveData.jobs
      }
    };
    http.post('TEAM_API_PLAYER_SETINFO', data, function(res) {
      if (res.code != 200) {
        return wx.showModal({ content: res.err, confirmText: '确定', confirmColor: '#00a7f2', showCancel: false });
      }
      wx.setStorageSync('updatedPlayerId_'+self.data.teamId, self.data.playerId);
      return wx.showToast({
        title: '保存成功',
        icon: 'success',
        duration: 3000,
        success: function() {
          return wx.navigateBack({ delta: 1 });
        }
      });
    });
  },

  loadTeam(teamId, callback) {
    var self = this;
    http.post('TEAM_API_INDEX_DETAIL', {
      id: teamId
    }, function(res) {
      if (res.code != 200) {
        return wx.showModal({
          title: '',
          content: res.err,
          confirmText: '确定', confirmColor: '#00a7f2', 
          showCancel: false
        });
      }
      self.setData({
        teamId: teamId,
        team: res.info
      });
      wx.hideLoading();

      if (callback) callback();

    });
  },

  loadPlayer(teamId, playerId, callback) {
    var self = this;
    http.post('TEAM_API_PLAYER_DETAIL', {
      team_id: teamId,
      player_id: playerId
    }, function(res) {
      if (res.code != 200) {
        return wx.showModal({
          title: '',
          content: res.err,
          confirmText: '确定', confirmColor: '#00a7f2', 
          showCancel: false
        });
      }
      self.setData({ 'playerInfo': res.info });
      self.setData({ 'playerInfo.jobs': res.info.jobs });
      self.setData({ 'saveData.number': res.info.number });
      self.setData({ 'saveData.position': teamConfig.getPosition(res.info.position) });
      self.setData({ 'saveData.jobs': res.info.jobs });
      self.setData({ 'saveData.rights': teamConfig.getRights(res.info.rights) });
      wx.hideLoading();

      if (callback) callback();
    });
  },

  // 生命周期函数--监听页面加载
  onLoad(options) {
    this.setData({
      from: config.FROM
    })

    const self = this;
    self.setData({ teamId: options.team_id, playerId: options.player_id });

    self.loadRights(function() {
      self.loadTeam(self.data.teamId, function() {
        self.loadPlayer(self.data.teamId, self.data.playerId);
      });
    });
  }

});