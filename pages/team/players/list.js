import http from "../../../utils/http.js";
import utils from "../../../utils/index.js";
import config from '../../../config/config.js'
import teamConfig from '../../../utils/team_config.js';

const app = getApp();

Page({

  // 页面的初始数据
  data: {
    teamRights: null,

    from: '',
    teamId: '',
    team: {},
    players: [],
    jobs: [],
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
      var rights = null;
      if (res.info.rights != undefined) {
        rights = res.info.rights ? res.info.rights : 0;
      }
      self.setData({ teamRights: rights });
      if (callback) callback();
    });
  },

  // 添加球员
  gotoAddPlayer() {
    return wx.navigateTo({ url: '/pages/team/players/add?team_id=' + this.data.teamId });
  },

  gotoDetail(e) {
    if (this.data.teamRights == null) return;
    const playerId = e.currentTarget.dataset.playerid;
    const url = '/pages/team/players/detail?team_id='+this.data.teamId+'&player_id='+playerId;
    return wx.navigateTo({ url: url });
  },

  cantQuit() {
    let self = this;
    wx.showModal({
      content: '您是超级管理员，请先移交超级管理员权限。',
      confirmText: '确定', confirmColor: '#00a7f2', 
      showCancel: false
    })
  },
  quit() {
    let self = this;
    wx.showModal({
      content: self.data.teamRights == 2 ? '球队只剩您一个成员，退出将解散球队，确定解散球队？' : "确定退出球队？",
      confirmText: '离开',
      showCancel: true,
      success: function (res) {
        if (!res.confirm) {
          return;
        }
        leaveTeam(self);
      }
    })
  },
  loadPlayerList(page) {
    const self = this;
    http.post('TEAM_API_PLAYER_GETLIST_BY_JOB', { team_id: this.data.teamId, current_page: page }, function (res) {
      if (res.code != 200) {
        return wx.showModal({ content: res.err, confirmText: '确定', confirmColor: '#00a7f2', showCancel: false });
      }
      const totalCount = res.info.total_count;
      var hasMore = self.data.hasMore;
      var newPlayers = self.data.players;
      var newJobs = self.data.jobs;

      var players = res.info.list;
      for (let k in players) {
        const job = teamConfig.getJob(players[k].job);
        players[k].jobs = [job];
        players[k].badge_name = self.getBadgeName(players[k]);
        players[k].badge_class = self.getBadgeClass(players[k]);
        players[k].position = teamConfig.getPosition(players[k].position);
        newPlayers.push(players[k]);
        for(let k2 in players[k].jobs) {
          const jobIndex = players[k].jobs[k2].id - 1;
          newJobs[jobIndex].children.push(players[k]);
        }
      }
      if (newPlayers.length >= totalCount) {
        hasMore = false;
      }
      self.setData({ players: newPlayers, jobs: newJobs, page: res.info.current_page, hasMore: hasMore });
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

  onReachBottom(e) {
    if (!this.data.hasMore) return;
    this.loadPlayerList(this.data.page + 1);
  },

  clearPlayers() {
    const self = this;
    const jobs = self.data.jobs;
    for(let k in jobs) {
      jobs[k].children = [];
    }
    self.setData({ players: [], jobs: jobs, page: 1, hasMore: true });
  },

  loadTeam(teamId, callback) {
    this.setData({ teamId: teamId });

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
    const jobs = teamConfig.getJobs();
    const teamId = options.team_id ? options.team_id : '';
    self.setData({ from: config.FROM, teamId: teamId, jobs: jobs });
    self.loadTeam(teamId);
  },

  onShow() {
    const self = this;
    var updatePlayers = wx.getStorageSync('updatePlayers_'+self.data.teamId);
    const currentTeamId = wx.getStorageSync('currentTeamId');
    if (currentTeamId != self.data.teamId) updatePlayers = 1;
    if (this.data.players.length == 0) updatePlayers = 1;
    if (updatePlayers) {
      self.loadRights(function () {
        // 加载第一页列表数据
        self.clearPlayers();
        self.loadPlayerList(1);
        wx.removeStorageSync('updatePlayers_'+self.data.teamId);
      });
      return;
    }
    const updatedPlayerId = wx.getStorageSync('updatedPlayerId_'+self.data.teamId);
    if (updatedPlayerId) {
      var players = self.data.players;
      const playerIndex = players.findIndex(item => item.player_id == updatedPlayerId);
      if (playerIndex) {
        http.post('TEAM_API_PLAYER_DETAIL', { team_id: self.data.teamId, player_id: updatedPlayerId }, function (res) {
          wx.removeStorageSync('updatedPlayerId_'+self.data.teamId);
          if (res.code != 200) {
            return null;
          }
          const playerInfo = res.info;
          const position = teamConfig.getPosition(playerInfo.position);
          const job = teamConfig.getJob(playerInfo.rights);
          playerInfo.job = job;
          playerInfo.position = position;
          players[playerIndex] = playerInfo;
          self.setData({ players: players });
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



function joinTeam(self) {
  wx.showLoading()
  http.post('TEAM_API_PLAYER_ADD', {
    team_id: self.data.post_data.id,
    desc: self.data.post_data.value,
  }, function (res) {
    wx.hideLoading()
    if (res.code != 200) {
      return wx.showModal({
        title: '',
        content: res.err,
        confirmText: '确定', confirmColor: '#00a7f2', 
        showCancel: false,
        success: function (res) { } // res.confirm
      });
    }

  });
}

function leaveTeam(self) {
  wx.showLoading()
  http.post('TEAM_API_PLAYER_LEAVE', {
    team_id: self.data.teamId
  }, function (res) {
    wx.hideLoading();
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