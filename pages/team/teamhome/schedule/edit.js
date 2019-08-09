import http from "../../../../utils/http.js";
import utils from "../../../../utils/index.js";
import config from '../../../../config/config.js'
import teamConfig from '../../../../utils/team_config.js';

import WeCropper from 'we-cropper/index.js'

const device = wx.getSystemInfoSync(); // 获取设备信息
const width = device.windowWidth; // 示例为一个与屏幕等宽的正方形裁剪框
const height = device.windowHeight;

const app = getApp();

var moment = require('moment');

function getLimitNumbers() {
  let rangeArray = (start, end) => Array(end - start + 1).fill(0).map((v, i) => i + start)
  // let rangeArray = (start,end) => Array(end-start +1).fill

   // return [0,1,2,3,4,5,6,7,8,9,10]
  return ['不限人数', ...rangeArray(1,500)];
} 

Page({

  // 页面的初始数据
  data: {

    chooseTeam:0,//判断主队或客队

    teamId: 0,
    team: null,
    type: 1,

    limitNumbers: getLimitNumbers(),
    limitIndex: 0,

    enrollFields: null,
    enrollFieldsTitles: {
      'person_info': '个人信息',
      'size': '身材鞋码',
      'work': '工作经历',
      'education': '教育经历',
      'contact': '紧急联系人',
      'tqi': '资格条件'
    },
    // contact
    enrollFieldsText: '',

    focusOnIntro: false,

    cropper1config: {
      cut: {
        x: (width - 320) / 2, // 裁剪框x轴起点
        y: (width - 180) / 2, // 裁剪框y轴期起点
        width: 320, // 裁剪框宽度
        height: 180 // 裁剪框高度
      },
      dest: {
        width: 320*5,
        height: 180*5
      }
    },

    liveLeftCount: null,
    needLive: 0,

    editData: {
      type: 1,
      is_home: 1,
      target_team_name: '',
      banner_url: '',
      name: '',
      start_time: null,
      region: [
        { id: 0, name: '' },
        { id: 0, name: '' },
        { id: 0, name: '' }
      ],
      province_id: null,
      city_id: null,
      district_id: null,
      address: '',
      place: '',
      place_lat: '',
      place_lng: '',
      sponsor: '',

      intro_images: null,
      introImagesArray: [],
      intro: '', 

      is_enroll: 0,
      is_verify: 0,
      need_enroll_time: 0,
      enroll_start_time: null,
      enroll_end_time: null,
      players_max: 1000,

      live_id: null,

      enrollFields: {},
      status_count : {
        agreed:0,
        all:0,
        arrived:0,
        denied:0,
        vacated:0,
        waiting:0,
      }
    }

  },

  openBannerSheet() {
    var self = this;
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['camera', 'album'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        self.cropper1.pushOrign(res.tempFilePaths[0]);
        self.setData({ cropper1Visible: true });
      }
    });
  },

  cropper1GetImage(callback) {
    const self = this;
    self.cropper1.getCropperImage({ destWidth: 800, destHeight: 450, fileType: 'jpg' }, (tempFilePath) => {
      if (!tempFilePath) {
        return console.log('获取图片地址失败，请稍后重试');
      }
      self.setData({ cropper1Visible: false });
      wx.showLoading();
      wx.uploadFile({
        url: config.BASE_URL + '/aqm/tool/api/upload/file',
        // url: 'http://192.168.0.21:3000/tool/api/upload/file',
        filePath: tempFilePath,
        name: 'file',
        formData: {},
        success (res2){
          wx.hideLoading();
          if (res2.statusCode != 200) {
            console.log('upload result:::', res2);
            return wx.showModal({ content: '上传失败', confirmText: '确定', confirmColor: '#00a7f2', showCancel: false });
          }
          var obj = JSON.parse(res2.data);
          self.setData({ 'editData.banner_url': obj.result });
        }
      });
    })
  },
  cropper1TouchStart (e) { this.cropper1.touchStart(e) },
  cropper1TouchMove (e) { this.cropper1.touchMove(e) },
  cropper1TouchEnd (e) { this.cropper1.touchEnd(e) },

  onChangeHomeTeam(e) {
    const value = e.currentTarget.dataset.ishome == 1 ? 1 : 0;
    this.setData({ 'editData.is_home': value });
  },

  bindInputChange: function (e) {
    let editData = this.data.editData;
    let key = e.currentTarget.dataset.key;
    let value = e.detail.value;
    // if (key == 'number') {
    //   if (value > 99) {
    //     wx.showModal({ content: '球衣号不能大于 99', confirmText: '确定', confirmColor: '#00a7f2', showCancel: false });
    //     value = '';
    //   }
    //   if (escape(value).indexOf( "%u" ) >= 0) {
    //     wx.showModal({ content: '球衣号不能包含中文', confirmText: '确定', confirmColor: '#00a7f2', showCancel: false });
    //     value = '';
    //   }
    // }
    // if (key == 'height') {
    //   if (value > 300) {
    //     wx.showModal({ content: '身高不能大于 300', confirmText: '确定', confirmColor: '#00a7f2', showCancel: false });
    //     value = '';
    //   }
    //   if (escape(value).indexOf( "%u" ) >= 0) {
    //     wx.showModal({ content: '身高不能包含中文', confirmText: '确定', confirmColor: '#00a7f2', showCancel: false });
    //     value = '';
    //   }
    // }
    // if (key == 'weight') {
    //   if (value > 300) {
    //     wx.showModal({ content: '体重不能大于 200', confirmText: '确定', confirmColor: '#00a7f2', showCancel: false });
    //     value = '';
    //   }
    //   if (escape(value).indexOf( "%u" ) >= 0) {
    //     wx.showModal({ content: '体重不能包含中文', confirmText: '确定', confirmColor: '#00a7f2', showCancel: false });
    //     value = '';
    //   }
    // }
    editData[key] = value;
    this.setData({ editData: editData });
  },
  bindTimeChange: function (e) {
    let editData = this.data.editData;
    let key = e.currentTarget.dataset.key;
    let value = moment(e.detail.value).format('YYYY-MM-DD HH:mm');
    editData[key] = value;
    this.setData({ editData: editData });
  },
  bindSwitchChange(e) {
    let editData = this.data.editData;
    let key = e.currentTarget.dataset.key;
    let value = e.detail.value ? 1 : 0;
    editData[key] = value;
    this.setData({ editData: editData });
  },
  bindLiveSwitchChange(e) {
    let value = e.detail.value ? 1 : 0;
    this.setData({ needLive: value });
  },
  bindRegionChange(e) {
    console.log('region event:', e);
    this.setData({
      'editData.province_id': e.detail.checked[0].id,
      'editData.city_id': e.detail.checked[1].id,
      'editData.district_id': e.detail.checked[2].id,
      'editData.province_name': e.detail.checked[0].name,
      'editData.city_name': e.detail.checked[1].name,
      'editData.district_name': e.detail.checked[2].name,
      'editData.region': e.detail.checked
    });
  },
  bindLimitChange(e) {
    const limitIndex = e.detail.value;
    var value = this.data.limitNumbers[limitIndex] ? this.data.limitNumbers[limitIndex] : 0;
    if (limitIndex == 0) {
      value = 0;
    }
    this.setData({ 'limitIndex': limitIndex, 'editData.players_max': value });
  },

  focusOnIntro() { this.setData({ 'focusOnIntro': true }); },
  focusOutIntro() { this.setData({ 'focusOnIntro': false }); },
  bindIntroChange(e) { this.setData({ 'editData.intro': e.detail.value }); },

  openImageSheet() {
    var self = this;
    var introImagesArray = self.data.editData.introImagesArray;
    wx.chooseImage({
      count: 9-introImagesArray.length, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['camera', 'album'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        wx.showLoading();
        http.uploadPhoto(res.tempFilePaths, function (urls) {
          for (let k in urls) {
            introImagesArray.push(urls[k]);
          }
          self.setData({ 'editData.intro_images': JSON.stringify(introImagesArray), 'editData.introImagesArray': introImagesArray });
          wx.hideLoading();
        });
      }
    });
  },
  deleteImage(e) {
    const idx = e.currentTarget.dataset.idx;
    const introImagesArray = this.data.editData.introImagesArray;
    introImagesArray.splice(idx, 1);
    this.setData({ 'editData.intro_images': JSON.stringify(introImagesArray), 'editData.introImagesArray': introImagesArray });
  },
  getFieldValue(e){ 
      console.log('收到子组件的field的值：：：：：',e,e.detail.content);
      const enrollFields = e.detail.content;
      this.setData({ 'editData.enrollFields': enrollFields });
      this.resetEnrollFieldsText();

  },
  resetEnrollFieldsText() {
    const enrollFields = this.data.editData.enrollFields;
    var arr = [];
    for (let k in enrollFields) {
      for (let k2 in enrollFields[k]) {
        if (!enrollFields[k][k2].is_select) continue;
          arr.push(enrollFields[k][k2].name);
      }
    }
    this.setData({ enrollFieldsText: arr.join('，') });
  },

  cannotModifyTime() {
    return wx.showModal({ content: '当直播开始后，不能修改时间', confirmText: '确定', confirmColor: '#00a7f2', showCancel: false });
  },

  editSubmit() {
    var self = this;
    if (self.data.editData.type == 2) { // 创建比赛，根据对方队伍名称生成标题
      if (!self.data.editData.target_team_name || self.data.editData.target_team_name.length > 50) {
        return wx.showModal({ content: '请填写队伍名称', confirmText: '确定', confirmColor: '#00a7f2', showCancel: false });
      }
      const title = self.data.editData.is_home ? self.data.team.name + ' VS ' + self.data.editData.target_team_name : self.data.editData.target_team_name + ' VS ' + self.data.team.name;
      self.data.editData.title = title;
    }
    if (!self.data.editData.title || self.data.editData.title.length > 200) {
      return wx.showModal({ content: '请填写活动名称', confirmText: '确定', confirmColor: '#00a7f2', showCancel: false });
    }
    if (self.data.editData.type != 4 && !self.data.editData.start_time) {
      return wx.showModal({ content: '请填写开始时间', confirmText: '确定', confirmColor: '#00a7f2', showCancel: false });
    }
    if(self.data.editData.is_enroll==1){
      if (self.data.editData.need_enroll_time) {
        if (!self.data.editData.enroll_start_time || !self.data.editData.enroll_end_time) {
          return wx.showModal({ content: '请填写报名时间', confirmText: '确定', confirmColor: '#00a7f2', showCancel: false });
        }
        if (moment(self.data.editData.enroll_end_time).isBefore(self.data.editData.enroll_start_time)) {
          return wx.showModal({ content: '报名开始时间不能晚于结束时间', confirmText: '确定', confirmColor: '#00a7f2', showCancel: false });
        }
      }
      self.data.editData.players_max = parseInt(self.data.editData.players_max);
      if (self.data.editData.players_max <= 0) {
        return wx.showModal({ content: '请填写报名人数', confirmText: '确定', confirmColor: '#00a7f2', showCancel: false });
      }
      if (self.data.editData.is_enroll) {
        if (self.data.editData.enrollFields.person_info[2].is_select || self.data.editData.enrollFields.person_info[3].is_select) {
          if (!self.data.editData.enrollFields.person_info[2].is_select) {
            return wx.showModal({ content: '请选择证件类型', confirmText: '确定', confirmColor: '#00a7f2', showCancel: false });
          }
          if (!self.data.editData.enrollFields.person_info[3].is_select) {
            return wx.showModal({ content: '请选择证件号码', confirmText: '确定', confirmColor: '#00a7f2', showCancel: false });
          }
        } 
      }
    }

    // 有直播时
    if (self.data.needLive) {
      if (!self.data.editData.live_id || (self.data.editData.live.live.status == 1) ) { // 检测时间是否合法，条件符合则检测
        // if (self.data.editData.live.live) {
        //   if (!moment(self.data.editData.start_time).isSame( moment() ))
        // }
        if (moment(self.data.editData.start_time).isBefore( moment() )) {
          return wx.showModal({ content: '有直播时，开始时间不能早于当前时间', confirmText: '确定', confirmColor: '#00a7f2', showCancel: false });
        }
      }
    }

    var data = {
      team_id: self.data.teamId,
      type: self.data.editData.type,
      banner_url: self.data.editData.banner_url,
      title: self.data.editData.title,
      is_home: self.data.editData.is_home,
      target_team_name: self.data.editData.target_team_name,
      start_time: self.data.editData.start_time,
      province_id: self.data.editData.province_id,
      city_id: self.data.editData.city_id,
      district_id: self.data.editData.district_id,
      address: self.data.editData.address,
      place: self.data.editData.place,
      place_lat: self.data.editData.place_lat,
      place_lng: self.data.editData.place_lng,
      sponsor: self.data.editData.sponsor,
      intro: self.data.editData.intro,
      intro_images: self.data.editData.introImagesArray.length > 0 ? JSON.stringify(self.data.editData.introImagesArray) : null,
      is_enroll: self.data.editData.is_enroll,
      is_verify: self.data.editData.is_verify,
      need_enroll_time: self.data.editData.need_enroll_time,
      enroll_start_time: self.data.editData.enroll_start_time,
      enroll_end_time: self.data.editData.enroll_end_time,
      players_max: self.data.editData.players_max,
      enroll_fields: JSON.stringify(self.data.editData.enrollFields)
    };
    self.data.editData.team_name = self.data.team.name;
    console.log('editData:::', data);

    // 做标记刷新
    wx.setStorageSync('updateTeamHome', 1);
    wx.showLoading();
    if (self.data.editData.id) {
      data.id = self.data.editData.id;
      http.post('SCHEDULE_API_EDIT', data, function (res) {
        wx.hideLoading();
        if (res.code != 200) {
          return wx.showModal({ content: res.err, confirmText: '确定', confirmColor: '#00a7f2', showCancel: false });
        }
        wx.setStorageSync('updateTeamSchedule', self.data.editData);
        return self.checkLive('edit');
      });
    } else {
      http.post('SCHEDULE_API_ADD', data, function (res) {
        wx.hideLoading();
        if (res.code != 200) {
          return wx.showModal({ content: res.err, confirmText: '确定', confirmColor: '#00a7f2', showCancel: false });
        }
        self.data.scheduleId = res.info.insertId;
        self.data.editData.id = res.info.insertId;
        wx.setStorageSync('updateTeamSchedule', self.data.editData);
        return self.checkLive('add');
      });
    }
  },

  checkLive(action) {
    const self = this;
    let actionText = '发布成功'; // action == 'edit' ? '修改成功' : '发布成功';
    let helpText = "活动开始前1小时，可以用“爱球迷助手”APP控制手机或摄像机进行直播拍摄，活动后自动生成视频回放。请使用小程序的用户名/手机号+密码登录“爱球迷助手”APP，选择您的球队进入，按日历找到直播任务，开始直播。\n\n（如未安装“爱球迷助手”APP，请至各大应用商店或爱球迷官网下载。）";
    let needLive = self.data.needLive;
    let hasLive = self.data.editData.live_id ? true : false;
    if (hasLive) {
      if (!needLive) {
        return self.cancelLive(function() {
          return wx.showModal({
            content: actionText,
            confirmText: '确定', confirmColor: '#00a7f2', 
            showCancel: false,
            success: function () {
              return wx.navigateBack({ delta: 1 });
            }
          });
        });
      }
      return self.addLive(function() {
        return wx.showModal({
          title: actionText,
          content: helpText,
          confirmText: '确定', confirmColor: '#00a7f2', 
          showCancel: false,
          success: function () {
            return wx.navigateBack({ delta: 1 });
          }
        });
      });
    }
    // 目前没有直播
    if (!needLive) {
      return wx.showModal({
        content: actionText,
        confirmText: '确定', confirmColor: '#00a7f2', 
        showCancel: false,
        success: function () {
          return wx.navigateBack({ delta: 1 });
        }
      });
    }
    self.loadLiveLeftCount(function(liveLeftCount) {
      if (!liveLeftCount) {
        return wx.showModal({
          title: actionText,
          content: "发布成功，但无法添加直播，因为没有可用的直播场次了。请至“控制台-帐户中心”购买后，再进入“日程管理”重新添加直播。",
          confirmText: '确定', confirmColor: '#00a7f2', 
          showCancel: false,
          success: function () {
            return wx.navigateTo({ url: "/pages/my/card/list?team_id="+self.data.teamId });
          }
        });
      }
      return self.addLive(function() {
        return wx.showModal({
          title: actionText,
          content: helpText,
          confirmText: '确定', confirmColor: '#00a7f2', 
          showCancel: false,
          success: function () {
            return wx.navigateBack({ delta: 1 });
          }
        });
      });

    });
    // return wx.showModal({
    //   title: '需要添加视频直播吗？',
    //   content: '活动开始前1小时，可以用“爱球迷助手”APP控制手机或摄像机进行直播拍摄，活动后自动生成视频回放，还能剪辑精彩集锦。',
    //   confirmText: '添加',
    //   cancelText: '暂不需要',
    //   showCancel: true,
    //   success: function (res) {
    //     if (res.cancel) {
    //       return wx.navigateBack({ delta: 1 });
    //     }
    //     return self.openAddLiveModal();
    //   }
    // });
  },

  loadLiveLeftCount(callback) {
    const self = this;
    let liveLeftCount = self.data.liveLeftCount;
    if (liveLeftCount !== null) {
      return callback(liveLeftCount);
    }
    http.post('PAY_API_COUPON_TOTAL', { group_id: self.data.teamId }, function(res) {
      if (res.code != 200) {
        return wx.showModal({ content: res.err, confirmText: '确定', confirmColor: '#00a7f2', showCancel: false });
      }
      let liveLeftCount = res.info[2].left_count;
      self.data.liveLeftCount = liveLeftCount;
      return callback(liveLeftCount);
    });

  },

  // openAddLiveModal() {
  //   var self = this;
  //   self.loadLiveLeftCount(function(liveLeftCount) {
  //     if (!liveLeftCount) {
  //       return wx.navigateTo({ url: "/pages/my/card/list?team_id="+self.data.teamId });
  //     }
  //     return self.addLive(function() {
  //       return wx.navigateBack({ delta: 1 });
  //     });

  //   });
  // },
  addLive(callback) {
    var self = this;
    var liveStartTime = '';
    var liveEndTime = '';
    if (self.data.editData.type == 4) {
      liveStartTime = self.data.editData.match.start_time;
      liveEndTime = self.data.editData.match.end_time;
    } else {
      liveStartTime = self.data.editData.start_time;
    }
    if (self.data.editData.live_id ) {
      if (self.data.editData.live.live.status != 1) { // 正在直播时不操作直播
        if (callback) callback();
        return;
      }
    }
    http.post('SCHEDULE_API_LIVE_ADD', { schedule_id: self.data.scheduleId, group_id: self.data.teamId, start_time: liveStartTime, end_time: liveEndTime }, function(res) {
      if (res.code != 200) {
        return wx.showModal({ content: res.err, confirmText: '确定', confirmColor: '#00a7f2', showCancel: false });
      }
      if (callback) callback();
    });
  },

  cancelLive(callback) {
    var self = this;
    http.post('SCHEDULE_API_LIVE_CANCEL', { schedule_id: self.data.scheduleId, group_id: self.data.teamId }, function(res) {
      if (res.code != 200) {
        return wx.showModal({ content: res.err, confirmText: '确定', confirmColor: '#00a7f2', showCancel: false });
      }
      if (callback) callback();
    });
  },

  chooseLocation() {
    const self = this;
    wx.chooseLocation({
      type: 'wgs84',
      success: function (res) {
        console.log('wxChooseLocaion backed', res);
        // if (res.name) self.setData({ 'editData.place': res.name });
        if (res.address) self.setData({ 'editData.address': res.address });
        if (res.latitude) self.setData({ 'editData.place_lat': res.latitude });
        if (res.longitude) self.setData({ 'editData.place_lng': res.longitude });
      },
      fail: function () {
        return wx.showModal({ content: '未授权定位', confirmText: '确定', confirmColor: '#00a7f2', showCancel: false });
      }
    });
  },

  loadEnrollFields(callback) {
    const self = this;
    http.post('SCHEDULE_API_GET_ENROLL_FIELDS', { }, function (res) {
      if (res.code != 200) {
        return wx.showModal({ content: res.err, confirmText: '确定', confirmColor: '#00a7f2', showCancel: false });
      }
      // console.log( JSON.stringify(res.info.enroll_fields) );
      self.setData({ enrollFields: res.info.enroll_fields });
      if (callback) callback();
    });
  },

  loadTeam(callback) {
    var self = this;
    http.post('TEAM_API_INDEX_DETAIL', { id: self.data.teamId }, function(res) {
      if (res.code != 200) {
        return wx.showModal({ content: res.err, confirmText: '确定', confirmColor: '#00a7f2', showCancel: false });
      }
      self.setData({ team: res.info });
      if (callback) callback();
    });
  },

  loadSchedule(scheduleId, callback) {
    const self = this;
    http.post('SCHEDULE_API_DETAIL', { id: scheduleId }, function (res) {
      wx.hideLoading();
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
      var limitIndex = '';
      if (res.info.players_max) {
        limitIndex = res.info.players_max;
      }
      if (schedule.enroll_fields) {
        schedule.enrollFields = JSON.parse(schedule.enroll_fields);
      } else {
        schedule.enrollFields = self.data.enrollFields;
      }
      schedule.show_start_time = schedule.start_time ? moment(schedule.start_time).format('YYYY-MM-DD HH:mm') : null;
      schedule.show_enroll_start_time = schedule.enroll_start_time ? moment(schedule.enroll_start_time).format('YYYY-MM-DD HH:mm') : null;
      schedule.show_enroll_end_time = schedule.enroll_end_time ? moment(schedule.enroll_end_time).format('YYYY-MM-DD HH:mm') : null;

      let needLive = schedule.live_id ? 1 : 0;
      self.setData({ limitIndex: limitIndex, editData: schedule, type: schedule.type, needLive: needLive });

      self.resetEnrollFieldsText();
      if (callback) callback();
    });
  },

  previewAll(e) {
    let current = e.currentTarget.dataset.src;
    wx.previewImage({
      current: current, // 当前显示图片的http链接
      urls: this.data.editData.introImagesArray // 需要预览的图片http链接列表
    });
  },

  // 生命周期函数--监听页面加载
  onLoad(options) {
    // console.log('1111111',this.data.editData)
    // let players_max  = this.data.editData.players_max;
    // players_max  ? players_max : 1000;
    const self = this;
    const teamId = options.team_id ? options.team_id : null;
    if (!teamId) {
      wx.showModal({ content: '球队ID不能为空', confirmText: '确定', confirmColor: '#00a7f2', showCancel: false });
    }
    const scheduleId = options.schedule_id ? options.schedule_id : null;
    const type = options.type ? options.type : 4;
    self.setData({ teamId: teamId, scheduleId: scheduleId, type: type });
    self.cropper1 = new WeCropper(this.data.cropper1Opt);
  },
  onReady: function () {
    const self = this;
    wx.showLoading();
    self.loadEnrollFields(function() {
      self.loadTeam(function() {
        let scheduleTypeName = '活动';
        if (self.data.type == 2) scheduleTypeName = '比赛';
        if (self.data.type == 3) scheduleTypeName = '训练';
        if (self.data.scheduleId) {
          wx.setNavigationBarTitle({ title: '编辑'+scheduleTypeName });
          self.loadSchedule(self.data.scheduleId);
        } else {
          wx.setNavigationBarTitle({ title: '创建'+scheduleTypeName });
          let schedule = self.data.editData;
          if (self.data.enrollFields == null) {
            wx.showModal({ content: '字段为空', confirmText: '确定', confirmColor: '#00a7f2', showCancel: false });
          }
          schedule.type = self.data.type;
          schedule.enrollFields = self.data.enrollFields;
          self.setData({ editData: schedule });
          self.resetEnrollFieldsText();
          wx.hideLoading();
        }

      });
    });
  },
  onShow() {
    const self = this;
    http.post('PAY_API_COUPON_TOTAL', { group_id: self.data.teamId }, function(res) {
      if (res.code != 200) {
        return wx.showModal({ content: res.err, confirmText: '确定', confirmColor: '#00a7f2', showCancel: false });
      }
      let liveLeftCount = res.info[2].left_count;
      self.data.liveLeftCount = liveLeftCount;
    });
  }

});
