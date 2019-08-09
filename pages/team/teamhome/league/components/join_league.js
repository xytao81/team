import leagueHttp from "../../../../../utils/league_http";

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
      this.loadJoinLeague();
    },
  },

  /**
   * 组件的方法列表
   */
  methods: {
    handleClick: function (e) {
      this.triggerEvent('click', e.detail)
    },
    loadJoinLeague:function(e){
      let self = this;
      wx.showLoading();
      leagueHttp.post("JOIN_LEAGUE", { id: app.globalData.current_team.id }, function (res) {
        wx.hideLoading();
        if (res.code != 200) {
          wx.showToast({
            title: res.err,
            icon: 'none',
            duration: 3000
          });
          return;
        }
        self.setData({ list: res.info });
        self.selectComponent("#list").onShow(res.info);
      });
    }
  }
})
