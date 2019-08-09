import http from "../../utils/http.js";
import utils from "../../utils/index.js";
import config from '../../config/config.js'
import teamConfig from "../../utils/team_config.js";

import WeCropper from 'we-cropper/index.js'
const device = wx.getSystemInfoSync(); // 获取设备信息
const width = device.windowWidth; // 示例为一个与屏幕等宽的正方形裁剪框
const height = device.windowHeight;

const app = getApp();

Page({

  // 页面的初始数据
  data: {

    cropper1config: {
      cut: {
        x: (width - 320) / 2, // 裁剪框x轴起点
        y: (width - 320) / 2, // 裁剪框y轴期起点
        width: 320, // 裁剪框宽度
        height: 320 // 裁剪框高度
      },
      dest: {
        width: 500,
        height: 500
      }
    },
    cropper2config: {
      cut: {
        x: (width - 320) / 2, // 裁剪框x轴起点
        y: (width - 160) / 2, // 裁剪框y轴期起点
        width: 320, // 裁剪框宽度
        height: 160 // 裁剪框高度
      },
      dest: {
        width: 1000,
        height: 500
      }
    },

    teampLogoPath: '',

    types: teamConfig.getTypes(),
    typeIndex: '',

    focusOnIntro: false,

    createData: {
      logoUrl: '',
      name: '',
      color: [
        {
          player: {
            shirt: { id: 0, color: "https://team-v2.oss-cn-hangzhou.aliyuncs.com/color/%E6%97%A0.png", name: "" },
            shorts: { id: 0, color: "https://team-v2.oss-cn-hangzhou.aliyuncs.com/color/%E6%97%A0.png", name: "" },
            shoes: { id: 0, color: "https://team-v2.oss-cn-hangzhou.aliyuncs.com/color/%E6%97%A0.png", name: "" }
          },
          goalkeeper: {
            shirt: { id: 0, color: "https://team-v2.oss-cn-hangzhou.aliyuncs.com/color/%E6%97%A0.png", name: "" },
            shorts: { id: 0, color: "https://team-v2.oss-cn-hangzhou.aliyuncs.com/color/%E6%97%A0.png", name: "" },
            shoes: { id: 0, color: "https://team-v2.oss-cn-hangzhou.aliyuncs.com/color/%E6%97%A0.png", name: "" }
          }
        }, {
          player: {
            shirt: { id: 0, color: "https://team-v2.oss-cn-hangzhou.aliyuncs.com/color/%E6%97%A0.png", name: "" },
            shorts: { id: 0, color: "https://team-v2.oss-cn-hangzhou.aliyuncs.com/color/%E6%97%A0.png", name: "" },
            shoes: { id: 0, color: "https://team-v2.oss-cn-hangzhou.aliyuncs.com/color/%E6%97%A0.png", name: "" }
          },
          goalkeeper: {
            shirt: { id: 0, color: "https://team-v2.oss-cn-hangzhou.aliyuncs.com/color/%E6%97%A0.png", name: "" },
            shorts: { id: 0, color: "https://team-v2.oss-cn-hangzhou.aliyuncs.com/color/%E6%97%A0.png", name: "" },
            shoes: { id: 0, color: "https://team-v2.oss-cn-hangzhou.aliyuncs.com/color/%E6%97%A0.png", name: "" }
          }
        }
      ],
      
      contact_name: '',
      contact_phone: '',
      contact_wx: '',
      
      region: [
        { id: 0, name: '' },
        { id: 0, name: '' }
      ],

      type: 0,

      familyUrl: '',
      intro: ''
    }
  },

  openLogoSheet() {
    var self = this;
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['camera', 'album'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        self.cropper1.pushOrign(res.tempFilePaths[0]);
        self.setData({ cropper1Visible: true });
      }
    });
  },
  cropper1GetImage(callback) {
    const self = this;
    self.cropper1.getCropperImage({ destWidth: 200, destHeight: 200, fileType: 'jpg' }, (tempFilePath) => {
      if (!tempFilePath) {
        return console.log('获取图片地址失败，请稍后重试');
      }
      self.setData({ cropper1Visible: false });
      wx.showLoading();
      wx.uploadFile({
        url: config.BASE_URL + '/aqm/tool/api/upload/file',
        // url: 'http://192.168.0.21:3000/tool/api/upload/file',
        filePath: tempFilePath,
        name: 'file',
        formData: {},
        success (res2){
          wx.hideLoading();
          if (res2.statusCode != 200) {
            console.log('upload result:::', res2);
            return wx.showModal({ content: '上传失败', confirmText: '确定', confirmColor: '#00a7f2', showCancel: false });
          }
          var obj = JSON.parse(res2.data);
          self.setData({ 'createData.logoUrl': obj.result });
        }
      });
    })
  },
  cropper1TouchStart (e) { this.cropper1.touchStart(e) },
  cropper1TouchMove (e) { this.cropper1.touchMove(e) },
  cropper1TouchEnd (e) { this.cropper1.touchEnd(e) },

  bindLogoChange(e) { this.setData({ 'createData.logoUrl': e.detail.value }); },
  bindNameChange(e) { this.setData({ 'createData.name': e.detail.value }); },
  bindTypeChange(e) { this.setData({ 'typeIndex': e.detail.value, 'createData.type': this.data.types[e.detail.value].id }); },
  focusOnIntro() { console.log(this.data.createData.intro); this.setData({ 'focusOnIntro': true }); },
  focusOutIntro() { this.setData({ 'focusOnIntro': false }); },
  bindIntroChange(e) { this.setData({ 'createData.intro': e.detail.value }); },

  bindRegionChange(e) {
    console.log('region event:', e);
    this.setData({ 'createData.region': e.detail.checked });
  },

  bindClothesChange1(e) {
    console.log('cloth event:', e);
    const newTeamColors = [e.detail.checked, this.data.createData.color[1]];
    this.setData({
      'createData.color': newTeamColors
    });
  },
  bindClothesChange2(e) {
    console.log('cloth event:', e);
    const newTeamColors = [this.data.createData.color[0], e.detail.checked];
    console.log(newTeamColors);
    this.setData({
      'createData.color': newTeamColors
    });
  },

  bindContactNameChange(e) {
    this.setData({ 'createData.contact_name': e.detail.value });
  },
  bindContactPhoneChange(e) {
    this.setData({ 'createData.contact_phone': e.detail.value });
  },
  bindContactWXChange(e) {
    this.setData({ 'createData.contact_wx': e.detail.value });
  },

  bindFamilyChange(e) { this.setData({ 'createData.familyUrl': e.detail.value }); },
  openFamilySheet() {
    var self = this;
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['camera', 'album'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        wx.uploadFile({
          url: config.BASE_URL + '/aqm/tool/api/upload/file',
          // url: 'http://192.168.0.21:3000/tool/api/upload/file',
          filePath: res.tempFilePaths[0],
          name: 'file',
          formData: {},
          success (res2){
            console.log('upload result', res2);
            if (res2.statusCode != 200) {
              return wx.showModal({ content: '上传失败', confirmText: '确定', confirmColor: '#00a7f2', showCancel: false });
            }
            var obj = JSON.parse(res2.data);
            self.setData({ 'createData.familyUrl': obj.result });
          }
        });
      }
    });
  },

  createTeamSubmit(e) {
    console.log('createData:::', this.data.createData);

    let form_id = e.detail.formId;
    const wxSessionKey = app.globalData.secret;
    const wxAppId = app.globalData.appid;
    const wxOpenId = app.globalData.openid;

    var self = this;
    if (this.data.typeIndex === '') {
      return wx.showModal({ content: '请选择球队类型', confirmText: '确定', confirmColor: '#00a7f2', showCancel: false });
    }
    if (this.data.createData.region[1].id === 0) {
      return wx.showModal({ content: '请选择所在地', confirmText: '确定', confirmColor: '#00a7f2', showCancel: false });
    }
    var data = {
      logo: this.data.createData.logoUrl,
      name: this.data.createData.name,
      type: this.data.types[this.data.typeIndex].id,
      province_id: this.data.createData.region[0].id,
      city_id: this.data.createData.region[1].id,
      desc: this.data.createData.intro,
      photo: this.data.createData.familyUrl,
      colors: this.data.createData.color,
      contact_name: this.data.createData.contact_name,
      contact_phone: this.data.createData.contact_phone,
      contact_wx: this.data.createData.contact_wx,
      wx_open_id: wxOpenId,
      wx_form_id:form_id,
      wx_app_id: wxAppId,
      wx_session_key: wxSessionKey
    };
    http.post('TEAM_API_INDEX_CREATE', data, function (res) {
      if (res.code != 200) {
        return wx.showModal({ content: res.err, confirmText: '确定', confirmColor: '#00a7f2', showCancel: false });
      }
      const teamId = res.info.team_id;
      return wx.showModal({
        title: '球队创建成功',
        content: '您已经是球队管理员了。请在微信中搜索关注“爱球迷服务号”，可以为您提供更多使用帮助和引导。',
        confirmText: '确定', confirmColor: '#00a7f2',
        showCancel: false,
        success: function () {
            wx.setStorageSync('currentTeamId', teamId);
            wx.setStorageSync('updateMyTeams', 1);
            wx.navigateBack({ delta: 1 });
        }
      });
    });
  },

  // 生命周期函数--监听页面加载
  onLoad(options) {
    this.cropper1 = new WeCropper(this.data.cropper1Opt);
  }
  
});
