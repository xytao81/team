import http from "../../../utils/http.js";
import utils from "../../../utils/index.js";
import config from '../../../config/config.js'
import teamConfig from '../../../utils/team_config.js';
import leagueConfig from '../../../utils/league_config.js';
import validate from '../../../utils/validate.js';

const app = getApp();

Page({

  // 页面的初始数据
  data: {

    from: '',
    leagueid: '',
    teamId: '',
    jobId: '',

    leagueDetail: null,
    leagueConfig: null,

    playerId: '',
    player: null,

    fields: [],

    saveData: {
      jobs: []
    }

  },


  checkAllFields() {
    const self = this;
    let player = self.data.player;
    for (let k in player.content) {
      for (let k2 in player.content[k]) {
        let field = player.content[k][k2];
        if (!field.is_select) continue;
        // console.log('检查字段' + field.name, field);
        if (field.key == 'number') {
          if (field.value > 99) {
            wx.showModal({ content: '球衣号不能大于 99', confirmText: '确定', confirmColor: '#00a7f2', showCancel: false });
            return false;
          }
          if (escape(field.value).indexOf( "%u" ) >= 0) {
            wx.showModal({ content: '球衣号不能包含中文', confirmText: '确定', confirmColor: '#00a7f2', showCancel: false });
            return false;
          }
        }
        if (field.key == 'height') {
          if (field.value > 300) {
            wx.showModal({ content: '身高不能大于 300', confirmText: '确定', confirmColor: '#00a7f2', showCancel: false });
            return false;
          }
          if (escape(field.value).indexOf( "%u" ) >= 0) {
            wx.showModal({ content: '身高不能包含中文', confirmText: '确定', confirmColor: '#00a7f2', showCancel: false });
            return false;
          }
        }
        if (field.key == 'weight') {
          if (field.value > 300) {
            wx.showModal({ content: '体重不能大于 200', confirmText: '确定', confirmColor: '#00a7f2', showCancel: false });
            return false;
          }
          if (escape(field.value).indexOf( "%u" ) >= 0) {
            wx.showModal({ content: '体重不能包含中文', confirmText: '确定', confirmColor: '#00a7f2', showCancel: false });
            return false;
          }
        }

      }
    }
    return true;
  },
  onUsereditChange(e) {
    console.log('onUsereditChange', e);
    let player = this.data.player;
    player.content = e.detail.value;
    this.setData({ player: player });
  },

  bindInputChange: function (e) {
    let saveData = this.data.saveData;
    let key = e.currentTarget.dataset.key;
    let value = e.detail.value;
      console.log(value);
    if (key == 'number') {
      if (value > 99) {
        wx.showModal({ content: '球衣号不能大于 99', confirmText: '确定', confirmColor: '#00a7f2', showCancel: false });
        value = '';
      }
      if (escape(value).indexOf( "%u" ) >= 0) {
        wx.showModal({ content: '球衣号不能包含中文', confirmText: '确定', confirmColor: '#00a7f2', showCancel: false });
        value = '';
      }
    }
    if (key == 'height') {
      if (value > 300) {
        wx.showModal({ content: '身高不能大于 300', confirmText: '确定', confirmColor: '#00a7f2', showCancel: false });
        value = '';
      }
      if (escape(value).indexOf( "%u" ) >= 0) {
        wx.showModal({ content: '身高不能包含中文', confirmText: '确定', confirmColor: '#00a7f2', showCancel: false });
        value = '';
      }
    }
    if (key == 'weight') {
      if (value > 300) {
        wx.showModal({ content: '体重不能大于 200', confirmText: '确定', confirmColor: '#00a7f2', showCancel: false });
        value = '';
      }
      if (escape(value).indexOf( "%u" ) >= 0) {
        wx.showModal({ content: '体重不能包含中文', confirmText: '确定', confirmColor: '#00a7f2', showCancel: false });
        value = '';
      }
    }
    saveData[key] = value;
    this.setData({ saveData: saveData });
  },
  bindSubJobChange(e) {
    const subJubId = e.detail.value;
    const subJub = teamConfig.getSubJob(this.data.jobId, subJubId);
    console.log('job change', subJub);
    this.setData({ 'saveData.sub_job': subJubId, 'saveData.sub_job_name': subJub.name });
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
    }
    http.post('LEAGUE_CONFIG_URL', { id: leagueId }, function (res) {
      if (res.code != 200) {
        return wx.showModal({ content: res.err, confirmText: '确定', confirmColor: '#00a7f2', showCancel: false });
      }
      self.setData({ leagueConfig: res.info });
      if (callback) callback();
    });
  },
  clearPlayerData() {
    const self = this;
    let playerData = self.data.saveData;
    for (let key in playerData) {
      const isNeeded = self.data.fields.find(field => field.key == key);
      if (!isNeeded) {
        if (key == 'player_id' || key == 'team_id' || key == 'is_me' || key == 'is_player' || key == 'is_user'
        || key == 'is_selected' || key == 'isFinished' || key == 'show_name' || key == 'job' || key == 'jobs'
        || key == 'job_name' || key == 'show_jobs' || key == 'uid' || key == 'rights' || key == 'cert_type'
        || key == 'sub_job_name' || key == 'show_number' || key == 'flag') continue;
        playerData[key] = null;
        if (key == 'certnumber') playerData.cert_type = null;
      }
    }
  },

  saveLocalPlayer() {
    const self = this;
    self.clearPlayerData();
    console.log('处理完毕', self.data.saveData);
    const fieldPhone = self.data.fields.find(item => item.key == 'phone');
    if (fieldPhone != null && self.data.saveData.phone) {
      if (!validate.validatePhone(self.data.saveData.phone) ) {
        return wx.showModal({ content: '手机号错误 '+self.data.saveData.phone, confirmText: '确定', confirmColor: '#00a7f2', showCancel: false });
      }
    }
    const fieldCertnumber = self.data.fields.find(item => item.key == 'certnumber');
    if (fieldCertnumber != null && self.data.saveData.cert_type == 1 && self.data.saveData.certnumber)  {
      var res = validate.validateIdentity(self.data.saveData.certnumber);
      if (!res.result ) {
        return wx.showModal({ content: res.message, confirmText: '确定', confirmColor: '#00a7f2', showCancel: false });
      }
    }

    let result = self.checkAllFields();
    if (!result) { return; }
    let key = "enroll-" + self.data.teamId + "-" + self.data.leagueId;
    let buf = wx.getStorageSync(key);
    if (!buf || buf.length == 0) {
      return wx.showModal({ content: '未找到队员资料 ' + self.data.playerId, confirmText: '确定', confirmColor: '#00a7f2', showCancel: false });
    }
    let json = JSON.parse(buf);
    let job = json['player_list'][self.data.jobId-1];
    let playerIndex = job.players.findIndex(item => item.player_id == self.data.playerId);
    job.players[playerIndex] = self.data.player;
    buf = JSON.stringify(json);
    // console.log('savelocalPlayer:::', self.data.player);
    const rs = wx.setStorageSync(key, buf);
    wx.navigateBack({ delta: 1 });
  },
  loadLocalPlayer() {
    const self = this;
    let key = "enroll-" + self.data.teamId + "-" + self.data.leagueId;
    let buf = wx.getStorageSync(key);
    if (!buf || buf.length == 0) {
      return wx.showModal({ content: '未找到队员资料 ' + self.data.playerId, confirmText: '确定', confirmColor: '#00a7f2', showCancel: false });
    }
    let json = JSON.parse(buf);
    let players = json['player_list'][self.data.jobId-1].players;
    let player = players.find(item => item.player_id == self.data.playerId);
    if (!player) {
      return wx.showModal({ content: '未找到队员资料 ' + self.data.playerId, confirmText: '确定', confirmColor: '#00a7f2', showCancel: false });
    }
    console.log('localPlayer:::', player);
    self.setData({ player: player });
  },

  // 生命周期函数--监听页面加载
  onLoad(options) {
    const self = this;
    self.setData({ from: config.FROM, leagueId: options.league_id, jobId: options.job_id, teamId: options.team_id, playerId: options.player_id })
  },

  onReady() {
    const self = this;
    self.loadLeagueDetail(self.data.leagueId, self.data.teamId, function () {
      self.loadLeagueConfig(self.data.leagueId, function () {
        // const enrollFields = self.data.leagueConfig.enroll_field[self.data.jobId].split(',');
        // var fields = [];
        // for (let k in enrollFields) {
        //   var key = leagueConfig.getEnrollKeyByZh(enrollFields[k]);
        //   if (key == 'sub_rights') key = 'sub_job'; //转换成球队使用的字段
        //   const obj = {
        //     key: key,
        //     name: enrollFields[k]
        //   }
        //   fields.push(obj);
        // }
        // console.log('fields', fields);
        // self.setData({ fields: fields })
        self.loadLocalPlayer();
      });
    });
  }

});