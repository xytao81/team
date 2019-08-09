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
      loadLeagueTableData(this)
    }
  }
})
function loadLeagueTableData(self) {
  http.post(
    'LEAGUE_CARD_LIST', {
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
