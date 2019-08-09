
const app = getApp();

Page({

  data: {

  },


  onLoad: function (options) {
    
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.selectComponent('#joinLeague').loadJoinLeague();
    this.selectComponent('#inviteLeague').loadInviteLeague();
    wx.stopPullDownRefresh();
  },

  handleClick:function(e){
    let item = e.detail;
    wx.navigateTo({
      url: '/pages/team/teamhome/league/matchs?id='+item.id+"&team_id="+item.team_id,
    })
  },

  handleClickToLeagueHome:function(e){
    let item = e.detail;
    wx.navigateTo({ url: '/pages/league/leagueitem/index_h5?id=' + item.id + '&team_id='+ app.globalData.current_team.id +'&is_admin=1' })
  }
})