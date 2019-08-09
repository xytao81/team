import http from "../../../utils/http.js";
import utils from "../../../utils/index.js";
import config from '../../../config/config.js'
var moment = require("moment");

Page({

  /**
   * 页面的初始数据
   */
  data: {

    team_id: '',
    type: 1,
    finished: 0,
    unpaid: 0,

    is_first:true,

    info_1: {
      list: [],
      max_count: 0,
      current_page: 1,
      limit: 10,
      search_name: "",
      isLoadMore: true,
    },
    info_2: {
      list: [],
      max_count: 0,
      current_page: 1,
      limit: 10,
      search_name: "",
      isLoadMore: true,
    },
  },

  clickButton(e) {
    let type = e.currentTarget.dataset.type;
    this.setData({
      type: type,
    })

    if (type == 2 && this.data.is_first){
      this.loadData();
    }

    this.setData({
      is_first:false,
    })
  },

  onReachBottom(e) {
    let info = this.data.info_1;
    if (this.data.type == 2) info = this.data.info_2;

    info.current_page++;
    info.isHideLoadMore = true;
    if (this.data.type == 2) {
      this.setData({
        info_2: info
      });
    } else {
      this.setData({
        info_1: info
      });
    }
    this.loadData();

  },

  onClickButton: function(e) {
    let type = e.detail.type
    this.setData({
      type: type,
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      team_id: options.team_id
    })
  },

  onShow: function() {
    const self = this;
    self.loadData();
  },

  loadData: function() {
    let self = this;
    let info = this.data.info_1;
    let status = 0;
    if (this.data.type == 2) {
      info = this.data.info_2
      status = 1;
    } else {
      status = 4;
    }
    http.post('PAY_API_PAY_GET_ORDER_LIST', {
      group_id: self.data.team_id,
      current_page: info.current_page,
      status: status,
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

      let des_info = self.data.info_1;
      if (self.data.type == 2) des_info = self.data.info_2;

      if (info.current_page == 1) {
        des_info.list = []
      }
      list = des_info.list.concat(info.list)
      des_info = {
        list: list,
        max_count: info.max_count,
        current_page: info.current_page,
        limit: info.limit,
        isHideLoadMore: true,
      }
      if (self.data.type == 2) {
        self.setData({
          info_2: des_info
        })
      } else {
        self.setData({
          info_1: des_info
        })
      }

      setTimeout(() => {
        wx.stopPullDownRefresh()
      })

      getOrderNum(self)
    });
  },

  deleteItem: function(e) {
    let self = this;
    let info = self.data.info_2;
    for (var i = 0; i < info.list.length; i++) {
      if (info.list[i].id === e.detail) {
        info.list.splice(i, 1)
      } 
    }
    self.setData({
      info_2: info
    })
    getOrderNum(self)
  }
});


function getOrderNum(self) {
  http.post('PAY_API_PAY_GET_ORDER_STATISTICS', {
    group_id: self.data.team_id,
  }, function (res) {
    if (res.code != 200) {
      return wx.showModal({
        title: '',
        content: res.err,
        confirmText: '确定', confirmColor: '#00a7f2', 
        showCancel: false,
        success: function (res) { } // res.confirm
      });
    }
    self.setData({
      finished: res.info.finished,
      unpaid: res.info.unpaid
    });
  });

}

