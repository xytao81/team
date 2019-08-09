import leagueHttp from "../../../../../utils/league_http.js";


const app = getApp();

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
    list: []
  },

  lifetimes: {
    attached() {
      this.loadInviteLeague();
    },
  },


  /**
   * 组件的方法列表
   */
  methods: {
    handleClick: function (e) {
      this.triggerEvent('click', e.detail)
    },

    loadInviteLeague: function () {
      let self = this;
      wx.showLoading();
      // INVITE_LEAGUE || TEAM_JOIN
      leagueHttp.post("INVITE_LEAGUE", { id: app.globalData.current_team.id, current_page: 1, limit: 99 }, function (res) {
        wx.hideLoading();
        if (res.code != 200) {
          return wx.showToast({ title: res.err, icon: 'none', duration: 3000 });
        }
        self.setData({ list: res.info });
        self.selectComponent("#list").onShow(res.info);
      });
    },
  }
})
