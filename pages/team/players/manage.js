import http from "../../../utils/http.js";
import utils from "../../../utils/index.js";
import config from '../../../config/config.js'
import teamConfig from '../../../utils/team_config.js';

const app = getApp();

Page({

  // 页面的初始数据
  data: {
    teamRights: null,
    inTeam: false,

    totalCount: 0,

    from: '',
    teamId: '',
    team: {},
    players: [],
    page: 1,
    hasMore: true

  },

  loadRights(callback) {
    const self = this;
    wx.showLoading();
    http.post('TEAM_API_PLAYER_MYRIGHTS', { team_id: self.data.teamId }, function (res) {
      wx.hideLoading();
      if (res.code != 200) {
        return wx.showModal({ content: res.err, confirmText: '确定', confirmColor: '#00a7f2', showCancel: false });
      }
      const inTeam = res.info.rights == undefined ? false : true;
      let rights = res.info.rights ? res.info.rights : 0;
      self.setData({ teamRights: rights, inTeam: inTeam });
      if (callback) callback();
    });
  },

  // 添加球员
  gotoAddPlayer() {
    return wx.navigateTo({ url: '/pages/team/players/add?team_id=' + this.data.teamId });
  },
  //
  quit() {
    let self = this;
    wx.showModal({
      content: "确定要离开球队吗？",
      confirmText: '离开',
      showCancel: true,
      success: function (res) {
        if (res.confirm) {
          leaveTeam(self);
        }
      } // res.confirm
    });
  },
  loadPlayerList(page) {
    const self = this;
    http.post('TEAM_API_PLAYER_GETLIST', { team_id: this.data.teamId, current_page: page }, function (res) {
      if (res.code != 200) {
        return wx.showModal({ content: res.err, confirmText: '确定', confirmColor: '#00a7f2', showCancel: false });
      }
      const totalCount = res.info.total_count;
      var hasMore = self.data.hasMore;
      var newPlayers = self.data.players;

      var players = res.info.list;
      for (let k in players) {
        // const job = teamConfig.getJob(players[k].job);
        players[k].show_jobs = players[k].show_jobs.join(",");
        players[k].badge_name = self.getBadgeName(players[k]);
        players[k].badge_class = self.getBadgeClass(players[k]);
        players[k].position = teamConfig.getPosition(players[k].position);
        players[k].is_player = self.getIsPlayer(players[k].jobs);
        newPlayers.push(players[k]);
      }
      if (newPlayers.length >= totalCount) {
        hasMore = false;
      }
      self.setData({ players: newPlayers, page: res.info.current_page, hasMore: hasMore, totalCount: totalCount });
    });

  },

  getBadgeClass(player) {
    if (player.rights == 2) {
      return 2;
    }
    if (player.rights == 1) {
      return 1;
    }
    return 0;
  },
  getBadgeName(player) {
    // if (player.player_id == app.globalData.user)
    if (player.rights == 2) {
      return '超级管理员';
    }
    if (player.rights == 1) {
      return '管理员';
    }
    return '';
  },
  getIsPlayer(jobs) {
    const playerIndex = jobs.findIndex(item => item.job == 3);
    return playerIndex >= 0 ? true : false;
  },

  onReachBottom(e) {
    if (!this.data.hasMore) return;
    this.loadPlayerList(this.data.page + 1);
  },

  loadPlayer(teamId, playerId, callback) {
    const self = this;
    http.post('TEAM_API_PLAYER_DETAIL', { team_id: teamId, player_id: playerId }, function (res) {
      if (res.code != 200) return null;
      const playerInfo = res.info;
      const position = teamConfig.getPosition(playerInfo.position);
      const job = teamConfig.getJob(playerInfo.rights);
      playerInfo.job = job;
      playerInfo.position = position;
      playerInfo.badge_name = self.getBadgeName(playerInfo);
      playerInfo.badge_class = self.getBadgeClass(playerInfo);
      playerInfo.is_player = self.getIsPlayer(playerInfo.jobs);
      if (callback) callback(playerInfo);
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

  onShareAppMessage: function (e) {
    let title = app.globalData.user.info.name + "邀请你加入【" + this.data.team.name + "】成为【队员】"
    let page = '/pages/team/teamhome/invite/login?team_id=' + this.data.teamId;
    console.log(page);
    return { title: title, imageUrl: this.data.team.logo, path: page };
  },

  // 生命周期函数--监听页面加载
  onLoad(options) {
    const self = this;
    const teamId = options.team_id;
    self.setData({ from: config.FROM, teamId: teamId });
    self.loadRights(function () {
      // 加载第一页列表数据
      self.setData({ players: [], page: 1, hasMore: true });
      self.loadPlayerList(1);
      self.loadTeam(teamId);
    });
  },

  onShow() {
    const self = this;
    var updatePlayers = wx.getStorageSync('updatePlayers_'+self.data.teamId);
    const currentTeamId = wx.getStorageSync('currentTeamId');
    if (currentTeamId != self.data.teamId) updatePlayers = 1;
    if (updatePlayers) {
      self.loadRights(function () {
        // 加载第一页列表数据
        self.setData({ players: [], page: 1, hasMore: true });
        self.loadPlayerList(1);
        wx.removeStorageSync('updatePlayers_'+self.data.teamId);
      });
      return;
    }
    const updatedPlayerId = wx.getStorageSync('updatedPlayerId_'+self.data.teamId);
    if (updatedPlayerId) {
      var players = self.data.players;
      const playerIndex = players.findIndex(item => item.player_id == updatedPlayerId);
      if (playerIndex >= 0) {
        const myIndex = players.findIndex(item => item.is_me == true);
        wx.removeStorageSync('updatedPlayerId_'+self.data.teamId);
        self.loadPlayer(self.data.teamId, updatedPlayerId, function(player) {
          players[playerIndex] = player;
          self.setData({ players: players });
          if (myIndex >= 0) {
            self.loadPlayer(self.data.teamId, players[myIndex].player_id, function(player) {
              players[myIndex] = player;
              self.setData({ players: players });
            });
          }
        });
      }

    }

    const removedPlayerId = wx.getStorageSync('removedPlayerId_'+self.data.teamId);
    if (removedPlayerId) {
      var players = self.data.players;
      const playerIndex = players.findIndex(item => item.player_id == removedPlayerId);
      if (playerIndex) {
        players.splice(playerIndex, 1);
        self.setData({ players: players });
        wx.removeStorageSync('removedPlayerId_'+self.data.teamId);
      }
    }

  },

});

function leaveTeam(self) {
  wx.showLoading()
  http.post('TEAM_API_PLAYER_LEAVE', {
    team_id: self.data.teamId
  }, function (res) {
    wx.hideLoading()
    if (res.code != 200) {
      return wx.showModal({ content: res.err, confirmText: '确定', confirmColor: '#00a7f2', showCancel: false });
    }
    wx.removeStorageSync('currentTeamId');
    wx.setStorageSync('updateMyTeams', 1);
    return wx.showModal({
      content: "您已退出球队",
      confirmText: '确定', confirmColor: '#00a7f2', 
      showCancel: false,
      success: function (res) {
        return wx.switchTab({ url: '/pages/team/teamhome/home' });
      } // res.confirm
    });
  });
}