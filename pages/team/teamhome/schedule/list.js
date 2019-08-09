import http from "../../../../utils/http.js";
import utils from "../../../../utils/index.js";
import config from '../../../../config/config.js'
import teamConfig from '../../../../utils/team_config.js';

const moment = require('moment');

const app = getApp();

Page({

  // 页面的初始数据
  data: {

    isAdmin: false,

    teamRights: null,

    from: '',
    teamId: '',
    team: {},
    schedules: [],

    page: 1,

    previousDay: '',
    nextDay: '',

    isLoading: false,

    hasMore: true,
    // 是否分享进入
    isShare: false

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

  gotoDetail(e) {
    if (this.data.teamRights == null) return;
    const playerId = e.currentTarget.dataset.playerid;
    const url = '/pages/team/players/detail?team_id='+this.data.teamId+'&player_id='+playerId;
    return wx.navigateTo({ url: url });
  },

  loadScheduleList(type, callback) {
    const self = this;
    if (self.data.isLoading) return;
    self.data.isLoading = true;
    let time = (type == 'up') ? self.data.previousDay : self.data.nextDay;
    http.post('SCHEDULE_API_LIST_BY_DAY', { team_id: this.data.teamId, type: type, time: time, limit: 3 }, function (res) {
      if (res.code != 200) {
        return wx.showModal({ content: res.err, confirmText: '确定', confirmColor: '#00a7f2', showCancel: false });
      }
      var hasMore = self.data.hasMore;
      var newSchedules = self.data.schedules;

      var days = res.info.days;
      for (let k in days) {
        for (let k2 in days[k].list) {
          if (type == 'up') {
            newSchedules.unshift(days[k].list[k2]);
          } else {
            newSchedules.push(days[k].list[k2]);
          }
        }
        // const job = teamConfig.getJob(players[k].job);
        // players[k].jobs = [job];
        // players[k].badge_name = self.getBadgeName(players[k]);
        // players[k].badge_class = self.getBadgeClass(players[k]);
        // players[k].position = teamConfig.getPosition(players[k].position);
      }
      if (days.length == 0) {
        hasMore = false;
      }
      if (days.length > 0) {
        if (type == 'up') {
          let previousDay = moment(days[days.length-1].date).subtract(1, 'day').format("YYYY-MM-DD");
          self.setData({ previousDay: previousDay });
        }
        if (type == 'down') {
          let nextDay = moment(days[days.length-1].date).add(1, 'day').format("YYYY-MM-DD");
          self.setData({ nextDay: nextDay });
        }
      } 
      self.setData({ schedules: newSchedules, hasMore: hasMore, isLoading: false });
      if (type == 'down' && newSchedules.length < 10) {
        if (hasMore && days.length == 3) {
          return self.loadScheduleList('down', callback);
        } else {
          return self.onPullDownRefresh();
        }
      }
      if (callback) callback();
    });
  },
  //转发给好友
  onShareAppMessage(res){
    let self = this;
    return {
      title:'球队日程',
      // action=captain_check&team_id=13093&from_player_id=165268
      path: '/pages/team/teamhome/schedule/list?action=captain_check&team_id='+self.data.teamId+'&is_share=1',        // 默认是当前页面，必须是以‘/’开头的完整路径
      imageUrl: self.data.posterUrl,
      success: (res)=> {
        // console.log("转发成功",res)
      },
      fail:(res)=> {
        // console.log("转发失败",res)
      }
    }
  },

  // 上拉加载
  onReachBottom(e) {
    // if (!this.data.hasMore) return;
    // this.loadScheduleList(this.data.page + 1);
    if (this.data.hasMore) this.loadScheduleList('down');
  },

  // 下拉加载
  onPullDownRefresh() {
    // console.log('下拉加载');
    this.loadScheduleList('up', function() {
      wx.stopPullDownRefresh();
    });
  },

  clearSchedules() {
    const self = this;
    self.setData({ schedules: [], page: 1, hasMore: true });
  },

  gotoAddSchedule() {
    return wx.navigateTo({ url: '/pages/team/teamhome/schedule/edit?team_id='+this.data.teamId+'&schedule_id=' });
  },

  onSelectNewScheduleType(e) {
    const self = this; 
    const itemList = ['创建活动', '创建比赛', '创建训练'];
    wx.showActionSheet({
      itemList: itemList,
      success(res) {
        let type = '';
        if (itemList[res.tapIndex] == '创建活动') {
          type = 1;
        } else if (itemList[res.tapIndex] == '创建比赛') {
          type = 2;
        } else if (itemList[res.tapIndex] == '创建训练') {
          type = 3;
        }
        return wx.navigateTo({ url: '/pages/team/teamhome/schedule/edit?team_id='+self.data.teamId+'&schedule_id=&type='+type });
      },
      fail(res) {
        // console.log('选择错误', res.errMsg);
      }
    });
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

  refresh() {
    if (this.data.isLoading) {
      return null;
    }
    this.setData({
      schedules: [],
      page: 1,

      previousDay: moment().subtract(1, 'day').format("YYYY-MM-DD") ,
      nextDay: moment().format("YYYY-MM-DD"),
      hasMore: true
    });
    this.onReady();
  },

  // 生命周期函数--监听页面加载
  onLoad(options) {
    const self = this;
    const teamId = options.team_id ? options.team_id : '';
    const isAdmin = options.is_admin == 1 ? 1 : 0;
    const isShare = options.is_share == 1 ? true : false;

    self.setData({
      from: config.FROM,
      teamId: teamId,
      isAdmin: isAdmin,
      isShare: isShare,
      previousDay: moment().subtract(1, 'day').format("YYYY-MM-DD") ,
      nextDay: moment().format("YYYY-MM-DD")
    });
  },

  onReady() {
    const self = this;
    // let updateTeamSchedules = 0;
    // if (self.data.schedules.length == 0) updateTeamSchedules = 1;
    // if (updateTeamSchedules) {
    //   self.loadRights(function () {
    //     // // 加载第一页列表数据
    //     self.clearSchedules();
    //     self.loadScheduleList(1);
    //   });
    //   wx.setStorageSync('updateTeamSchedules', 0);
    // }
    self.loadRights(function () {
      self.loadTeam(self.data.teamId, function() {
        self.clearSchedules();
        self.loadScheduleList('down');
      });
    });
  },
  onShow() {
    const self = this;
    var schedule = wx.getStorageSync('updateTeamSchedule');
    if (schedule) {
      let idx = self.data.schedules.findIndex(item => item.id == schedule.id);
      if (idx >= 0) {
        self.data.schedules[idx] = schedule;
      } else {
        self.data.schedules.push(schedule);
      }
      self.setData({ schedules: self.data.schedules });
      wx.removeStorageSync('updateTeamSchedule');
    }

    var schedule = wx.getStorageSync('updateTeamSchedule');
    if (schedule) {
      let idx = self.data.schedules.findIndex(item => item.id == schedule.id);
      if (idx >= 0) {
        self.data.schedules[idx] = schedule;
      } else {
        self.data.schedules.push(schedule);
      }
      self.setData({ schedules: self.data.schedules });
    }

    var deleteScheduleId = wx.getStorageSync('deleteTeamSchedule');
    if (deleteScheduleId) {
      let newSchedules = self.data.schedules.filter(item => item.id != deleteScheduleId);
      self.setData({ schedules: newSchedules });
      wx.removeStorageSync('deleteTeamSchedule');
    }
  }

});
