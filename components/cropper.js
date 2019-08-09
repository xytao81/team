import WeCropper from '../libs/we-cropper/index.js'
import config from '../config/config.js';

const uploadUrl = config.BASE_URL + '/aqm/tool/api/upload/file';

const device = wx.getSystemInfoSync(); // 获取设备信息
const width = device.windowWidth;
const height = device.windowHeight;

Component({
  /**
   * 组件的属性列表
   */
  properties: {

    config: {
      type: Object,
      value: '', //不存在此属性时
      observer: function(newVal, oldVal, changedPath) {
        if (!newVal) {
          return console.error('新 cropper 配置无效:', newVal);
        }
        this.data.outConfig = newVal;
        // console.info('cropper obs Opt', newVal, oldVal, changedPath);
        this.data.cropperOpt.cut = newVal.cut;
        if (!this.cropper1) {
          this.init();
        }
        // this.cropper1 = this.selectComponent('#crop');
      }
    },

    upload: {
      type: Boolean,
      value: false
    }

  },

  /**
   * 组件的初始数据
   */
  data: {

    cropperWrapperVisible: false,
    cropperOpt: {
      id: 'cropperId', // 用于手势操作的canvas组件标识符
      targetId: 'cropperTargetId', // 用于用于生成截图的canvas组件标识符
      pixelRatio: device.pixelRatio, // 传入设备像素比
      width: width,  // 画布宽度
      height: height - 100, // 画布高度
      scale: 2.5, // 最大缩放倍数
      zoom: 8, // 缩放系数
      cut: {
        x: (width - 200) / 2, // 裁剪框x轴起点
        y: (width - 200) / 2, // 裁剪框y轴期起点
        width: 200, // 裁剪框宽度
        height: 200 // 裁剪框高度
      }
    },

    outConfig: {
      cut: {
        x: (width - 200) / 2, // 裁剪框x轴起点
        y: (width - 200) / 2, // 裁剪框y轴期起点
        width: 200, // 裁剪框宽度
        height: 200 // 裁剪框高度
      },
      dest: {
        width: 200,
        height: 200
      }
    }

  },

  /**
   * 组件的方法列表
   */
  methods: {

    init() {
      const options = Object.assign(this.data.cropperOpt, {
        ctx: wx.createCanvasContext(this.data.cropperOpt.id, this),
        targetCtx: wx.createCanvasContext(this.data.cropperOpt.targetId, this)
      });
      // console.info('pz:::', options, this.cropper1);
      this.cropper1 = new WeCropper(options, this);
      // this.cropper2 = this.selectComponent('#crop')
    },

    openImageSheet(e) {
      const self = this;
      self.data.idx = e.currentTarget.dataset.idx;
      self.data.idx2 = e.currentTarget.dataset.idx2;
      wx.chooseImage({
        count: 1, // 默认9
        sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
        sourceType: ['camera', 'album'], // 可以指定来源是相册还是相机，默认二者都有
        success: function (res) {
          // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
          let pushRes = self.cropper1.pushOrign(res.tempFilePaths[0]);
          // let pushRes2 = self.cropper2.pushOrign(res.tempFilePaths[0]);
          // console.log('push:::', pushRes, self.cropper1, res.tempFilePaths[0]);
          self.showCropper();
        }
      });
    },

    touchStart (e) { this.cropper1.touchStart(e) },
    touchMove (e) { this.cropper1.touchMove(e) },
    touchEnd (e) { this.cropper1.touchEnd(e) },

    cropperGetImage() {
      const self = this;
      self.cropper1.getCropperImage({ destWidth: self.data.outConfig.dest.width, destHeight: self.data.outConfig.dest.height, fileType: 'jpg', componentContext: self }).then((tempFilePath) => {
        if (!tempFilePath) {
          return console.log('获取图片地址失败，请稍后重试', tempFilePath);
        } 
        self.hideCropper();
        if (self.properties.upload) {
          return self.uploadImage(tempFilePath);
        }
        return self.trigger(tempFilePath);
      });
    },

    trigger(value) {
      const myEventDetail = {
        value: value
      } // detail对象，提供给事件监听函数
      const myEventOption = {} // 触发事件的选项
      this.triggerEvent('change', myEventDetail, myEventOption);
    },

    uploadImage(tempFilePath) {
      const self = this;
      wx.uploadFile({
        url: uploadUrl,
        filePath: tempFilePath,
        name: 'file',
        formData: {},
        success (res2){
          if (res2.statusCode != 200) {
            console.log('upload result:::', res2);
            return wx.showModal({ content: '上传失败', confirmText: '确定', confirmColor: '#00a7f2', showCancel: false });
          }
          var obj = JSON.parse(res2.data);
          self.trigger(obj.result);
        }
      });
    },

    showCropper() {
      this.setData({ cropperWrapperVisible: true });
    },
    hideCropper() {
      this.setData({ cropperWrapperVisible: false });
    }

  },

  lifetimes: {

    created() {}

  }

})
