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
        console.log('degree: obs', newVal, oldVal, changedPath);
        this.setChecked(newVal);
      }
    }

  },

  data: {

    degrees: [],
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
      const degrees = this.data.degrees;
      const degree = degrees[index];
      this.setData({ realValue: degree.id });

      const myEventDetail = {
        value: this.data.realValue
      }
      const myEventOption = {} // 触发事件的选项
      this.triggerEvent('degreechange', myEventDetail, myEventOption)
    },

    setChecked(id) {
      const degrees = this.data.degrees;
      var valueIndex = 0;
      for(let k in degrees) {
        if (degrees[k].id != id) continue;
        valueIndex = k;
      }
      this.setData({ valueIndex: valueIndex });
    },

  },

  ready() {
    const self = this;
    const degrees = teamConfig.getDegrees();
    this.setData({ degrees: degrees });
  }

});