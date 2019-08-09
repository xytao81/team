import http from "../../../../utils/http.js";
import utils from "../../../../utils/index.js";
import config from '../../../../config/config.js'
import teamConfig from '../../../../utils/team_config.js';

var moment = require('moment');

const app = getApp();

Page({

  // 页面的初始数据
  data: {

    isAdmin: false,
    
    team: {},
    teamRights: null,

    showPoster: false,
    posterUrl: '',

    liveStatus: 1, // 1 未开始 2 直播中

    schedule: {
      title: '',
      start_time: '',
      address: '',
      place_title: '',
      sign_time: '',
      intro: '',
      introImagesArray:[],

      homeTeamScore: '',
      awayTeamScore: '',
      homeTeamPointScore: '',
      awayTeamPointScore: ''
    },
    scheduleScoreForm: {
      homeTeamScore: '',
      awayTeamScore: '',
      homeTeamPointScore: '',
      awayTeamPointScore: ''
    },

    //球衣颜色的数据
    colors:{},
    enrollButtonStatus: 1,
    enroll: null,


//新添加已报名和已签到的数据
    state: 0,
    enrolls: [],
    pageType: 1,
    enrollCount: { all: 0, waiting: 0, agreed: 0, denied: 0, arrived: 0, vacated: 0 },


    //图片的展示简介 收起简介
    imgExpanded:false,

    //简介的展开和收起
    expanded: false,
    limit:40,
    desc:'',
    shortDesc: '',
    descLength: 0,

    scoreModalVisible: false,

    liveModalVisible: false,

    // 是否分享进入
    isShare: false

  },
  //赛事报名的按钮提示框
  showinfo(){
    let that =this;
    wx.showModal({
      title:'内部出勤统计不等于出场阵容',
      content:'报名仅用于球队内部出勤统计。最终出场阵容安排以球队提交给赛事组委会的出场阵容名单为准。',
      confirmText: '确定', confirmColor: '#00a7f2', 
      showCancel: false,
      success(res){
        console.log(res);
        that.gotoEnrollEdit()
      }
    })
  },
  //请假
  leaveConfirm() {
    const self = this;
    wx.showModal({
      content: "确定要请假吗？",
      confirmText: '确定', confirmColor: '#00a7f2', 
      showCancel: true,
      cancelText: '取消',
      success: function(res) {
        if (!res.confirm) return;
        return self.leave();
      }
    });
  },
  leave() {
    const self = this;
    http.post('SCHEDULE_API_ENROLL_SIGNIN', { schedule_id: self.data.enroll.schedule_id, user_id: self.data.enroll.uid, status: 2 }, function (res) {
      if (res.code != 200) {
        return wx.showModal({ content: res.err, confirmText: '确定', confirmColor: '#00a7f2', showCancel: false });
      }
      let enroll = self.data.enroll;
      enroll.arrive = 2;
      self.setData({ enroll: enroll });
      wx.showModal({
        content: "请假成功",
        confirmText: '确定', confirmColor: '#00a7f2', 
        showCancel: false
      });
    });
  },

  // 简介的收起和展开
  resetDesc(desc) {
    desc = desc || '';
    this.hideDesc();
    const limit = this.data.limit;
    const len = desc.length;
    const isLong = len > limit ? true : false;
    const shortDesc = isLong ? desc.substr(0, limit) + ' ...' : desc;
    this.setData({ descLength: len, isLong: isLong, desc: desc, shortDesc: shortDesc });
    if (this.properties.expand) {
      this.showDesc();
    }
  },
  //生成海报的弹框
  generatePoster() {
    const self = this;
    self.setData({ showPoster: true });
    if (!self.data.posterUrl) {
      http.post('SCHEDULE_API_GET_POSTER', { id: self.data.schedule.id }, function (res) {
        if (res.code != 200) {
          return wx.showModal({ content: res.err, confirmText: '确定', confirmColor: '#00a7f2', showCancel: false });
        }
        const url = res.info.url;
        self.setData({ posterUrl: url });
      });
    }
  },
  hidePoster() {
    this.setData({ showPoster: false });
  },

  //转发给好友
  onShareAppMessage(res){
    const self = this;
    return {
      // title: app.globalData.user.info.name+ '邀请你参加' + self.data.schedule.title,
      title: '【'+self.data.team.name+'】足球队的【'+app.globalData.user.info.name+'】邀请你参加',
      path: '/pages/team/teamhome/schedule/detail?team_id='+self.data.schedule.team_id+'&schedule_id='+self.data.schedule.id+'&is_share=1',        // 默认是当前页面，必须是以‘/’开头的完整路径
      imageUrl: self.data.posterUrl ? self.data.posterUrl : '',
      success: (res)=> {
        // console.log("转发成功",res)
      },
      fail:(res)=> {
        // console.log("转发失败",res)
      }
    }
  },

  // 保存图片到相册
  downloadFile(){
    wx.downloadFile({
      url: this.data.posterUrl,
      success(res){
        let path = res.tempFilePath;
        console.log('下载path', path);
        wx.saveImageToPhotosAlbum({
          filePath: path,
          success(res){
            return wx.showToast({ title: '保存成功' });
          },
          fail(res) {
            console.log('保存失败', res);
            return wx.showModal({ content: '保存失败，请检查授权后重新保存', confirmText: '确定', confirmColor: '#00a7f2', showCancel: false,
              success(res) {
                wx.openSetting({
                  success(res) {
                    console.log(res.authSetting)
                  }
                });

              }
            });
          }
        });
      },
      fail(res) {
        console.log('下载失败', res);
      }
    })
  },

  preventTouchMove() {},

  //监听当前位置  点击打开小地图的功能
  listenerBtnGetLocation() {
    const self = this;
    wx.getLocation({
      type: 'gcj02',
      success:function(res){
        console.log(res);
        wx.openLocation({
          //当前经纬度
          latitude: parseFloat(self.data.schedule.place_lat),
          longitude: parseFloat(self.data.schedule.place_lng),
          //缩放级别默认28
          scale: 15,
          //位置名
          name: self.data.schedule.place,
          //详细地址
          address: self.data.schedule.address,
          success:function(res){
            console.log(res)
          },
          fail:function(err){
            console.log(err)
          },
          complete:function(info){
            console.log(info)
          }
        });
      },
      fail: function () {
        return wx.showModal({ content: '未授权定位', confirmText: '确定', confirmColor: '#00a7f2', showCancel: false });
      }
    })
  },
 //收藏或取消收藏
    // serviceSelection(){
    //   console.log("click");
    //   this.setData({
    //     'schedule.isChecked':!this.data.schedule.isChecked,
    //     'schedule.isCollection':this.data.schedule.isChecked==true?'收藏':'取消收藏'
    //   })
    // },

  //获取是管理员还是普通人员
  loadRights(callback) {
    const self = this;
    http.post('TEAM_API_PLAYER_MYRIGHTS', { team_id: self.data.teamId }, function (res) {
      if (res.code != 200) {
        return wx.showModal({ content: res.err, confirmText: '确定', confirmColor: '#00a7f2', showCancel: false });
      }
      const rights = res.info.rights === undefined ? null : res.info.rights;
      self.setData({ teamRights: rights });//res.info.rights :0
      if (callback) callback();
    });
  },
  loadTeam(callback) {
    var self = this;
    http.post('TEAM_API_INDEX_DETAIL', { id: self.data.teamId }, function(res) {
      if (res.code != 200) {
        return wx.showModal({ content: res.err, confirmText: '确定', confirmColor: '#00a7f2', showCancel: false });
      }
      let schedule = self.data.schedule;
      schedule.team_name = res.info.name;
      self.setData({ team: res.info, schedule });
      if (callback) callback();
    });
  },
  //加载活动简介的接口
  loadSchedule(scheduleId, callback) {
    wx.removeStorageSync('updateTeamSchedule_'+scheduleId);
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
      schedule.show_start_time = schedule.start_time ? moment(schedule.start_time).format('YYYY-MM-DD HH:mm') : null;
      schedule.show_enroll_start_time = schedule.enroll_start_time ? moment(schedule.enroll_start_time).format('YYYY-MM-DD HH:mm') : null;
      schedule.show_enroll_end_time = schedule.enroll_end_time ? moment(schedule.enroll_end_time).format('YYYY-MM-DD HH:mm') : null;
      self.setData({ schedule: schedule, teamId: schedule.team_id });
      if(schedule.type==4){
        if(schedule.team_id == schedule.match.home._team_id ){
          self.setData({colors:schedule.match.home})
        }else{
          self.setData({colors:schedule.match.away})
        }
      }
      let scheduleScoreForm = {
        homeTeamScore: schedule.home_team_score,
        awayTeamScore: schedule.away_team_score,
        homeTeamPointScore: schedule.home_team_point_score,
        awayTeamPointScore: schedule.away_team_point_score
      };
      self.setData({scheduleScoreForm: scheduleScoreForm });
      if (callback) callback();
    });
  },
  //加载personalInfo那一坨
  loadMyEnroll(scheduleId, callback) {
    const self = this;
    http.post('SCHEDULE_API_ENROLL_DETAIL', { schedule_id: scheduleId, user_id: self.data.uid }, function (res) {
      if (res.code != 200) {
        return wx.showModal({ content: res.err, confirmText: '确定', confirmColor: '#00a7f2', showCancel: false });
      }
      var enroll = res.info.enroll;
      if (enroll) {
        if (enroll.content) enroll.content = JSON.parse(enroll.content);
      }
      self.setData({ enroll: enroll });
      if (callback) callback();
    });
  },
  resetEnrollButton(schedule, enroll) {
    if (schedule.delete_time) {
      return this.setData({ enrollButtonStatus: 6 });
    }
    var enrollButtonStatus = 1;
    if (!schedule.is_enroll) {
      enrollButtonStatus = 4;
    } else {
      if ( schedule.players_max > 0 && (schedule.status_count.agreed+schedule.status_count.waiting) >= schedule.players_max) {
        enrollButtonStatus = 5;
      } else {
        if (!schedule.enroll_start_time || !schedule.enroll_end_time) {
          enrollButtonStatus = 1;
        } else {
          if (moment().isBefore(schedule.enroll_start_time)) enrollButtonStatus = 2;
          if (moment(schedule.enroll_end_time).isBefore(moment())) enrollButtonStatus = 3;
        }
      }
    }
    this.setData({ enrollButtonStatus: enrollButtonStatus });
  },
  gotoEdit() {
    wx.navigateTo({ url:"/pages/team/teamhome/schedule/edit?team_id="+this.data.teamId+"&schedule_id="+this.data.scheduleId });
  },
  gotoUsers() {
    wx.navigateTo({ url:"/pages/team/teamhome/schedule/users?team_id="+this.data.teamId+"&schedule_id="+this.data.scheduleId });
  },
  gotoEnroll() {
    if (this.data.teamRights === null) {
      return  wx.showModal({ content: "不是球队成员无法报名", confirmText: '确定', confirmColor: '#00a7f2', showCancel: false });
    }
    wx.navigateTo({ url: "/pages/team/teamhome/schedule/user?team_id="+this.data.teamId+"&schedule_id="+this.data.scheduleId+"&uid="+this.data.uid });
  },
  gotoEnrollEdit() {
    if (this.data.teamRights === null) {
      return  wx.showModal({ content: "不是球队成员无法报名", confirmText: '确定', confirmColor: '#00a7f2', showCancel: false });
    }
    wx.navigateTo({ url: "/pages/team/teamhome/schedule/user_edit?team_id="+this.data.teamId+"&schedule_id="+this.data.scheduleId+"&uid="+this.data.uid });
  },

  cancelEnrollConfirm() {
    const self = this;
    wx.showModal({
      content: "确定要取消报名吗？",
      confirmText: '确定', confirmColor: '#00a7f2', 
      showCancel: true,
      success: function(res) {
        if (!res.confirm) return;
        return self.cancelEnroll();
      }
    });
  },
  cancelEnroll() {
    const self = this;
    http.post('SCHEDULE_API_ENROLL_DELETE', { id: self.data.enroll.id }, function (res) {
      if (res.code != 200) {
        return wx.showModal({ content: res.err, confirmText: '确定', confirmColor: '#00a7f2', showCancel: false });
      }
      wx.setStorageSync('updateTeamTome', 1);
      wx.showModal({
        content: "取消成功",
        confirmText: '确定', confirmColor: '#00a7f2', 
        showCancel: false,
        success: function(res) {
          return self.onReady();
        }
      });
    });
  },

  cancelLive(callback) {
    const self = this;
    if (!self.data.schedule.live_id) {
      if (callback) callback();
      return;
    }
    http.post('SCHEDULE_API_LIVE_CANCEL', { schedule_id: self.data.scheduleId, group_id: self.data.schedule.team_id }, function(res) {
      if (res.code != 200) {
        return wx.showModal({ content: res.err, confirmText: '确定', confirmColor: '#00a7f2', showCancel: false });
      }
      if (callback) callback();
    });
  },
  cancelSchedule() {
    const self = this;
    self.cancelLive(function() {
      http.post('SCHEDULE_API_DELETE', { id: self.data.scheduleId }, function (res) {
        if (res.code != 200) {
          return wx.showModal({ content: res.err, confirmText: '确定', confirmColor: '#00a7f2', showCancel: false });
        }
        wx.setStorageSync('deleteTeamSchedule', self.data.scheduleId);
        wx.showModal({
          content: "取消成功",
          confirmText: '确定', confirmColor: '#00a7f2', 
          showCancel: false,
          success: function(res) {
            return wx.navigateBack({ delta: 1 });
          }
        });
      });
    });
  },
  confirmCancelSchedule() {
    const self = this;
    wx.showModal({
      content: "确定要取消活动吗？",
      confirmText: '确定', confirmColor: '#00a7f2', 
      showCancel: true,
      success: function(res) {
        if (!res.confirm) return;
        return self.cancelSchedule();
      }
    });
  },

  openScoreModal() {
    this.setData({ scoreModalVisible: true });
  },

  onScoreChange(e) {
    let scheduleScoreForm = this.data.scheduleScoreForm;
    let key = e.currentTarget.dataset.key;
    scheduleScoreForm[key] = e.detail.value;
    this.setData({ scheduleScoreForm: scheduleScoreForm });
  },
  saveScore(e) {
    const self = this;
    let params = {
      id: this.data.scheduleId,
      home_team_score: this.data.scheduleScoreForm.homeTeamScore,
      away_team_score: this.data.scheduleScoreForm.awayTeamScore,
      home_team_point_score: this.data.scheduleScoreForm.homeTeamPointScore,
      away_team_point_score: this.data.scheduleScoreForm.awayTeamPointScore
    };
    if (params.home_team_score && params.away_team_score == '') {
      return wx.showModal({ content: '请填写客队比分', confirmText: '确定', confirmColor: '#00a7f2', showCancel: false });
    }
    if (params.home_team_score == '' && params.away_team_score) {
      return wx.showModal({ content: '请填写主队比分', confirmText: '确定', confirmColor: '#00a7f2', showCancel: false });
    }
    if ((params.home_team_point_score || params.away_team_point_score) && (params.home_team_score == '' || params.away_team_score == '')) {
      return wx.showModal({ content: '请填写正赛比分', confirmText: '确定', confirmColor: '#00a7f2', showCancel: false });
    }
    if (params.home_team_point_score && params.away_team_point_score == '') {
      return wx.showModal({ content: '请填写客队点球比分', confirmText: '确定', confirmColor: '#00a7f2', showCancel: false });
    }
    if (params.home_team_point_score == '' && params.away_team_point_score) {
      return wx.showModal({ content: '请填写主队点球比分', confirmText: '确定', confirmColor: '#00a7f2', showCancel: false });
    }
    http.post('SCHEDULE_API_SAVE_SCORE', params, function (res) {
      if (res.code != 200) {
        return wx.showModal({ content: res.err, confirmText: '确定', confirmColor: '#00a7f2', showCancel: false });
      }
      let schedule = self.data.schedule;
      schedule.home_team_score = params.home_team_score;
      schedule.away_team_score = params.away_team_score;
      schedule.home_team_point_score = params.home_team_point_score;
      schedule.away_team_point_score = params.away_team_point_score;

      self.setData({ schedule: schedule, scoreModalVisible: false });
      wx.setStorageSync('updateTeamSchedule', schedule);
    });
  },
  saveScoreCancel() {
    let scheduleScoreForm = {
      homeTeamScore: this.data.schedule.home_team_score,
      awayTeamScore: this.data.schedule.away_team_score,
      homeTeamPointScore: this.data.schedule.home_team_point_score,
      awayTeamPointScore: this.data.schedule.away_team_point_score
    };
    this.setData({ scheduleScoreForm: scheduleScoreForm });
  },

  // openLiveModal() {
  //   this.setData({ liveModalVisible: true });
  // },
  gotoLiveControl() {
      return wx.navigateTo({ url: "/pages/web/url?url="+encodeURIComponent(this.data.schedule.live.control_url) });
  },

  parseScene(scene) {
    if (!scene) return {};
    const obj = {};
    const arr = scene.split('||');
    if (arr[0]) obj.schedule_id = arr[0];
    obj.is_share = 1;
    return obj;
  },

  previewAll(e) {
    let current = e.currentTarget.dataset.src;
    wx.previewImage({
      current: current, // 当前显示图片的http链接
      urls: this.data.schedule.introImagesArray // 需要预览的图片http链接列表
    });
  },

  // 生命周期函数--监听页面加载
  onLoad(options) {
    options = Object.assign(options, this.parseScene(options.scene));

    const self = this;
    const scheduleId = options.schedule_id ? options.schedule_id : null;
    if (!scheduleId) {
      return wx.showModal({ content: '活动ID不能为空', confirmText: '确定', confirmColor: '#00a7f2', showCancel: false });
    }
    const uid = app.globalData.user.info.uid ? app.globalData.user.info.uid : '';
    const isShare = options.is_share == 1 ? true : false;
    const isAdmin = options.is_admin == 1 ? true : false;

    self.setData({ scheduleId: scheduleId, uid: uid, isShare: isShare, isAdmin: isAdmin });
  },
  onReady: function () {

  },
  onShow() {
    this.onReady();
    const self = this;

    if (!self.data.uid) {
      wx.setStorageSync('openScheduleId', self.data.scheduleId);
      return wx.redirectTo({ url: '/pages/index/index' });
    }

    wx.showLoading();
    self.loadSchedule(self.data.scheduleId, function() {
      self.loadRights(function() {
        self.loadTeam(function() {
            self.resetDesc(self.data.schedule.intro);
            let scheduleTypeName = '活动';
            if (self.data.schedule.type == 2) scheduleTypeName = '比赛';
            if (self.data.schedule.type == 3) scheduleTypeName = '训练';
            if (self.data.schedule.type == 4) scheduleTypeName = '参赛';
            wx.setNavigationBarTitle({ title: '球队'+scheduleTypeName+'详情' });
            self.loadMyEnroll(self.data.scheduleId, function() {
              self.resetEnrollButton(self.data.schedule, self.data.enroll);
              self.loadScheduleEnrollList(self.data.scheduleId, ''); //加载报名信息
              wx.hideLoading();
            });
        });
      });
    });
  },


  // 已签到和已报名

  //点击选项卡事件
  onTabsItemTab(e){
      let status = e.target.dataset.status;//0
      this.setData({ state: status });
      wx.showLoading();
      this.loadScheduleEnrollList(this.data.scheduleId, status, function() {
        wx.hideLoading();
      });
  },
  onClickUser(e) {
    const user = e.detail.user;
    if (this.data.isAdmin) {
      return wx.navigateTo({ url: "/pages/team/teamhome/schedule/user?team_id="+this.data.teamId+"&schedule_id="+this.data.scheduleId+"&uid="+user.uid });
    } else {
      return wx.navigateTo({ url: "/pages/team/players/detail?team_id="+this.data.teamId+"&player_id="+user.player_id });
    }
  },
  //获取过来是带personalInfo很大的数组
  loadScheduleEnrollList(scheduleId, status, callback) {
    const self = this;
    self.setData({ enrolls: [] });
    let arrive = '';
    if (status == 1) {
      // arrive = 1;
    }
    http.post('SCHEDULE_API_ENROLL_LIST', { schedule_id: scheduleId, status: status, arrive: arrive }, function (res) {
      if (res.code != 200) {
        return wx.showModal({ content: res.err, confirmText: '确定', confirmColor: '#00a7f2', showCancel: false });
      }
      const enrolls = res.info.list;
      self.setData({ enrolls: enrolls, enrollCount: res.info.enroll_count });
      if (callback) callback();
    });
  },


  //展示详情 收起详情
  showDesc() {
    this.setData({ expanded: true});
  },
  hideDesc() {
    this.setData({ expanded: false });
  },
  //展示图片详情 收起详情
  showImg() {
    this.setData({ imgExpanded: true});
  },
  hideImg() {
    this.setData({ imgExpanded: false });
  },



});
