import http from "../../../utils/http.js";
import utils from "../../../utils/index.js";
import config from '../../../config/config.js'


Component({
  /**
   * 组件的属性列表
   */
  properties: {
    leagueid: {            // 属性名
      type: String,     // 类型（必填），目前接受的类型包括：String, Number, Boolean, Object, Array, null（表示任意类型）
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    round_list: [], //轮次列表
    picker_list: [], //picker数据
    round_index: 0, //默认轮次
    round_id: 0, // 轮次id
    list: [] // 赛程列表
  },
  /**
   * 组件的方法列表
   */
  methods: {
    onShow: function () {
      loadRoundList(this)
    },
    // 轮次选择触发
    bindPickerChange: function (e) {
      var self = this
      console.log('picker发送选择改变，携带值为', e.detail.value)
      self.setData({
        round_index: e.detail.value,
        round_id: self.data.round_list[e.detail.value].id
      })
      loadScheduleList(self)
    },
    // 上一轮 
    preRound: function () {
      var self = this
      var round_index = self.data.round_index - 1;
      console.log(round_index, self.data.round_list[round_index])
      self.setData({
        round_index: round_index,
        round_id: self.data.round_list[round_index].id
      })
      loadScheduleList(self)

    },
    // 下一轮
    nextRound: function () {
      var self = this
      var round_index = Number(self.data.round_index) + 1;
      console.log(round_index, self.data.round_index)
      self.setData({
        round_index: round_index,
        round_id: self.data.round_list[round_index].id
      })
      loadScheduleList(self)
    },
    // 点击单个比赛查看详情
    onClickItem: function (event) {
      console.log(event.currentTarget.dataset.item)
      wx.navigateTo({
        url:"/pages/web/index?id="+event.currentTarget.dataset.item.id+"&type=1"
      });
    }
  }
})

function loadRoundList(self) {
  http.post(
    'LEAGUE_QUERY_SCHEDULE_ROUND', {
      league_id: self.data.leagueid
    },

    function (res) {
      if (res.code != 200) {
        wx.showToast({
          icon: 'none',
          title: err
        });
        return;
      }
      let info = res.info;
      var picker_list = []
      for (var i = 0; i < info.round_list.length; i++) {
        picker_list.push(info.round_list[i].name)
      }
      self.setData({
        round_list: info.round_list,
        picker_list: picker_list
      })
      if(info.round_list.length>0){
        self.setData({
          round_id: info.round_list[info.round_index].id
        })
      }
      loadScheduleList(self)
    }
  );
}

function loadScheduleList(self) {
  console.log(self.data)
  http.post(
    'LEAGUE_QUERY_SCHEDULE', {
      league_id: self.data.leagueid,
      round_id: self.data.round_id
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
        list: res.info.schedule_list
      })
    }
  );
}
