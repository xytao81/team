import http from "../../../../utils/http.js";
import utils from "../../../../utils/index.js";
import config from '../../../../config/config.js'
import teamConfig from '../../../../utils/team_config.js';

import WeCropper from 'we-cropper/index.js'
const device = wx.getSystemInfoSync(); // 获取设备信息
const width = device.windowWidth; // 示例为一个与屏幕等宽的正方形裁剪框
const height = device.windowHeight;

const app = getApp();

function getNumbersArray(start, end) {
  let rangeArray = (start, end) => Array(end - start + 1).fill(0).map((v, i) => i + start)
  return rangeArray(start, end); // return [0,1,2,3,4,5,6,7,8,9,10]
} 

Page({

  // 页面的初始数据
  data: {
    
    teamRights: 0,
    uid: 0,
    myUid: 0,

    denyModalVisible: false,
    refusalReason: '',

    enrollFieldsTitles: {
      'person_info': { text: '个人信息', count: 0 },
      'size': { text: '身材鞋码', count: 0 },
      'work': { text: '工作经历', count: 0 },
      'education': { text: '教育经历', count: 0 },
      'contact': { text: '紧急联系人', count: 0 },
      'tqi': { text: '资格条件', count: 0 }
    },

    numbersArray: getNumbersArray(1, 250),

    schedule: null,
    enroll: null

  },

  gotoEdit() {
    wx.navigateTo({ url:"/pages/team/teamhome/schedule/user_edit?team_id="+this.data.teamId+"&schedule_id="+this.data.scheduleId+"&uid="+this.data.uid });
  },

  onReasonChange(e) {
    this.setData({ refusalReason: e.detail.value });
  },

  openDenyModal() {
    const self = this;
    self.setData({ denyModalVisible: true });
  },
  hideDenyModal() {
    const self = this;
    self.setData({ denyModalVisible: false });
  },
  changePass() {
    const self = this;
    http.post('SCHEDULE_API_ENROLL_OPERATE', { id: self.data.enroll.id, status: 1, refusal_reason: '' }, function (res) {
      if (res.code != 200) {
        return wx.showModal({ content: res.err, confirmText: '确定', confirmColor: '#00a7f2', showCancel: false });
      }
      self.onReady();
    });
  },
  changeDeny() {
    const self = this;
    http.post('SCHEDULE_API_ENROLL_OPERATE', { id: self.data.enroll.id, status: 2, refusal_reason: self.data.refusalReason }, function (res) {
      if (res.code != 200) {
        return wx.showModal({ content: res.err, confirmText: '确定', confirmColor: '#00a7f2', showCancel: false });
      }
      self.hideDenyModal();
      self.onReady();
    });
  },

  enrollFieldsTitlesCount(content) {
    let enrollFieldsTitles = this.data.enrollFieldsTitles;
    for (let k in content) {
      let arr = content[k].filter(item => item.is_select == true);
      enrollFieldsTitles[k].count = arr.length;
    }
    this.setData({ enrollFieldsTitles: enrollFieldsTitles });
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
  loadSchedule(scheduleId, callback) {
    const self = this;
    http.post('SCHEDULE_API_DETAIL', { id: scheduleId }, function (res) {
      if (res.code != 200) {
        return wx.showModal({ content: res.err, confirmText: '确定', confirmColor: '#00a7f2', showCancel: false });
      }
      const schedule = res.info;
      schedule.region = [
        { id: res.info.province_id, name: res.info.province_name },
        { id: res.info.city_id, name: res.info.city_name },
        { id: res.info.district_id, name: res.info.district_name }
      ];
      schedule.introImagesArray = schedule.intro_images ? JSON.parse(schedule.intro_images) : [];
      if (schedule.enroll_fields) {
        schedule.enrollFields = JSON.parse(schedule.enroll_fields);
      }
      self.setData({ schedule: schedule });
      if (callback) callback();
    });
  },
  loadMyEnroll(scheduleId, callback) {
    const self = this;
    http.post('SCHEDULE_API_ENROLL_DETAIL', { schedule_id: scheduleId, user_id: self.data.uid }, function (res) {
      if (res.code != 200) {
        return wx.showModal({ content: res.err, confirmText: '确定', confirmColor: '#00a7f2', showCancel: false });
      }
      var enroll = res.info.enroll;
      if (enroll) {
        if (enroll.content) enroll.content = JSON.parse(enroll.content);
        self.setData({ enroll: enroll });
        self.enrollFieldsTitlesCount(enroll.content);
      }
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
    const uid = options.uid ? options.uid : null;
    if (!uid) {
      wx.showModal({ content: 'uid不能为空', confirmText: '确定', confirmColor: '#00a7f2', showCancel: false });
    }

    const myUid = app.globalData.user.info.uid ? app.globalData.user.info.uid : 0;
    self.setData({ teamId, teamId, scheduleId: scheduleId, uid: uid, myUid: myUid });
  },
  onReady: function () {
    const self = this;
    self.loadRights(function () {
      self.loadSchedule(self.data.scheduleId, function() {
        self.loadMyEnroll(self.data.scheduleId, function() {
        });
      });
    });
  }

});
