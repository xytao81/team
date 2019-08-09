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
    const url = options.url ? decodeURIComponent(options.url) : '';
    this.setData({ url: url });
    
  }

});
