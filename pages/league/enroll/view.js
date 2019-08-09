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
  },

  // 提交表单

  getNewPlayer(player) {
    console.log('接收 player', player);
    if (!player) return wx.showModal({ content: 'getNewPlayer player 不能是 undefined!', confirmText: '确定', confirmColor: '#00a7f2', showCancel: false });
    if (!player.job) return wx.showModal({ content: 'getNewPlayer player.job 不能是 undefined!', confirmText: '确定', confirmColor: '#00a7f2', showCancel: false });
    const self = this;
    const job = self.data.player_list[player.job-1];
    if (!job) return wx.showModal({ content: 'getNewPlayer job 不能是 undefined!'+player.job, confirmText: '确定', confirmColor: '#00a7f2', showCancel: false });
    const newPlayer = JSON.parse( JSON.stringify(player) );
   
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


  // 生命周期函数--监听页面加载
  onLoad(options) {
    const self = this;
    const leagueId = options.league_id ? options.league_id : '';
    if (!leagueId) return wx.showModal({ content: '赛事ID不能为空！'+leagueId, confirmText: '确定', confirmColor: '#00a7f2', showCancel: false });
    const teamId = options.team_id ? options.team_id : '';
    if (!teamId) return wx.showModal({ content: '球队ID不能为空！'+leagueId, confirmText: '确定', confirmColor: '#00a7f2', showCancel: false });

    this.cropper1 = new WeCropper(this.data.cropper1Opt);

    self.setData({ leagueId: leagueId, teamId: teamId, from:config.FROM });

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


});


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
            // playerList[k].players[k2] = self.checkFinishStatus( self.getNewPlayer(newPlayer) );
          }
        }

        self.setData({ player_list: playerList });
    }

    }
    
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
