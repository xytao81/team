import config from '../../config/config.js'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    url:'',
    isShare: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const isShare = options.is_share ? 1 : 0;
    this.setData({ isShare: isShare });

    let type = options.type;
    let url = '';
    if(type==1){
      //比赛主页
      url = config.LEAGUE_MACTH_URL + options.id+"&is_mp=1&is_share="+this.data.isShare;
    } else if (type == 2) {
      //赛事详情
      url = config.LEAGUE_TEAM_URL + "league_id=" + options.league_id + "&id=" + options.id+"&is_mp=1&is_share="+this.data.isShare;
    }
    this.setData({ url: url });
    
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

  }
})