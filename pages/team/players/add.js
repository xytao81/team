import http from "../../../utils/http.js";
import utils from "../../../utils/index.js";
import config from '../../../config/config.js'
import teamConfig from '../../../utils/team_config.js';

import WeCropper from 'we-cropper/index.js'
const device = wx.getSystemInfoSync(); // 获取设备信息
const width = device.windowWidth; // 示例为一个与屏幕等宽的正方形裁剪框
const height = device.windowHeight;

Page({

  /**
   * 页面的初始数据
   */
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

    teamId: '',
    jobs: [],
    sub_jobs:[],

    jobIndex:2,
    jobSubIndex: 0,

    createData: {
      photo: '',
      name: '',
      jobs: [ {job: 3, sub_job: 1, job_name: "队员", sub_job_name: "队员"} ],
      number: '',
      position: { id: 0, name: '-' }
    }
  },


  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  bindNameChange(e) {
    this.setData({ 'createData.name': e.detail.value });
  },
  bindNumberChange:function(e){
    if (e.detail.value > 99) {
      return wx.showModal({ content: '球衣号不能大于 99', confirmText: '确定', confirmColor: '#00a7f2', showCancel: false });
    }
    this.setData({ 'createData.number': e.detail.value });
  },
  bindPhoneChange: function (e) {
    this.setData({ 'createData.phone': e.detail.value });
  },
  openPhotoSheet:function(){
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
        filePath: tempFilePath,
        name: 'file',
        formData: {},
        success(res2) {
          console.log('upload result', res2);
          if (res2.statusCode != 200) {
            return wx.showModal({ content: '上传失败', confirmText: '确定', confirmColor: '#00a7f2', showCancel: false });
          }
          var obj = JSON.parse(res2.data);
          self.setData({ 'createData.photo': obj.result });
        }
      });

    })
  },
  cropper1TouchStart (e) { this.cropper1.touchStart(e) },
  cropper1TouchMove (e) { this.cropper1.touchMove(e) },
  cropper1TouchEnd (e) { this.cropper1.touchEnd(e) },


  bindJobChange: function(e){
    const jobs = e.detail.checked;
    this.setData({ 'createData.jobs': jobs });
    // if (jobs[0] && jobs[0].job.id != 3) {
    //   //不是队员
    //   this.setData({'createData.position': '' });
    // } 
  },
  bindSubJobChange: function (e) {
    let jobSubIndex = e.detail.value;
    this.setData({ jobSubIndex: jobSubIndex, 'createData.sub_job': this.data.sub_jobs[jobSubIndex].id });
  },
  bindPositionChange(e) {
    const id = e.detail.value;
    const position = teamConfig.getPosition(id);
    //console.log(11111111111111111111,position);
    this.setData({ 'createData.position': position });
  },

  createPhoneSubmit:function(){
    let data=this.data.createData;
    if(data.name.length==0){
      return wx.showModal({ content: "姓名不能为空", confirmText: '确定', confirmColor: '#00a7f2', showCancel: false });
    }
    if(data.jobs.length==0){
      return wx.showModal({ content: "至少需要选择一个职务", confirmText: '确定', confirmColor: '#00a7f2', showCancel: false });
    }

    data["team_id"]=this.data.teamId;
    data["position"] = data.position.id;
    sendData(this,data);
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({ teamId: options.team_id });
    this.cropper1 = new WeCropper(this.data.cropper1Opt);
  }

});

function sendData(self,data){
  wx.showLoading()

  http.post('TEAM_API_PLAYER_CREATE', data, function (res) {
    wx.hideLoading()
    if (res.code != 200) {
      return wx.showModal({ content: res.err, confirmText: '确定', confirmColor: '#00a7f2', showCancel: false });
    }
    wx.setStorageSync('updateMyTeams', 1);
    wx.setStorageSync('updatePlayers_'+self.data.teamId, 1);
    return wx.showModal({
      title: '成功',
      content: "添加用户成功",
      confirmText: '确定', confirmColor: '#00a7f2', 
      showCancel: false,
      success: function (res) {
        wx.navigateBack();
       } // res.confirm
    });
    
  });
}