// components/inputModal.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    title: {
      type: String,
      value: 'default value', //不存在此属性时
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    hidden: true,
    value: "",
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onShow:function(value){
      this.setData({value:value,hidden:false})
    },
    cancel: function() {
      this.setData({ hidden: true });
      this.triggerEvent('cancel', { value: true });
    },
    bindInputChange:function(e){
      this.setData({ value: e.detail.value})
    },
    formSubmit:function(e){
      console.log("hindleConfirm",e)
      this.setData({hidden:true});
      console.log(this.data.value)
      this.triggerEvent('onInpueDone', { value: this.data.value, form_id: e.detail.formId});
    }
  }
})
