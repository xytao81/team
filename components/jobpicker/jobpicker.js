import teamConfig from "../../utils/team_config.js";
import utils from "../../utils/index.js";

Component({

  options: {
    addGlobalClass: true,
  },

  properties: {

    show: {
      type: Boolean,
      value: false
    },
    checked: {
      type: Array,
      value: [],
      observer: function(newVal, oldVal, changedPath) {
        // console.log('obs', newVal, oldVal, changedPath);
        this.setCheckedArray();
      }
    }

  },

  data: {

    jobs: []

  },

  methods: {
    
    show() {
      this.setData({ show: true });
    },

    cancel() {
    },

    confirm() {
      var checkedArray = [];
      const jobs = this.data.jobs;
      for(let k in jobs) {
        let jobId = jobs[k].id;
        for(let k2 in jobs[k].children) {
          let subJobId = jobs[k].children[k2].id;
          if (jobs[k].children[k2].checked) { // 此项被选中
            checkedArray.push({ job: jobId, sub_job: subJobId, job_name: jobs[k].name, sub_job_name: jobs[k].children[k2].name });
          }
        }
      }
      const myEventDetail = {
        checked: checkedArray
      }
      const myEventOption = {} // 触发事件的选项
      this.triggerEvent('jobchange', myEventDetail, myEventOption)
    },

    setCheckedArray() {
      let checkedArray = this.properties.checked;
      let jobs = this.data.jobs;
      for(let k in jobs) {
        let jobId = jobs[k].id;
        const checkedOne = checkedArray.find(item => item.job == jobId);
        if (!checkedOne) continue; 
        for(let k2 in jobs[k].children) {
          let subJobId = jobs[k].children[k2].id;
          jobs[k].children[k2].checked = (subJobId == checkedOne.sub_job);
        }
      }
      this.setData({ jobs: jobs });
    },

    checkboxChange(e) {
      const jobId = e.target.dataset.jobid;
      const newId = e.detail.value[1] ? e.detail.value[1] : e.detail.value[0];

      const jobs = this.data.jobs;
      for(let k in jobs) {
        if (jobs[k].id != jobId) continue;
        for(let k2 in jobs[k].children) {
          jobs[k].children[k2].checked = jobs[k].children[k2].id == newId;
        }
      }
      this.setData({ jobs: jobs });
    }

  },

  ready() {
    const self = this;
    var jobs = teamConfig.getJobs();
    for(let k in jobs) {
      jobs[k].children = teamConfig.getSubJobs( jobs[k].id );
    }
    this.setData({ jobs: jobs });
    this.setCheckedArray();
  }

});