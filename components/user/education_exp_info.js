import http from "../../utils/http.js";

Component({

  options: {
    addGlobalClass: true,
  },

  /**
   * 组件的属性列表
   */
  properties: {

    uid: {
      type: String,
      value: '',
      observer: function(newVal, oldVal, changedPath) {
        if (!newVal) {
          return console.error('新用户ID无效:', newVal);
        }
        // console.log('obs', newVal, oldVal, changedPath);
        this.format();
        this.loadData(newVal);
      }
    }

  },

  data: {

    list: []
    
  },

  methods: {

    onShow(uid) {
      this.format();
      this.loadData(uid);
    },

    format() {
      const list = [];
      this.setData({ list: list });
    },

    loadData(uid) {
      const self = this;
      http.post('ACCOUNT_API_INFO_GET_EDUCATION', { user_id: uid }, function(res) {
        wx.hideLoading()
        if (res.code != 200) {
          return wx.showModal({ content: res.err, confirmText: '确定', confirmColor: '#00a7f2', showCancel: false });
        }
        self.setData({ list: res.info });
      });
    }

  },

  lifetimes: {

    ready() {
      this.format();
      this.loadData();
    }

  }

});
