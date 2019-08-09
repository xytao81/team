import http from "../../../../utils/http.js";
import utils from "../../../../utils/index.js";

const app = getApp();

Component({

  /**
   * 组件的初始数据
   */
  data: {
    teamId: '',

    openLeagueIds: '',

    info: {
      list: [],
      max_count: 0,
      current_page: 1,
      limit: 10,
      search_name: "",
      isLoadMore: true,
      pageIndex: 0,
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {
    onShow: function (team_id) {
      this.setData({ teamId: team_id });
      loadData(this);
    },
    gotoDetail: function (e) {
      const schedule = e.currentTarget.dataset.item;
      return wx.navigateTo({ url: '/pages/team/teamhome/schedule/detail?team_id=' + this.data.teamId + '&schedule_id='+ schedule.id });
    },
    handleClick: function (e) {
      return wx.navigateTo({ url: '/pages/team/teamhome/schedule/list?team_id=' + this.data.teamId });
    }
  }
})


function loadData(self) {
  http.post('SCHEDULE_API_LIST', { team_id: self.data.teamId, limit: 3 }, function (res) {
    if (res.code != 200) {
      return wx.showModal({ content: res.err, confirmText: '确定', confirmColor: '#00a7f2', showCancel: false });
    }

    var list = []
    let info = res.info;
    if (info.page == 1) {
      self.data.info.list = []
    }
    for (let i = 0; i < res.info.list.length; i++) {
      // let obj = res.info.list[i];
      // obj.status = obj.match_status + "" + obj.enroll_status;
    }
    list = self.data.info.list.concat(info.list)
    // self.data.info.list = list;
    // self.data.info.max_count = info.max_count;
    // self.data.info.current_page = info.current_page;
    // self.data.info.limit = info.limit;
    self.setData({
      info: {
        // list:info.list,
        list: list,
        max_count: info.max_count,
        current_page: info.page,
        limit: info.limit,
        isHideLoadMore: true,
      }
    })

  });
}