import http from "../../../utils/http.js";
import utils from "../../../utils/index.js";
import config from '../../../config/config.js'

const app = getApp();

Page({

  // 页面的初始数据
  data: {
    
    token: null,

    isShare: false,

    teamRights: 0,
    teamId: 0,
    team: {},
    from: '',

    hidebugs: false

  },

  gotoUrl: utils.gotoUrl,


  //沈桢  菜单点击回调 e.detail
  statClickMenu(e) {
    if (e.detail.type == 1) {
      wx.navigateTo({
        url: e.detail.url
      });
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
  loadRights(callback) {
    const self = this;
    wx.showLoading();
    http.post('TEAM_API_PLAYER_MYRIGHTS', { team_id: self.data.teamId }, function (res) {
      wx.hideLoading();
      if (res.code != 200) {
        return wx.showModal({ content: res.err, confirmText: '确定', confirmColor: '#00a7f2', showCancel: false });
      }
      if (res.info.rights != undefined) {
        wx.setStorageSync('currentTeamId', self.data.teamId);
        wx.setStorageSync('updateMyTeams', self.data.teamId);
        return wx.switchTab({ url: '/pages/team/teamhome/home' });
      }
      self.setData({ teamRights: res.info.rights ? res.info.rights : 0 });
      if (callback) callback();
    });
  },
  openInfo(){

    let url ="/pages/team/edit?team_id="+this.data.teamId;
    if(this.data.teamRights==0){
      url = "/pages/team/teamhome/info?team_id=" + this.data.teamId
    }
    wx.navigateTo({
      url: url,
    })

  },
  loadTeam(teamId) {
    this.setData({
      teamId: teamId
    })

    var self = this;
    http.post('TEAM_API_INDEX_DETAIL', {
      id: teamId
    }, function(res) {
      if (res.code != 200) {
        return wx.showModal({ content: res.err, confirmText: '确定', confirmColor: '#00a7f2', showCancel: false });
      }
      res.info.showname = res.info.name.substring(0, 20);
      self.setData({
        teamId: teamId,
        team: res.info
      });
      wx.hideLoading();

      //沈桢
      if (self.data.team.rights){
        self.selectComponent("#team_stat").onShow(teamId);
        self.selectComponent("#team_message").onShow(teamId);
      }
      
      // self.selectComponent("#team_league").onShow(teamId);
      self.selectComponent("#team_my_league").onShow(teamId);
      // self.selectComponent("#team_notice").onShow(teamId);
      // self.toggleTeamSelector(); // 调试用

    });
  },

  backToTeam() {
    return wx.switchTab({ url: '/pages/team/teamhome/home' });
  },

  // 生命周期函数--监听页面加载
  onLoad(options) {
    // wx.showModal({ content: "token:"+options.token, confirmText: '确定', confirmColor: '#00a7f2', showCancel: true });
    const self = this;
    const isShare = options.is_share == 1 ? true : false;
    const userToken = app.globalData.user.info.token;
    var token = options.token ? options.token : null;
    if (token && userToken == token) {
      token = null;
    }
    self.setData({ from: config.FROM, teamId: options.team_id, isShare: isShare, token: token });
  },
  onReady() {
    const self = this;
    if (self.data.token) {
      return utils.loginByToken(self.data.token, function (res) {
        if (res.code != 200) {
          return wx.showModal({ content: "token 登录失败", confirmText: '确定', confirmColor: '#00a7f2', showCancel: false });
        }
        return wx.redirectTo({ url: '/pages/index/index?open_team_id=' + self.data.teamId });
      });
    }
    if (!app.globalData.user.info.name || !app.globalData.user.info.login) {
      return wx.redirectTo({ url: '/pages/index/index?open_team_id=' + self.data.teamId });
    }
    self.loadRights(function () {
      self.loadTeam(self.data.teamId);
    });
  },

  showShareMenu() {
    wx.showShareMenu();
    console.log("显示了当前页面的转发按钮");
  },
  bindJoinTeam() {
    let id = this.data.teamId;
    console.log(id)
    let value = "我是" + app.globalData.user.info.name + ",想加入您的球队~~";
    this.selectComponent("#input").onShow(value);
    this.setData({ hidebugs: true });

    // let data = this.data.post_data;
    // data["id"] = id;
    // this.setData({ post_data: data })
  },
  cancelJoinTeam() {
    this.setData({ hidebugs: false });
  },
  onInpueDone(e) {
    console.log(e.detail)
    this.setData({ "post_data.value": e.detail.value, "post_data.form_id": e.detail.form_id, hidebugs: false });
    joinTeam(this);
  },
  onShareAppMessage: function(e) {
    if (e.from == 'button') {
      return {
        title: '快来加入我的球队【' + this.data.team.name + "】",
        imageUrl: this.data.team.logo,
        path: '/pages/team/teamhome/invite/player?team_id=' + this.data.team.id
      }
    } else {
      return {
        title: '【'+app.globalData.user.info.name+'】邀请你了解【'+this.data.team.name+'】',
        imageUrl: this.data.team.logo,
        path: '/pages/team/teamhome/view?team_id='+this.data.team.id+'&is_share=1'
      }
    }

  }

});

function joinTeam(self) {
  wx.showLoading()
  http.post('TEAM_API_PLAYER_ADD', {
    team_id: self.data.teamId,
    desc: self.data.post_data.value,
    form_id: self.data.post_data.form_id,
    app_id: app.globalData.appid, 
    session_key: app.globalData.secret
  }, function(res) {
    wx.hideLoading();

    if (res.code != 200) {
      return wx.showModal({ content: res.err, confirmText: '确定', confirmColor: '#00a7f2', showCancel: false });
    }

    return wx.showModal({
      title: '申请成功',
      content: '您的入队申请已发送，正等待球队管理员审核。请在微信中搜索关注“爱球迷服务号”，可以为您提供更多使用帮助和引导。',
      confirmText: '确定', confirmColor: '#00a7f2',
      showCancel: false,
      success: function () {
      }
    });
  });
}