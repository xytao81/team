import http from "../../../../utils/http.js";
import utils from "../../../../utils/index.js";
import config from '../../../../config/config.js'

Page({

  /**
   * 页面的初始数据
   */
  data: {

    teamId: '',

    count: 0,

    notice: {
      id: '',
      title: '',
      content: ''
    }

  },

  loadNotice(noticeId) {
    wx.showLoading();
    const self = this;
    http.post('TEAM_API_NOTICE_DETAIL', { team_id: self.data.teamId, id: noticeId }, function (res) {
      wx.hideLoading();
      if (res.code != 200) {
        return wx.showModal({ content: res.err, confirmText: '确定', confirmColor: '#00a7f2', showCancel: false });
      }

      self.setData({ notice: res.info, count: res.info.content.length });

    });

  },

  bindTitleChange(e) {
    const val = e.detail.value;
    this.data.notice.title = val;
  },
  bindContentChange(e) {
    const val = e.detail.value;
    this.data.notice.content = val;
    this.setData({ count: val.length });
  },

  goTeam() {

  },

  bindSubmit: function() {
    const self = this;
    if (!self.data.notice.title) {
      return wx.showModal({ content: "填写公告标题", confirmText: '确定', confirmColor: '#00a7f2', showCancel: false });
    }
    if (!self.data.notice.content) {
      return wx.showModal({ content: "填写公告内容", confirmText: '确定', confirmColor: '#00a7f2', showCancel: false });
    }

    wx.showLoading();
    if (self.data.notice.id) {
      http.post('TEAM_API_NOTICE_EDIT', { team_id: self.data.teamId, id: self.data.notice.id, title: self.data.notice.title, content: self.data.notice.content }, function (res) {
        wx.hideLoading();
        if (res.code != 200) {
          return wx.showModal({ content: res.err, confirmText: '确定', confirmColor: '#00a7f2', showCancel: false });
        }
        wx.setStorageSync('updateNotices', 1);
        wx.showModal({ content: "提交成功", confirmText: '确定', confirmColor: '#00a7f2', showCancel: false, success: function (res) { wx.navigateBack({ delta: 1 }); } });
      });
    } else {
      http.post('TEAM_API_NOTICE_ADD', { team_id: self.data.teamId, title: self.data.notice.title, content: self.data.notice.content }, function (res) {
        wx.hideLoading();
        if (res.code != 200) {
          return wx.showModal({ content: res.err, confirmText: '确定', confirmColor: '#00a7f2', showCancel: false });
        }
        wx.setStorageSync('updateNotices', 1);
        wx.showModal({ content: "提交成功", confirmText: '确定', confirmColor: '#00a7f2', showCancel: false, success: function (res) { wx.navigateBack({ delta: 1 }); } });
      });

    }

  },

  onLoad: function (options) {
    const self = this;
    const teamId = options.team_id;
    self.setData({ teamId: teamId });

    const noticeId = options.notice_id;
    if (noticeId) {
      wx.setNavigationBarTitle({ title: '编辑公告' });
      self.loadNotice(noticeId);
    }
  }

});
