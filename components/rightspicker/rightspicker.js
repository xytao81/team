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
        console.log('rights: obs', newVal, oldVal, changedPath);
        this.setChecked(newVal);
      }
    }

  },

  data: {

    rights: [],
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
      const rights = this.data.rights;
      const selected = rights[index];
      this.setData({ realValue: selected.id });

      const myEventDetail = {
        value: this.data.realValue
      }
      const myEventOption = {} // 触发事件的选项
      this.triggerEvent('rightschange', myEventDetail, myEventOption)
    },

    setChecked(id) {
      const rights = this.data.rights;
      var valueIndex = 0;
      for(let k in rights) {
        if (rights[k].id != id) continue;
        valueIndex = k;
      }
      this.setData({ valueIndex: valueIndex });
    }

  },

  ready() {
    const self = this;
    const rights = teamConfig.getRightsList();
    this.setData({ rights: rights });
  }

});