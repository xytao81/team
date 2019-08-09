import http from "../../../utils/http.js";
import utils from "../../../utils/index.js";
import config from '../../../config/config.js'





Page({
  data: {
    id: '',
    teamId: '',
    teamRights: 0,

    info: null,
    currentTab: 0,
    round_list: [], //轮次列表
    picker_list: [], //picker数据
    round_index: 0, //默认轮次
    round_id: 0, // 轮次id
    list: [] // 赛程列表
  },
  //  加载赛事信息
  onLoad: function (options) {
    this.setData({
      id: options.id,
      teamId: options.team_id
    })

    let self = this;
    self.loadRights(function () {
      loadData(self);
    });


    this.loadTab()
  },
  loadTab: function () {
    var schedule = this.selectComponent('#schedule')
    var data = this.selectComponent('#data')
    var team = this.selectComponent('#team')
    if (this.data.currentTab == 0) {
      schedule.onShow()
    } else if (this.data.currentTab == 1) {
      data.onShow()
    } else if (this.data.currentTab == 2) {
      team.onShow()
    }
  },
  //  tab切换
  click: function (event) {
    console.log(event.target.dataset.currenttab)
    this.setData({
      currentTab: event.target.dataset.currenttab
    })
    var schedule = this.selectComponent('#schedule')
    var data = this.selectComponent('#data')
    var team = this.selectComponent('#team')
    if (this.data.currentTab == 0) {
      schedule.onShow()
    } else if (this.data.currentTab == 1) {
      data.onShow()
    } else if (this.data.currentTab == 2) {
      team.onShow()
    }
  },
  loadRights(callback) {
    const self = this;
    wx.showLoading();
    http.post('TEAM_API_PLAYER_MYRIGHTS', { team_id: self.data.teamId }, function (res) {
      wx.hideLoading();
      if (res.code != 200) {
        return wx.showModal({ title: '出错了', content: res.err, confirmText: '确定', confirmColor: '#00a7f2', showCancel: false });
      }
      self.setData({ teamRights: res.info.rights });
      if (callback) callback();
    });
  },

});

function loadData(self) {
  http.post(
    'LEAGUE_API_DETAIL', {
      id: self.data.id,
      team_id: self.data.teamId
    },

    function (res) {
      if (res.code != 200) {
        wx.showToast({
          icon: 'none',
          title: res.err
        });
        return;
      }
      self.setData({
        info: res.info
      })
    }
  );
}
// 获取榜单配置
function loadRankData(self) {
  http.post(
    'LEAGUE_CONFIG_URL', {
      id: self.data.id
    },

    function (res) {
      if (res.code != 200) {
        wx.showToast({
          icon: 'none',
          title: res.err
        });
        return;
      }
      self.setData({
        rankInfo: res.info
      })
    }
  );
}

