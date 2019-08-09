import http from "../../utils/http.js";
import utils from "../../utils/index.js";

Component({
  
  properties: {

  },

  data: {

    ad: {
      image_url: '',
      link_url: ''
    }

  },

  methods: {

    loadAd() {
      const self = this;
      http.post('COMMON_API_AD_AD1', { }, function (res) {
        if (res.code != 200) {
          return wx.showModal({ content: res.err, confirmText: '确定', confirmColor: '#00a7f2', showCancel: false });
        }
        let ad = res.info.ad;
        self.setData({ ad: ad });
      });
    },

    gotoAd() {
      wx.navigateTo({ url: '/pages/web/ad?url=' + this.data.ad.link_url });
    }

  },

  lifetimes: {
    ready() {
      this.loadAd();
    },
    detached() {
      // 在组件实例被从页面节点树移除时执行
    },
  }

});
