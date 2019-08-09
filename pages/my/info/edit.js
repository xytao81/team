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

    group: '',

    user: null,
    content: null

  },

  onUsereditChange(e) {
    console.log('资料修改组件事件的接收：', e);
    this.setData({ content: e.detail.value });
  },

  editSubmit() {
    const self = this;
    let content = self.data.content;
    for (let k in content) {
      for (let k2 in content[k]) {
        let field = content[k][k2];
        if (!field.is_select) continue;
        if (field.key == 'realname') {
          if (!field.value) {
            return wx.showModal({ content: field.name+'不能为空 '+ (field.value === undefined ? '' : field.value), confirmText: '确定', confirmColor: '#00a7f2', showCancel: false });
          }
        }
        if (field.key == 'cert_type') {
          if (field.value == 0) {
            return wx.showModal({ content: field.name+'错误 ', confirmText: '确定', confirmColor: '#00a7f2', showCancel: false });
          }
        }
        if (field.key == 'certnumber' && content['person_info'][2].value == 1) {
          const res = validate.validateIdentity(field.value);
          if (!res.result) {
            return wx.showModal({ content: field.name+'错误 ' + field.value, confirmText: '确定', confirmColor: '#00a7f2', showCancel: false });
          }
        }
        if (field.key == 'phone' && field.value) {
          if (!validate.validatePhone(field.value)) {
            field.value = '';
            return wx.showModal({ content: field.name+'错误 ', confirmText: '确定', confirmColor: '#00a7f2', showCancel: false });
          }
        }
        if (field.key == 'email' && field.value) {
          if (!validate.validateEmail(field.value)) {
            field.value = '';
            return wx.showModal({ content: field.name+'错误 ', confirmText: '确定', confirmColor: '#00a7f2', showCancel: false });
          }
        }
      }
    }

    http.post('ACCOUNT_API_INDEX_SETINFO2', { content: content }, function (res) {
      if (res.code != 200) {
        return wx.showModal({ content: res.err, confirmText: '确定', confirmColor: '#00a7f2', showCancel: false });
      }
      if (content['person_info'] && content['person_info'].length > 0) {
        app.globalData.user.info.photo = content['person_info'][0].value;
        app.globalData.user.info.name = content['person_info'][1].value;
        self.setData({ user: app.globalData.user.info });
      }
      wx.showModal({
        content: "信息更新成功",
        confirmText: '确定', confirmColor: '#00a7f2', 
        showCancel: false,
        success: function (res) {
          wx.navigateBack({ delta: 1 });
        }
      });
    });
  },

  loadBase() {
    const self = this;
    wx.showLoading();
    http.post('ACCOUNT_API_INDEX_DETAIL2', { group: self.data.group }, function (res) {
      wx.hideLoading();
      if (res.code != 200) {
        return wx.showModal({ content: res.err, confirmText: '确定', confirmColor: '#00a7f2', showCancel: false });
      }
      // let info = res.info;
      // // info.region = [
      // //   { id: 110000, name: '北京' },
      // //   { id: 110100, name: '北京' }
      // // ];
      self.setData({ user: app.globalData.user.info, content: res.info.content });
    });
  },

  onLoad(options) {
    const group = options.group ? options.group : '';
    this.setData({ from: config.FROM, group: group });
  },

  onReady() {
    this.loadBase();
    // loadData(this);
  }

});
