// pages/team/teamhome/schedule/user.js
import http from "../../../../utils/http.js";
import utils from "../../../../utils/index.js";
import config from '../../../../config/config.js'
import teamConfig from '../../../../utils/team_config.js';

const app = getApp();

Page({

  // 页面的初始数据
  data: {

    pageType: 1,

    totalCount: 0,

    from: '',
    teamId: '',
    team: {},

    enrolls: [],

    currentType: 0,
    state: 0

  },

  signin(e) {
    // console.log('eee', e);
    const uid = e.currentTarget.dataset.uid;
    const self = this;
    http.post('SCHEDULE_API_ENROLL_SIGNIN', { schedule_id: self.data.scheduleId, user_id: uid }, function (res) {
      if (res.code != 200) {
        return wx.showModal({ content: res.err, confirmText: '确定', confirmColor: '#00a7f2', showCancel: false });
      }
      self.onReady();
      // const enrolls = res.info.list;
      // self.setData({ enrolls: enrolls });
      // if (callback) callback();
    });
  },

  onUsersUpdate(e) {
    // let state = this.data.state;
    // this.loadScheduleEnrollList(this.data.scheduleId, state);
    this.onReady();
  },

  //点击选项卡事件
  onTabsItemTab(e){
    let index = e.target.dataset.index;
    this.setData({ currentType: index, state: index });
    this.loadScheduleEnrollList(this.data.scheduleId, index);
  },
//接收到子组件传递的值
  onClickUser(e) {
    const user = e.detail.user;
    wx.navigateTo({ url: "/pages/team/teamhome/schedule/user?team_id="+this.data.teamId+"&schedule_id="+this.data.scheduleId+"&uid="+user.uid });
  },

  // changePageType() {
  //   let pageType = this.data.pageType == 1 ? 2 : 1;
  //   if (pageType == 2) {
  //     let index = 1;
  //     this.setData({ currentType: index, state: index });
  //     this.loadScheduleEnrollList(this.data.scheduleId, index);
  //   } else {
  //     let index = 1;
  //     this.setData({ currentType: index, state: index });
  //     this.loadScheduleEnrollList(this.data.scheduleId, index);
  //   }
  //   this.setData({ pageType: pageType });
  // },

  loadSchedule(scheduleId, callback) {
    const self = this;
    http.post('SCHEDULE_API_DETAIL', { id: scheduleId }, function (res) {
      if (res.code != 200) {
        return wx.showModal({ content: res.err, confirmText: '确定', confirmColor: '#00a7f2', showCancel: false });
      }
      const schedule = res.info;
      self.setData({ schedule: schedule });
      if (callback) callback();
    });
  },
  loadScheduleEnrollList(scheduleId, status, callback) {
    const self = this;
    self.setData({ enrolls: [] });
    http.post('SCHEDULE_API_ENROLL_LIST', { schedule_id: scheduleId, status: status }, function (res) {
      if (res.code != 200) {
        return wx.showModal({ content: res.err, confirmText: '确定', confirmColor: '#00a7f2', showCancel: false });
      }
      const enrolls = res.info.list;
      self.setData({ enrolls: enrolls });
      if (callback) callback();
    });
  },

  // 生命周期函数--监听页面加载
  onLoad(options) {
    const self = this;
    const teamId = options.team_id ? options.team_id : null;
    if (!teamId) {
      wx.showModal({ content: '球队ID不能为空', confirmText: '确定', confirmColor: '#00a7f2', showCancel: false });
    }
    const scheduleId = options.schedule_id ? options.schedule_id : null;
    if (!scheduleId) {
      wx.showModal({ content: '活动ID不能为空', confirmText: '确定', confirmColor: '#00a7f2', showCancel: false });
    }
    self.setData({ teamId: teamId, scheduleId: scheduleId });
  },
  onReady: function () {
    const self = this;
    self.loadSchedule(self.data.scheduleId, function() {
      self.loadScheduleEnrollList(self.data.scheduleId, self.data.state);
    });
  },
  onShow: function () {
    this.onReady();
  }

});
