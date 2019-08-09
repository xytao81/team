import http from "../../../utils/http.js";
import utils from "../../../utils/index.js";
import config from '../../../config/config.js'

const moment = require('moment');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    team_id: "",
    team: {},
    left_count: 0,
    end_time: "",
  },

  loadTeam() {
    var self = this;
    http.post('TEAM_API_INDEX_DETAIL', {
      id: self.data.team_id
    }, function(res) {
      if (res.code != 200) {
        return wx.showModal({
          content: res.err,
          confirmText: '确定', confirmColor: '#00a7f2', 
          showCancel: false
        });
      }
      self.setData({
        team: res.info
      });
    });
  },

  getMeal() {
    var self = this;
    http.post('PAY_API_PAY_GET_MEAL', {
      group_id: self.data.team_id
    }, function(res) {
      if (res.code != 200) {
        return wx.showModal({
          content: res.err,
          confirmText: '确定', confirmColor: '#00a7f2', 
          showCancel: false
        });
      }
      let end_time = ""
      let left_count = 0
      if (res.info.length > 0) {
        end_time = moment(res.info[0].end_time).format('YYYY-MM-DD');
        left_count = res.info[0].left_count
      } else {
        end_time = "--"
      }
      self.setData({
        end_time: end_time,
        left_count: left_count
      });
    });
  },




  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      team_id: options.team_id
    })

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    this.loadTeam();
    this.getMeal();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    this.getMeal();
  }

})