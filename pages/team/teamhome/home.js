import http from "../../../utils/http.js";
import utils from "../../../utils/index.js";
import config from '../../../config/config.js'

const app = getApp();

Page({

  // 页面的初始数据
  data: {

    teamId: 0,
    team: {},
    from: '',

    suggestLeagueIds: [],

    teamSelectorVisible: false,

    myTeams: [],

    imgUrls: [],
    // 是否分享进入
    isShare: false,
    userToken:'',

  },

  gotoUrl: utils.gotoUrl,

  openInfo() {
    return wx.navigateTo({ url: "/pages/team/teamhome/info?team_id=" + this.data.teamId });
    var url = "/pages/team/edit?team_id=" + this.data.teamId;
    if (this.data.team.rights == 0) {
      url = "/pages/team/teamhome/info?team_id=" + this.data.teamId
    }
  },

  toggleTeamSelector() {
    const self = this;
    self.setData({ teamSelectorVisible: !self.data.teamSelectorVisible });
    if (self.data.teamSelectorVisible) { // 若是展开，则重新查询一次
      http.post('TEAM_API_INDEX_MY', {}, function (res) {
        if (res.code != 200) {
          return wx.showModal({ content: res.err, confirmText: '确定', confirmColor: '#00a7f2', showCancel: false });
        }
        // res.info.list = []; // 调试空列表用
        self.setData({ myTeams: res.info.list });
      });
    }
  },

  selectTeam(e) {
    const teamId = e.currentTarget.dataset.id;
    this.toggleTeamSelector();
    wx.showLoading();
    this.loadTeam(teamId);
  },


  //沈桢  菜单点击回调 e.detail
  statClickMenu(e) {
    if (e.detail.type == 1) {
      wx.navigateTo({ url: e.detail.url });
    }
  },
  vsstatClick(e) {
    console.log('单击了统计数据');
  },

  gotoTeamInfo() {
    return wx.navigateTo({
      url: '/pages/team/teamhome/info?team_id=' + this.data.teamId
    });
  },

  gotoSearch() {
    return wx.navigateTo({
      url: '/pages/team/search'
    });
  },

  gotoCreate() {
    return wx.navigateTo({
      url: '/pages/team/create'
    });
  },
  gotoPlayer() {
    return wx.navigateTo({
      url: '/pages/team/players/list?team_id=' + this.data.teamId
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
      self.loadSuggestLeagueIds(teamId);
      res.info.showname = res.info.name.substring(0, 20);
      self.setData({ teamId: teamId, team: res.info });
      app.globalData.current_team = res.info;
      wx.setStorageSync('currentTeamId', teamId);

      //沈桢
      if (res.info.rights != 0) {
        self.selectComponent("#team_stat").onShow(teamId);
      }

      self.selectComponent("#team_message").onShow(teamId);
      // self.selectComponent("#team_schedule").onShow(teamId);
      self.selectComponent("#team_league").onShow(teamId, self.data.suggestLeagueIds);
      self.selectComponent("#team_my_league").onShow(teamId);
      self.selectComponent("#team_my_schedule").onShow(teamId);
      self.selectComponent("#team_statistics").refresh();
      // self.selectComponent("#team_vs_stat").onShow(teamId);
      // self.selectComponent("#team_notice").onShow(teamId);
      // self.toggleTeamSelector(); // 调试用
      if (callback) callback();

    });
  },

  loadMyTeams(callback) {
    const self = this;
    wx.removeStorageSync('updateMyTeams');
    http.post('TEAM_API_INDEX_MY', {}, function (res) {
      if (res.code != 200) {
        return wx.showModal({ content: res.err, confirmText: '确定', confirmColor: '#00a7f2', showCancel: false });
      }
      // res.info.list = []; // 调试空列表用
      self.setData({
        myTeams: res.info.list
      });
      if (res.info.list.length > 0) {
        const currentTeamId = wx.getStorageSync('currentTeamId');
        const currentTeamIdIndex = res.info.list.findIndex(item => item.id == currentTeamId);
        const teamId = currentTeamIdIndex >= 0 ? currentTeamId : res.info.list[0].id;
        return self.loadTeam(teamId, callback);
      }
    });
  },

  loadSuggestLeagueIds(teamId) {
    const self = this;
    var suggestLeagueIdsStr = wx.getStorageSync('suggestLeagueIdsStr-'+teamId);
    var suggestLeagueIds = suggestLeagueIdsStr ? suggestLeagueIdsStr.split(',') : [];
    this.setData({ suggestLeagueIds: suggestLeagueIds });
  },

  // 生命周期函数--监听页面加载
  onLoad(options) {
    const self = this;
    const isShare = options.is_share == 1 ? true : false;
    self.setData({ from: config.FROM,isShare: isShare ,userToken:app.globalData.user.info.token});
  },

  onReady() {
    const self = this;
    wx.removeStorageSync('updateTeamHome');
    wx.removeStorageSync('updateMyTeams');
    const enrollLeagueId = wx.getStorageSync('enrollLeagueId');
    wx.showLoading();
    http.post('TEAM_API_INDEX_MY', {}, function (res) {
      if (res.code != 200) {
        return wx.showModal({ content: res.err, confirmText: '确定', confirmColor: '#00a7f2', showCancel: false });
      }
      // res.info.list = []; // 调试空列表用
      self.setData({ myTeams: res.info.list });
      if (res.info.list.length == 0) {
        wx.hideLoading();
        if (enrollLeagueId) {
          return wx.showModal({ content: "请先创建或者加入一支球队后搜索赛事ID: " + enrollLeagueId + ",去报名比赛", confirmText: '确定', confirmColor: '#00a7f2', showCancel: false });
        }
        if (self.data.from != "aqm") {
          return wx.showModal({ content: "您没有球队，请先去注册", confirmText: '确定', confirmColor: '#00a7f2', showCancel: false });
        }
        return;
      }

      const currentTeamId = wx.getStorageSync('currentTeamId');
      const currentTeamIdIndex = res.info.list.findIndex(item => item.id == currentTeamId);
      const teamId = currentTeamIdIndex >= 0 ? currentTeamId : res.info.list[0].id;

      return self.loadTeam(teamId, function () {
        wx.hideLoading();

        //沈桢 报名使用
        if (enrollLeagueId) {
          if (self.data.myTeams.length > 0) {
            //只有一只球队。直接去报名
            let rights = self.data.team.rights;
            if (rights != 0) {
              //是管理员直接去报名
              wx.showModal({
                content: "是否立即去报名参加比赛",
                confirmText: '立即报名',
                showCancel: true,
                success: function (res) {
                  wx.removeStorageSync('enrollLeagueId');
                  if (!res.confirm) return;
                  return wx.navigateTo({ url: '/pages/league/enroll/index?league_id=' + enrollLeagueId + "&team_id=" + self.data.team.id, });
                }
              });

            } else {
              //不是管理员
              wx.showModal({ content: "请联系球队管理员去报名赛事,或者切换球队后搜索赛事ID: " + enrollLeagueId + ",去报名比赛", confirmText: '确定', confirmColor: '#00a7f2', showCancel: false });
            }
          }
        }

      });

    });

  },
  onShow() {
    const self = this;
    const updateMyTeams = wx.getStorageSync('updateMyTeams');
    if (updateMyTeams) {
      self.loadMyTeams();
    }
    const updateTeamHome = wx.getStorageSync('updateTeamHome');
    if (updateTeamHome) {
      self.onReady();
    }
  },

  onPullDownRefresh() {
    this.loadMyTeams(function () {
      wx.stopPullDownRefresh();
    });
  },

  showShareMenu() {
    wx.showShareMenu();
    console.log("显示了当前页面的转发按钮");
  },
  onShareAppMessage: function (e) {
    let title = '快来加入我的球队【' + this.data.team.name + "】";
    if (app.globalData.user && app.globalData.user.info) {
      title = app.globalData.user.info.name + "邀请你加入【" + this.data.team.name + "】成为【队员】"
    }

    let page = '/pages/index/index?open_team_id=' + this.data.teamId + '&is_share=1';
    console.log(page);
    return {
      title: title,
      imageUrl: this.data.team.logo,
      path: page
    }

    /*
    if(e.from=='button'){
      return {
        title: '快来加入我的球队【' + this.data.team.name + "】",
        imageUrl: this.data.team.logo,
        path: '/pages/team/teamhome/invite/player?team_id=' + this.data.team.id
      }
    }else{
      return {
        title: '欢迎使用爱球迷球队小程序',
        imageUrl: 'http://www.aiqiumi.cn/leaguemanage/images/84ae9726.gz.jpg',
        path: '/pages/index/index',
      }
    }
    */
  }

});