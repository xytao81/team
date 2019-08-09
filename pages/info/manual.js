import config from "../../config/config.js"
import http from "../../utils/http.js";

Page({

  /**
   * 页面的初始数据
   */
  data: {

    teamId: 0,
    isShare: false,

    helps: []

  },

  loadHelpList() {
    const self = this;
    http.post('COMMON_API_HELP_LIST', {}, function(res) {
      if (res.code != 200) {
        return wx.showModal({ content: res.err, confirmText: '确定', confirmColor: '#00a7f2', showCancel: false });
      }
      self.setData({ helps: res.info.helps });
    });

  },

  onLoad: function (options) {
    let isShare = options.is_share == 1 ? true : false;
    let teamId = options.team_id ? options.team_id : 0;
    // let url = options.url ? decodeURIComponent(options.url) : "";
    this.setData({ isShare: isShare, teamId: teamId });
  },

  onReady: function () {
    this.loadHelpList();
  },

  toggle(e) {
    let helps = this.data.helps;
    let idx = e.currentTarget.dataset.idx;
    helps[idx].show = helps[idx].show ? false : true;
    this.setData({ helps: helps });
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage(e) {
    const self = this;
    return {
      title: '足球队管理小程序操作指南',
      path: '/pages/info/manual?is_share=1',
    }
  }

});