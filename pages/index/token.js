import http from "../../utils/http.js";
import utils from "../../utils/index.js";
import config from '../../config/config.js'

const app = getApp();

var sliderWidth = 96;

Page({

  // 页面的初始数据
  data: {
    redirectUrl: ''

  },

  gotoFinish: function () {
    let info = app.globalData.user.info
    if (!info.login) {
      return wx.redirectTo({ url: '/pages/my/finish/index?step=1&redirect_url='+encodeURIComponent(this.data.redirectUrl) });
    }
    if (!info.name) {
      return wx.redirectTo({ url: '/pages/my/finish/index?step=2&redirect_url='+encodeURIComponent(this.data.redirectUrl) });
    }
    if (this.data.redirectUrl) {
      return wx.redirectTo({ url: this.data.redirectUrl }); 
    }
    const openTeamId = wx.getStorageSync('openTeamId');
    if (openTeamId) {
      return wx.redirectTo({ url: '/pages/team/teamhome/view?team_id=' + openTeamId + '&is_share=1' });
    }
    return wx.redirectTo({ url: '/pages/index/index' });
  },
  loginSubmit: function () {
    var self = this;
    if (!self.data.loginDialogData.phone) {
      return wx.showModal({ content: '用户名不能为空', confirmText: '确定', confirmColor: '#00a7f2', showCancel: false });
    }
    if (!self.data.loginDialogData.password) {
      return wx.showModal({ content: '密码不能为空', confirmText: '确定', confirmColor: '#00a7f2', showCancel: false });
    }
    var data = {
      open_id: app.globalData.openid ? app.globalData.openid : '',
      union_id: app.globalData.unionid ? app.globalData.unionid : '',
      login: self.data.loginDialogData.phone,
      password: self.data.loginType == 3 ? self.data.loginDialogData.smsCode : self.data.loginDialogData.password,
      type: self.data.loginType
    };
    http.post('ACCOUNT_API_INDEX_LOGIN', data, function (res) {
      if (res.code != 200) {
        return wx.showModal({ content: '登录失败:' + res.err, confirmText: '确定', confirmColor: '#00a7f2', showCancel: false });
      }
      app.globalData.user.info = res.info;
      wx.showToast({ title: '登录成功', icon: 'success', duration: 3000 });
      self.gotoFinish();
      // if (!res.info.login) {
      //   return wx.redirectTo({ url: '/pages/my/finish/index' });
      // }
      // return wx.switchTab({ url: '/pages/team/teamhome/home' });
    });
  },

  // 生命周期函数--监听页面加载
  onLoad(options) {
    var self = this;

    const isInvited = options.is_invited ? true : false;
    const redirectUrl = options.redirect_url ? decodeURIComponent(options.redirect_url) : '';

    const action = options.action == 'register' || isInvited ? 'register' : 'login';

    if (options.open_league_id) {
      wx.setStorageSync('openLeagueId', options.open_league_id);
    }
    if (options.enroll_league_id) {
      wx.setStorageSync('enrollLeagueId', options.enroll_league_id);
    }
    if (options.open_team_id) {
      wx.setStorageSync('openTeamId', options.open_team_id);
    }
    // if (options.enroll_league_id) {
    //   wx.setStorageSync('openTeamId', options.open_team_id);
    // }

    self.setData({ from: config.FROM, action: action, isInvited: isInvited, redirectUrl: redirectUrl });

    wx.getSystemInfo({
      success: function (res) {
        self.setData({ sliderLeft: (res.windowWidth / 2 - sliderWidth) / 2, sliderOffset: res.windowWidth / 2 * 0 });
      }
    });

    getLocation(function () {
      // 已登录了？
      if (app.globalData.user.info.token != '') {
        if (redirectUrl) {
          return wx.redirectTo({ url: redirectUrl });
        }
        if (options.open_team_id) {
          return wx.redirectTo({ url: '/pages/team/teamhome/view?team_id=' + options.open_team_id + '&is_share=1' });
        } else {
          return wx.switchTab({ url: '/pages/team/teamhome/home' });
        }
      }


      // 自动登录
      if (self.data.action == 'login') {
        wx.showLoading();
        console.log('auto login');
        // 获取用户信息
        wx.login({
          success: function (res) {
            if (!res.code) return;
            console.log('wx.login:::', res);

            http.post('WX_API_INDEX_GETSESSION', { app_id: app.globalData.appid, app_secret: app.globalData.secret, code: res.code }, function (res) {
              app.globalData.openid = res.info.openid;
              app.globalData.unionid = res.info.unionid;
              app.globalData.sessionKey = res.info.session_key;
              http.post('ACCOUNT_API_INDEX_LOGIN', { login: '', password: '', open_id: app.globalData.openid, union_id: app.globalData.unionid, type: 2 }, function (res2) {
                wx.hideLoading();
                if (res2.code == 200) {
                  app.globalData.user.info = res2.info;
                  console.log(app.globalData.user.info);
                  self.gotoFinish();
                }
                self.setData({ 'loginDialogVisible': true });
              });
            });

          },
          fail: function (res) {
            console.log('wx.login fail:::', res);
          }
        });
      } else {
        self.setData({ 'registerDialogVisible': true });
      }

    });

  }

});

//沈桢  获取当前地址
// function getLocation(self) {
//   console.log("vvvvvvvv")
//   wx.getSetting({
//     success: (res) => {
//       if (res.authSetting['scope.userLocation'] != undefined && res.authSetting['scope.userLocation'] != true) { //非初始化进入该页面,且未授权
//         wx.showModal({
//           title: '是否授权当前位置',
//           content: '需要获取您的地理位置，请确认授权，否则无法获取您所需数据',
//           success: function(res) {
//             if (res.cancel) {
//               that.setData({
//                 isshowCIty: false
//               })
//               wx.showToast({
//                 title: '授权失败',
//                 icon: 'success',
//                 duration: 1000
//               })
//             } else if (res.confirm) {
//               wx.openSetting({
//                 success: function(dataAu) {
//                   if (dataAu.authSetting["scope.userLocation"] == true) {
//                     wx.showToast({
//                       title: '授权成功',
//                       icon: 'success',
//                       duration: 1000
//                     })
//                     //再次授权，调用getLocationt的API
//                     getLocation(self);
//                   } else {
//                     wx.showToast({
//                       title: '授权失败',
//                       icon: 'success',
//                       duration: 1000
//                     })
//                   }
//                 }
//               })
//             }
//           }
//         })
//       } else if (res.authSetting['scope.userLocation'] == undefined) { //初始化进入
//         getLocation(self);
//       } else { //授权后默认加载
//         getLocation(self);
//       }
//     }
//   })
// }

var getLocation = function (callback) {
  let ak = app.globalData.app_libs_key;
  wx.getLocation({
    type: 'wgs84',
    success: function (res) {
      console.log('wxGetLocaion backed', res);
      http.post('COMMON_API_ZONE_GEOCODER', { latitude: res.latitude, longitude: res.longitude, ak: ak, }, function (res) {
        if (res.code != 200) {
          console.log('http get zone error!');
        }

        app.globalData.user["location"] = {
          province: '',
          city: ''
        }
        if (res.info.province) app.globalData.user.location.province = res.info.province;
        if (res.info.city) app.globalData.user.location.city = res.info.city;

        if (callback) callback();
      });

    },
    fail: function () {
      // wx.showToast({ title: '授权失败', icon: 'none', duration: 1000 });
      if (callback) callback();
    }
  })
}