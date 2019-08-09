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
        if (!newVal) {
          return console.warn('民族不合法:', newVal);
        }
        console.log('nationality: obs', newVal, oldVal, changedPath);
        this.setChecked(newVal);
      }
    }

  },

  data: {

    nationalities: [],
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
      const nationalities = this.data.nationalities;
      const nationality = nationalities[index];
      this.setData({ realValue: nationality.name });

      const myEventDetail = {
        value: this.data.realValue
      }
      const myEventOption = {} // 触发事件的选项
      this.triggerEvent('nationalitychange', myEventDetail, myEventOption)
    },

    setChecked(newVal) {
      const isNum = Number.isFinite(Number.parseInt(newVal));

      const nationalities = this.data.nationalities;
      var valueIndex = 0;
      for(let k in nationalities) {
        if (isNum) {
          if (nationalities[k].id != newVal) continue;
        } else {
          if (nationalities[k].name != newVal) continue;
        }
        valueIndex = k;
        break;
      }
      this.setData({ valueIndex: valueIndex });
    },

  },

  ready() {
    const self = this;
    const nationalities = teamConfig.getNationalities();
    this.setData({ nationalities: nationalities });
  }

});