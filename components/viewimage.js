function getFilename(filePath) {
  filePath = filePath.split('?')[0]; //去参数
  var re = /([^\.\/\\]+)\.([a-z]+)$/i,
      resultArr = re.exec(filePath),
      info = {};
  if (resultArr) {
      info.name = resultArr[1].toLowerCase();
      info.type = resultArr[2].toLowerCase();
  }
  return info.name + '.' + info.type;
}

Component({
  /**
   * 组件的属性列表
   */
  properties: {

    mode: {
      type: String,
      value: 'aspectFill', //不存在此属性时
      observer: function(newVal, oldVal, changedPath) {
        if (!newVal) {
          return console.error('新 style 无效:', newVal);
        }
        // console.log('obs src', newVal, oldVal, changedPath);
      }
    },
    src: {
      type: String,
      value: '', //不存在此属性时
      observer: function(newVal, oldVal, changedPath) {
        if (!newVal) {
          return console.error('新图片地址无效:', newVal);
        }
        // console.log('obs src', newVal, oldVal, changedPath);
      }
    },
    style2: {
      type: String,
      value: '', //不存在此属性时
      observer: function(newVal, oldVal, changedPath) {
        if (!newVal) {
          return console.error('新 style 无效:', newVal);
        }
        // console.log('obs src', newVal, oldVal, changedPath);
      }
    }

  },

  /**
   * 组件的初始数据
   */
  data: {

    hidden: true

  },

  /**
   * 组件的方法列表
   */
  methods: {

    togglePreview() {
      // this.setData({ hidden: !this.data.hidden });
      let filename = getFilename(this.properties.src);
      if (
        filename == 'default_photo.png' || filename == 'no_photo.png' || filename == 'no_photo.jpg' || filename == 'default_banner.png'
      ) {
        return;
      }
      wx.previewImage({
        current: '', // 当前显示图片的http链接
        urls: [this.properties.src] // 需要预览的图片http链接列表
      });
    }

  }
})
