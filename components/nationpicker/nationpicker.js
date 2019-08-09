import teamConfig from "../../utils/team_config.js";
Component({

  options: {
    addGlobalClass: true,
  },

  properties: {

    show: {
      type: Boolean,
      value: false
    },
    value: {
      type: Number,
      value: 1,
      observer: function(newVal, oldVal, changedPath) {
        console.log('1', newVal, oldVal, changedPath);
        this.setChecked(newVal);
      }
    }

  },

  data: {
    allNations: [],
    nations:[],
    indexes: [0],
    realValue: ''

  },

  methods: {
    
    show() {
      this.setData({ 
        show: true 
      });
    },

    cancel() {
    },

    confirm(e) {
      const myEventDetail = {
        value: this.data.realValue
      }
      const myEventOption = {} // 触发事件的选项
      this.triggerEvent('nationchange', myEventDetail, myEventOption)
    },

    setChecked(id) {
      const nations = this.data.nations;
      var valueIndex = 0;
      for(let k in nations) {
        if (nations[k].id != id) continue;
        valueIndex = k;
      }
      this.setData({ valueIndex: valueIndex });
    },

    nationChange(e) {
      console.log('xuanze', e);
      const index = e.detail.value[0];
      const nations = this.data.nations;
      const nation = nations[index];
      if (!nation) {
        return;
      }
      this.data.realValue = nation.text;
      
    },

    qChange(e) {
      const q = e.detail.value;
      console.log('q', q);
      this.filterNations(q);
    },
    filterNations(q) {
      if (!q) {
        const nations=teamConfig.getNationality();
        const currentIndex = nations.length > 5 ? 5 : nations.length-1;
        this.setData({ nations: this.data.allNations });
        this.setData({ indexes: [currentIndex] });
         return;
      }
      const nations = this.data.allNations.filter(item=>{
        // console.log('查找对比', item.text, q, item.text.indexOf(q) >= 0);
          return item.text.indexOf(q) >= 0;
      });
      console.log('last', nations, this.data.allNations);
      this.setData({ nations: nations });
      if (nations.length == 0) return;
      const currentIndex = nations.length > 5 ? 5 : nations.length-1;
      this.setData({ indexes: [currentIndex] });
      this.selectNationByIndex(currentIndex);
    },

    selectNationByIndex(index) {
      const nations = this.data.nations;
      const nation = nations[index];
      this.data.realValue = nation.text;
      
    }

  },

  ready() {
    const self = this;
    const allNations = teamConfig.getNationality();
    const nations=teamConfig.getNationality();
    this.data.allNations = allNations;
    this.setData({ nations: nations });
    this.filterNations('');
    const currentIndex = nations.length > 5 ? 5 : nations.length-1;
    this.setData({ indexes: [currentIndex] });
    this.selectNationByIndex(currentIndex);
  }

});