import http from "../../../../utils/http.js";
import utils from "../../../../utils/index.js";
var moment = require("moment");

Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    noticeVisible:false,
    teamId: "",

    info:null,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onShow: function (team_id) {
      this.setData({ teamId: team_id });
      loadData(this);
    },
    // 移除公告
    removeNotice() {
      this.setData({ noticeVisible: false });
      wx.setStorageSync("notice-" + this.data.teamId, moment().valueOf());
    },
    gotoNoticeDetail(){
      this.setData({ noticeVisible: false });
      wx.setStorageSync("notice-" + this.data.teamId, moment().valueOf());
      wx.navigateTo({
        url: '/pages/team/teamhome/notice/detail?team_id='+this.data.teamId+'&notice_id='+this.data.info.id,
      })
    }
  }
})

function loadData(self){
  http.post('TEAM_API_NOTICE_LIST', { team_id: self.data.teamId,limit:1,current_page:1 }, function (res) {
    wx.hideLoading()
    if (res.code != 200) {
      return wx.showModal({ content: res.err, confirmText: '确定', confirmColor: '#00a7f2', showCancel: false });
    }

    if (res.info.list.length==0)return ;

    let info = res.info.list[0];
    self.setData({info:info})

    self.setData({ noticeVisible: true })
    let notice_time = moment(info.create_time).valueOf();
    let value = wx.getStorageSync("notice-" + self.data.teamId);
    if (value) {
      console.log(notice_time,value)
      if (value >= notice_time) {
        self.setData({ noticeVisible: false })
      }
    }
  });
}