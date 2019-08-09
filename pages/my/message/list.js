import http from "../../../utils/http.js";
import utils from "../../../utils/index.js";
import config from '../../../config/config.js'

Page({
  /**
   * 页面的初始数据
   */
  data: {
    isTeam:false,
    
    info: {
      list: [],
      max_count: 0,
      current_page: 1,
      limit: 10,
      search_name: "",
      isLoadMore: true,
      pageIndex: 0,
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    loadData(this);
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.data.info.current_page = 1
    this.setData({
      isLoadMore: true
    })
    // this.data.user = []
    loadData(this)
    wx.showToast({
      title: '刷新成功'
    })
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.data.info.current_page++;
    this.setData({ isHideLoadMore: true, isLoadMore: true });
    loadData(this);
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  onClickDetail: function (e) {
    console.log('接收到的消息',e);
    let item = e.detail;
    if(item.type == 201){
      if (item.extra) {
        //日程详情
        return wx.navigateTo({
          url : '/pages/team/teamhome/schedule/detail?schedule_id='+item.extra.schedule_id
        });
      } 
    }
    // let type = item.type;
    // let id = item.id;

    // if (type == 1 || type == 5 || type == 2 || type == 4) {
    //   //赛事报名
    //   return wx.navigateTo({
    //     url: '/pages/league/leagueitem/index?team_id=' + this.data.teamId + '&id=' + id
    //   });
    // } else if (type == 101) {
    //   return wx.navigateTo({
    //     url: '/pages/team/teamhome/notice/detail?team_id=' + item.team_id + '&id=' + id
    //   });
    // }

  }
})


function loadData(self) {
  http.post('TEAM_API_MY_MESSAGE_LIST', { current_page: self.data.info.current_page, limit: 10 }, function (res) {
    if (res.code != 200) {
      return wx.showModal({
        title: '',
        content: res.err,
        confirmText: '确定', confirmColor: '#00a7f2', 
        showCancel: false,
        success: function (res) { } // res.confirm
      });
    }

    var list = []
    let info = res.info;

    if (info.current_page == 1) {
      self.data.info.list = []
    }
    list = self.data.info.list.concat(info.list)
    self.setData({
      info: {
        list: list,
        max_count: info.max_count,
        current_page: info.current_page,
        limit: info.limit,
        isHideLoadMore: true,
      }
    })
    setTimeout(() => {
      wx.stopPullDownRefresh()
    })
  });
}