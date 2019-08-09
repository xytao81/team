import http from "../../../utils/http.js";
import utils from "../../../utils/index.js";
import config from '../../../config/config.js'

const app = getApp();

Page({

  /**
   * 2
   */
  data: {
    token: null,

    id: 0,
    teamId: 0,
    url: '',

    isShare: 0,

    isAdmin: 0,

    teamRights: null,
    isPlayer: 0,
    league: {},
    team: {}
  },


  parseScene(scene) {
    if (!scene) return {};
    const obj = {};
    const arr = scene.split('||');
    if (arr[0]) obj.id = arr[0];
    if (arr[1]) obj.team_id = arr[1];
    obj.is_share = 1;
    return obj;
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    options = Object.assign(options, this.parseScene(options.scene));

    const id = options.id ? options.id : 0;
    const teamId = options.team_id ? options.team_id : 0;
    const isShare = options.is_share == 1 ? 1 : 0;
    const isAdmin = options.is_admin == 1 ? 1 : 0;

    const userToken = app.globalData.user.info.token;
    var token = options.token ? options.token : null;
    if (token && userToken == token) {
      token = null;
    }

    this.setData({ id: id, teamId: teamId, isShare: isShare, isAdmin: isAdmin, token: token });

    if (token) {
      return utils.loginByToken(token, function (res) {
        if (res.code != 200) {
          return wx.showModal({ content: "token 登录失败", confirmText: '确定', confirmColor: '#00a7f2', showCancel: false });
        }
      });
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    let self = this;

    if (self.data.token) {
      return utils.loginByToken(self.data.token, function (res) {
        if (res.code != 200) {
          return wx.showModal({ content: "token 登录失败", confirmText: '确定', confirmColor: '#00a7f2', showCancel: false });
        }
        return wx.redirectTo({ url: '/pages/index/index?open_league_id=' + self.data.id });
      });
    }
   
    self.loadRights(function(){
      let teamRights = self.data.teamRights === null ? '' : self.data.teamRights;
      let url = config.LEAGUE_URL + "/leaguedetail?id=" + self.data.id + "&team_id=" + self.data.teamId+"&is_mp=1&is_share="+self.data.isShare+"&is_admin="+self.data.isAdmin+"&team_rights="+teamRights+"&is_player="+self.data.isPlayer;
      console.log('url:', url);
      self.setData({ url: url });
      if (self.data.teamId) {
        self.loadTeam(self.data.teamId);
      }
    });
    self.loadLeague(self.data.id);
    
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage(e) {
    const self = this;
    let title = '邀请你关注【'+self.data.league.name+'】';
    if (self.data.team.name) {
      title = '【'+ self.data.team.name +'】邀请你关注【'+self.data.league.name+'】';
    }
    return {
      title: title,
      imageUrl: self.data.league.logo,
      path: '/pages/league/leagueitem/index_h5?id=' + self.data.league.id + '&team_id=' + self.data.teamId + '&is_share=1',
    }
  },

  loadTeam(teamId, callback) {
    var self = this;
    http.post('TEAM_API_INDEX_DETAIL', {
      id: teamId
    }, function(res) {
      if (res.code != 200) {
        return wx.showModal({ content: res.err, confirmText: '确定', confirmColor: '#00a7f2', showCancel: false });
      }
      self.setData({
        teamId: teamId,
        team: res.info
      });

      if (callback) callback();

    });
  },
  loadLeague(leagueId, callback) {
    const self = this;
    http.post('LEAGUE_API_DETAIL', { id: self.data.id, team_id: self.data.teamId }, function (res) {
      if (res.code != 200) {
        if (callback) callback();
        return;
      }
      self.setData({ league: res.info });
     
      if (callback) callback();
    });
  },
  loadRights(callback) {
    const self = this;
    http.post('TEAM_API_PLAYER_MYRIGHTS', { team_id: self.data.teamId }, function (res) {
      if (res.code != 200) {
        if (callback) callback();
        return;
      }
      var teamRights = null;
      if (res.info.rights !== undefined) {
        teamRights = res.info.rights;
      }
      let isPlayer = teamRights === null ? 0 : 1;

      self.setData({ teamRights: teamRights, isPlayer: isPlayer });
      if (callback) callback();
    });
  },

});