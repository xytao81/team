
// components/useredit/useredit.js

import http from "../../utils/http.js";
import validate from "../../utils/validate.js";
import config from '../../config/config.js';
import teamConfig from '../../utils/team_config.js';

const device = wx.getSystemInfoSync(); // 获取设备信息
const width = device.windowWidth; // 示例为一个与屏幕等宽的正方形裁剪框
const height = device.windowHeight;

const moment = require('moment');

const app = getApp();
function getNumbersArray(start, end) {
  let rangeArray = (start, end) => Array(end - start + 1).fill(0).map((v, i) => i + start)
  return rangeArray(start, end); // return [0,1,2,3,4,5,6,7,8,9,10]
} 
  
Component({
  /**
   * 组件的属性列表
   */
  options: {
    addGlobalClass: true,
  },
  properties: {
      value: {
        type : null,
        value:'',
        observer: function(newVal, oldVal) {
          if (!newVal) return;
          console.log('useredit:::', newVal, oldVal);
          // if (newVal.person_info && newVal.person_info[8] && newVal.person_info[8].value) {
          //   const region = newVal.person_info[8].value;
          //   this.setData({ region: region });
          // }
          let isIdCard = false;
          if (newVal.person_info) {
            let birthdayField = newVal.person_info.find(item => item.key == 'birthday');
            if (birthdayField && birthdayField.value) { // 改变生日的结构
              birthdayField.value = moment(birthdayField.value).format('YYYY-MM-DD');
            }
            let certField = newVal.person_info.find(item => item.key == 'cert_type');
            if (certField && certField.is_select && certField.value) {
              if (certField.value == 1) isIdCard = true;
            }
            let positionField = newVal.person_info.find(item => item.key == 'position');
            if (positionField && positionField.value) {
              this.changePosition(positionField.value);
            }
            let subjobField = newVal.person_info.find(item => item.key == 'sub_rights');
            if (subjobField && subjobField.value) {
              this.changeSubjob(subjobField.value);
            }
          }
          this.setData({ content: newVal, isIdCard: isIdCard });
          this.contentFieldsTitlesCount(newVal);
          if ( newVal.person_info && !newVal.person_info[1].value && this.properties.loadDefault ){
            console.log('useredit load default:::', this.properties.loadDefault);
            this.loadMyDefaultInfo();
          }
        }

      },

      job: {
        type : Number,
        value: 0,
      },

      loadDefault: {
        type : Boolean,
        value: false,
        observer: function(newVal, oldVal) {
          if (newVal) {
          }
        }
      }
  },

  /**
   * 组件的初始数据
   */
  data: {
    idx: '',
    idx2: '',

    content: {},
    account: null,

    contentFieldsTitles: {
      'person_info': { text: '个人信息', count: 0 },
      'size': { text: '身材鞋码', count: 0 },
      'work': { text: '工作经历', count: 0 },
      'education': { text: '教育经历', count: 0 },
      'contact': { text: '紧急联系人', count: 0 },
      'tqi': { text: '资格条件', count: 0 },
      'sign_number': { text: 'sign_number', count: 0 }
    },

    region: [
      { id: 0, name: '' },
      { id: 0, name: '' }
    ],
    position: {
      id: 0,
      name: '-'
    },

    isIdCard: false,

    numbersArray: getNumbersArray(1, 250),
    
    cropper1config: {
      cut: {
        x: (width - 227) / 2, // 裁剪框x轴起点
        y: (width - 320) / 2, // 裁剪框y轴期起点
        width: 227, // 裁剪框宽度
        height: 320 // 裁剪框高度
      },
      dest: {
        width: 227*3,
        height: 320*3
      }
    },
    cropper2config: {
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

    redLables: {
      'person_info': {},
      'size': {},
      'work': {},
      'education': {},
      'contact': {},
      'tqi': {},
      'sign_number': {}
    }

  },

  /**
   * 组件的方法列表
   */
  methods: {

    fieldError(idx, idx2) {
      let redLables = this.data.redLables;
      redLables[idx][idx2] = true;
      this.setData({ redLables: redLables });
    },

    contentFieldsTitlesCount(content) {
      let contentFieldsTitles = this.data.contentFieldsTitles;
      for (let k in content) {
        let arr = content[k].filter(item => item.is_select == true);
        if (!contentFieldsTitles[k]) {
          console.log('useredit: '+k+' 未找到');
        }
        contentFieldsTitles[k].count = arr.length;
      }
      // console.log('useredit 计算完成:', contentFieldsTitles);
      this.setData({ contentFieldsTitles: contentFieldsTitles });
    },

    bindNationInputChange(e){
      let idx = e.currentTarget.dataset.idx;
      let idx2 = e.currentTarget.dataset.idx2;
      let value = e.detail.value;
      console.log('修改值', idx, idx2, value);
      let content = this.data.content;
      content[idx][idx2].value = value;
      this.setData({ content: content });
      this.triggerChange();
    },
    bindInputChange: function (e) {
      let idx = e.currentTarget.dataset.idx;
      let idx2 = e.currentTarget.dataset.idx2;
      let value = e.detail.value;
      console.log('修改值', idx, idx2, value);
      let content = this.data.content;
      content[idx][idx2].value = value;
      this.setData({ content: content });
      this.triggerChange();
    },
    bindNumberChange: function (e) {
      let idx = e.currentTarget.dataset.idx;
      let idx2 = e.currentTarget.dataset.idx2;
      let value = parseInt(e.detail.value)+1;
      console.log('修改值', idx, idx2, value);
      let content = this.data.content;
      content[idx][idx2].value = value;
      this.setData({ content: content });
      this.triggerChange();
    },
    bindPhoneChange: function (e) {
      let idx = e.currentTarget.dataset.idx;
      let idx2 = e.currentTarget.dataset.idx2;
      let value = e.detail.value;
      if (value && !validate.validatePhone(value)) {
        wx.showModal({ content: '手机号错误 ' + value, confirmText: '确定', confirmColor: '#00a7f2', showCancel: false });
      }
      console.log('修改值', idx, idx2, value);
      let content = this.data.content;
      content[idx][idx2].value = value;
      this.setData({ content: content });
      this.triggerChange();
    },
    bindEmailChange: function (e) {
      let idx = e.currentTarget.dataset.idx;
      let idx2 = e.currentTarget.dataset.idx2;
      let value = e.detail.value;
      if (value && !validate.validateEmail(value)) {
        wx.showModal({ content: '邮箱错误 ' + value, confirmText: '确定', confirmColor: '#00a7f2', showCancel: false });
      }
      console.log('修改值', idx, idx2, value);
      let content = this.data.content;
      content[idx][idx2].value = value;
      this.setData({ content: content });
      this.triggerChange();
    },

    changePosition(id) {
      const position = teamConfig.getPosition(id);
      // console.log('切换position', position);
      this.setData({ 'position': position }); 
    },
    bindPositionChange(e) {
      console.log('position event:', e);
      let idx = e.currentTarget.dataset.idx;
      let idx2 = e.currentTarget.dataset.idx2;
      let value = e.detail.value;
      this.changePosition(value);
      console.log('修改值', idx, idx2, value);
      let content = this.data.content;
      content[idx][idx2].value = value;
      this.setData({ content: content });
      this.triggerChange();
    },

    changeSubjob(id) {
      const subjob = teamConfig.getSubJob(this.properties.job, id);
      // console.log('切换subjob', subjob);
      this.setData({ 'subjob': subjob }); 
    },
    bindSubjobChange(e) {
      console.log(e);
      console.log('subjob event:', e);
      let idx = e.currentTarget.dataset.idx;
      let idx2 = e.currentTarget.dataset.idx2;
      let value = e.detail.value;
      this.changeSubjob(value);
      console.log('修改值', idx, idx2, value);
      let content = this.data.content;
      content[idx][idx2].value = value;
      this.setData({ content: content });
      this.triggerChange();
    },

    // 证件类型
    bindCertTypeChange: function (e) {
      let idx = e.currentTarget.dataset.idx;
      let idx2 = e.currentTarget.dataset.idx2;
      let value = e.detail.value;
      let content = this.data.content;
      let isIdCard = false;
      if (value == '1') { //是身份证
        isIdCard = true;
      }
      // console.log('修改值', idx, idx2, value);
      content[idx][idx2].value = value;
      this.setData({ content: content, isIdCard: isIdCard });
      this.triggerChange();
    },
    bindCertnumberChange(e) {
      let idx = e.currentTarget.dataset.idx;
      let idx2 = e.currentTarget.dataset.idx2;
      let value = e.detail.value;
      let content = this.data.content;
      if (this.data.isIdCard) { // 是身份证
        if (value) {
          const res = validate.validateIdentity(value);
          if (!res.result) {
            // this.fieldError('person_info', 'certnumber'); 
            wx.showModal({ content: '身份证错误 ' + value, confirmText: '确定', confirmColor: '#00a7f2', showCancel: false });
            // value = '';
          } else {
            console.log('验证身份证结果', res);
            const sexIndex = content['person_info'].findIndex(item => item.key == 'sex');
            content['person_info'][sexIndex].value = res.info.sex == 1 ? 1 : 2;
            const birthdayIndex = content['person_info'].findIndex(item => item.key == 'birthday');
            content['person_info'][birthdayIndex].value = res.info.birthday;
          }
        }
      }
      console.log('修改值', idx, idx2, value);
      content[idx][idx2].value = value;
      this.setData({ content: content });
      this.triggerChange();
    },

    openImageSheet(e) {
      this.data.idx = e.currentTarget.dataset.idx;
      this.data.idx2 = e.currentTarget.dataset.idx2;
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
                return wx.showModal({
                  title: '',
                  content: '上传失败',
                  confirmText: '确定', confirmColor: '#00a7f2', 
                  showCancel: false,
                  success: function (res) { } // res.confirm
                });
              }
              var obj = JSON.parse(res2.data);

              let idx = self.data.idx;
              let idx2 = self.data.idx2;
              let value = obj.result;
              console.log('修改值', idx, idx2, value);
              let content = self.data.content;
              content[idx][idx2].value = value;
              self.setData({ content: content });
              self.triggerChange();
            }
          });
        }
      });
    },

    bindRegionChange(e) {
      console.log('region event:', e);
      let idx = e.currentTarget.dataset.idx;
      let idx2 = e.currentTarget.dataset.idx2;
      let arr = [];
      for (let k in e.detail.checked) {
        arr.push({ id: e.detail.checked[k].id, name: e.detail.checked[k].name });
      }
      let value = arr;
      console.log('修改值', idx, idx2, value);
      let content = this.data.content;
      content[idx][idx2].value = value;
      this.setData({ content: content, region: e.detail.checked });
      this.triggerChange();
    },

    bindPlayerNumberChange(e) { // 球衣号改变
      let idx = e.currentTarget.dataset.idx;
      let idx2 = e.currentTarget.dataset.idx2;
      let value = e.detail.value;
      if (value > 99) {
        wx.showModal({ content: '球衣号不能大于 99', confirmText: '确定', confirmColor: '#00a7f2', showCancel: false });
      }
      if (escape(value).indexOf( "%u" ) >= 0) {
        wx.showModal({ content: '球衣号不能包含中文', confirmText: '确定', confirmColor: '#00a7f2', showCancel: false });
      }
      console.log('修改值', idx, idx2, value);
      let content = this.data.content;
      content[idx][idx2].value = value;
      this.setData({ content: content });
      this.triggerChange();

    },



    loadMyDefaultInfo() {
      const self = this;
      if (self.data.account) {
        return;
      }
      http.post('ACCOUNT_API_INDEX_DETAIL', {}, function (res) {
        wx.hideLoading();
        if (res.code != 200) {
          return wx.showModal({ content: res.err, confirmText: '确定', confirmColor: '#00a7f2', showCancel: false });
        }
        let account = res.info;
        // console.log('account:',account);
        let content = self.data.content;
        console.log("content",content);
        if (content['person_info'] && content['person_info'].length > 0) {
          if (account.realphoto.value && content['person_info'][0].is_select) content['person_info'][0].value = account.realphoto.value;
          if (account.realname.value && content['person_info'][1].is_select) content['person_info'][1].value = account.realname.value;
          if (account.cert_type.value && content['person_info'][2].is_select) content['person_info'][2].value = account.cert_type.value;
          if (account.certnumber.value && content['person_info'][3].is_select) content['person_info'][3].value = account.certnumber.value;
          if (account.sex.value && content['person_info'][4].is_select) content['person_info'][4].value = account.sex.value;
          if (account.birthday.value && content['person_info'][5].is_select) content['person_info'][5].value = account.birthday.value;
          if (account.address.value && content['person_info'][9].is_select) content['person_info'][9].value = account.address.value;
          if (account.phone.value && content['person_info'][10].is_select) content['person_info'][10].value = account.phone.value;
          if (account.email.value && content['person_info'][11].is_select) content['person_info'][11].value = account.email.value;
        }
        if (content['size'] && content['size'].length > 0) {
          if (account.height.value && content['size'][0].is_select) content['size'][0].value = account.height.value;
          if (account.weight.value && content['size'][1].is_select) content['size'][1].value = account.weight.value;
        }
        self.setData({ content: content, account: account });
        self.triggerChange();
        console.log('my account info:::', account);
      });
    },

    triggerChange() {
      const myEventDetail = {
        value: this.data.content
      }
      const myEventOption = {} // 触发事件的选项
      this.triggerEvent('usereditchange', myEventDetail, myEventOption)
    }

  },

  lifetimes: {
    created() {
    }
  }
})
