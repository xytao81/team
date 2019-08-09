import config from "../../config/config.js"
import http from "../../utils/http.js";

Page({

  /**
   * 页面的初始数据
   */
  data: {

    helpId: 0,

    help: {
      id: 0,
      title: '',
      content: ''
    }

  },

  loadHelp(id) {
    const self = this;
    http.post('COMMON_API_HELP_DETAIL', { id: id }, function(res) {
      if (res.code != 200) {
        return wx.showModal({ content: res.err, confirmText: '确定', confirmColor: '#00a7f2', showCancel: false });
      }
      self.setData({ help: res.info.help });
    });

  },

  onLoad: function (options) {
    let helpId = options.id ? options.id : 0;
    this.setData({ helpId: helpId });
  },

  onReady: function () {
    this.loadHelp(this.data.helpId);
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