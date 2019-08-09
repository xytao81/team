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
      school_name: '',
      start_time: '',
      end_time: '',
      education: '',
      subject: ''
    }

  },

  loadData() {
    const self = this;


    http.post('ACCOUNT_API_INFO_EDUCATION_DETAIL', {
      id: self.data.post_data.id
    }, function(res) {
      wx.hideLoading();
      if (res.code != 200) {
        return wx.showModal({ content: res.err, confirmText: '确定', confirmColor: '#00a7f2', showCancel: false });
      }

      self.setData({ post_data: res.info });

    });

  },

  bindSchoolChange(e) {
    const val = e.detail.value;
    this.setData({ "post_data.school_name": val })
  },
  bindSubjectChange(e) {
    const val = e.detail.value;
    this.setData({ "post_data.subject": val })
  },
  bindEducationChange(e) {
    const val = e.detail.value;
    const degree = teamConfig.getDegree(val);
    this.setData({
      "post_data.education_name": degree.name,
      "post_data.education": val
    });
  },

  bindInputStartChange(e) {
    const val = e.detail.value;
    this.setData({
      "post_data.start_time": val
    });
  },
  bindInputEndChange(e) {
    const val = e.detail.value;
    this.setData({
      "post_data.end_time": val
    });
  },



  save() {
    const self = this;
    if (self.data.post_data.school_name.length == 0) {
      return wx.showModal({ content: "请填写学校名称", confirmText: '确定', confirmColor: '#00a7f2', showCancel: false });
    }
    if (self.data.post_data.subject.length == 0) {
      return wx.showModal({ content: "请填写专业", confirmText: '确定', confirmColor: '#00a7f2', showCancel: false });
    }
    if (self.data.post_data.education.length == 0) {
      return wx.showModal({ content: "请选择学历", confirmText: '确定', confirmColor: '#00a7f2', showCancel: false });
    }

    wx.showLoading();
    http.post('ACCOUNT_API_INFO_SET_EDUCATION', self.data.post_data, function(res) {
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