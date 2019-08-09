import http from "../../../../utils/http.js";
import utils from "../../../../utils/index.js";

const moment = require('moment');

Component({
  
  properties: {

  },

  data: {

    // 这里是一些组件内部数据
    teamId: "",
    info:null,
    schedules: [],
    // page: 1,
    // hasMore: true

    nextDay: ''
  },
  methods: {


    loadScheduleList(type, callback) {
      const self = this;
      let time = (type == 'up') ? self.data.previousDay : self.data.nextDay;
      http.post('SCHEDULE_API_LIST_BY_DAY', { team_id: self.data.teamId, type: type, time: time, limit: 1 }, function (res) {
        if (res.code != 200) {
          return wx.showModal({ content: res.err, confirmText: '确定', confirmColor: '#00a7f2', showCancel: false });
        }
        var hasMore = self.data.hasMore;
        var newSchedules = [];
  
        var days = res.info.days;
        for (let k in days) {
          for (let k2 in days[k].list) {
            if (newSchedules.length == 0) newSchedules.push(days[k].list[k2]);
          }
          // const job = teamConfig.getJob(players[k].job);
          // players[k].jobs = [job];
          // players[k].badge_name = self.getBadgeName(players[k]);
          // players[k].badge_class = self.getBadgeClass(players[k]);
          // players[k].position = teamConfig.getPosition(players[k].position);
        }
        if (type == 'down' && newSchedules.length == 0) {
          return self.loadScheduleList('up'); 
        }
        self.setData({ schedules: newSchedules });
        if (callback) callback();
      });
    },

    onShow: function (teamId) {
      let previousDay = moment().subtract(1, 'day').format("YYYY-MM-DD");
      let nextDay = moment().format("YYYY-MM-DD");
      this.setData({ teamId: teamId, previousDay: previousDay, nextDay: nextDay });
      this.loadScheduleList('down');
      // loadScheduleList(this);
    },
    gotoDetail:function(e){
      const schedule = e.currentTarget.dataset.item;
      // this.triggerEvent('clickMenu', { type: 1, url: '/pages/league/leagueitem/index_h5?id=' + this.data.info.id + "&team_id=" + this.data.teamId });
      this.triggerEvent('clickMenu', { type: 1, url: '/pages/team/teamhome/schedule/detail?team_id=' + this.data.teamId + '&schedule_id='+ schedule.id  });
    },
    gotoMore: function () {
      // this.triggerEvent('clickMenu', { type: 1, url: "/pages/league/my?team_id=" + this.data.teamId });
      this.triggerEvent('clickMenu', { type: 1, url: '/pages/team/teamhome/schedule/list?team_id=' + this.data.teamId  })  
    },
  }
});

function loadScheduleList(self) {
  http.post('SCHEDULE_API_LIST', { team_id: self.data.teamId, current_page: 1, limit: 1 }, function (res) {
    if (res.code != 200) {
      return wx.showModal({ content: res.err, confirmText: '确定', confirmColor: '#00a7f2', showCancel: false });
    }
    const totalCount = res.info.total_count;
    var hasMore = self.data.hasMore;
    var newSchedules = [];

    var schedules = res.info.list;
    for (let k in schedules) {
      newSchedules.push(schedules[k]);
    }
    if (newSchedules.length >= totalCount || !res.info.has_next) {
      hasMore = false;
    }
    self.setData({ schedules: newSchedules, page: res.info.page});
  });
}
