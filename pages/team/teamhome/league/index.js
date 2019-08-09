import http from "../../../../utils/http.js";
import utils from "../../../../utils/index.js";

const app = getApp();

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    openLeagueIds: {
      type: Array,
      value: []
    }
  },

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
    onShow: function (team_id, openLeagueIds) {
      this.setData({
        teamId: team_id, openLeagueIds: openLeagueIds
      });
      loadData(this);
    },
    gotoDetail: function (event) {
      if (event.currentTarget.dataset.item.is_multi) {
        wx.navigateTo({
          url: '/pages/league/leaguechildlist/index_h5?id=' + event.currentTarget.dataset.item.id + "&team_id=" + this.data.teamId
        })
      } else {
        // wx.navigateTo({
        //   url: '/pages/league/leagueitem/index?id=' + event.currentTarget.dataset.item.id + "&team_id=" + this.data.teamId
        // })
        wx.navigateTo({
          url: '/pages/league/leagueitem/index_h5?id=' + event.currentTarget.dataset.item.id + "&team_id=" + this.data.teamId
        })
      }
    },
    handleClick: function (e) {
      return wx.navigateTo({ url: '/pages/league/leaguelist/index_h5?team_id=' + this.data.teamId });
    }
  }
})


function loadData(self) {
  http.post('LEAGUE_API_ALL_LIST', {
    team_id: self.data.teamId,
    league_ids: self.data.openLeagueIds ? self.data.openLeagueIds.join(',') : '',
    // province: '浙江',
    // city: '温州'
    province: app.globalData.user.location.province,
    city: app.globalData.user.location.city
  }, function (res) {
    if (res.code != 200) {
      return wx.showModal({ content: res.err, confirmText: '确定', confirmColor: '#00a7f2', showCancel: false });
    }

    for (let i = 0; i < res.info.list.length; i++) {
      let obj = res.info.list[i];
      obj.status = obj.match_status + "" + obj.enroll_status;
    }
    // list = self.data.info.list.concat(info.list)
    // self.data.info.list = list;
    // self.data.info.max_count = info.max_count;
    // self.data.info.current_page = info.current_page;
    // self.data.info.limit = info.limit;
    self.setData({
      info: {
        list: res.info.list,
        max_count: res.info.max_count,
        current_page: res.info.current_page,
        limit: res.info.limit,
        isHideLoadMore: true,
      }
    })

  });
}