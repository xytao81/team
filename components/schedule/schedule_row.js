
const moment = require('moment');

Component({
  /**
   * 组件的属性列表
   */
  
  properties: {
    
    schedule: {
      type: Object,
      value: null,
      observer(newValue) {
        if(Object.keys(newValue).length==0) return;
        const enrollStatus = this.getEnrollStatus(newValue);
        const vsText = this.getVsText(newValue);
        this.setData({ enrollStatus: enrollStatus, vsText: vsText });
        // console.log('接收到来自父组件schedule_list的值:::', newValue);
      }
    },
    isAdmin: {
      type: Boolean,
      value: false
    },

    showTeam: {
      type: Boolean,
      value: false,
      
    }

  },

  /**
   * 组件的初始数据
   */
  data: {
    enrollStatus: 0,
    vsText: 'VS'
  },

  /**
   * 组件的方法列表
   */
  methods: {
    getEnrollStatus(schedule) {
      var enrollStatus = 1;
      if (!schedule.is_enroll) {
        enrollStatus = 4;
      } else {
        if ( schedule.players_max > 0 && schedule.status_count.agreed >= schedule.players_max) {
          enrollStatus = 5;
        } else {
          if (!schedule.enroll_start_time || !schedule.enroll_end_time) {
            enrollStatus = 1;
          } else {
            if (moment().isBefore(schedule.enroll_start_time)) enrollStatus = 2;
            if (moment(schedule.enroll_end_time).isBefore(moment())) enrollStatus = 3;
          }
        }
      }
      return enrollStatus;
    },

    getVsText(schedule) {
      let text = 'VS';
      let hasPoint = false;
      if ( (schedule.home_team_score!=''&&schedule.home_team_score!=null) || (schedule.away_team_score!=''&&schedule.away_team_score!=null) || (schedule.home_team_point_score!=''&&schedule.home_team_point_score!=null) || (schedule.away_team_point_score!=''&&schedule.away_team_point_score!=null) ) {
        if ( (schedule.home_team_point_score!=''&&schedule.home_team_point_score!=null) || (schedule.away_team_point_score!=''&&schedule.away_team_point_score!=null) ) {
          hasPoint = true;
        }
        text = '';
        text += (schedule.home_team_score||'0');
        if (hasPoint) {
          text += '['+ (schedule.home_team_point_score||'0')+']';
        }
        text += ' : ';
        text += (schedule.away_team_score||'0');
        if (hasPoint) {
          text += '['+ (schedule.away_team_point_score||'0')+']';
        }
      }
      return text;
    }

  }
})
