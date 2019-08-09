import http from "../../../utils/http.js";
import utils from "../../../utils/index.js";
import config from '../../../config/config.js'
import teamConfig from '../../../utils/team_config.js';
import leagueConfig from '../../../utils/league_config.js';
import validate from '../../../utils/validate.js';
var moment = require('moment');

import WeCropper from 'we-cropper/index.js'
const device = wx.getSystemInfoSync(); // 获取设备信息
const width = device.windowWidth; // 示例为一个与屏幕等宽的正方形裁剪框
const height = device.windowHeight;

const app = getApp();

Page({

  // 页面的初始数据
  data: {

    leagueId: '',
    teamId: '',
    from:'',

    enrollData: null,

    leagueDetail: null,
    leagueConfig: null,

    playersTotalCount: 0,
    player_list: null,

    cropper1Visible: false,
    cropper1Opt: {
      id: 'cropper1Id', // 用于手势操作的canvas组件标识符
      targetId: 'cropper1TargetId', // 用于用于生成截图的canvas组件标识符
      pixelRatio: device.pixelRatio, // 传入设备像素比
      width: width,  // 画布宽度
      height: height - 100, // 画布高度
      scale: 2.5, // 最大缩放倍数
      zoom: 8, // 缩放系数
      cut: {
        x: (width - 320) / 2, // 裁剪框x轴起点
        y: (width - 320) / 2, // 裁剪框y轴期起点
        width: 320, // 裁剪框宽度
        height: 320 // 裁剪框高度
      }
    },
    chooseImageLock: false,
  },

  bindClothesChange1(e) {
    let color = e.detail.checked;
    if (!this.checkColor(color)) {
      wx.showModal({ content: '球衣颜色必须填齐6项（队员与守门员的上衣、短裤、袜子）', confirmText: '确定', confirmColor: '#00a7f2', showCancel: false });
    }
    console.log('cloth event:', color);
    const newTeamColors = [color, this.data.enrollData.color[1]];
    this.setData({'enrollData.color': newTeamColors});
  },
  bindClothesChange2(e) {
    let color = e.detail.checked;
    if (!this.checkColor(color)) {
      wx.showModal({ content: '球衣颜色必须填齐6项（队员与守门员的上衣、短裤、袜子）', confirmText: '确定', confirmColor: '#00a7f2', showCancel: false });
    }
    console.log('cloth event:', color);
    const newTeamColors = [this.data.enrollData.color[0], color];
    this.setData({'enrollData.color': newTeamColors});
  },
  bindChangeFullName: function (e) {
    this.setData({ 'enrollData.full_name': e.detail.value });
    saveCacheData(this);
  },
  bindChangeName: function (e) {
    this.setData({ 'enrollData.name': e.detail.value });
    saveCacheData(this);
  },
  bindChangeContactsName: function (e) {
    this.setData({ 'enrollData.contacts_name': e.detail.value });
    saveCacheData(this);
  },
  bindChangeContactsPhone: function (e) {
    this.setData({ 'enrollData.contacts_phone': e.detail.value });
    saveCacheData(this);
  },
  onClickSetting(e){
    let job_id = e.currentTarget.dataset.index;
    wx.navigateTo({ url: "/pages/league/enroll/selectplayer?league_id=" + this.data.leagueId + "&team_id=" + this.data.teamId + "&job_id=" + job_id });
  },

  openLogoSheet() {
    var self = this;
    self.data.chooseImageLock = true;
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
    self.cropper1.getCropperImage((tempFilePath) => {
      if (!tempFilePath) {
        return console.log('获取图片地址失败，请稍后重试');
      }
      self.data.chooseImageLock = false;
      self.setData({ cropper1Visible: false });
      wx.uploadFile({
        url: config.BASE_URL + '/aqm/tool/api/upload/file',
        // url: 'http://192.168.0.21:3000/tool/api/upload/file',
        filePath: tempFilePath,
        name: 'file',
        formData: {},
        success (res2) {
          if (res2.statusCode != 200) {
            console.log('upload result:::', res2);
            return wx.showModal({ content: '上传失败', confirmText: '确定', confirmColor: '#00a7f2', showCancel: false });
          }
          var obj = JSON.parse(res2.data);
          self.setData({ 'enrollData.logo': obj.result });
        }
      });
    })
  },
  cropper1TouchStart (e) { this.cropper1.touchStart(e) },
  cropper1TouchMove (e) { this.cropper1.touchMove(e) },
  cropper1TouchEnd (e) { this.cropper1.touchEnd(e) },

  // 提交表单

  getNewPlayer(player) {
    console.log('接收 player', player);
    if (!player) return wx.showModal({ content: 'getNewPlayer player 不能是 undefined!', confirmText: '确定', confirmColor: '#00a7f2', showCancel: false });
    if (!player.job) return wx.showModal({ content: 'getNewPlayer player.job 不能是 undefined!', confirmText: '确定', confirmColor: '#00a7f2', showCancel: false });
    const self = this;
    const job = self.data.player_list[player.job-1];
    if (!job) return wx.showModal({ content: 'getNewPlayer job 不能是 undefined!'+player.job, confirmText: '确定', confirmColor: '#00a7f2', showCancel: false });
    const newPlayer = JSON.parse( JSON.stringify(player) );
    // newPlayer.uid = player.uid;
    // newPlayer.player_id = player.player_id;
    // newPlayer.team_id = player.team_id;
    // newPlayer.is_me = player.is_me;
    // newPlayer.is_player = player.is_player;
    // newPlayer.is_user = player.is_user;
    // newPlayer.is_selected = player.is_selected;
    // newPlayer.isFinished = player.isFinished;
    // newPlayer.is_selected = player.is_selected;
    // newPlayer.flag = player.flag;
    // newPlayer.rights = player.rights;
    // newPlayer.show_name = player.show_name;
    // newPlayer.job = player.job;
    // newPlayer.jobs = player.jobs;
    // newPlayer.job_name = player.job_name;
    // newPlayer.show_jobs = player.show_jobs;
    // newPlayer.sub_job = player.sub_job;
    // newPlayer.sub_job_name = player.sub_job_name;

    // for (let k in job.fields) {
    //   const jKey = job.fields[k].key;
    //   if (jKey == 'certnumber') {
    //     newPlayer['cert_type'] = player['cert_type']; 
    //   }
    //   newPlayer[jKey] = player[jKey]; 
    // }
    return newPlayer;
  },
  checkFinishStatus(player) {
    if (!player) return wx.showModal({ content: 'checkFinishStatus player 不能是 undefined!', confirmText: '确定', confirmColor: '#00a7f2', showCancel: false });
    const self = this;
    const job = self.data.player_list[player.job-1];
    let isFinished = true;
   
    for (let k in player.content) {
      for (let k2 in player.content[k]) {
        const field = player.content[k][k2];
        // console.log('检查字段', field);
        if ((field.value === '' || field.value === undefined ) && field.is_select) {
          console.error(player.job_name+':'+player.content['person_info'][1].value+'的'+field.name+'错误 '+field.value);
          isFinished = false;
          break;
        }
      }
    }
    player.isFinished = isFinished;
    return player;
  },

  loadLeagueDetail(leagueId, teamId, callback) {
    const self = this;
    if (self.data.leagueDetail) {
      if (callback) callback();
    }
    http.post('LEAGUE_API_DETAIL', { id: leagueId, team_id: teamId }, function (res) {
      if (res.code != 200) {
        return wx.showModal({ content: res.err, confirmText: '确定', confirmColor: '#00a7f2', showCancel: false });
      }
      self.setData({ leagueDetail: res.info });
      if (callback) callback();
    });
  },
  loadLeagueConfig(leagueId, callback) {
    const self = this;
    if (self.data.leagueConfig) {
      if (callback) callback();
      return;
    }
    http.post('LEAGUE_CONFIG_URL', { id: leagueId }, function (res) {
      if (res.code != 200) {
        return wx.showModal({ content: res.err, confirmText: '确定', confirmColor: '#00a7f2', showCancel: false });
      }
      const leagueConfigRes = res.info;
      // const jobs = self.data.player_list;
      // for (let k in jobs) {
      //   const fields = leagueConfigRes.enroll_field[jobs[k].id];
      //   jobs[k].isNeededaaa = fields ? true : false;
      //   if (fields) {
      //     jobs[k].fields = self.getFieldsArray(fields);
      //   }
      // }
      console.log('leagueConfig enroll_fields:::', leagueConfigRes.enroll_fields);
      self.setData({ leagueConfig: res.info, player_list: leagueConfigRes.enroll_fields });
      if (callback) callback();
    });
  },
  getFieldsArray(fieldsStr) {
    const fieldsArr = fieldsStr.split(',');
    const newFields = [];
    for (let k2 in fieldsArr) {
      var fieldKey = leagueConfig.getEnrollKeyByZh(fieldsArr[k2]);
      if (fieldKey == 'sub_rights') fieldKey = 'sub_job'; //转换成球队使用的字段
      let obj = {
        key: fieldKey,
        name: fieldsArr[k2]
      }
      newFields.push(obj);
    }
    return newFields;
  },

  addSuggestLeagueId(leagueId, teamId) {
    var suggestLeagueIdsStr = wx.getStorageSync('suggestLeagueIdsStr-'+teamId);
    var suggestLeagueIds = suggestLeagueIdsStr ? suggestLeagueIdsStr.split(',') : [];
    suggestLeagueIds.push(leagueId);
    suggestLeagueIds = Array.from( new Set(suggestLeagueIds) );
    wx.setStorageSync('suggestLeagueIdsStr-'+teamId, suggestLeagueIds.join(','));
  },

  checkColor(color) {
    console.log('color:::', color);
    if (
      color.player.shirt.id != 0 || color.player.shorts.id != 0 || color.player.shoes.id != 0 || color.goalkeeper.shirt.id != 0 || color.goalkeeper.shorts.id != 0 || color.goalkeeper.shoes.id != 0 
    ) { // 一旦选了1项
      if (color.player.shirt.id != 0 && color.player.shorts.id != 0 && color.player.shoes.id != 0 && color.goalkeeper.shirt.id != 0 && color.goalkeeper.shorts.id != 0 && color.goalkeeper.shoes.id != 0) { // 就必须选择全部6项
      } else {
        return false;
      }
    }
    return true;
  },
  getSubmitColor(colors) {
    let color1 = this.checkColor(colors[0]) ? colors[0] : {};
    let color2 = this.checkColor(colors[1]) ? colors[1] : {};
    return [color1, color2];
  },

  bindSubmit(e) {
    const self = this;
    let form_id = e.detail.formId;

    let enrollData = this.data.enrollData;
    if (!enrollData.logo) {
      return wx.showModal({ content: "请上传队徽", confirmText: '确定', confirmColor: '#00a7f2', showCancel: false });
    }
    if (enrollData.name == 0) {
      return wx.showModal({ content: "请填写球队简称", confirmText: '确定', confirmColor: '#00a7f2', showCancel: false });
    }
    if (enrollData.name > 8) {
      return wx.showModal({ content: "球队简称不能超过8个字", confirmText: '确定', confirmColor: '#00a7f2', showCancel: false });
    }
    if (enrollData.contacts_name.length == 0) {
      return wx.showModal({ content: "请填写球队联系人", confirmText: '确定', confirmColor: '#00a7f2', showCancel: false });
    }
    if (!validate.validatePhone(enrollData.contacts_phone) ) {
      return wx.showModal({ content: '球队联系人电话格式错误', confirmText: '确定', confirmColor: '#00a7f2', showCancel: false });
    }

    if (this.data.player_list == undefined) {
      console.log('出问题了！没有这个对象！', this.data.player_list);
    }
    if (this.data.player_list[0].players && this.data.player_list[0].players.length <= 0) {
      // return wx.showModal({ content: "领队人数不能少于1人", confirmText: '确定', confirmColor: '#00a7f2', showCancel: false });
    }

    if (this.data.player_list[0].players && this.data.player_list[1].players.length <= 0) {
      // return wx.showModal({ content: "教练人数不能少于1人", confirmText: '确定', confirmColor: '#00a7f2', showCancel: false });
    }

    // let teamLeaders = this.data.player_list[2].players.filter(player => player.sub_job == 2);
    // if (teamLeaders.length > 1) {
    //   return wx.showModal({ content: "球队队长人数不能超过1人", confirmText: '确定', confirmColor: '#00a7f2', showCancel: false });
    // }
    // if (this.data.player_list[2].players.length < this.data.leagueInfo.players_count) {
    //   return wx.showModal({ content: "球员人数不能少于" + this.data.leagueInfo.players_count + "人", confirmText: '确定', confirmColor: '#00a7f2', showCancel: false });
    // }

    // let total_count = this.data.player_list[0].players.length + this.data.player_list[1].players.length + this.data.player_list[2].players.length + this.data.player_list[3].players.length;
    // if (total_count > this.data.leagueInfo.join_players_count) {
    //   return wx.showModal({ content: "报名人数不能多于" + this.data.leagueInfo.join_players_count + "人", confirmText: '确定', confirmColor: '#00a7f2', showCancel: false });
    // }

    // 检测球衣号的重复
    const playerFields = this.data.leagueConfig.enroll_fields[2].list;
    const numberField = playerFields.person_info.find(item => item.key == 'number');
    if (numberField && numberField.is_select) {
      let job = this.data.player_list[2];
      let list = job.players;
      for (let i = 0; i < list.length; i++) {
        let nameField = list[i].content['person_info'].find(item => item.key == 'name');
        let numField = list[i].content['person_info'].find(item => item.key == 'number');
        if (!numField.value) {
          return wx.showModal({ content: "请完善"+nameField.value+"的球衣号", confirmText: '确定', confirmColor: '#00a7f2', showCancel: false });
        }
        let otherPlayers = this.data.player_list[2].players.filter(item => item.player_id != list[i].player_id);
        for (let k2 in otherPlayers) {
          let otherNameField = otherPlayers[k2].content['person_info'].find(item => item.key == 'name');
          let otherNumField = otherPlayers[k2].content['person_info'].find(item => item.key == 'number');
          if (otherNumField.value == numField.value) {
            return wx.showModal({ content: nameField.value+"与"+otherNameField.value+"的球衣号有重复", confirmText: '确定', confirmColor: '#00a7f2', showCancel: false });
          }
        }
      }
    }

    // 检查是否全部完善
    for (let k in this.data.player_list) {
      let job = this.data.player_list[k];
      if (job.is_select && job.players.length < job.list.sign_number[0].min) {
          return wx.showModal({ content: job.type+"报名人数不能少于"+job.list.sign_number[0].min+"人", confirmText: '确定', confirmColor: '#00a7f2', showCancel: false });
      }
      if (job.is_select && job.players.length > job.list.sign_number[0].max) {
          return wx.showModal({ content: job.type+"报名人数不能多于"+job.list.sign_number[0].max+"人", confirmText: '确定', confirmColor: '#00a7f2', showCancel: false });
      }
      for (let k2 in job.players) {
        let obj = self.checkFinishStatus(job.players[k2]);
        let nameField = obj.content['person_info'].find(item => item.key == 'name');
        if (!obj.isFinished) {
          return wx.showModal({ content: "请完善"+job.type+nameField.value+"的资料", confirmText: '确定', confirmColor: '#00a7f2', showCancel: false });
        }
      }
    }
    self.bindSubmitPost(form_id);

  },
  bindSubmitPost(form_id) {
    const self = this;
    const wxSessionKey = app.globalData.secret;
    const wxAppId = app.globalData.appid;
    const wxOpenId = app.globalData.openid;
    const teamInfo = {
      _team_id: self.data.enrollData.id,
      from: 'aqm',
      name: self.data.enrollData.name,
      full_name: self.data.enrollData.full_name,
      logo: self.data.enrollData.logo ? self.data.enrollData.logo : '',
      color: self.getSubmitColor(self.data.enrollData.color),
      contacts_name: self.data.enrollData.contacts_name,
      contacts_phone: self.data.enrollData.contacts_phone,
      wx_open_id: wxOpenId,
      wx_form_id:form_id,
      wx_app_id: wxAppId,
      wx_session_key: wxSessionKey,
      wx_page: '/pages/team/teamhome/view?team_id=' + self.data.enrollData.id + '&is_share=1'
    };
    let playerList = [];
    for (let k in self.data.player_list) {
      const job = self.data.player_list[k];
      if (!job.is_select) continue;
      let newJob = { rights: job.value, list: [] };
      for (let k2 in job.players) {
        let newPlayer = { _player_id: job.players[k2].player_id, enroll_fields: utils.getValueFromEnrollFields(job.players[k2].content, job.value) };
        newJob.list.push(newPlayer);
      }
      playerList.push(newJob);
    }
  
    http.post('LEAGUE_ADD_PLAYER_URL', {
      league_id: self.data.leagueId,
      team_info: teamInfo,
      player_list: playerList
    }, function (res) {
      if (res.code != 200) {
        return wx.showModal({ content: res.err, confirmText: '确定', confirmColor: '#00a7f2', showCancel: false });
      }
      
      //提交成功，删除缓存
      wx.removeStorageSync('enrollLeagueId');
      let key = "enroll-" + self.data.teamId + "-" + self.data.leagueId;
      wx.removeStorageSync(key)

      wx.showModal({
        content: "提交成功，等待赛事方确认",
        confirmText: '确定', confirmColor: '#00a7f2', 
        showCancel: false,
        success: function (res) {
          wx.navigateBack({ delta: 1 });
        } // res.confirm
      });
  
    });
  },

  // 生命周期函数--监听页面加载
  onLoad(options) {
    const self = this;
    const leagueId = options.league_id ? options.league_id : '';
    if (!leagueId) return wx.showModal({ content: '赛事ID不能为空！'+leagueId, confirmText: '确定', confirmColor: '#00a7f2', showCancel: false });
    const teamId = options.team_id ? options.team_id : '';
    if (!teamId) return wx.showModal({ content: '球队ID不能为空！'+leagueId, confirmText: '确定', confirmColor: '#00a7f2', showCancel: false });

    this.cropper1 = new WeCropper(this.data.cropper1Opt);

    self.setData({ leagueId: leagueId, teamId: teamId, from:config.FROM });

    self.addSuggestLeagueId(leagueId, teamId);
  },

  onShow() {
    const self = this;
    if (self.data.chooseImageLock) return null;
    self.loadLeagueDetail(self.data.leagueId, self.data.teamId, function() {
      self.loadLeagueConfig(self.data.leagueId, function() {
        loadLocalData(self, function() {
          loadData(self);
        });
      });
    });
  },
  onHide() {
    if (this.data.chooseImageLock) return null;
    //保存缓存数据
    saveCacheData(this);
  },
  onUnload() {
    //保存缓存数据
    saveCacheData(this);
  }

});

function saveCacheData(self) {
  if (!self.data.enrollData) return;

  let key = "enroll-" + self.data.teamId + "-" + self.data.leagueId;
  console.log("saveCacheData");
  
  let json = {};
  let buf = wx.getStorageSync(key);
  if (buf) {
    json = JSON.parse(buf);
  }
  let timestamp = moment().valueOf();
  json["timestamp"] = timestamp;
  json["enrollData"] = self.data.enrollData;
  // for (let k in self.data.player_list) {
  //   const job = self.data.player_list[k];
  //   json['job-'+job.id] = job.players;
  //   console.log('job-'+job.id, job.players);
  // }
  json["player_list"] = self.data.player_list;
  wx.setStorageSync(key, JSON.stringify(json));
}

function loadData(self) {
  http.post('LEAGUE_TEAM_DETAIL_URL', {
    id: self.data.teamId,
    league_id: self.data.leagueId
  }, function (res) {
    if (res.code != 200) {
      return wx.showModal({ content: res.err, confirmText: '确定', confirmColor: '#00a7f2', showCancel: false });
    }
    self.setData({ leagueInfo: res.info.league_info });

    let operatedTime = res.info.team_info.operate_time; // 云端数据时间
    let localTime = 0;
    let key = "enroll-" + self.data.teamId + "-" + self.data.leagueId;
    let buf = wx.getStorageSync(key);
    if (buf && buf.length >0) {
      let json = JSON.parse(buf);
      localTime = json.timestamp;
    }

    console.log('时间对比', localTime < operatedTime, localTime, operatedTime);
    if (localTime < operatedTime || !self.data.enrollData) {
      console.log('使用云端报名数据', res.info.team_info, res.info.out_player_list);
      self.setData({ enrollData: res.info.team_info });
      if ( res.info.out_player_list ) {
        let playerList = res.info.out_player_list;
        for (let k in playerList) {
          for (let k2 in playerList[k].players) {
            let newPlayer = playerList[k].players[k2];
            newPlayer.content = utils.getEnrollFieldsFromFields(playerList[k].list, newPlayer.enroll_fields, parseInt(k)+1);
            delete newPlayer.enroll_fields;
            console.log('loadData checkFinishStatus', playerList[k].players[k2]);
            playerList[k].players[k2] = self.checkFinishStatus( self.getNewPlayer(newPlayer) );
          }
        }

        self.setData({ player_list: playerList });
    }

    }

    //保存缓存数据
    saveCacheData(self);

    
  });
}


function loadLocalData(self, callback) {
  let key = "enroll-" + self.data.teamId + "-" + self.data.leagueId;
  let buf = wx.getStorageSync(key);
  if (!buf || buf.length == 0) {
    if (callback) callback();
    return;
  }
  var playersTotalCount = 0;
  let player_list = self.data.player_list;
  let json = JSON.parse(buf);
  console.log('loadLocalData json:::', json);
  // for(let i=1;i<=4;i++){
  //   player_list[i-1].players = [];
  //   let list = json["job-"+i];
  //   if (list.length == 0) continue;
  //   // console.log('当前list', i, list);
  //   for (let k2 in list) {
  //     let newPlayer = self.checkFinishStatus( self.getNewPlayer(list[k2]) );
  //     player_list[i-1].players.push(newPlayer);
  //     console.log('loadLocalData '+i+'插入', k2, list[k2], newPlayer);
  //   }
  //   playersTotalCount += list.length;
  // }
  for(let k in json['player_list']) {
    player_list[k].players = [];
    let localPlayers = json['player_list'][k].players;
    if (!localPlayers || localPlayers.length == 0) continue;
    // console.log('当前list', i, list);
    for (let k2 in localPlayers) {
      let newPlayer = self.checkFinishStatus( self.getNewPlayer(localPlayers[k2]) );
      player_list[k].players.push(newPlayer);
      console.log('loadLocalData '+k+'插入', k2, localPlayers[k2], newPlayer);
    }
    playersTotalCount += localPlayers.length;
  }
  console.log('player_list', player_list);

  self.setData({ player_list: player_list, playersTotalCount: playersTotalCount });

  if (json["enrollData"]) {
    self.setData({ enrollData: json["enrollData"] });
  }
  if (callback) callback();
}
