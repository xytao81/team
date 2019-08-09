import http from "../../utils/http.js";


Component({

  options: {
    addGlobalClass: true,
  },

  /**
   * 组件的属性列表
   */
  properties: {

    secure: {
      type: Boolean,
      value: false
    }
    
  },

  data: {
    info: null
  },

  methods: {

    onShow(uid) {
      if (!uid) return;
      this.loadData(uid);
    },

    loadData(uid) {
      let self=this;
      http.post('ACCOUNT_API_INDEX_DETAIL', { user_id: uid}, function (res) {
        if (res.code != 200) {
          return ;
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
