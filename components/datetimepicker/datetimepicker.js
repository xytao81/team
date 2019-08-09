const moment = require('moment');

const yearIndex = 0;
const monthIndex = 1;
const dayIndex = 2;
const hourIndex = 3;
const minuteIndex = 4;
const secondIndex = 5;

const minDatetime = moment('1900-01-01 00:00:00', 'YYYY-MM-DD HH:mm:ss')
const maxDatetime = moment('2099-01-01 00:00:00', 'YYYY-MM-DD HH:mm:ss')



function calulateRange(dateTime, minDateTime, maxDateTime, field) {

  // console.log('datetime', dateTime);
  // console.log('miniDatetime', minDateTime);
  // console.log('maxDatetime',  maxDateTime);

  let range = [];
  let value = [];

  if(minDatetime>maxDateTime){
    return {
      value: [],
      range: [],
    };
  }

  if (field == 'year' || field == 'month' || field == 'day' || field == 'hour' || field == 'minute' || field == 'second') {
    //年
    let minYear = minDateTime.year();
    let maxYear = maxDateTime.year();
    var year = dateTime.year();
    let years = []
    for (let index = minYear; index <= maxYear; index++) {
      years.push({
        name: '' + index + '年',
        id: index
      });
    }
    let index_year = year - minYear;
    range.push(years);
    value.push(index_year);

  }

  if (field == 'month' || field == 'day' || field == 'hour' || field == 'minute' || field == 'second') {
    //月
    let minMonth = year == minDateTime.year() ? minDateTime.month() : 0;
    let maxMonth = year == maxDateTime.year() ? maxDateTime.month() : 11;
    var month = dateTime.month();
    let months = [];
    for (let index = minMonth; index <= maxMonth; index++) {
      months.push({
        name: '' + (index + 1) + '月',
        id: index + 1
      })
    }
    let index_month = month - minMonth;
    range.push(months);
    value.push(index_month);

  }


  if ( field == 'day' || field == 'hour' || field == 'minute' || field == 'second') {
    //日
    let minDay = year == minDateTime.year() && month == minDateTime.month() ? minDateTime.date() : 1;
    let maxDay = year == maxDateTime.year() && month == maxDateTime.month() ? maxDateTime.date() : dateTime.daysInMonth();
    var day = dateTime.date();
    let days = [];
    for (let index = minDay; index <= maxDay; index++) {
      days.push({
        name: '' + index + '日',
        id: (index)
      })
    }
    let index_day = day - minDay;
    range.push(days);
    value.push(index_day);

  }



  if (field == 'hour' || field == 'minute' || field == 'second') {

    //时
    let minHour = year == minDateTime.year() && month == minDateTime.month() && day == minDateTime.date() ? minDateTime.hour() : 0;
    let maxHour = year == maxDateTime.year() && month == maxDateTime.month() && day == maxDateTime.date() ? maxDateTime.hour() : 23;
    var hour = dateTime.hour()
    let hours = [];
    for (let index = minHour; index <= maxHour; index++) {
      hours.push({
        name: '' + index + '时',
        id: (index)
      })
    }
    let index_hour = hour - minHour;
    range.push(hours);
    value.push(index_hour);
  }
  

  if (field == 'minute' || field == 'second') {
    //分
    let minMinute = year == minDateTime.year() && month == minDateTime.month() && day == minDateTime.date() && hour == minDateTime.hour() ? minDateTime.minute() : 0;
    let maxMinute = year == maxDateTime.year() && month == maxDateTime.month() && day == maxDateTime.date() && hour == maxDateTime.hour() ? maxDateTime.minute() : 59;
    var minute = dateTime.minute()
    let minutes = [];
    for (let index = minMinute; index <= maxMinute; index++) {
      minutes.push({
        name: '' + index + '分',
        id: (index)
      })
    }
    let index_minute = minute - minMinute;
    range.push(minutes);
    value.push(index_minute);
  }

  if (field == 'second') {
    //秒
    let minSecond = year == minDateTime.year() && month == minDateTime.month() && day == minDateTime.date() && hour == minDateTime.hour() && minute == minDateTime.minute() ? minDateTime.second() : 0;
    let maxSecond = year == maxDateTime.year() && month == maxDateTime.month() && day == maxDateTime.date() && hour == maxDateTime.hour() && minute == maxDateTime.minute() ? maxDateTime.second() : 59;
    var second = dateTime.second()
    let seconds = [];
    for (let index = minSecond; index <= maxSecond; index++) {
      seconds.push({
        name: '' + index + '秒',
        id: (index)
      })
    }
    let index_second = second - minSecond;
    range.push(seconds);
    value.push(index_second);
  }


  return {
    value: value,
    range: range,
  };
}


Component({
  /**
   * 组件的属性列表
   */
  properties: {
    start: {
      type: String,
      value: minDatetime.format('YYYY-MM-DD HH:mm:ss'),
    },
    end: {
      type: String,
      value: maxDatetime.format('YYYY-MM-DD HH:mm:ss'),
    },
    field: {
      type: String,
      value: 'month', // year, month ,day, hour, minute, second
    },
    value: {
      type: String,
      value: moment().format('YYYY-MM-DD HH:mm:ss'),
      observer:function(value){
        this.reloadData()
      }
    },
    now:{
      type:Boolean,
      value: true,
    },
    index:{
      type:Object,
      value:{}
    },
    info:{
      type:Object,
      value:{}
    },
    format: {
      type:String,
      value: 'YYYY-MM-DD HH:mm:ss',
    }

  },

  


  /**
   * 组件的初始数据
   */
  data: {
    indexValue: [],
    datetimeRange: [],
    rangeKey: 'name',
    start_time: null,
    end_time: null,
  },

  attached: function() {
    this.reloadData();
  },

  

  /**
   * 组件的方法列表
   */
  methods: {

    reloadData: function () {

      if(this.data.now){
        this.data.field = 'year';
      }

      //开始时间
      let start_time = moment(this.data.start, 'YYYY-MM-DD HH:mm:ss');
      if (!start_time) {
        start_time = minDatetime;
      }
      this.data.start_time = start_time;

      let end_time = moment(this.data.end, 'YYYY-MM-DD HH:mm:ss');
      if (!end_time) {
        end_time = maxDatetime;
      }

      if (this.data.now) {
        end_time = moment();
      }


      this.data.end_time = end_time;

      //不合法
      if (start_time > end_time) return;

      let now_time = moment(this.data.value, 'YYYY-MM-DD HH:mm:ss');
      if (!this.data.value || !now_time) {
        now_time = moment()
      }
      //调整当前时间
      now_time = now_time < start_time ? start_time : now_time;
      now_time = now_time > end_time ? end_time : now_time;



      let range_value = calulateRange(now_time, start_time, end_time, this.data.field);

      if (this.data.now) {
        range_value.range[yearIndex].push({ id: -1, name: '至今' })
      }

      this.setData({
        indexValue: range_value.value,
        datetimeRange: range_value.range,
      });
    },

    bindChange: function(e) {
      
      let year = this.data.datetimeRange[yearIndex][e.detail.value[0]].id;
      if(year==-1){
        const myEventDetail = {
          value: '至今',
          index:this.data.index,
          info:this.data.info,
        } 
        const myEventOption = {} 
        this.triggerEvent('datetimechange', myEventDetail, myEventOption)
      
      }else{
        let datetime = this.valueToDatetime(e.detail.value);
        let value = datetime.format(this.data.format);
        this.data.value = value;
        const myEventDetail = {
          value: this.data.value,
          index: this.data.index,
          info:this.data.info,
        } 
        const myEventOption = {} 
        this.triggerEvent('datetimechange', myEventDetail, myEventOption)
      }

    },

    valueToDatetime: function(value) {
      let index_value = value;
      let year = 0;
      if (this.data.indexValue.length > 0) {
        year = this.data.datetimeRange[yearIndex][index_value[yearIndex]].id;
      }

      let month = 0;
      if (this.data.indexValue.length > 1) {
        month = this.data.datetimeRange[monthIndex][index_value[monthIndex]].id;
      }

      let day = 0;
      if (this.data.indexValue.length > 2) {
        day = this.data.datetimeRange[dayIndex][index_value[dayIndex]].id;
      }

      let hour = 0;
      if (this.data.indexValue.length > 3) {
        hour = this.data.datetimeRange[hourIndex][index_value[hourIndex]].id
      }

      let minute = 0;
      if (this.data.indexValue.length > 4) {
        minute = this.data.datetimeRange[minuteIndex][index_value[minuteIndex]].id
      }

      let second = 0;

      if (this.data.indexValue.length > 5) {
        second = this.data.datetimeRange[secondIndex][this.data.indexValue[secondIndex]].id
      }

      return moment({
        y: year,
        M: month-1,
        d: day,
        h: hour,
        m: minute,
        s: second
      });
    },

    bindCancel: function(e) {

    },

    bindColumnChange: function(e) {
      let column = e.detail.column;
      let value = e.detail.value;
      this.data.indexValue[column] = value;

      if (this.data.now && this.data.datetimeRange[column][value].id == -1 ){
        let range_value = this.data.datetimeRange;
        let index_value = this.data.indexValue;
        if(index_value.length>1){
          for (let index = 1; index < index_value.length; index++) {
            range_value[index] = [];
            index_value[index] = 0;
          }
        }
        this.setData({
          datetimeRange: range_value,
          indexValue: index_value,
        });

      }else{
        
        let now_time = null;
        if (this.data.now && this.data.datetimeRange[column][value + 1].id == -1) {
          now_time = moment();
        }else{
          now_time = this.valueToDatetime(this.data.indexValue);
        }
        
        
        now_time = now_time < this.data.start_time ? this.data.start_time : now_time;
        now_time = now_time > this.data.end_time ? this.data.end_time : now_time;

        let range_value = calulateRange(now_time, this.data.start_time, this.data.end_time, this.data.field);

        if (this.data.now) {
          range_value.range[yearIndex].push({ id: -1, name: '至今' })
        }

        this.setData({
          datetimeRange: range_value.range,
          indexValue: range_value.value,
        });
      }      
    }
  }
})