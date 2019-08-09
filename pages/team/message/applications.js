import http from "../../../utils/http.js";
import utils from "../../../utils/index.js";
import config from '../../../config/config.js'
var moment = require("moment");

Page({

  /**
   * 页面的初始数据
   */
  data: {

    teamId: '',
    teamRights: 0,

    type: 1,

    is_first:true,

    info_1: {
      list: [],
      max_count: 0,
      current_page: 1,
      limit: 10,
      search_name: "",
      isLoadMore: true,
    },
    info_2: {
      list: [],
      max_count: 0,
      current_page: 1,
      limit: 10,
      search_name: "",
      isLoadMore: true,
    },


    post_data: {},
  },

  clickButton(e) {
    let type = e.currentTarget.dataset.type;
    
    this.setData({
      type: type,
    })

    if (type == 2 && this.data.is_first){
      this.loadData();
    }

    this.setData({
      is_first:false,
    })
  },

  loadRights(callback) {
    const self = this;
    wx.showLoading();
    http.post('TEAM_API_PLAYER_MYRIGHTS', {
      team_id: self.data.teamId
    }, function(res) {
      wx.hideLoading();
      if (res.code != 200) {
        return wx.showModal({
          title: '',
          content: res.err,
          confirmText: '确定', confirmColor: '#00a7f2', 
          showCancel: false
        });
      }
      self.setData({
        teamRights: res.info.rights
      });
      if (callback) callback();
    });
  },

  // onPullDownRefresh: function () {
  //   this.data.info.current_page = 1
  //   this.setData({
  //     isLoadMore: true
  //   })
  //   // this.data.user = []
  //   loadData(this)
  //   wx.showToast({
  //     title: '刷新成功'
  //   })
  // },

  onReachBottom(e) {
    let info = this.data.info_1;
    if (this.data.type == 2) info = this.data.info_2;

    info.current_page++;
    info.isHideLoadMore = true;
    if (this.data.type == 2) {
      this.setData({
        info_2: info
      });
    } else {
      this.setData({
        info_1: info
      });
    }
    this.loadData();

  },
  onClickButton: function(e) {
    let type = e.detail.type
    let record_id = e.detail.record_id
    let player_id = e.detail.player_id
    let operate_id = e.detail.operate_id

    let post_data = {
      type: type,
      record_id: record_id,
      player_id: player_id,
      operate_id: operate_id
    }
    this.setData({
      post_data: post_data
    })

    if (type == 1) {
      let value = "欢迎加入我们的球队~~";
      this.selectComponent("#input").onShow(value);
    } else {
      let value = "很遗憾，不能加入我们的球队~~";
      this.selectComponent("#input").onShow(value);
    }
  },

  onInpueDone: function(e) {
    let value = e.detail.value;
    console.log(value)

    saveData(this, value);
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    const self = this;
    const type = options.type ? options.type : 1;

    self.setData({
      teamId: options.team_id,
      type: type
    });
  },

  onShow: function() {
    const self = this;

    self.loadRights(function() {
      // 加载第一页列表数据
      self.loadData();

    });
  },
  loadData: function() {
    let self = this;
    let info = this.data.info_1;
    if (this.data.type == 2) info = this.data.info_2;

    http.post('TEAM_API_OPERATE_LIST', {
      team_id: self.data.teamId,
      current_page: info.current_page,
      limit: 10,
      is_done: self.data.type == 1 ? 0 : 1
    }, function(res) {
      if (res.code != 200) {
        return wx.showModal({
          title: '',
          content: res.err,
          confirmText: '确定', confirmColor: '#00a7f2', 
          showCancel: false,
          success: function(res) {} // res.confirm
        });
      }

      var list = []
      let info = res.info;

      let des_info = self.data.info_1;
      if (self.data.type == 2) des_info = self.data.info_2;

      if (info.current_page == 1) {
        des_info.list = []
      }
      list = des_info.list.concat(info.list)
      des_info = {
        list: list,
        max_count: info.max_count,
        current_page: info.current_page,
        limit: info.limit,
        isHideLoadMore: true,
      }
      if (self.data.type == 2) {
        self.setData({
          info_2: des_info
        })
      } else {
        self.setData({
          info_1: des_info
        })
      }

      setTimeout(() => {
        wx.stopPullDownRefresh()
      })
    });
  }

});


function saveData(self, desc) {
  let post_data = self.data.post_data;
  post_data["desc"] = desc;
  post_data["team_id"] = self.data.teamId;

  wx.showLoading();
  http.post('TEAM_API_PLAYER_AGREE', post_data, function(res) {
    wx.hideLoading();
    if (res.code != 200) {
      return wx.showModal({
        title: '',
        content: res.err,
        confirmText: '确定', confirmColor: '#00a7f2', 
        showCancel: false
      });
    }

    let info = self.data.info_1;
    if (self.data.type == 2) info = self.data.info_2;
    info.current_page = 1;
    if (self.data.type == 1) {
      self.setData({
        info_1: info
      })
    } else if (self.data.type == 2) {
      self.setData({
        info_2: info
      })
    }
    self.loadData();
  });
}