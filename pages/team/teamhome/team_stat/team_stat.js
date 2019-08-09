import http from "../../../../utils/http.js";
import utils from "../../../../utils/index.js";

Component({
  options: {
    addGlobalClass: true,
  },
  properties: {
    user_team_rights: {
      type: String,
      value: '',
      observer: function(newVal, oldVal, changedPath) {
      }
    },
    to_team_id: {
      type: String,
      value: '',
      observer: function(newVal, oldVal, changedPath) {
      }
    },
    user_token: {
      type: String,
      value: '',
      observer: function(newVal, oldVal, changedPath) {
      }
    },
  },
// http://test.m.aiqiumi.com:8080/webapps/teamApp/index.html#/pages/photo/album?is_redirect_rights=1&user_token={{user_token}}&user_team_id={{teamId}}&user_team_rights={{user_team_rights}}&is_share={{is_share}}&to_team_id={{to_team_id}}
  data: {

    // 这里是一些组件内部数据
    teamId: "",

    player_count: '',
    is_notice: false,
    photo_url:'',

  },
  lifetimes: {
    // ready() {
    //   // 在组件实例进入页面节点树时执行
    //   console.log('team_stat:', this.data.teamId);

    // },
  },
  methods: {
    onShow: function (team_id) {
      this.setData({ teamId: team_id });
      loadData(this);
    },
    onClickMenu: function (e) {
      this.triggerEvent('clickMenu', e.detail);
    },
    refresh:function(e){
      let type=e.detail.type;
      if (type==2){
        this.setData({ is_notice:false})
      }
    }
  }
});


function loadData(self) {
  wx.showLoading()

  http.post('TEAM_API_VIEW_INFO', { team_id: self.data.teamId }, function (res) {
    wx.hideLoading()
    if (res.code != 200) {
      return wx.showModal({
        title: '',
        content: res.err,
        confirmText: '确定', confirmColor: '#00a7f2', 
        showCancel: false,
        success: function (res) { } // res.confirm
      });
    }

    self.setData({ player_count: res.info.player_count })
    if (res.info.notice_time) {
      self.setData({ is_notice: true })

      let notice_time = res.info.notice_time;
      let value = wx.getStorageSync("notice-"+self.data.teamId);
      console.log(notice_time,value);
      if (value){
        if (value >= notice_time){
          console.log("aaaa");
          self.setData({ is_notice: false })
        }
      }
    }
  });
  let url = 'http:test.m.aiqiumi.com:8080/webapps/teamApp/index.html#/pages/photo/album?is_redirect_rights=1&user_token='+self.data.user_token+'&user_team_id='+self.data.teamId+'&user_team_rights='+self.data.user_team_rights+'&to_team_id='+self.data.to_team_id;
  self.setData({
    photo_url : encodeURIComponent(url)
  }) 
}