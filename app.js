import http from "./utils/http.js";
import config from './config/config.js';

App({

  // 全局变量
  globalData: {
    appid: "wx7b7cbd70512dfaff",
    secret: "5a65c63270258d605289cbd882d6dbfb",
    app_libs_key:"JWTBZ-BRXWQ-KI65W-GHEBR-74TFJ-FBBF3",

    sessionKey: '',
    openid: '',

    systemInfo: {},

    colors: [],

    //app用户信息
    user: {
      wxUserInfo: {
        nickName: '',
        avatarUrl: ''
      },
      info: {
        uid: config.DEBUG ? 424275 : '',
        token: '',
        name: ''
      },
      location:{
        province:'',
        city:''
      }
    },

    current_team: {
      id: config.DEBUG ? 13093 : ''
    }

  },

  onLaunch: function () {
    var self = this;

    // 获取系统信息
    wx.getSystemInfo({
      success: (res) => {
        // console.log('system res:::', res);
        self.globalData.systemInfo = res;
        // self.globaldata.systeminfo.windowheight = res.windowheight / (res.windowwidth / 750)
        // self.globaldata.systeminfo.screenheight = res.screenheight / (res.screenwidth / 750)
      }
    });

    this.loadColors();

  },

  onShow: function () {
      // console.log('App Show')
  },

  onHide: function () {
      // console.log('App Hide')
  },

  loadColors() {
    var self = this;

    // http.post("COMMON_API_OTHER_COLOR", {}, function (res) {
    //   if (res.code != 200) {
    //     return ;
    //   }
    //   self.globalData.colors = res.info.result;
    // });
  }


});