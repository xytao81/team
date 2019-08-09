import http from "../../../utils/http.js";
import utils from "../../../utils/index.js";
import config from '../../../config/config.js'


const app = getApp();

Page({
  data: {
    team_id: '',
    info: {
      list: [],
      max_count: 0,
      current_page: 1,
      limit: 10,
      search_name: "",
      isLoadMore: true,
      pageIndex: 0,
    },
    id: '',
    isHideLoadMore: true
  },
  // //下拉刷新
  // onPullDownRefresh: function () {
  //   wx.stopPullDownRefresh()
  // },

  //   loadData(this);

  // },
  //加载更多
  // onReachBottom(){

  //   loadData(this);
  // },

  onLoad: function(options) {
    this.setData({
      id: options.id,
      teamId: options.team_id
    })
    loadData(this);
  },
  onPullDownRefresh: function() {
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
  onReachBottom: function() {
    this.data.info.current_page++
      this.setData({
        isHideLoadMore: true,
        isLoadMore: true
      })
    loadData(this)
  },
  handleClick: function(event) {
    // wx.navigateTo({
    //   url: '../leagueitem/index?id=' + event.currentTarget.dataset.item.id + "&team_id=" + this.data.teamId
    // })
    wx.navigateTo({
      url: '../leagueitem/index_h5?id=' + event.currentTarget.dataset.item.id + "&team_id=" + this.data.teamId
    })

  }
})



function loadData(self) {
  http.post('LEAGUE_API_ALL_CHILD_LIST', {
    limit: 10,
    current_page: self.data.info.current_page,
    id: self.data.id,
    search_name: self.data.info.search_name,
    province: app.globalData.user.location.province,
    city: app.globalData.user.location.city,
  }, function(res) {
    if (res.code != 200) {
      return wx.showModal({
        title: '',
        content: res.err,
        confirmText: '确定', confirmColor: '#00a7f2', 
        showCancel: false,
        success: function(res) {} // res.confirm
      });
    }
    var list = []
    let info = res.info;

    if (info.current_page == 1) {
      self.data.info.list = []
    }
    list = self.data.info.list.concat(info.list)
    // self.data.info.list = list;
    // self.data.info.max_count = info.max_count;
    // self.data.info.current_page = info.current_page;
    // self.data.info.limit = info.limit;
    self.setData({
      info: {
        // list:info.list,
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