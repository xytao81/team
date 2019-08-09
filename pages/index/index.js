import http from "../../utils/http.js";
import utils from "../../utils/index.js";
import config from '../../config/config.js'

const app = getApp();

var sliderWidth = 96;

Page({

  // 页面的初始数据
  data: {
    from: '',
    open_team_id: '',

    isInvited: false,
    redirectUrl: '',

    sliderOffset: 0,
    sliderLeft: 0,

    action: 'login',

    loginType: 1,

    loginButtonVisible: false,
    loginDialogVisible: false,
    loginDialogData: {
      open_id: '',
      phone: '',
      password: '',
      smsCode: ''

    },

    registerDialogVisible: false,
    registerDialogData: {
      login: '',
      password: '',
      phone: '',
      smsCode: '',
      is_weixinphone: 0,
      openid: '',
      email: ''
    },
    registerSmsTimer: 0,
    registerPhoneVerified: false,

    tipLoginVisible: false,
    tipPasswordVisible: false,
    // wxUserInfo: {
    //   nickName: '',
    //   avatarUrl: ''
    // }
  },

  showTopTips: function () {
    var that = this;
    this.setData({
      showTopTips: true
    });
    setTimeout(function () {
      that.setData({
        showTopTips: false
      });
    }, 3000);
  },

  inputShowTipLogin() {
    this.setData({
      tipLoginVisible: true
    });
  },
  inputHideTipLogin() {
    this.setData({
      tipLoginVisible: false
    });
  },
  inputShowTipPassword() {
    this.setData({
      tipPasswordVisible: true
    });
  },
  inputHideTipPassword() {
    this.setData({
      tipPasswordVisible: false
    });
  },
  inputShowTipPhone() {
    this.setData({
      tipPhoneVisible: true
    });
  },
  inputHideTipPhone() {
    this.setData({
      tipPhoneVisible: false
    });
  },
  inputShowTipEmail() {
    this.setData({
      tipEmailVisible: true
    });
  },
  inputHideTipEmail() {
    this.setData({
      tipEmailVisible: false
    });
  },

  changeLoginType: function (e) {
    this.setData({
      loginType: e.currentTarget.dataset.logintype,
      sliderOffset: e.currentTarget.offsetLeft,
      tab1ActiveIndex: e.currentTarget.id
    });
  },
  onLoginTabsChange: function (e) {
    var loginType = e.detail.key == 'tab2' ? 3 : 1;
    this.setData({
      'loginType': loginType
    });
  },

  wxGetUserInfo: function (res) {
    var self = this;
    utils.wxDecrypt(res.detail.encryptedData, res.detail.iv).then(function (data) {
      console.log('wx:getUserInfo', res, data);
    });
  },
  wxGetPhoneNumber: function (res) {
    var self = this;
    utils.wxDecrypt(res.detail.encryptedData, res.detail.iv).then(function (data) {
      console.log('data', data);
      if (!data.phoneNumber) return;
      self.setData({
        'loginDialogData.phone': data.phoneNumber.replace(' ', '')
      });
    });
    // getCode(this, e.detail.iv, e.detail.encryptedData);
  },
  wxGetPhoneNumberRegister: function (res) {
    var self = this;
    utils.wxDecrypt(res.detail.encryptedData, res.detail.iv).then(function (data) {
      console.log('data', data);
      if (!data.phoneNumber) return;
      self.setData({ 'registerDialogData.phone': data.phoneNumber.replace(' ', ''), 'registerDialogData.is_weixinphone': 1 });
    });
    // getCode(this, e.detail.iv, e.detail.encryptedData);
  },
  resetPhoneNumberRegister: function () {
    this.setData({ 'registerDialogData.phone': '', 'registerDialogData.is_weixinphone': 0 });
  },



  // 登录
  wxLogin: function (res) {
    this.setData({
      loginDialogVisible: true
    });
  },

  sendSmsCode: function (x) {
    var self = this;
    http.post('ACCOUNT_API_INDEX_GETCODE', {
      phone: self.data.loginDialogData.phone.replace(' ', '')
    }, function (res) {
      if (res.code != 200) {
        return wx.showModal({
          title: '',
          content: '发送失败:' + res.err,
          confirmText: '确定', confirmColor: '#00a7f2', 
          showCancel: false,
          success: function (res) { } // res.confirm
        });
      }
      return wx.showToast({
        title: '发送成功',
        icon: 'success',
        duration: 3000
      });
    });
  },
  inputNamePhone: function (e) {
    this.setData({
      'loginDialogData.phone': e.detail.value
    });
  },
  inputChangePhone: function (e) {
    this.setData({
      'loginDialogData.phone': e.detail.value
    });
  },
  inputChangePassword: function (e) {
    this.setData({
      'loginDialogData.password': e.detail.value
    });
  },
  inputChangeCode: function (e) {
    this.setData({
      'loginDialogData.smsCode': e.detail.value
    });
  },
  inputChangeEmailRegister: function (e) {
    this.setData({
      'registerDialogData.email': e.detail.value
    });
  },
  inputChangeLoginRegister: function (e) {
    this.setData({
      'registerDialogData.login': e.detail.value
    });
  },
  inputChangePhoneRegister: function (e) {
    this.setData({
      'registerDialogData.phone': e.detail.value
    });
  },
  inputChangeCodeRegister: function (e) {
    this.setData({
      'registerDialogData.smsCode': e.detail.value
    });
  },
  inputChangePasswordRegister: function (e) {
    this.setData({
      'registerDialogData.password': e.detail.value
    });
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
      wx.removeStorageSync('openTeamId');
      return wx.redirectTo({ url: '/pages/team/teamhome/view?team_id=' + openTeamId + '&is_share=1' });
    }
    const openScheduleId = wx.getStorageSync('openScheduleId');
    if (openScheduleId) {
      wx.removeStorageSync('openScheduleId');
      return wx.redirectTo({ url: '/pages/team/teamhome/schedule/detail?schedule_id=' + openScheduleId + '&is_share=1' });
    }
    return wx.switchTab({ url: '/pages/team/teamhome/home' });
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

  switchToLogin: function () {
    this.setData({
      'action': 'login',
      'loginDialogVisible': true,
      'registerDialogVisible': false
    });
  },
  openUserInfoRegister: function () {
    // if (res.detail.userInfo) {
    //   app.globalData.user.wxUserInfo = res.detail.userInfo;
    //   this.setData({
    //     'registerDialogData.nickname': res.detail.userInfo.nickName,
    //     'registerDialogData.avatarUrl': res.detail.userInfo.avatarUrl
    //   });
    // }
    this.setData({
      'action': 'register',
      'loginDialogVisible': false,
      'registerDialogVisible': true
    });
  },

  chooseImage: function () {
    var self = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        console.log('choose i', res);
        // tempFilePath可以作为img标签的src属性显示图片
        const tempFilePaths = res.tempFilePaths;
        wx.uploadFile({
          url: config.BASE_URL + '/aqm/tool/api/upload/file',
          // url: 'http://192.168.0.21:3000/tool/api/upload/file',
          filePath: tempFilePaths[0],
          name: 'file',
          formData: {},
          success(res2) {
            console.log('upload result', res2);
            if (res2.statusCode != 200) {
              return wx.showModal({ content: '上传失败', confirmText: '确定', confirmColor: '#00a7f2', showCancel: false });
            }
            var obj = JSON.parse(res2.data)
            console.log('upload obj', obj);
            self.setData({
              'registerDialogData.avatarUrl': obj.result
            });
          }
        });
      }
    });
  },

  // 倒计时
  countdown() {
    const self = this;
    if (self.data.registerSmsTimer == 0) return;
    const newRegisterSmsTimer = self.data.registerSmsTimer - 1;
    self.setData({
      registerSmsTimer: newRegisterSmsTimer
    });
    if (newRegisterSmsTimer > 0) {
      var timer = setTimeout(function () {
        self.countdown();
      }, 1000);
    }
  },
  sendSmsCodeRegister: function () {
    var self = this;
    if (!self.data.registerDialogData.phone) {
      return wx.showModal({
        title: '',
        content: '发送失败:' + '手机号不能为空',
        confirmText: '确定', confirmColor: '#00a7f2', 
        showCancel: false
      });
    }
    self.setData({
      registerSmsTimer: 60
    });
    self.countdown();
    http.post('ACCOUNT_API_INDEX_GETCODE', {
      phone: self.data.registerDialogData.phone.replace(' ', '')
    }, function (res) {
      if (res.code != 200) {
        self.setData({
          registerSmsTimer: 0
        });
        return wx.showModal({
          title: '',
          content: '发送失败:' + res.err,
          confirmText: '确定', confirmColor: '#00a7f2', 
          showCancel: false
        });
      }
      return wx.showToast({
        title: '已发送',
        icon: 'success',
        duration: 3000
      });
    });
  },

  registerSubmit: function () {
    var self = this;
    if (!self.data.registerDialogData.password) {
      return wx.showModal({ content: '密码不能为空', confirmText: '确定', confirmColor: '#00a7f2', showCancel: false });
    }
    var data = {
      open_id: app.globalData.openid,
      union_id: app.globalData.unionid,
      login: self.data.registerDialogData.login,
      email: self.data.registerDialogData.email,
      phone: self.data.registerDialogData.phone,
      code: self.data.registerDialogData.smsCode,
      is_weixinphone: self.data.registerDialogData.is_weixinphone,
      password: self.data.registerDialogData.password
    };
    http.post('ACCOUNT_API_INDEX_REGISTER', data, function (res) {
      if (res.code != 200) {
        return wx.showModal({ content: res.err, confirmText: '确定', confirmColor: '#00a7f2', showCancel: false });
      }

      let res2 = res;
      return wx.showModal({
        content: "注册成功",
        confirmText: '确定', confirmColor: '#00a7f2', 
        showCancel: false,
        success: function (res) {
          app.globalData.user.info = res2.info;
          console.log(app.globalData.user.info)
          self.gotoFinish();
        } // res.confirm
      });
      // app.globalData.user.info = res.info;

      // name : "Mirror.凯⁶⁶⁶₆₆₆"
      // phone : "13770756177"
      // photo : "https://wx.qlogo.cn/mmopen/vi_32/PiajxSqBRaELGxbUNynyXc5eXcp7he1zSibYCV2DnBj1N5t1YJqu012Oaw1lsJzruC2wprgj4DUHH8uVVJ8Nv2rA/132"
      // token : "8d1d597dd417724ca17de04a"
      // console.log('user:::', app.globalData.user);
      // return wx.showToast({
      //   title: '注册成功',
      //   icon: 'success',
      //   duration: 3000
      // });
    });
  },

  addEnrollLeagueId(enrollLeagueId) {},
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

    const token = options.token ? options.token : null;
    if (token) {
      return utils.loginByToken(token, function (res) {
        if (res.code != 200) {
          return wx.showModal({ content: "token 登录失败", confirmText: '确定', confirmColor: '#00a7f2', showCancel: false });
        }
        return self.gotoFinish();
      });
    }

    getLocation(function () {
      // 已登录了？
      if (app.globalData.user.info.token != '') {
        return self.gotoFinish();
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
          console.log('http get zone error!', res);
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
