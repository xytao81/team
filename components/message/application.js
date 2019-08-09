import http from "../../utils/http.js";

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    list: {
      type: Array
    },
    isHideLoadMore: {
      type: Boolean
    },
    max_count: {
      type: Number,
    },
    current_page: {
      type: Number,
    },
    limit: {
      type: Number,
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    onClickButton:function(e){
      let type = e.currentTarget.dataset.type;
      let item = e.currentTarget.dataset.item;
      if(item.type > 100){
        let player_id = item.from_player_id;
        let operate_id = item.id;
        let is_done = item.is_done;
        let extra = item.extra;
        extra = JSON.parse(extra);
        let record_id = 0;
        if (extra.record_id) record_id = extra.record_id;

        this.triggerEvent('onClickButton', { type: type, player_id: player_id, record_id: record_id, operate_id: operate_id });
      }else {
        //赛事
        let extra = item.extra;
        extra = JSON.parse(extra);

        this.setDone(item.id,'/pages/league/leagueitem/index_h5?team_id=' + item.team_id + '&id=' + extra.league_id)
      }
    },
    setDone:function(id,url) {
      const self = this;
      wx.showLoading();
      http.post('TEAM_API_OPERATE_SET_DONE', {
        id: id
      }, function (res) {
        wx.hideLoading();
        if (res.code != 200) {
          return wx.showModal({
            title: '',
            content: res.err,
            confirmText: '确定', confirmColor: '#00a7f2', 
            showCancel: false
          });
        }

        return wx.navigateTo({
          url: url
        })
        
      });
    }
  }
})
