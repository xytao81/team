import http from "../../utils/http.js";


Component({

  options: {
    addGlobalClass: true,
  },

  /**
   * 组件的属性列表
   */
  properties: {
  },

  data: {
    info: {}
  },

  methods: {

    onShow(uid) {
      this.loadData(uid);
    },

    loadData(uid) {
      let self = this;
      http.post('ACCOUNT_API_INDEX_SIZE_GET', { uid: uid }, function (res) {
        if (res.code != 200) {
          return;
        }
        let info = res.info;
        self.setData({ info: info })
      });
    }

  },

  lifetimes: {

    ready() {

    }

  }

});
