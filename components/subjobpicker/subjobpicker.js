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
    job: {
      type: Number,
      value: 0,
      observer: function(newVal, oldVal, changedPath) {
        console.log('job: obs', newVal, oldVal, changedPath);
        const subJobs = teamConfig.getSubJobs(newVal);
        this.setData({ subJobs: subJobs });
      }
    },
    value: {
      type: Number,
      value: 1,
      observer: function(newVal, oldVal, changedPath) {
        console.log('subjob: obs', newVal, oldVal, changedPath);
        this.setChecked(newVal);
      }
    }

  },

  data: {

    subJobs: [],
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
      const subJobs = this.data.subJobs;
      const subJob = subJobs[index];
      this.setData({ realValue: subJob.id });

      const myEventDetail = {
        value: this.data.realValue
      }
      const myEventOption = {} // 触发事件的选项
      this.triggerEvent('subjobchange', myEventDetail, myEventOption)
    },

    setChecked(id) {
      const subJobs = this.data.subJobs;
      var valueIndex = 0;
      for(let k in subJobs) {
        if (subJobs[k].id != id) continue;
        valueIndex = k;
      }
      this.setData({ valueIndex: valueIndex });
    }

    // bindPositionChange(e) {
    //   const index = e.detail.value;
    //   const subJobs = this.data.subJobs;
    //   const subJob = subJobs[index];
    //   this.setData({ realValue: subJobs.id });
    // }

  },

  ready() {
    const self = this;
  }

});