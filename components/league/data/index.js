// components/data/index.js
import http from "../../../utils/http.js";
import utils from "../../../utils/index.js";
import config from '../../../config/config.js'

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    leagueid: { // 属性名
      type: String, // 类型（必填），目前接受的类型包括：String, Number, Boolean, Object, Array, null（表示任意类型）
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    rankInfo: null,
    dataTab: 0,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onShow: function() {
      loadData(this)
      this.loadTab()
    },
    loadTab: function () {
      var point = this.selectComponent('#point')
      var goal = this.selectComponent('#goal')
      var assist = this.selectComponent('#assist')
      var card = this.selectComponent('#card')
      var team = this.selectComponent('#team')
      if (this.data.dataTab == 0) {
        point.onShow()
      } else if (this.data.dataTab == 1) {
        goal.onShow()
      } else if (this.data.dataTab == 2) {
        assist.onShow()
      } else if (this.data.dataTab == 3) {
        card.onShow()
      } else if (this.data.dataTab == 4) {
        team.onShow()
      }
    },
    // 数据tab切换
    dataTabClick: function (event) {
      console.log(event.target.dataset)
      this.setData({
        dataTab: event.target.dataset.datatab
      })
      var point = this.selectComponent('#point')
      var goal = this.selectComponent('#goal')
      var assist = this.selectComponent('#assist')
      var card = this.selectComponent('#card')
      var team = this.selectComponent('#team')
      if (this.data.dataTab == 0) {
        point.onShow()
      } else if (this.data.dataTab == 1) {
        goal.onShow()
      } else if (this.data.dataTab == 2) {
        assist.onShow()
      } else if (this.data.dataTab == 3) {
        card.onShow()
      } else if (this.data.dataTab == 4) {
        team.onShow()
      }
    },
  }
})

function loadData(self) {
  http.post(
    'LEAGUE_CONFIG_URL', {
      id: self.data.leagueid
    },

    function(res) {
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