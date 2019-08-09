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
        console.log('position: obs', newVal, oldVal, changedPath);
        this.setChecked(newVal);
      }
    }

  },

  data: {

    positions: [],
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
      const positions = this.data.positions;
      //console.log(2,positions);
      const position = positions[index];
     // console.log(3,position);
      this.setData({ realValue: position.id });

      const myEventDetail = {
        value: this.data.realValue
      }
      const myEventOption = {} // 触发事件的选项
      this.triggerEvent('positionchange', myEventDetail, myEventOption)
    },

    setChecked(id) {
      const positions = this.data.positions;
      var valueIndex = 0;
      for(let k in positions) {
        if (positions[k].id != id) continue;
        valueIndex = k;
      }
      this.setData({ valueIndex: valueIndex });
    },

    bindPositionChange(e) {
      const index = e.detail.value;
      const positions = this.data.positions;
      const position = positions[index];
      this.setData({ realValue: position.id });
    }

  },

  ready() {
    const self = this;
    const positions = teamConfig.getPositions();
    this.setData({ positions: positions });
  }

});