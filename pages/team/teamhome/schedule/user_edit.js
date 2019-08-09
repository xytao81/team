import http from "../../../../utils/http.js";
import utils from "../../../../utils/index.js";
import validate from "../../../../utils/validate.js";
import config from '../../../../config/config.js'
import teamConfig from '../../../../utils/team_config.js';

import WeCropper from 'we-cropper/index.js'

const app = getApp();

function getNumbersArray(start, end) {
  let rangeArray = (start, end) => Array(end - start + 1).fill(0).map((v, i) => i + start)
  return rangeArray(start, end); // return [0,1,2,3,4,5,6,7,8,9,10]
} 
  
Page({

  // 页面的初始数据
  data: {

    teamId: 0,
    scheduleId: 0,
    uid: 0,

    schedule: {},
    enroll: {
      status: 0,
      content: null
    },

  },

  enrollSubmit(e) {
    const wxSessionKey = app.globalData.secret;
    const wxFormId = e.detail.formId;
    const wxAppId = app.globalData.appid;
    const wxOpenId = app.globalData.openid;
    const self = this;
    let enroll = self.data.enroll;
    for (let k in enroll.content) {
      for (let k2 in enroll.content[k]) {
        let field = enroll.content[k][k2];
        if (!field.is_select) continue;
        // console.log('检查', field);
        if (!field.value) {
          return wx.showModal({ content: field.name+'错误 '+ (field.value === undefined ? '' : field.value), confirmText: '确定', confirmColor: '#00a7f2', showCancel: false });
        }
      }
    }
    if (enroll.content['person_info'][2].is_select && enroll.content['person_info'][2].value == 0) {
      return wx.showModal({ content: '证件类型错误 ', confirmText: '确定', confirmColor: '#00a7f2', showCancel: false });
    }
    if (enroll.content['person_info'][2].is_select && enroll.content['person_info'][2].value == 1) {
      const res = validate.validateIdentity(enroll.content['person_info'][3].value);
      if (!res.result) {
        return wx.showModal({ content: '身份证错误 ' + enroll.content['person_info'][3].value, confirmText: '确定', confirmColor: '#00a7f2', showCancel: false });
      }
    }

    let data = {
      schedule_id: self.data.scheduleId,
      user_id: self.data.uid,
      content: JSON.stringify(self.data.enroll.content),
      wx_session_key: wxSessionKey,
      wx_form_id: wxFormId,
      wx_app_id: wxAppId,
      wx_open_id: wxOpenId
    };

    http.post('SCHEDULE_API_ENROLL_ENROLL', data, function (res) {
      if (res.code != 200) {
        return wx.showModal({ content: res.err, confirmText: '确定', confirmColor: '#00a7f2', showCancel: false });
      }
      return wx.showModal({
        content: '报名成功', confirmText: '确定', confirmColor: '#00a7f2', showCancel: false,
        success: function () {
          return wx.navigateBack({ delta: 1 });
          // wx.redirectTo({ url:"/pages/team/teamhome/schedule/detail?team_id="+self.data.teamId+"&schedule_id="+self.data.scheduleId });
        }
      });
    });
  },

  loadSchedule(scheduleId, callback) {
    const self = this;
    http.post('SCHEDULE_API_DETAIL', { id: scheduleId }, function (res) {
      if (res.code != 200) {
        return wx.showModal({ content: res.err, confirmText: '确定', confirmColor: '#00a7f2', showCancel: false });
      }
      const schedule = res.info;
      schedule.enrollFields = JSON.parse(schedule.enroll_fields);
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
      } else {
        enroll = self.data.enroll;
        enroll.content = self.data.schedule.enrollFields;
      }
      self.setData({ enroll: enroll });
      if (callback) callback();
    });
  },

  onUsereditChange(e) {
    console.log('资料修改组件事件的接收：', e);
    let enroll = this.data.enroll;
    enroll.content = e.detail.value;
    this.setData({ enroll: enroll });
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
    self.setData({ teamId: teamId, scheduleId: scheduleId, uid: uid });

    self.cropper1 = new WeCropper(this.data.cropper1Opt);
  },
  onReady: function () {
    const self = this;
    self.loadSchedule(self.data.scheduleId, function() {
      self.loadMyEnroll(self.data.scheduleId, function() {

      });
    });
  }

});
