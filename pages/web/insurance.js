import config from '../../config/config.js'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    url:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let url = options.url;
    console.log('网址：', url);
    // this.setData({ url: 'https://m.aiqiumi.com/insurance?token=a1030af7ca8222d6ba75e1da' });
    this.setData({ url: 'https://m.aiqiumi.com/insurance?token=a1030af7ca8222d6ba75e1da#/InsuredList' });
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