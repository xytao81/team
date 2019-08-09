import http from "../../../utils/http.js";
import utils from "../../../utils/index.js";
import config from '../../../config/config.js'
import teamConfig from '../../../utils/team_config.js';

const app = getApp();

Page({

  // 页面的初始数据
  data: {
    teamRights: 0,
    playerId: '',
    teamId: '',
    messageId: '',
    recordId:'',
    isDone:1,
    info: null,


    type:'',
    desc:'',
  },

  captainCheck(e) {
    let type = e.currentTarget.dataset.type;
    this.setData({type:type})
    if (type==1){
      let value = "欢迎加入我们的球队~~";
      this.selectComponent("#input").onShow(value);
    }else {
      let value = "很遗憾，不能加入我们的球队~~";
      this.selectComponent("#input").onShow(value);
    }
    

    // let type = e.currentTarget.dataset.type;
    // saveData(this,type);
  },
  onInpueDone: function (e) {
    let value = e.detail.value;
    console.log(value)
    
    saveData(this, value);
  },

  loadPlayer(id, callback) {
    return 'ok';
    var self = this;
    http.post('TEAM_API_PLAYER_DETAIL', {
      team_id: teamId,
      player_id: playerId
    }, function(res) {
      if (res.code != 200) {
        return wx.showModal({
          title: '',
          content: res.err,
          confirmText: '确定', confirmColor: '#00a7f2', 
          showCancel: false
        });
      }
      self.setData({
        'playerInfo': res.info
      });
      self.setData({
        'playerInfo.jobs': res.info.jobs
      });
      self.setData({
        'saveData.number': res.info.number
      });
      self.setData({
        'saveData.position': teamConfig.getPosition(res.info.position)
      });
      self.setData({
        'saveData.jobs': res.info.jobs
      });
      self.setData({
        'saveData.rights': teamConfig.getRights(res.info.rights)
      });
      wx.hideLoading();

      if (callback) callback();
    });
  },

  // 生命周期函数--监听页面加载
  onLoad(options) {
    const self = this;
    const teamId = options.team_id ? options.team_id : 0;
    const from_player_id = options.from_player_id ? options.from_player_id : 0;
    const messageId = options.message_id ? options.message_id : 0;
    const recordId = options.record_id ? options.record_id : 0;
    
    self.setData({
      from: config.FROM,
      teamId: teamId,
      playerId: from_player_id,
      messageId: messageId,
      recordId: recordId,
    });
  },
  onReady() {
    let self = this;
    self.loadRights(function() {
      loadData(self);
    });

  },
  loadRights(callback) {
    const self = this;
    wx.showLoading();
    http.post('TEAM_API_PLAYER_MYRIGHTS', {
      team_id: self.data.teamId
    }, function(res) {
      wx.hideLoading();
      if (res.code != 200) {
        return wx.showModal({ content: res.err, confirmText: '确定', confirmColor: '#00a7f2', showCancel: false });
      }
      self.setData({ teamRights: res.info.rights });
      if (callback) callback();
    });
  },

});

function loadData(self) {
  wx.showLoading();
  http.post('TEAM_API_PLAYER_USER_INFO', {player_id:self.data.playerId}, function (res) {
    wx.hideLoading();
    if (res.code != 200) {
      return wx.showModal({ content: res.err, confirmText: '确定', confirmColor: '#00a7f2', showCancel: false });
    }
    let info = res.info;
    self.setData({ info: res.info });
    self.setData({ 'info.realphoto.value': res.info.realphoto.value });
    console.log('new', self.data.info.realphoto.value);
    self.selectComponent("#base").onShow(res.info.uid);
    self.selectComponent("#body").onShow(res.info.uid);
    self.selectComponent("#edu").onShow(res.info.uid);
   
    if (self.data.recordId==0){
      self.setData({ isDone: true })
    }else{
      loadRecordData(self);
    }
    
  });
}

function loadRecordData(self) {
  wx.showLoading();
  http.post('TEAM_API_PLAYER_RECORD_STATUS', { record_id: self.data.recordId }, function (res) {
    wx.hideLoading();
    if (res.code != 200) {
      return wx.showModal({ content: res.err, confirmText: '确定', confirmColor: '#00a7f2', showCancel: false });
    }
    let info = res.info;
    self.setData({ isDone: info.is_done })
  });
}

function saveData(self, desc){
  wx.showLoading();
  http.post('TEAM_API_PLAYER_AGREE', { desc: desc, record_id: self.data.recordId, player_id: self.data.playerId, type: self.data.type,team_id:self.data.teamId }, function (res) {
    wx.hideLoading();
    if (res.code != 200) {
      return wx.showModal({ content: res.err, confirmText: '确定', confirmColor: '#00a7f2', showCancel: false });
    }
    // let info = res.info;
    // self.setData({ info: res.info })
    self.setData({ isDone: true })
  });
}