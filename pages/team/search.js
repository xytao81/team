import http from "../../utils/http.js";
import utils from "../../utils/index.js";
import config from '../../config/config.js'

const app = getApp();

Page({

  // 页面的初始数据
  data: {
    search_name: '',
    is_show: false,
    list: [],
    
    pageSize: 10,
    currentPage: 1,
    hasMore: true,

    post_data:{
      id:0,
      value:""
    },

    typeIndex: 0,
    type:''
  },

  bindTypeChange: function (e) {
    let typeIndex = e.detail.value;
    let type = typeIndex == 1 ? 'id' : 'name';
    this.setData({ 
      typeIndex: e.detail.value, type: type ,
      search_name: '',
    });
  },

  loadTeams(page) {
    const self = this;
    let params = {
      search_name: self.data.search_name,
      type:self.data.type,
      current_page: page,
      limit: self.data.pageSize,
    };
    http.post('TEAM_API_INDEX_SEARCH', params, function (res) {
      if (res.code != 200) {
        return wx.showModal({ content: res.err, confirmText: '确定', confirmColor: '#00a7f2', showCancel: false });
      }
  
      let list = self.data.list;
      for (let k in res.info.list) {
        list.push(res.info.list[k]);
      }

      let hasMore = self.data.hasMore;
      if (list.length >= res.info.total_count) {
        hasMore = false;
      }
  
      self.setData({ list: list, currentPage: page, hasMore: hasMore });
    });

  },

  // 生命周期函数--监听页面加载
  onLoad(options) { },

  onReachBottom: function() {
    if (!this.data.hasMore) return;
    let page = this.data.currentPage + 1;
    this.loadTeams(page);
  },


  inputSearchName: function (e) {
    this.setData({ search_name: e.detail.value, list: [], currentPage: 1, hasMore: true });
    if (this.data.search_name.length > 0){
      this.loadTeams(1);
    }
  },
  handleShowInput: function () {
    this.setData({ is_show: true });
  },
  handleHideInput: function () {
    this.setData({ is_show: false });
  },
  handleClearInput: function () {
    this.setData({ search_name: "" });
  }
});

function joinTeam(self){
  wx.showLoading()
  http.post('TEAM_API_PLAYER_ADD', {
    team_id: self.data.post_data.id,
    desc:self.data.post_data.value,
  }, function (res) {
    wx.hideLoading()

    if (res.code != 200) {
      return wx.showModal({
        title: '',
        content: res.err,
        confirmText: '确定', confirmColor: '#00a7f2', 
        showCancel: false,
        success: function (res) { } // res.confirm
      });
    }

  });
}