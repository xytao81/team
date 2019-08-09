import http from "../../../../utils/http.js";
import utils from "../../../../utils/index.js";
import config from '../../../../config/config.js'


Page({

  /**
   * 页面的初始数据
   */
  data: {
    teamId:'',
    teamRights:0,

    content:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({ teamId: options.team_id})
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    loadRightsData(this);
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

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },


  gotoAdd:function(){
    return wx.navigateTo({ url: '/pages/team/notice/add?team_id=' + this.data.teamId });
  }
})

function loadRightsData(self){
  wx.showLoading()
  http.post('TEAM_API_PLAYER_MYRIGHTS', { team_id: self.data.teamId }, function (res) {
    wx.hideLoading()
    if (res.code != 200) {
      return wx.showModal({
        title: '',
        content: res.err,
        confirmText: '确定', confirmColor: '#00a7f2', 
        showCancel: false,
        success: function (res) { } // res.confirm
      });
    }

    self.setData({ teamRights:res.info.rights})
    loadData(self)

  });
}


function loadData(self) {
  wx.showLoading()

  http.post('TEAM_API_NOTICE_GETLAST', { team_id: self.data.teamId }, function (res) {
    wx.hideLoading()
    if (res.code != 200) {
      return wx.showModal({
        title: '',
        content: res.err,
        confirmText: '确定', confirmColor: '#00a7f2', 
        showCancel: false,
        success: function (res) { } // res.confirm
      });
    }

    let info=res.info;
    if (info){
      self.setData({ content: info.content });

      wx.setStorageSync("notice-" + self.data.teamId,info.id);
    } 
    

  });
}