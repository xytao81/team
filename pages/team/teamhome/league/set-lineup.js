import leagueHttp from "../../../../utils/league_http.js";
const app = getApp();


Page({

  /**
   * 页面的初始数据
   */
  data: {
    current_team: null,

    league_id: 0,
    match_id: 0,
    team_id: 0,

    match_info: null,
    lineup_info: {
      leader_list: [],
      coach_list: [],
      player_list: [],
      other_list: []
    },
    first_list: [],
    second_list: [],
    is_show: false,
    lineup:-1,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      league_id: options.league_id,
      match_id: options.match_id,
      team_id: options.team_id
    });

    this.loadMatchInfo();
    this.loadLineup();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    let current_team = app.globalData.current_team;
    this.setData({
      current_team: current_team
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    let old = this.data.lineup_info;
    console.log(old);
    this.setData({
      lineup_info: old
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },


  loadMatchInfo: function() {
    let self = this;
    wx.showLoading();
    leagueHttp.post("MATCH_INFO", {
      id: this.data.match_id
    }, function(res) {
      wx.hideLoading();
      if (res.code != 200) {
        wx.showToast({
          title: res.err,
          icon: 'none',
          duration: 3000
        });
        return;
      }
      self.setData({
        match_info: res.info
      });
      self.isShow(res.info);

    });
  },

  loadleaderlist: function() {
    let self = this;
    leagueHttp.post("GET_LINEUP", {
      id: this.data.match_id,
      team_id: this.data.team_id,
      rights: 1
    }, function(res) {
      if (res.code != 200) {
        wx.hideLoading();
        wx.showToast({
          title: res.err,
          icon: 'none',
          duration: 3000
        });
        return;
      }

      let obj_list = self.data.lineup_info;
      obj_list['leader_list'] = res.info;
      self.loadcoachlist();
    });
  },
  loadcoachlist: function() {
    let self = this;
    leagueHttp.post("GET_LINEUP", {
      id: this.data.match_id,
      team_id: this.data.team_id,
      rights: 2
    }, function(res) {

      if (res.code != 200) {
        wx.hideLoading();
        wx.showToast({
          title: res.err,
          icon: 'none',
          duration: 3000
        });
        return;
      }

      let obj_list = self.data.lineup_info;
      obj_list['coach_list'] = res.info;
      self.loadplayerlist();
    });
  },
  loadplayerlist: function() {
    let self = this;
    leagueHttp.post("GET_LINEUP", {
      id: this.data.match_id,
      team_id: this.data.team_id,
      rights: 3
    }, function(res) {
      if (res.code != 200) {
        wx.hideLoading();
        wx.showToast({
          title: res.err,
          icon: 'none',
          duration: 3000
        });
        return;
      }

      //组装首发替补
      let f_list = [];
      let s_list = [];
      if (res.info) {
        for (let i = 0; i < res.info.length; i++) {
          let obj = res.info[i];
          if (!obj.is_first) continue;

          if (obj.is_first == 1) {
            f_list.push(obj);
          } else if (obj.is_first == 2) {
            s_list.push(obj);
          }
        }
      }

      self.setData({
        first_list: f_list,
        second_list: s_list,
      })

      let obj_list = self.data.lineup_info;
      obj_list['player_list'] = res.info;
      self.loadotherlist();
    });
  },
  loadotherlist: function() {
    let self = this;
    leagueHttp.post("GET_LINEUP", {
      id: this.data.match_id,
      team_id: this.data.team_id,
      rights: 4
    }, function(res) {
      if (res.code != 200) {
        wx.hideLoading();
        wx.showToast({
          title: res.err,
          icon: 'none',
          duration: 3000
        });
        return;
      }
      wx.hideLoading();

      let obj_list = self.data.lineup_info;
      obj_list['other_list'] = res.info;

      self.setData({
        lineup_info: obj_list,
      })

      //存储
      wx.setStorage({
        key: 'lineup',
        data: self.data.lineup_info,
      });
    });
  },

  loadLineup: function() {
    let self = this;
    wx.showLoading();
    self.loadleaderlist();
  },

  updateData: function(data) {
    let self = this;
    //组装首发替补
    let f_list = [];
    let s_list = [];
    if (data.player_list) {
      for (let i = 0; i < data.player_list.length; i++) {
        let obj = data.player_list[i];
        if (!obj.is_first) continue;

        if (obj.is_first == 1) {
          f_list.push(obj);
        } else if (obj.is_first == 2) {
          s_list.push(obj);
        }
      }
    }
    self.setData({
      lineup_info: data,
      first_list: f_list,
      second_list: s_list
    });

    //存储
    wx.setStorage({
      key: 'lineup',
      data: data,
    });
  },

  isShow: function(match_info) {
    var show;
    var lineup
    if (this.data.team_id == match_info.home.id) {
      show = match_info.home.lineup != 2;
      lineup = match_info.home.lineup;
    } else {
      show = match_info.away.lineup != 2;
      lineup = match_info.away.lineup;
    }
    this.setData({
      is_show: show,
      lineup: lineup
    })
  },

  //进入领队
  enterTeamLeader: function() {
    wx.navigateTo({
      url: '/pages/team/teamhome/league/select-player?type=1' + '&team_id=' + this.data.team_id + '&id=' + this.data.match_id
    });
  },
  //进入教练
  enterTeamCoach: function() {
    wx.navigateTo({
      url: '/pages/team/teamhome/league/select-player?type=2' + '&team_id=' + this.data.team_id + '&id=' + this.data.match_id
    });
  },
  //进入球员
  enterTeamPlayer: function() {
    wx.navigateTo({
      url: '/pages/team/teamhome/league/select-player?type=3' + '&team_id=' + this.data.team_id + '&id=' + this.data.match_id
    });
  },
  //进入官方
  enterTeamOfficial: function() {
    wx.navigateTo({
      url: '/pages/team/teamhome/league/select-player?type=4' + '&team_id=' + this.data.team_id + '&id=' + this.data.match_id
    });
  },

  formSubmit: function(e) {

    let self = this;
    wx.showLoading();

    for (let index = 0; index < self.data.lineup_info.leader_list.length; index++) {
      self.data.lineup_info.leader_list[index]['match_id'] = self.data.match_id;
      self.data.lineup_info.leader_list[index]['league_id'] = self.data.league_id;
      self.data.lineup_info.leader_list[index]['team_id'] = self.data.team_id;
    }

    for (let index = 0; index < self.data.lineup_info.coach_list.length; index++) {
      self.data.lineup_info.coach_list[index]['match_id'] = self.data.match_id;
      self.data.lineup_info.coach_list[index]['league_id'] = self.data.league_id;
      self.data.lineup_info.coach_list[index]['team_id'] = self.data.team_id;
    }

    for (let index = 0; index < self.data.lineup_info.player_list.length; index++) {
      self.data.lineup_info.player_list[index]['match_id'] = self.data.match_id;
      self.data.lineup_info.player_list[index]['league_id'] = self.data.league_id;
      self.data.lineup_info.player_list[index]['team_id'] = self.data.team_id;
    }

    for (let index = 0; index < self.data.lineup_info.other_list.length; index++) {
      self.data.lineup_info.other_list[index]['match_id'] = self.data.match_id;
      self.data.lineup_info.other_list[index]['league_id'] = self.data.league_id;
      self.data.lineup_info.other_list[index]['team_id'] = self.data.team_id;
    }

    let formId = e.detail.formId;
    if (formId == 'the formId is a mock one') {
      formId = '';
    }

    console.log(app.globalData)


    leagueHttp.post("ADD_ALL_PLAYER", {
        id: this.data.match_id,
        team_id: this.data.team_id,
        wx_session_key: app.globalData.secret, //大坑
        wx_app_id: app.globalData.appid,
        wx_open_id: app.globalData.openid,
        wx_form_id:formId,
        data: this.data.lineup_info,
        is_admin: 0
      },
      function(res) {
        wx.hideLoading();
        if (res.code != 200) {
          wx.showToast({
            title: res.err,
            icon: 'none',
            duration: 3000
          });
          return;
        }

        self.loadMatchInfo()

        wx.showModal({
          title: '提示',
          content: '提交成功,是否返回上个页面？',
          success(res) {
            if (res.confirm) {
              wx.navigateBack({
                delta: 1
              });
            } else if (res.cancel) {

            }
          }
        })
      });
  },
})