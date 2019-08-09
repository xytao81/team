import http from "../../utils/http.js";
import utils from "../../utils/index.js";
import teamConfig from "../../utils/team_config.js";
import config from '../../config/config.js'

import WeCropper from 'we-cropper/index.js'
const device = wx.getSystemInfoSync(); // 获取设备信息
const width = device.windowWidth; // 示例为一个与屏幕等宽的正方形裁剪框
const height = device.windowHeight;

const app = getApp();

Page({

  // 页面的初始数据
  data: {

    teampLogoPath: '',
    teamRights: 0,

    types: teamConfig.getTypes(),
    typeIndex: '',

    focusOnIntro: false,

    cropper1config: {
      cut: {
        x: (width - 320) / 2, // 裁剪框x轴起点
        y: (width - 320) / 2, // 裁剪框y轴期起点
        width: 320, // 裁剪框宽度
        height: 320 // 裁剪框高度
      },
      dest: {
        width: 1000,
        height: 1000
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

    editData: {
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
      region: [
        { id: 0, name: '' },
        { id: 0, name: '' }
      ],

      contact_name: '',
      contact_phone: '',
      contact_wx: '',

      type: 0,

      familyUrl: '',
      intro: ''
    }
  },

  loadRights(callback) {
    const self = this;
    wx.showLoading();
    http.post('TEAM_API_PLAYER_MYRIGHTS', { team_id: self.data.teamId }, function (res) {
      wx.hideLoading();
      if (res.code != 200) {
        return wx.showModal({ content: res.err, confirmText: '确定', confirmColor: '#00a7f2', showCancel: false });
      }
      self.setData({ teamRights: res.info.rights });
      if (callback) callback();
    });
  },
  bindLogoChange(e) { this.setData({ 'editData.logoUrl': e.detail.value }); },
  bindNameChange(e) { this.setData({ 'editData.name': e.detail.value }); },
  bindTypeChange(e) {
    this.setData({
      'typeIndex': e.detail.value,
      'editData.type': this.data.types[e.detail.value].id
    });
  },
  bindContactNameChange(e) { this.setData({ 'editData.contact_name': e.detail.value }); },
  bindContactPhoneChange(e) { this.setData({ 'editData.contact_phone': e.detail.value }); },
  bindContactWXChange(e) { this.setData({ 'editData.contact_wx': e.detail.value }); },

  focusOnIntro() { this.setData({ 'focusOnIntro': true }); },
  focusOutIntro() { this.setData({ 'focusOnIntro': false }); },
  bindIntroChange(e) { this.setData({ 'editData.intro': e.detail.value }); },

  bindRegionChange(e) {
    console.log('region event:', e);
    this.setData({
      'editData.region': e.detail.checked
    });
  },

  bindClothesChange1(e) {
    console.log('cloth event:', e);
    const newTeamColors = [e.detail.checked, this.data.editData.color[1]];
    this.setData({
      'editData.color': newTeamColors
    });
  },
  bindClothesChange2(e) {
    console.log('cloth event:', e);
    const newTeamColors = [this.data.editData.color[0], e.detail.checked];
    console.log(newTeamColors);
    this.setData({
      'editData.color': newTeamColors
    });
  },

  bindFamilyChange(e) { this.setData({ 'editData.familyUrl': e.detail.value }); },
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
          success(res2) {
            console.log('upload result', res2);
            if (res2.statusCode != 200) {
              return wx.showModal({ content: '上传失败', confirmText: '确定', confirmColor: '#00a7f2', showCancel: false });
            }
            var obj = JSON.parse(res2.data);
            self.setData({ 'editData.familyUrl': obj.result });
          }
        });
      }
    });
  },

  editTeamSubmit() {
    console.log('editData:::', this.data.editData);
    var self = this;
    if (this.data.typeIndex === '') {
      return wx.showModal({ content: '请选择球队类型', confirmText: '确定', confirmColor: '#00a7f2', showCancel: false });
    }
    if (this.data.editData.region[1].id === 0) {
      return wx.showModal({ content: '请选择所在地', confirmText: '确定', confirmColor: '#00a7f2', showCancel: false });
    }
    var data = {
      id: this.data.editData.id,
      logo: this.data.editData.logoUrl,
      name: this.data.editData.name,
      type: this.data.types[this.data.typeIndex].id,
      province_id: this.data.editData.region[0].id,
      city_id: this.data.editData.region[1].id,
      desc: this.data.editData.intro,
      photo: this.data.editData.familyUrl,
      colors: this.data.editData.color,
      contact_name: this.data.editData.contact_name,
      contact_phone: this.data.editData.contact_phone,
      contact_wx: this.data.editData.contact_wx
    };
    console.log(data)
    http.post('TEAM_API_INDEX_EDIT', data, function (res) {
      if (res.code != 200) {
        return wx.showModal({ content: res.err, confirmText: '确定', confirmColor: '#00a7f2', showCancel: false });
      }
      wx.setStorageSync('updateMyTeams', 1);
      return wx.showToast({
        title: '修改成功',
        icon: 'success',
        duration: 3000,
        success: function () {
          wx.navigateBack({ delta: 1 });
        }
      });
    });
  },

  // 生命周期函数--监听页面加载
  onLoad(options) {
    this.setData({ teamId: options.team_id });
    this.cropper1 = new WeCropper(this.data.cropper1Opt);
  },
  onReady: function () {
    let self = this;
    self.loadRights(function () {
      loadData(self);
    });
  }

});

function loadData(self) {

  wx.showLoading();
  http.post('TEAM_API_INDEX_DETAIL', {
    id: self.data.teamId
  }, function (res) {
    wx.hideLoading();
    if (res.code != 200) {
      return wx.showModal({ content: res.err, confirmText: '确定', confirmColor: '#00a7f2', showCancel: false });
    }
    var data = self.data.editData;
    data["id"] = res.info.id;
    data["logoUrl"] = res.info.logo;
    data["name"] = res.info.name;
    data["type"] = res.info.type;
    const typeIndex = self.data.types.findIndex(item => item.id == res.info.type);
    data["region"] = [
      { id: res.info.province_id, name: res.info.province_name },
      { id: res.info.city_id, name: res.info.city_name }
    ]
    data["intro"] = res.info.desc;
    data["familyUrl"] = res.info.photo;
    data["contact_name"] = res.info.contact_name;
    data["contact_phone"] = res.info.contact_phone;
    data["contact_wx"] = res.info.contact_wx;

    if (res.info.colors) {
      data.color = res.info.colors;
    }

    self.setData({ editData: data, typeIndex: typeIndex });
  });
}