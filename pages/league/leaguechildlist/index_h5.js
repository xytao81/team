import config from '../../../config/config.js'


Page({

  /**
   * 页面的初始数据
   */
  data: {
    id:0,
    teamId: 0,
    url: '',

    isShare: 0
  },

  parseScene(scene) {
    if (!scene) return {};
    const obj = {};
    const arr = scene.split('||');
    if (arr[0]) obj.id = arr[0];
    if (arr[1]) obj.team_id = arr[1]
    obj.is_share = 1;
    return obj;
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    options = Object.assign(options, this.parseScene(options.scene));
  
    this.setData({ id: options.id})
    if (options.team_id) {
      this.setData({
        teamId: options.team_id
      })
    }

    const isShare = options.is_share ? options.is_share : 0;
    this.setData({ isShare: isShare });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.setData({ url: config.LEAGUE_URL + "/childlist?id="+this.data.id+"&team_id="+this.data.teamId+"&is_mp=1&is_share="+this.data.isShare })
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