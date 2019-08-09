import http from "../../../utils/http.js";
import utils from "../../../utils/index.js";
import config from '../../../config/config.js'

Page({
  /**
   * 页面的初始数据
   */
  data: {
    isTeam: false,
    info: {
      list: [],
      max_count: 0,
      current_page: 1,
      limit: 10,
      search_name: "",
      isLoadMore: true,
      pageIndex: 0,
    },
    showModal: false,
    price: 0,
    index: 0, //当前索引
    currentIndex: -1,
    price_id: 0, //价格ID
    team_id: "",
    coupon_count: 0,
    total_num: 0,

    detailModalVisible: false
  },

  loadCoupon() {
    const self = this;
    http.post('PAY_API_COUPON_TOTAL', {
      group_id: self.data.team_id
    }, function (res) {
      if (res.code != 200) {
        return wx.showModal({ content: res.err, confirmText: '确定', confirmColor: '#00a7f2', showCancel: false });
      }
      self.setData({
        coupon_count: res.info[4].coupon_count
      });
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      team_id: options.team_id
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    loadData(this);
    this.loadCoupon();
  },

  gotoDesc (e) {
    return wx.navigateTo({ url: '/pages/my/card/description' });
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    this.data.info.current_page = 1
    this.setData({ isLoadMore: true });
    // this.data.user = []
    loadData(this);
    this.loadCoupon();
    // wx.showToast({ title: '刷新成功' });
    wx.stopPullDownRefresh();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    // this.data.info.current_page++;
    // this.setData({
    //   isHideLoadMore: true,
    //   isLoadMore: true
    // });
    // loadData(this);
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },

  tapShowModal: function(event) {
    var position = event.currentTarget.id;
    // if (this.data.currentIndex != position) {
    this.selectComponent("#dialog").onShow();
    this.setData({
      showModal: true,
      price: event.currentTarget.dataset.item.sale_price / 100,
      currentIndex: position,
      price_id: event.currentTarget.dataset.item.id,
      team_id: this.data.team_id,
      total_num: event.currentTarget.dataset.item.sale_price / 100,
    })
    // }

  },

  // tapHideModal: function () {
  //   this.setData({
  //     showModal: false
  //   })
  // }
})


function loadData(self) {
  http.post('PAY_API_PRICE_GET_GOODS', {}, function(res) {
    if (res.code != 200) {
      return wx.showModal({ content: res.err, confirmText: '确定', confirmColor: '#00a7f2', showCancel: false });
    }
    var list = []
    let info = res.info;
    list = info;
    self.setData({
      info: {
        list: list
      }
    });
  });
}