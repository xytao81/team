import http from "../../../utils/http.js";
import utils from "../../../utils/index.js";
import config from '../../../config/config.js';
import validate from "../../../utils/validate.js";
import teamConfig from '../../../utils/team_config.js';

import WeCropper from 'we-cropper/index.js'
const device = wx.getSystemInfoSync(); // 获取设备信息
const width = device.windowWidth; // 示例为一个与屏幕等宽的正方形裁剪框
const height = device.windowHeight;

const app = getApp();

Page({

  // 页面的初始数据
  data: {
  
    cropper1Visible: false,
    cropper1Opt: {
      id: 'cropper1Id', // 用于手势操作的canvas组件标识符
      targetId: 'cropper1TargetId', // 用于用于生成截图的canvas组件标识符
      pixelRatio: device.pixelRatio, // 传入设备像素比
      width: width,  // 画布宽度
      height: height - 100, // 画布高度
      scale: 2.5, // 最大缩放倍数
      zoom: 8, // 缩放系数
      cut: {
        x: (width - 227) / 2, // 裁剪框x轴起点
        y: (width - 320) / 2, // 裁剪框y轴期起点
        width: 227, // 裁剪框宽度
        height: 320 // 裁剪框高度
      }
    },

    user: null,
    info: {
      name: '',
      // region: [
      //   { id: 110000, name: '北京' },
      //   { id: 110100, name: '北京' }
      // ],

    }

  },
  //判断身份证
  bindCertnumberChange: function (e) {
    var value = e.detail.value;
    if(!value) return;
    if(this.data.info.cert_type.value == '1'){
        const res = validate.validateIdentity(value);
        if(!res.result){
          wx.showModal({ content: '身份证错误 ', confirmText: '确定', confirmColor: '#00a7f2', showCancel: false });
          value = '';
          return;
        }
        let info = this.data.info;
        info.certnumber.value = value;
        info.birthday.value = res.info.birthday;
        info.sex.value = res.info.sex == 1 ? '1' : '2';//1男 2女
        this.setData({ info: info });
    }  else {
        let info = this.data.info;
        info.certnumber.value = value;
        this.setData({ info: info });
    }
  },





  openPhotoSheet() {
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
    self.cropper1.getCropperImage((tempFilePath) => {
      if (!tempFilePath) {
        return console.log('获取图片地址失败，请稍后重试');
      }
      self.setData({ cropper1Visible: false });
      wx.uploadFile({
        url: config.BASE_URL + '/aqm/tool/api/upload/file',
        // url: 'http://192.168.0.21:3000/tool/api/upload/file',
        filePath: tempFilePath,
        name: 'file',
        formData: {},
        success (res2){
          if (res2.statusCode != 200) {
            console.log('upload result:::', res2);
            return wx.showModal({ content: '上传失败', confirmText: '确定', confirmColor: '#00a7f2', showCancel: false });
          }
          var obj = JSON.parse(res2.data);
          let info=self.data.info;
          info.realphoto.value=obj.result;
          self.setData({ info: info });
        }
      });
    })
  },
  cropper1TouchStart (e) { this.cropper1.touchStart(e) },
  cropper1TouchMove (e) { this.cropper1.touchMove(e) },
  cropper1TouchEnd (e) { this.cropper1.touchEnd(e) },

  // bindNameChange(e) {
  //   this.setData({ 'saveData.name': e.detail.value });
  // },
  // bindHeightChange(e) {
  //   this.setData({ 'saveData.height': e.detail.value });
  // },
  // bindWeightChange(e) {
  //   this.setData({ 'saveData.weight': e.detail.value });
  // },
  // bindPhoneChange(e) {
  //   this.setData({ 'saveData.phone': e.detail.value });
  // },


  // 修改所在地
  bindRegionChange: function (e) {
    console.log(e.detail)
    this.setData({ 'info.region': e.detail.checked });

    this.setData({ 'info.province_id.value': e.detail.checked[0].id});
    this.setData({ 'info.city_id.value': e.detail.checked[1].id });
  },

  bindInputChange: function (e) {
    let key = e.currentTarget.dataset.key;
    let value = e.detail.value;
    console.log(key,value);
    let info = this.data.info;
    info[key].value = value;
    this.setData({ info: info });
  },
  // bindIdcardtypeChange(e) {
  //   this.setData({ 'saveData.idcard_type': e.detail.value });
  // },
  // bindIdcardChange(e) {
  //   this.setData({ 'saveData.idcard_no': e.detail.value });
  // },
  // bindNationChange(e) {
  //   this.setData({ 'saveData.nation': e.detail.value });
  // },
  // bindForeignChange(e) {
  //   this.setData({ 'saveData.foreign': e.detail.value });
  // },
  // bindSexChange(e) {
  //   this.setData({ 'saveData.sex': e.detail.value });
  // },
  // bindBirthdayChange(e) {
  //   console.log(e);
  //   this.setData({ 'saveData.birthday': e.detail.value });
  // },
  // bindLiveAddressChange(e) {
  //   this.setData({ 'saveData.live_address': e.detail.value });
  // },
  // bindIdAddressChange(e) {
  //   this.setData({ 'saveData.id_address': e.detail.value });
  // },
  // bindEmailChange(e) {
  //   this.setData({ 'saveData.email': e.detail.value });
  // },
  // bindCompanyChange(e) {
  //   this.setData({ 'saveData.company': e.detail.value });
  // },
  // bindEmergencyNameChange(e) {
  //   this.setData({ 'saveData.emergency_name': e.detail.value });
  // },
  // bindEmergencyRelationChange(e) {
  //   this.setData({ 'saveData.emergency_relaition': e.detail.value });
  // },
  // bindEmergencyPhoneChange(e) {
  //   this.setData({ 'saveData.emergency_phone': e.detail.value });
  // },

  saveInfo:function(){
    savaData(this);
  },

  onLoad(options) {
    this.setData({ from: config.FROM });
    this.cropper1 = new WeCropper(this.data.cropper1Opt);
  },

  onReady(){
    loadData(this);
  }

});

function loadData(self){
  wx.showLoading();
  http.post('ACCOUNT_API_INDEX_DETAIL', {}, function (res) {
    wx.hideLoading();
    if (res.code != 200) {
      return wx.showModal({ content: res.err, confirmText: '确定', confirmColor: '#00a7f2', showCancel: false });
    }
    let info = res.info;
    // info.region = [
    //   { id: 110000, name: '北京' },
    //   { id: 110100, name: '北京' }
    // ];
    self.setData({ info: res.info, user: app.globalData.user.info });
  });
}

function savaData(self){
  wx.showLoading();
  http.post('ACCOUNT_API_INDEX_SETINFO', {data:self.data.info}, function (res) {
    wx.hideLoading();
    if (res.code != 200) {
      return wx.showModal({ content: res.err, confirmText: '确定', confirmColor: '#00a7f2', showCancel: false });
    }

    app.globalData.user.info.name = self.data.info.realname.value;
    app.globalData.user.info.photo = self.data.info.realphoto.value;

    self.setData({ user: app.globalData.user.info });

    wx.showModal({ content: "信息更新成功", confirmText: '确定', confirmColor: '#00a7f2', showCancel: false });

  });
}