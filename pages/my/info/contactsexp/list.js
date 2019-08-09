import http from "../../../../utils/http.js";
import utils from "../../../../utils/index.js";
import config from '../../../../config/config.js'

const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    user_info:null,
  },

  loadData() {
    const self = this;
    http.post('ACCOUNT_API_INFO_GET_CONTACTS', {}, function(res) {
      wx.hideLoading()
      if (res.code != 200) {
        return wx.showModal({ content: res.err, confirmText: '确定', confirmColor: '#00a7f2', showCancel: false });
      }

      
      self.setData({
        list: res.info
      });
    });
  },

  onRemoveButton:function(e){
    let obj = e.currentTarget.dataset.item;
    let self=this;
    wx.showModal({
      content: "确定要删除紧急联系人吗",
      confirmText: '确定', confirmColor: '#00a7f2', 
      showCancel: true,
      success: function (res) {
        if (!res.confirm) return;
        return self.remove(obj.id);
      }
    });
  },

  onEditButton: function (e) {
    let obj = e.currentTarget.dataset.item;
    wx.navigateTo({
      url: '/pages/my/info/contactsexp/add?id='+obj.id,
    })
  },

  onReachBottom(e) {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({
      user_info: app.globalData.user.info
    })
  },

  onShow() {
    const self = this;

    self.loadData();
  },


  remove:function(id){
    let self=this;
    http.post('ACCOUNT_API_INFO_REMOVE_CONTACTS', {id:id}, function (res) {
      wx.hideLoading()
      if (res.code != 200) {
        return wx.showModal({ content: res.err, confirmText: '确定', confirmColor: '#00a7f2', showCancel: false });
      }

      self.loadData();
      
    });
  }

});
