import http from "../../../../utils/http.js";
import utils from "../../../../utils/index.js";

Component({

  options: {
    addGlobalClass: true
  },

  properties: {

    teamid: {
      type: String,
      value: '',
      observer: function(newVal, oldVal, changedPath) {
        if (!newVal) {
          return console.error('新球队ID无效:', newVal);
        }
        console.log('obs', newVal, oldVal, changedPath);
        this.setData({ yearIndex: 0 });
        this.loadData(newVal);
      }
    },
    hidebugs: {
      type: Boolean,
      value: false
    }

  },

  data: {
    yearIndex: 0,
    yearRange: ['至今', 2019, 2018, 2017, 2016],

    data: {
      league_vs: {
        draw_count: 0,
        goalin_count: 0,
        goalout_count: 0,
        lose_count: 0,
        total_count: 0,
        win: 0,
        win_count: 0
      },
      team_vs: {
        draw_count: 0,
        goalin_count: 0,
        goalout_count: 0,
        lose_count: 0,
        total_count: 0,
        win: 0,
        win_count: 0
      },
      team_activity: {
        enroll_count: 0,
        player_average: 0,
        single_average: 0,
        total_count: 0
      },
      team_training: {
        enroll_count: 0,
        player_average: 0,
        single_average: 0,
        total_count: 0
      }
    },

    hidebugs: false

  },

  methods: {
    tapIt(e) {
      this.triggerEvent('tap', e.detail);
    },

    loadData(teamId) {
      const self = this;
      let year = this.data.yearRange[this.data.yearIndex] == '至今' ? null : this.data.yearRange[this.data.yearIndex];
      http.post('TEAM_API_INDEX_STATISTICS', { id: teamId, year: year }, function (res) {
        if (res.code != 200) {
          return wx.showModal({ content: res.err, confirmText: '确定', confirmColor: '#00a7f2', showCancel: false });
        }

        self.setData({ data: res.info })
      });

    },
    
    refresh() {
      this.loadData(this.properties.teamid);
    },

    onYearChange(e) {
      let index = e.detail.value;
      this.setData({ yearIndex: index });
      this.refresh();
    }

  }

});

