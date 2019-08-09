import http from "../../../../utils/http.js";
import utils from "../../../../utils/index.js";
import moment from "moment"

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
    teamId: "",
    list: [],

    is_have:false,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onShow: function(team_id) {
      this.setData({
        teamId: team_id
      });
      
      loadNoDoneData(this);
    },
    onClickMenu: function (e) {
      this.setData({ is_have: false });
      wx.setStorageSync("notice-" + this.data.teamId, moment().valueOf());

      this.triggerEvent('clickMenu', { type: 1, url: "/pages/team/message/list?team_id="+this.data.teamId });
    },
  }
})

function loadData(self) {
  wx.showLoading()

  http.post('TEAM_API_MESSAGE_GETLAST', {
    team_id: self.data.teamId
  }, function(res) {
    wx.hideLoading()
    if (res.code != 200) {
      return wx.showModal({ content: res.err, confirmText: '确定', confirmColor: '#00a7f2', showCancel: false });
    }

    const list = res.info;
    for(let k in list) {
      if (list[k].title.length+list[k].show_time.length > 20) {
        const len = 18 - list[k].show_time.length;
        list[k].title = list[k].title.substr(0, len) + ' ...';
      }
    }
    self.setData({ list: list });

    if(list.length==0) return;
    if (self.data.is_have==true) return;

    self.setData({ is_have: true })

    let info=list[0];
    let notice_time = moment(info.create_time).valueOf();
    let value = wx.getStorageSync("notice-" + self.data.teamId);
    if (value) {
      console.log(notice_time, value)
      if (value >= notice_time) {
        self.setData({ is_have: false })
      }
    }

  });
}

function loadNoDoneData(self) {
  http.post('TEAM_API_OPERATE_NO_DONE', {
    team_id: self.data.teamId
  }, function (res) {
    if (res.code != 200) {
      return wx.showModal({
        content: res.err,
        confirmText: '确定', confirmColor: '#00a7f2', 
        showCancel: false,
        success: function (res) { } // res.confirm
      });
    }

    self.setData({ is_have: res.info.have })
    loadData(self);
  });
}