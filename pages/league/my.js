import http from "../../utils/http.js";
import utils from "../../utils/index.js";
import config from '../../config/config.js'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    teamId: '',

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
    this.setData({ teamId: options.team_id })
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
    isHideLoadMore: true
    this.data.info.current_page++
    // if (this.data.info.list.length < this.data.info.limit) {
    //   this.setData({
    //     isHideLoadMore: false,
    //     isLoadMore: false
    //   })
    //   return
    // }
    this.setData({
      isHideLoadMore: true,
      isLoadMore: true
    })
    loadData(this)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    let self = this;
    console.log(this.data);
    return {
      title:'我的赛事',
      // action=captain_check&team_id=13093&from_player_id=165268
      path: '/pages/league/my?team_id='+self.data.teamId+'&is_share=1',        // 默认是当前页面，必须是以‘/’开头的完整路径
      imageUrl: self.data.posterUrl,
      success: (res)=> {
        // console.log("转发成功",res)
      },
      fail:(res)=> {
        // console.log("转发失败",res)
      }
    }
  },

  gotoDetail:function(e){
    let id=e.currentTarget.dataset.item.id;
    // return wx.navigateTo({ url: '/pages/league/leagueitem/index?id=' + id + "&team_id=" + this.data.teamId });
    return wx.navigateTo({ url: '/pages/league/leagueitem/index_h5?id=' + id + "&team_id=" + this.data.teamId });
  }
})


function loadData(self) {
  http.post('LEAGUE_API_MY_LIST', { team_id: self.data.teamId, current_page: self.data.info.current_page }, function (res) {
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
    let info=res.info;

    if (info.current_page == 1) {
      self.data.info.list = []
    }
    for (let i = 0; i < info.list.length; i++) {
      let obj = info.list[i];
      obj.status = obj.match_status + "" + obj.enroll_status;
    }
    
    list = self.data.info.list.concat(info.list)
    self.data.info.list = list;
    self.data.info.max_count = info.max_count;
    self.data.info.current_page = info.current_page;
    self.data.info.limit = info.limit;
    self.setData({
      // list:info.list,
      list: self.data.info.list,
      max_count: info.max_count,
      current_page: info.current_page,
      limit: info.limit,
      isHideLoadMore:true,
    })
    setTimeout(() => {
      wx.stopPullDownRefresh()
    })
  });
}