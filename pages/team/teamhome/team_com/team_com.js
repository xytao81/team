// components/team/menu.js
Component({

  options: {
    addGlobalClass: true,
  },

  /**
   * 组件的属性列表
   */
  properties: {
    photo: {
      type: String,
      value: ''
    },
    desc: {
      type: String,
      value: '',
      observer: function(newVal, oldVal, changedPath) {
        if (!newVal) {
          newVal = '管理员很懒，什么都没留下。';
        }
        this.resetDesc(newVal);
      }
    },
    expand: {
      type: Boolean,
      value: false
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    limit: 40,

    shortDesc: '',
    descLength: 0,
    isLong: false,
    expanded: false
  },

  /**
   * 组件的方法列表
   */
  methods: {
    showDesc() {
      this.setData({ expanded: true });
    },
    hideDesc() {
      this.setData({ expanded: false });
    },
    resetDesc(desc) {
      this.hideDesc();
      const limit = this.data.limit;
      const len = desc.length;
      const isLong = len > limit ? true : false;
      const shortDesc = isLong ? desc.substr(0, limit) + ' ...' : desc;
      this.setData({ descLength: len, isLong: isLong, desc: desc, shortDesc: shortDesc });
      if (this.properties.expand) {
        this.showDesc();
      }
    }
  }
})
