// components/fieldpicker/fieldpicker.js
Component({
  /**
   * 组件的属性列表
   */
  options: {
    addGlobalClass: true,
  },

  properties: {
    show: {
      type: Boolean,
      value: false
    },
    content:{
      type: Object,
      value: null,
      observer: function(newVal) {
        //Object.keys(newVal).length==0判断是不是空对象
        if (Object.keys(newVal).length==0) return;
        console.log('fieldpicker obs:::', newVal);
        this.setData({ content2: newVal });
      }

    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    content2: null
  },

  /**
   * 组件的方法列表
   */
  methods: {
    show() {
      this.setData({ show: true });
    },
    cancel() {
    },
    confirm() {
      const content2 = this.data.content2;
      const myEventDetail = {
        content: content2
      }
      const myEventOption = {} // 触发事件的选项
      this.triggerEvent('fieldchange', myEventDetail, myEventOption)
    },
    onFieldselectChange(e){
      console.log('收到子组件的checkbox的值：：：：：',e.detail.value );
      this.setData({ content2: e.detail.value });
  },
    
  }
})
