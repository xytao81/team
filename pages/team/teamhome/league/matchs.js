import leagueHttp from "../../../../utils/league_http.js";
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    league_id:0,
    team_id:0,

    league_info:null,
    match_list:[],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({ league_id: options.id,team_id:options.team_id});
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    console.log('team_id' + this.data.team_id);
    let self = this;
    wx.showLoading();
    leagueHttp.post("MY_MATCH", { league_id: this.data.league_id, team_id: app.globalData.current_team.id }, function (res) {
      wx.hideLoading();
      if (res.code != 200) {
        wx.showToast({
          title: res.err,
          icon: 'none',
          duration: 3000
        });
        return;
      }

      self.setData({ league_info: res.info.league_info, match_list: res.info.match_list })
    });
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
  handleClick:function(e){
    let item = e.currentTarget.dataset.item;
    console.log(item)
    let id = item.id;
    
    wx.navigateTo({
      url: '/pages/team/teamhome/league/set-lineup?league_id=' + this.data.league_id + "&match_id=" + id + "&team_id=" + this.data.team_id,
    })
  },
  handleEntry:function(){
    wx.navigateTo({
      url: '/pages/league/leagueitem/index_h5?id=' + this.data.league_id,
    })
  }
})