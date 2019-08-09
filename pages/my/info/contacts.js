import http from "../../../utils/http.js";
import utils from "../../../utils/index.js";
import config from '../../../config/config.js'
import teamConfig from '../../../utils/team_config.js';

const app = getApp();

Page({

  // 页面的初始数据
  data: {

    info: {
      name: '',
      region: [
        { id: 110000, name: '北京' },
        { id: 110100, name: '北京' }
      ],

    }

  },

  openPhotoSheet() {
    var self = this;
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['camera', 'album'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {

        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        wx.uploadFile({
          url: config.BASE_URL + '/aqm/tool/api/upload/file',
          filePath: res.tempFilePaths[0],
          name: 'file',
          formData: {},
          success(res2) {
            console.log('upload result', res2);
            if (res2.statusCode != 200) {
              return wx.showModal({ content: '上传失败', confirmText: '确定', confirmColor: '#00a7f2', showCancel: false });
            }
            var obj = JSON.parse(res2.data);
            let info=self.data.info;
            info.realphoto.value=obj.result;
            self.setData({ info: info });
          }
        });

      }
    });
  },

  bindNameChange(e) {
    this.setData({ 'saveData.name': e.detail.value });
  },
  bindHeightChange(e) {
    this.setData({ 'saveData.height': e.detail.value });
  },
  bindWeightChange(e) {
    this.setData({ 'saveData.weight': e.detail.value });
  },
  bindPhoneChange(e) {
    this.setData({ 'saveData.phone': e.detail.value });
  },


  // 修改所在地
  bindRegionChange: function (e) {
    console.log('region change', e);
    this.setData({ 'info.region': e.detail.checked });
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
    const self = this;
    self.setData({ from: config.FROM });
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
    info.region = [
      { id: 110000, name: '北京' },
      { id: 110100, name: '北京' }
    ];
    self.setData({ info: res.info })
  });
}

function savaData(self){
  wx.showLoading();
  http.post('ACCOUNT_API_INDEX_SETINFO', {data:self.data.info}, function (res) {
    wx.hideLoading();
    if (res.code != 200) {
      return wx.showModal({ content: res.err, confirmText: '确定', confirmColor: '#00a7f2', showCancel: false });
    }

    wx.showModal({
      content: "信息更新成功",
      confirmText: '确定', confirmColor: '#00a7f2', 
      showCancel: false
    });

  });
}