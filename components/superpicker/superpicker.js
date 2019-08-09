Component({

  properties: {

    show: {
      type: Boolean,
      value: false
    }

  },

  data: {},

  methods: {

    close() {
      this.setData({ show: !this.properties.show });
    },

    cancel() {
      this.close();
      const myEventDetail = {} // detail对象，提供给事件监听函数
      const myEventOption = {} // 触发事件的选项
      this.triggerEvent('cancel', myEventDetail, myEventOption)
    },

    confirm() {
      this.close();
      const myEventDetail = {} // detail对象，提供给事件监听函数
      const myEventOption = {} // 触发事件的选项
      this.triggerEvent('confirm', myEventDetail, myEventOption)
    }

  }

});