import http from "../../../../utils/http.js";
import utils from "../../../../utils/index.js";

Component({
  
  properties: {

  },

  data: {

    // 这里是一些组件内部数据
    teamId: "",
    info:null,
  },
  lifetimes: {
    // ready() {
    //   // 在组件实例进入页面节点树时执行
    //   console.log('team_stat:', this.data.teamId);

    // },
  },
  methods: {
    onShow: function (team_id) {
      console.log("team_id",team_id);
      this.setData({ teamId: team_id });
      loadData(this);
    },
    gotoDetail:function(){
      // this.triggerEvent('clickMenu', { type: 1, url: '/pages/league/leagueitem/index?id=' + this.data.info.id + "&team_id=" + this.data.teamId  });
      this.triggerEvent('clickMenu', { type: 1, url: '/pages/league/leagueitem/index_h5?id=' + this.data.info.id + "&team_id=" + this.data.teamId });
    },
    gotoMore: function () {
      this.triggerEvent('clickMenu', { type: 1, url: "/pages/league/my?team_id=" + this.data.teamId });
    },
  }
});


function loadData(self) {
  http.post('LEAGUE_API_MY_LIST', { team_id: self.data.teamId, limit: 1, current_page:1 }, function (res) {
    if (res.code != 200) {
      return wx.showModal({
        title: '',
        content: res.err,
        confirmText: '确定', confirmColor: '#00a7f2', 
        showCancel: false,
        success: function (res) {
        } // res.confirm
      });
    }

    for (let i = 0; i < res.info.list.length; i++) {
      let obj = res.info.list[i];
      obj.status = obj.match_status + "" + obj.enroll_status;
    }

    if(res.info.list.length>0){
      self.setData({info:res.info.list[0]})
    }else {
      self.setData({ info:null})
    }
  });
}