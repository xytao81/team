import http from "../../../../utils/http.js";
import utils from "../../../../utils/index.js";
import config from '../../../../config/config.js'
import teamConfig from '../../../../utils/team_config.js'

const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    user_info: null,
    post_data: {
      id: '',
      name: '',
      relation: '',
      phone: ''
    }

  },

  loadData() {
    const self = this;


    http.post('ACCOUNT_API_INFO_CONTACTS_DETAIL', {
      id: self.data.post_data.id
    }, function(res) {
      wx.hideLoading();
      if (res.code != 200) {
        return wx.showModal({ content: res.err, confirmText: '确定', confirmColor: '#00a7f2', showCancel: false });
      }

      if (res.info.relation) {
        res.info.relation = parseInt(res.info.relation)-1;
      }

      self.setData({ post_data: res.info });

    });

  },

  bindNameChange(e) {
    const val = e.detail.value;
    this.setData({ "post_data.name": val })
  },
  bindRelationChange(e) {
    const val = e.detail.value;
    this.setData({ "post_data.relation": val });
  },
  bindPhoneChange(e) {
    const val = e.detail.value;
    this.setData({ "post_data.phone": val })
  },



  save() {
    const self = this;
    if (self.data.post_data.name.length == 0) {
      return wx.showModal({ content: "请填写姓名", confirmText: '确定', confirmColor: '#00a7f2', showCancel: false });
    }
    if (self.data.post_data.relation.length == 0) {
      return wx.showModal({ content: "请选择关系", confirmText: '确定', confirmColor: '#00a7f2', showCancel: false });
    }
    if (self.data.post_data.phone.length == 0) {
      return wx.showModal({ content: "请填写联系手机", confirmText: '确定', confirmColor: '#00a7f2', showCancel: false });
    }

    self.data.post_data.relation = parseInt(self.data.post_data.relation)+1;

    wx.showLoading();
    http.post('ACCOUNT_API_INFO_SET_CONTACTS', self.data.post_data, function(res) {
      wx.hideLoading();
      if (res.code != 200) {
        return wx.showModal({ content: res.err, confirmText: '确定', confirmColor: '#00a7f2', showCancel: false });
      }

      wx.showModal({
        content: "提交成功",
        confirmText: '确定', confirmColor: '#00a7f2', 
        showCancel: false,
        success: function(res) {
          wx.navigateBack({ delta: 1 });
        }
      });
    });

  },

  onLoad(options) {
    this.setData({ user_info: app.globalData.user.info })

    const self = this;
    const expId = options.id ? options.id : 0;
    this.setData({ "post_data.id": expId });
  },

  onShow() {
    if (this.data.post_data.id != 0) {
      this.loadData();
    }
  }

});