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
    list: []
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onShow: function () {
      loadData(this)
    },
    teamDetail(event) {
      console.log(event)
      wx.navigateTo({
        url: '/pages/web/index?type=2&id=' + event.currentTarget.dataset.item.id + '&league_id=' + this.data.leagueid
      })
    }
  }
})
function loadData(self) {
  http.post(
    'LEAGUE_JOIN_TEAM_URL', {
      league_id: self.data.leagueid
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
        list: res.info
      })
    }
  );
}
