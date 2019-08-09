// components/schedule/user.js

import http from "../../utils/http.js";
import utils from "../../utils/index.js";
// import config from '../../../../config/config.js'
// import teamConfig from '../../../../utils/team_config.js';
Component({
  /**
   * 组件的属性列表
   */
  options: {
    addGlobalClass: true,
  },
  properties: {
    user: {
      type: Object,
      value: {},
      observer(newValue) {
        if(Object.keys(newValue).length==0) return;
        // console.log('接收到来自父组件users的值:::', newValue);

      }
    },
    isAdmin: {
      type: Boolean,
      value: false,
      observer(newValue) {
        console.log('user 接收到 admin:::', newValue);
      }
    },
    showSignedStatus: {
      type: Boolean,
      value: true
    }

  },

  /**
   * 组件的初始数据
   */
  data: {
    denyModalVisible: false,
    refusalReason: ''
  },

  /**
   * 组件的方法列表
   */
  methods: {

    //请假
    leave() {
      const self = this;
      http.post('SCHEDULE_API_ENROLL_SIGNIN', { schedule_id: self.data.user.schedule_id, user_id: self.data.user.uid, status: 2 }, function (res) {
        if (res.code != 200) {
          return wx.showModal({ content: res.err, confirmText: '确定', confirmColor: '#00a7f2', showCancel: false });
        }
        self.data.user.arrive = 2;
        self.onUpdate();
      });
    },
    //签到
    signin() {
      const self = this;
      http.post('SCHEDULE_API_ENROLL_SIGNIN', { schedule_id: self.data.user.schedule_id, user_id: self.data.user.uid, status: 1 }, function (res) {
        if (res.code != 200) {
          return wx.showModal({ content: res.err, confirmText: '确定', confirmColor: '#00a7f2', showCancel: false });
        }
        self.data.user.arrive = 1;
        self.onUpdate();
      });
    },
  

    onClickUser(e) {
      console.log('this.properties.user',this.properties.user);
      const myEventDetail = {
        user: this.properties.user
      };
      const myEventOption = {} 
      this.triggerEvent('clickuser', myEventDetail, myEventOption);
    },

    onUpdate() {
      const myEventDetail = {
        value: this.data.user
      };
      const myEventOption = {} 
      this.triggerEvent('update', myEventDetail, myEventOption);
    },

    // 弹框
    openDenyModal() {
      const self = this;
      self.setData({ denyModalVisible: true });
    },
    changePass() {
      const self = this;
      http.post('SCHEDULE_API_ENROLL_OPERATE', { id: self.data.user.id, status: 1, refusal_reason: '' }, function (res) {
        if (res.code != 200) {
          return wx.showModal({ content: res.err, confirmText: '确定', confirmColor: '#00a7f2', showCancel: false });
        }
        self.data.user.status = 1;
        self.onUpdate();
      });
    },
    onReasonChange(e) {
      this.setData({ refusalReason: e.detail.value });
    },
    hideDenyModal() {
      const self = this;
      self.setData({ denyModalVisible: false });
    },
    changeDeny() {
      const self = this;
      http.post('SCHEDULE_API_ENROLL_OPERATE', { id: self.data.user.id, status: 2, refusal_reason: self.data.refusalReason }, function (res) {
        if (res.code != 200) {
          return wx.showModal({ content: res.err, confirmText: '确定', confirmColor: '#00a7f2', showCancel: false });
        }
        self.hideDenyModal();
        self.onUpdate();
      });
      self.setData({ denyModalVisible: false });
    },
  }

});
