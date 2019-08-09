import http from "../../utils/http.js";
import utils from "../../utils/index.js";

const app = getApp();

Component({

  options: {
    addGlobalClass: true,
  },

  properties: {
    style2: {
      type: String,
      value: '', //不存在此属性时
      observer: function(newVal, oldVal, changedPath) {
        if (!newVal) {
          return console.error('新 style 无效:', newVal);
        }
      }
    }
  },

  data: {},

  methods: {

    formIdMakerSubmit(e) {
      const self = this;
      const formId = e.detail.formId;
      const wxSessionKey = app.globalData.secret;
      const wxAppId = app.globalData.appid;
      const wxOpenId = app.globalData.openid;
      // console.log('提交了e', e);

      let params = {
        wx_session_key: wxSessionKey,
        wx_form_id: formId,
        wx_app_id: wxAppId,
        wx_open_id: wxOpenId
      };
      http.post('ACCOUNT_API_INDEX_ADD_WX_FORM_ID', params, function(res) {
        if (res.code != 200) {
          return wx.showModal({ content: res.err, confirmText: '确定', confirmColor: '#00a7f2', showCancel: false });
        }
      });
      self.trigger();
    },

    trigger() {
      const myEventDetail = {} // detail对象，提供给事件监听函数
      const myEventOption = {} // 触发事件的选项
      this.triggerEvent('submit', myEventDetail, myEventOption)
    }

  }

});