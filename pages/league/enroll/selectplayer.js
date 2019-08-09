import http from "../../../utils/http.js";
import utils from "../../../utils/index.js";
import config from '../../../config/config.js'
import teamConfig from '../../../utils/team_config.js';
var moment = require('moment');

const app = getApp();

Page({

  // 页面的初始数据
  data: {
    from:'',
    leagueId: '',
    teamId: '',
    jobId: '',
    leagueInfo: {},

    selected_list: [],

    info: {
      list: [],
      max_count: 0,
      page: 1,
      limit: 500,
      search_name: "",
      isLoadMore: true
    },

  },

  // // 移出队员
  removePlayer(e) {
    let select_list = this.data.selected_list;
    let index = e.currentTarget.dataset.index;
    let uid = select_list[index].uid;
    select_list.splice(index, 1);
    this.setData({ selected_list: select_list })

    let list = this.data.info.list;
    for (let i = 0; i < list.length; i++) {
      let obj = list[i];
      if (obj.uid == uid) {
        obj.is_selected = false;
        break;
      }
    }
    this.setData({ "info.list": list });

  },

  // // 改变关键词
  bindQChange(e) {
    this.setData({ "info.search_name": e.detail.value, "info.page": 1 });
    loadData(this); // 立即搜索
  },
  bindQClear() {
    this.setData({ "info.search_name": '', "info.page": 1 });
    loadData(this); // 立即搜索
  },

  bindSubjobChange(e) {
    const index = e.currentTarget.dataset.index;
    const val = e.detail.value;

    // 此处添加服务端改变subjob的逻辑

    // 改变视图
    const subJob = teamConfig.getSubJob(this.data.jobId, val);

    let list = this.data.info.list;
    list[index].sub_job = subJob.id;
    list[index].sub_job_name = subJob.name;
    this.setData({ "info.list": list });
  },

  bindNumberChange(e) {
    const index = e.currentTarget.dataset.index;
    const val = e.detail.value;
    console.log('改变player的number:', index, val);
    if (val > 99) {
      return wx.showModal({ content: '球衣号不能大于99', confirmText: '确定', confirmColor: '#00a7f2', showCancel: false });
    }

    let list = this.data.info.list;
    list[index].number = val;
    this.setData({ "info.list": list });
  },

  // 多选框选中
  checkedChange(e) {
    // 注：此处直接设置所有选中的人，而不是单独增加或删除指定的人，因为没有在多选框组件里找到单个多选框的状态事件
    let arr = e.detail.value;
    let list = this.data.info.list;
    for (let i = 0; i < list.length; i++) {
      list[i].is_selected = false;
    }
    let select_list = [];
    for (let i = 0; i < arr.length; i++) {
      let index = parseInt(arr[i]);
      list[index].is_selected = true;
      select_list.push(list[index]);
    }
    this.setData({ "info.list": list });

    this.setData({ selected_list: select_list })
  },

  onPullDownRefresh: function () {
    // this.data.info.page = 1
    // this.setData({ isLoadMore: true })
    // // this.data.user = []
    // loadData(this)
    // wx.showToast({
    //   title: '刷新成功'
    // })
  },
  /**
 * 页面上拉触底事件的处理函数
 */
  onReachBottom: function () {
    if (!this.data.hasMore) return;
    this.data.info.page++;
    loadData(this);

  },

  // 生命周期函数--监听页面加载
  onLoad(options) {
    this.setData({ leagueId: options.league_id, teamId: options.team_id, jobId: options.job_id, from: config.FROM });
  },
  onReady: function () {
    loadData(this);
  },

  onSaveData: function () {
    saveLocalData(this);
    
    wx.navigateBack({ delta: 1 });
  }
});

function concatList(oldPlayers, newPlayers) {
  if (!oldPlayers) oldPlayers = [];
  for (let k in oldPlayers) {
    oldPlayers[k].is_selected = false;
  }
  for (let k in newPlayers) {
    const newPlayer = newPlayers[k];
    var oldPlayer = oldPlayers.find(old => old.player_id == newPlayer.player_id);
    if (!oldPlayer) {
      const len = oldPlayers.push(newPlayer);
      oldPlayer = oldPlayers[len-1];
    }
    oldPlayer.is_selected = true;
  }
  return oldPlayers.filter(item => item.is_selected == true);
}

function saveLocalData(self){
  let select_list = [];
  for (let i = 0; i < self.data.info.list.length; i++) {
    let obj = self.data.info.list[i];
    if (obj.is_selected) select_list.push(obj);
  }
  //保存到缓存
  let key = "enroll-" + self.data.teamId + "-" + self.data.leagueId;
  let job = self.data.jobId;
  let buf = wx.getStorageSync(key);
  let json={};
  if(buf && buf.length>0){
    json=JSON.parse(buf);
  }
  json['player_list'][job-1].players = concatList(json['player_list'][job-1].players, select_list);
  let timestamp = moment().valueOf();
  json["timestamp"] = timestamp;

  wx.setStorageSync(key, JSON.stringify(json));
}


function getLocalPlayerByPlayer(self, player) {
  console.log('getLocalPlayerByPlayer:::', player);
  let localList = getSelectedPlayersFromLocal(self);
  let localPlayer = localList.find(item => item.player_id == player.player_id);
  if (localPlayer) {
    localPlayer.is_selected = true;
  } else {
    player.is_selected = false;
  }
  return localPlayer == null ? player : localPlayer;
}
function loadData(self) {
  http.post('LEAGUE_TEAM_JOIN_LEAGUE_PLAYER2', { team_id: self.data.teamId, league_id: self.data.leagueId, job: self.data.jobId, search_name: self.data.info.search_name, current_page: self.data.info.page, limit: self.data.info.limit }, function (res) {
    if (res.code != 200) {
      return wx.showModal({ content: res.err, confirmText: '确定', confirmColor: '#00a7f2', showCancel: false });
    }
  
    var list = []
    var hasMore = true;
    let info = res.info.player_info;
    self.setData({ leagueInfo: res.info.league_info })
    if (info.current_page == 1) {
      self.data.info.list = []
    }

    let select_list = getSelectedPlayersFromLocal(self);
    console.log('从本地存储中取得已选中的人', select_list);
    
    for (let i = 0; i < select_list.length;i++){
      let obj = select_list[i];
      for (let j = 0; j < info.list.length;j++){
        let o = info.list[j];
        o.is_selected=false;
        let o_uid='';
        let obj_uid='';
        if(self.data.from=='aqm'){
          o_uid = o.player_id;
          obj_uid=obj.player_id;
        }else {
          o_uid = o.uid;
          obj_uid=obj.uid;
        }
        if(o_uid==obj_uid){
          console.log(o.name+' 是选中的', o);
          o.is_selected=true;
          o.number=obj.number;
          o.sub_job=obj.sub_job;
          o.sub_job_name=obj.sub_job_name;
          info.list[j]=o;
          break;
        }
      }
    }

    list = self.data.info.list.concat(info.list)
    for(let k in list) {
      list[k] = getLocalPlayerByPlayer(self, list[k]);
    }
    console.log('合并后的list', list);
    self.data.info.list = list;
    self.data.info.max_count = info.max_count;
    self.data.info.page = info.current_page;
    self.data.info.limit = info.limit;
    if (self.data.info.list.length >= info.max_count) {
      hasMore = false;
    }

    //重新刷新选择的数据
    select_list = list.filter(item => item.is_selected);
    console.log('选中的人！！！', select_list);

    self.setData({
      selected_list: select_list,
      info: {
        // list:info.list,
        list: self.data.info.list,
        max_count: info.max_count,
        page: info.current_page,
        limit: info.limit,
        hasMore: hasMore
      }
    })
    
    setTimeout(() => {
      wx.stopPullDownRefresh()
    })
  });
}

function getSelectedPlayersFromLocal(self) {
  let select_list = [];
  let job = self.data.jobId;
  let key = "enroll-" + self.data.teamId + "-" + self.data.leagueId;
  let buf=wx.getStorageSync(key);
  if (!buf || buf.length == 0) {
    return select_list;
  }
  let json = JSON.parse(buf);
  if (json['player_list'][job-1] && json['player_list'][job-1].players) {
    select_list = json['player_list'][job-1].players;
  }
  self.setData({ selected_list: select_list })
  return select_list;
}
