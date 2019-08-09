// components/fieldselect/fieldselect.js
Component({
  /**
   * 组件的属性列表
   */
  options: {
    addGlobalClass: true,
  },
  properties: {
    content:{
      type: Object,
      value: null,
      observer: function(newVal) {
        //Object.keys(newVal).length==0判断是不是空对象
        if (Object.keys(newVal).length==0) return;
        this.setData({ enrollFields2: newVal});
      }

    }
  },

  /**
   * 组件的初始数据
   */
  data: {

    enrollFields:{},
    enrollFields2: {},
    
    enrollFieldsTitles: {
      'person_info': { text: '个人信息', count: 0 },
      'size': { text: '身材鞋码', count: 0 },
      'work': { text: '工作经历', count: 0 },
      'education': { text: '教育经历', count: 0 },
      'contact': { text: '紧急联系人', count: 0 },
      'tqi': { text: '资格条件', count: 0 }
    },

  },

  /**
   * 组件的方法列表
   */
  methods: {
    checkboxChange(e){
      console.log('checkbox发生change事件，携带value值为：', e.detail.value,e)
      const idx = e.currentTarget.dataset.idx;
      const arr = e.detail.value;
      // this.setData({checkValue:e.detail})
      let enrollFields = this.data.enrollFields2;
      let fieldList = enrollFields[idx];
      
      for (let k in fieldList) {
        const arrIndex = arr.findIndex(item => item == k);
        console.log('fieldList:::::::',fieldList,arrIndex);
        fieldList[k].is_select = (arrIndex >= 0) ? true : false;
      }
      this.setData({ 'enrollFields2': enrollFields });
          const myEventDetail = {
              value: enrollFields
          }
          const myEventOption = {} // 触发事件的选项
          this.triggerEvent('fieldselectchange', myEventDetail, myEventOption);
      
    }
    // selectField(e){
    //   // console.log("选择的字段：",e);
    //   const idx = e.currentTarget.dataset.idx;
    //   const idx2 = e.currentTarget.dataset.idx2;
    //   let enrollFields = this.data.enrollFields2;
    //   console.log('enrollFields',enrollFields);
    //   const field = enrollFields[idx][idx2];
    //   console.log('field',field);
    //   field.is_select = !field.is_select;
    //   this.setData({ 'this.data.enrollFields': enrollFields });
    //   const myEventDetail = {
    //       value: enrollFields
    //   }
    //   const myEventOption = {} // 触发事件的选项
    //   this.triggerEvent('fieldselectchange', myEventDetail, myEventOption)


    // },
    
  },
  onLoad(){

  }


})
