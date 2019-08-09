import http from "../../../utils/http.js";
import utils from "../../../utils/index.js";
import config from '../../../config/config.js'

Page({
  /**
   * 页面的初始数据
   */
  data: {
    select: false,
    info: {
      list: [],
      max_count: 0,
      current_page: 1,
      limit: 10,
      search_name: "",
      isLoadMore: true,
      pageIndex: 0,
    },
    currentCouponId: 0,
    teamId: 0,
    priceId: 0,
    totalAmount: 0,
    count: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    const select = options.select == 1 ? true : false;
    const currentCouponId = options.current_coupon_id ? parseInt(options.current_coupon_id) : 0;
    const teamId = options.team_id ? parseInt(options.team_id) : 0;
    const priceId = options.price_id ? parseInt(options.price_id) : 0;
    const totalAmount = options.total_amount ? parseInt(options.total_amount) : 0;
    const count = options.count ? parseInt(options.count) : 0;
    this.setData({ select, currentCouponId, teamId, priceId, totalAmount, count });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    loadData(this);
  },


  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    this.data.info.current_page = 1
    this.setData({
      isLoadMore: true
    })
    // this.data.user = []
    loadData(this)
    wx.stopPullDownRefresh();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    this.data.info.current_page++;
    this.setData({
      isHideLoadMore: true,
      isLoadMore: true
    });
    loadData(this);
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },

})


function loadData(self) {
  http.post('PAY_API_COUPON_GET_REMAIN_LIST', {
    group_id: self.data.teamId || '',
    price_id: self.data.priceId || '',
    money: self.data.totalAmount || '',
    count: self.data.count || ''
  }, function(res) {
    if (res.code != 200) {
      return wx.showModal({ content: res.err, confirmText: '确定', confirmColor: '#00a7f2', showCancel: false });
    }
    let info = res.info;
    for (var i = 0; i < info.list.length; i++) {
      info.list[i]["hidden"] = true
      info.list[i].rule = info.list[i].rule.replace("<br />", "\n");
    }
    self.setData({
      info: {
        list: info.list,
      }
    })
  });
}