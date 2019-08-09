import http from "../../utils/http.js";
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
      type: Object,
      value: {
        player: {
          shirt: { id: 0, color: "https://team-v2.oss-cn-hangzhou.aliyuncs.com/color/%E6%97%A0.png", name: "" },
          shorts: { id: 0, color: "https://team-v2.oss-cn-hangzhou.aliyuncs.com/color/%E6%97%A0.png", name: "" },
          shoes: { id: 0, color: "https://team-v2.oss-cn-hangzhou.aliyuncs.com/color/%E6%97%A0.png", name: "" }
        },
        goalkeeper: {
          shirt: { id: 0, color: "https://team-v2.oss-cn-hangzhou.aliyuncs.com/color/%E6%97%A0.png", name: "" },
          shorts: { id: 0, color: "https://team-v2.oss-cn-hangzhou.aliyuncs.com/color/%E6%97%A0.png", name: "" },
          shoes: { id: 0, color: "https://team-v2.oss-cn-hangzhou.aliyuncs.com/color/%E6%97%A0.png", name: "" }
        }
      },
      observer: function(newVal, oldVal, changedPath) {
        if (!newVal) {
          return console.error('新球衣颜色值无效:', newVal);
        }
        // console.log('obs', newVal, oldVal, changedPath);
        this.setCheckedIndexes();
      }
    }

  },

  data: {

    colors: [],

    playerIndexes: [],
    goalkeeperIndexes: []

  },

  methods: {

    show() {
      const self = this;
      self.setData({ show: true });
      self.setCheckedIndexes();
    },

    cancel() {
    },

    confirm() {
      const self = this;
      const newChecked = {
        player: {
          shirt: self.data.colors[self.data.playerIndexes[0]],
          shorts: self.data.colors[self.data.playerIndexes[1]],
          shoes: self.data.colors[self.data.playerIndexes[2]]
        },
        goalkeeper: {
          shirt: self.data.colors[self.data.goalkeeperIndexes[0]],
          shorts: self.data.colors[self.data.goalkeeperIndexes[1]],
          shoes: self.data.colors[self.data.goalkeeperIndexes[2]]
        }
      };
      self.properties.checked = newChecked;
      const myEventDetail = {
        checked: newChecked
      } // detail对象，提供给事件监听函数
      const myEventOption = {} // 触发事件的选项
      this.triggerEvent('clotheschange', myEventDetail, myEventOption)
    },

    bindPlayerChange(e) {
      this.data.playerIndexes = e.detail.value;
    },
    bindGoalkeeperChange(e) {
      this.data.goalkeeperIndexes = e.detail.value;
    },

    loadColors() {
      const self = this;
      let colors = wx.getStorageSync('system_colors');
      if (colors) {
          self.setData({ colors: colors });
          return;
      }
      http.post("COMMON_API_OTHER_COLOR", {}, function (res) {
        if (res.code != 200) {
          return ;
        }
        wx.setStorageSync('system_colors', res.info);
        self.setData({ colors: res.info });
      });
    },

    // 将颜色对象转换成插件需要的索引值
    color2index(color) {
      if (!color) return 0;
      const colors = this.data.colors; 
      for(let k in this.data.colors) {
        if(color.id == colors[k].id) return k;
      }
      return 0;
    },

    setCheckedIndexes() {
      let checkedObject = this.properties.checked;
      if (!checkedObject) return { playerIndexes: [0,0,0], goalkeeperIndexes: [0,0,0] };
      const playerIndexes = [
        this.color2index(checkedObject.player.shirt),
        this.color2index(checkedObject.player.shorts),
        this.color2index(checkedObject.player.shoes)
      ];
      const goalkeeperIndexes = [
        this.color2index(checkedObject.goalkeeper.shirt),
        this.color2index(checkedObject.goalkeeper.shorts),
        this.color2index(checkedObject.goalkeeper.shoes)
      ];
      this.setData({ playerIndexes: playerIndexes, goalkeeperIndexes: goalkeeperIndexes });
    },

    hasSelectOne(indexes) {
      for (let k in indexes) {
        if (indexes[k] != '0') return true;
      }
      return false;
    },
    hasSelectAll(indexes) {
      for (let k in indexes) {
        if (indexes[k] == '0') return false;
      }
      return true;
    },
    
  },

  attached() {
    this.loadColors();
  }

});