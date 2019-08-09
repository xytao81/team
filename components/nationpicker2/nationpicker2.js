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
    

    nationality: [],
    valueIndex: 0,
    realValue: ''

  },

  methods: {
    
    show() {
      this.setData({ show: true });
    },

    cancel() {
    },

    confirm(e) {
      const index = e.detail.value;
      const nationality = this.data.nationality;
      const nation = nationality[index];
      this.setData({ realValue: nation.text });

      const myEventDetail = {
        value: this.data.realValue
      }
      const myEventOption = {} // 触发事件的选项
      this.triggerEvent('nationchange', myEventDetail, myEventOption)
    },

    setChecked(id) {
      const nationality = this.data.nationality;
      var valueIndex = 0;
      for(let k in nationality) {
        if (nationality[k].id != id) continue;
        valueIndex = k;
      }
      this.setData({ valueIndex: valueIndex });
    },

    bindNationalChange(e) {
      const index = e.detail.value;
      const nationality = this.data.nationality;
      const nation = nationality[index];
      this.setData({ realValue: nation.id });
    }

  },

  ready() {
    const self = this;
    const nationality = teamConfig.getNationality();
    this.setData({ nationality: nationality });
  }

});