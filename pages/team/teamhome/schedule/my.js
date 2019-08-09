import http from "../../../../utils/http.js";
import utils from "../../../../utils/index.js";
import config from '../../../../config/config.js'
import teamConfig from '../../../../utils/team_config.js';

const app = getApp();

Page({

  // 页面的初始数据
  data: {

    isAdmin: false,

    from: '',
    schedules: [],
    page: 1,
    hasMore: true


  },

  loadScheduleList(page) {
    const self = this;
    http.post('SCHEDULE_API_MY_LIST', { team_id: '', current_page: page, limit: 99 }, function (res) {
      if (res.code != 200) {
        return wx.showModal({ content: res.err, confirmText: '确定', confirmColor: '#00a7f2', showCancel: false });
      }
      const totalCount = res.info.total_count;
      var hasMore = self.data.hasMore;
      var newSchedules = self.data.schedules;

      var schedules = res.info.list;
      for (let k in schedules) {
        newSchedules.push(schedules[k]);
      }
      if (newSchedules.length >= totalCount || !res.info.has_next) {
        hasMore = false;
      }
      self.setData({ schedules: newSchedules, page: res.info.page, hasMore: hasMore });
    });
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  // 下拉刷新
  // onPullDownRefresh: function () {
  //   console.log('onPullDownRefresh');
  //   this.loadScheduleList(1);
  // },

  clearSchedules() {
    const self = this;
    self.setData({ schedules: [], page: 1, hasMore: true });
  },



  // 生命周期函数--监听页面加载
  onLoad(options) {
    const self = this;
    self.setData({ from: config.FROM });
  },

  onReady() {
    const self = this;
    // let updateTeamSchedules = 0;
    // if (self.data.schedules.length == 0) updateTeamSchedules = 1;
    // if (updateTeamSchedules) {
    //   self.loadRights(function () {
    //     // // 加载第一页列表数据
    //     self.clearSchedules();
    //     self.loadScheduleList(1);
    //   });
    //   wx.setStorageSync('updateTeamSchedules', 0);
    // }
  },
  onShow() {
    const self = this;
    // var updateTeamSchedules = wx.getStorageSync('updateTeamSchedules');
    // if (updateTeamSchedules) {
    //   this.onReady();
    // }
      // // 加载第一页列表数据
      self.clearSchedules();
      self.loadScheduleList(1);
  }

});
