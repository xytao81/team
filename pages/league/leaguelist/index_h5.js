import config from '../../../config/config.js'


Page({

  /**
   * 页面的初始数据
   */
  data: {
    url: '',
    group_id: 0,
    team_id: 0,

    isShare: 0
  },

  parseScene(scene) {
    if (!scene) return {};
    const obj = {};
    const arr = scene.split('||');
    if (arr[0]) obj.group_id = arr[0];
    if (arr[1]) obj.team_id = arr[1];
    obj.is_share = 1;
    return obj;
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    options = Object.assign(options, this.parseScene(options.scene));

    if (options.group_id) {
      this.setData({ group_id: options.group_id })
    }

    if (options.team_id) {
      this.setData({ team_id: options.team_id })
    }

    const isShare = options.is_share ? options.is_share : 0;
    this.setData({ isShare: isShare })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    let url = config.LEAGUE_URL + "?is_mp=1&is_share="+this.data.isShare;
    if (this.data.group_id != 0) {
      url += "&group_id=" + this.data.group_id;
    }
    if (this.data.team_id != 0) {
      url += "&team_id=" + this.data.team_id;
    }
    console.log(url)
    this.setData({ url: url })
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
    const self = this;
    console.log(this.data);
    return {
      title:'赛事列表',
      // action=captain_check&team_id=13093&from_player_id=165268
      path: '/pages/league/leaguelist/index_h5?action=captain_check&team_id='+self.data.team_id+'&is_share=1',        // 默认是当前页面，必须是以‘/’开头的完整路径
      imageUrl: self.data.posterUrl,
      success: (res)=> {
        // console.log("转发成功",res)
      },
      fail:(res)=> {
        // console.log("转发失败",res)
      }
    }
  }
})