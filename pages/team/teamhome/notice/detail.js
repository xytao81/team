import http from "../../../../utils/http.js";

Page({

  /**
   * Page initial data
   */
  data: {

    teamId: 0,
    noticeId: 0,

    teamRights: 0,
    
    notice: {
      id: 0,
      title: '',
      create_time: '',
      content: ''
    }

  },

  openDeleteConfirm () {
    const self = this;
    wx.showModal({
      title: '删除公告',
      content: '确定删除公告？',
      confirmText: '确定', confirmColor: '#00a7f2',
      showCancel: true,
      success: function (res) {
        if (!res.confirm) return;
        self.deleteNotice(self.data.notice.id);
      }
    });
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

  deleteNotice(noticeId) {
    wx.showLoading();
    const self = this;
    http.post('TEAM_API_NOTICE_REMOVE', { team_id: self.data.teamId, id: noticeId }, function (res) {
      wx.hideLoading();
      if (res.code != 200) {
        return wx.showModal({ content: res.err, confirmText: '确定', confirmColor: '#00a7f2', showCancel: false });
      }
      wx.setStorageSync('updateNotices', 1);
      wx.navigateBack({ delta: 1 });
    });

  },

  loadNotice(noticeId) {
    wx.showLoading();
    const self = this;
    http.post('TEAM_API_NOTICE_DETAIL', { team_id: self.data.teamId, id: noticeId }, function (res) {
      wx.hideLoading();
      if (res.code != 200) {
        return wx.showModal({ content: res.err, confirmText: '确定', confirmColor: '#00a7f2', showCancel: false });
      }
      self.setData({ notice: res.info });
    });

  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
    const self = this;
    const teamId = options.team_id;
    const noticeId = options.id;
    self.setData({ teamId: teamId, noticeId: noticeId });
  },

  onShow: function () {
    const self = this;

    self.loadRights(function () {
      self.setData({ notice: {
        id: 0,
        title: '',
        create_time: '',
        content: ''
      }});

      self.loadNotice(self.data.noticeId);
    });
  },

});
