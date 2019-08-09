import http from "../../../../utils/http.js";
import utils from "../../../../utils/index.js";

Component({
  
  properties: {
    teamId: {
      type: String,
      value: '',
      observer: function(newVal, oldVal, changedPath) {
        if (!newVal) {
          return console.error('新球队ID无效:', newVal);
        }
        console.log('obs', newVal, oldVal, changedPath);
        // this.loadData(newVal);
      }
    },
    user_team_rights: {
      type: String,
      value: '',
      observer: function(newVal, oldVal, changedPath) {
        console.log('user_team_rights', newVal);
      }
    },
    to_team_id: {
      type: String,
      value: '',
      observer: function(newVal, oldVal, changedPath) {
        console.log('to_team_id', newVal);
      }
    },
    user_token: {
      type: String,
      value: '',
      observer: function(newVal, oldVal, changedPath) {
        console.log('newValue5555', newVal);
      }
    },
  },

  data: {

    // 这里是一些组件内部数据
    // teamId: "",
    info:null,
    photo_url:'',
  },
  lifetimes: {
    // ready() {
    //   // 在组件实例进入页面节点树时执行
    //   console.log('team_stat:', this.data.teamId);

    // },
  },
  methods: {
    // onShow: function (team_id) {
    //   console.log('sss')
    //   console.log("team_id",team_id);
    //   this.setData({ teamId: team_id });
    //   loadData(this);
    // },
    gotoDetail:function(){
      // this.triggerEvent('clickMenu', { type: 1, url: '/pages/league/leagueitem/index?id=' + this.data.info.id + "&team_id=" + this.data.teamId  });
      this.triggerEvent('clickMenu', { type: 1, url: '/pages/league/leagueitem/index_h5?id=' + this.data.info.id + "&team_id=" + this.data.teamId });
    },
    gotoMore: function () {
      let url = 'http:test.m.aiqiumi.com:8080/webapps/teamApp/index.html#/pages/photo/album?is_redirect_rights=2&user_token='+this.data.user_token+'&user_team_id='+this.data.teamId+'&user_team_rights='+this.data.user_team_rights+'&to_team_id='+this.data.to_team_id;
      console.log('url',url)
      this.setData({
       photo_url : encodeURIComponent(url)
      }) 
      this.triggerEvent('clickMenu', { type: 1, url:"/pages/web/url?url="+this.data.photo_url });
    },

    // loadData(teamId) {
    //   const self = this;
    //   let year = this.data.yearRange[this.data.yearIndex] == '至今' ? null : this.data.yearRange[this.data.yearIndex];
    //   http.post('TEAM_API_INDEX_STATISTICS', { id: teamId, year: year }, function (res) {
    //     if (res.code != 200) {
    //       return wx.showModal({ content: res.err, confirmText: '确定', confirmColor: '#00a7f2', showCancel: false });
    //     }

    //     self.setData({ data: res.info })
    //   });

    // },
  }
});


// function loadData(self) {
//   console.log('ssss');
//   http.post('LEAGUE_API_MY_LIST', { team_id: self.data.teamId, limit: 1, current_page:1 }, function (res) {
//     if (res.code != 200) {
//       return wx.showModal({
//         title: '',
//         content: res.err,
//         confirmText: '确定', confirmColor: '#00a7f2', 
//         showCancel: false,
//         success: function (res) {
//         } // res.confirm
//       });
//     }

//     for (let i = 0; i < res.info.list.length; i++) {
//       let obj = res.info.list[i];
//       obj.status = obj.match_status + "" + obj.enroll_status;
//     }

//     if(res.info.list.length>0){
//       self.setData({info:res.info.list[0]})
//     }else {
//       self.setData({ info:null})
//     }
//   });
 
//   let u rl = 'http:test.m.aiqiumi.com:8080/webapps/teamApp/index.html#/pages/photo/album?is_redirect_rights=1&user_token='+self.data.user_token+'&user_team_id='+self.data.teamId+'&user_team_rights='+self.data.user_team_rights+'&to_team_id='+self.data.to_team_id;
//   self.setData({
//     photo_url : encodeURIComponent(url)
//   }) 
//   console.log('sssssss',url)


// }
