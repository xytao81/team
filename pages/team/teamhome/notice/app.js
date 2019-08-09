import http from "../../../../utils/http.js";
import utils from "../../../../utils/index.js";
import config from '../../../../config/config.js'
var moment = require("moment");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    teamId: '',
    teamRights: 0,

    notices: [],
    page: 1,
    hasMore: true

  },

  loadRights(callback) {
    const self = this;
    wx.showLoading();
    http.post('TEAM_API_PLAYER_MYRIGHTS', { team_id: self.data.teamId }, function (res) {
      wx.hideLoading();
      if (res.code != 200) {
        return wx.showModal({ content: res.err, confirmText: '确定', confirmColor: '#00a7f2', showCancel: false });
      }
      self.setData({ teamRights: res.info.rights });
      if (callback) callback();
    });
  },

  loadNoticeList(page) {
    const self = this;
    http.post('TEAM_API_NOTICE_LIST', { team_id: self.data.teamId, current_page:page }, function (res) {
      wx.hideLoading()
      if (res.code != 200) {
        return wx.showModal({ content: res.err, confirmText: '确定', confirmColor: '#00a7f2', showCancel: false });
      }
  
      const totalCount = res.info.total_count;
      var hasMore = self.data.hasMore;
      var newNotices = self.data.notices;

      var notices = res.info.list;
      for (let k in notices) {
        newNotices.push(notices[k]);
      }
      if (newNotices.length >= totalCount) {
        hasMore = false;
      }
      self.setData({ notices: newNotices, page: res.info.current_page, hasMore: hasMore });
      if(page==1){
        wx.setStorageSync("notice-" + self.data.teamId, moment().valueOf());
      }
    });

  },

  onReachBottom(e) {
    if (!this.data.hasMore) return;
    this.loadNoticeList(this.data.page + 1);
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const self = this;

    self.setData({ teamId: options.team_id});

    // self.loadRights(function() {

    //   // 加载第一页列表数据
    //   self.loadNoticeList(1);

    // });

  },

  onShow: function () {
    const self = this;

    self.loadRights(function() {
      self.setData({ notices: [] });
      // 加载第一页列表数据
      self.loadNoticeList(1);

    });
  }

});
