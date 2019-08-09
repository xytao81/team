import http from "../../utils/http.js";

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
      value: [
        {id: 110000, name: "北京"},
        {id: 110100, name: "北京"},
        {id: 110101, name: "东城"}
      ],
      observer: function(newVal, oldVal, changedPath) {
        // console.log('region obs', newVal, oldVal, changedPath);
        if (!newVal || !newVal[0]) {
          return console.error('新区域值无效:', newVal);
        }
        this.setCheckedIndexes();
      }
    },
    depth: {
      type: Number,
      value: 2
    }

  },

  data: {

    provinces: [],

    indexes: [0, 0, 0],
    regionArray: [ [],[],[] ]

  },

  methods: {
    
    show() {
      const self = this;
      self.setData({ show: true });
      self.setCheckedIndexes();
    },

    cancel() {
    },

    confirm(e) {
      const self = this;
      var newChecked = [];
      if (self.properties.depth == 2) {
        newChecked = [
          self.data.provinces[e.detail.value[0]],
          self.data.provinces[e.detail.value[0]].children[e.detail.value[1]]
        ];
      } else {
        newChecked = [
          self.data.provinces[e.detail.value[0]],
          self.data.provinces[e.detail.value[0]].children[e.detail.value[1]],
          self.data.provinces[e.detail.value[0]].children[e.detail.value[1]].children[e.detail.value[2]]
        ];
      }
      self.properties.checked = newChecked;
      const myEventDetail = {
        checked: newChecked
      } // detail对象，提供给事件监听函数
      const myEventOption = {} // 触发事件的选项
      self.triggerEvent('regionchange', myEventDetail, myEventOption);
    },

    setCheckedIndexes() {
      const self = this;
      if (!self.data.provinces.length) return [0, 0, 0];
      let checkedObject = self.properties.checked;
      if (!checkedObject || !checkedObject[0] || checkedObject[0].id == 0) {
        if (self.properties.depth == 2) {
          checkedObject = [ {id: 110000, name: "北京"}, {id: 110100, name: "北京"} ];
        } else {
          checkedObject = [ {id: 110000, name: "北京"}, {id: 110100, name: "北京"}, {id: 110101, name: "东城"} ];
        }
      }
      const provinceIndex = self.idToIndex(self.data.provinces, checkedObject[0].id);
      self.loadCities(checkedObject[0].id, function() {
        if (self.properties.depth == 2) {
          const cityIndex = self.idToIndex(self.data.provinces[provinceIndex].children, checkedObject[1].id);
          self.setData({ indexes: [provinceIndex, cityIndex] });
        } else {
          self.loadAreas(checkedObject[0].id, checkedObject[1].id, function() {
            const cityIndex = self.idToIndex(self.data.provinces[provinceIndex].children, checkedObject[1].id);
            const areaIndex = self.idToIndex(self.data.provinces[provinceIndex].children[cityIndex].children, checkedObject[2].id);
            self.setData({ indexes: [provinceIndex, cityIndex, areaIndex] });
          });
        }
      });
    },

    loadProvinces() {
      var self = this;
      let provinces = wx.getStorageSync('system_provinces');
      if (provinces) {
        self.data.provinces = provinces;
        if (self.properties.depth == 3) {
          self.setData({ regionArray: [provinces, [], []] });
        } else {
          self.setData({ regionArray: [provinces, []] });
        }
        return;
      } else {
        http.post('COMMON_API_ZONE_GETPROVINCE', {}, function (res) {
          wx.setStorageSync('system_provinces', res.info);
          self.data.provinces = res.info;
          if (self.properties.depth == 3) {
            self.setData({ regionArray: [res.info, [], []] });
          } else {
            self.setData({ regionArray: [res.info, []] });
          }
        });
      }
    },
    loadCities(provinceId, callback) {
      var self = this;
      let provinces = self.data.provinces;
      let provinceIndex = provinces.findIndex(item=>item.id == provinceId);
      if (provinceIndex < 0) {
        provinceId = 110000;
        provinceIndex = 0;
        // return console.error('省ID值无效:', provinceId);
      }
      // console.log('loadCitys', cities, cityId, cityIndex);
      if (provinces[provinceIndex].children && provinces[provinceIndex].children.length) {
        if (self.properties.depth == 2) {
          self.setData({ regionArray: [provinces, provinces[provinceIndex].children] });
        } else {
          self.setData({ regionArray: [provinces, provinces[provinceIndex].children, []] });
        }
        return callback ? callback() : null;
      }
      http.post('COMMON_API_ZONE_GETCITY', { province_id: provinceId }, function (res) {
        provinces[provinceIndex].children = res.info;
        self.data.provinces = provinces;
        if (self.properties.depth == 2) {
          self.setData({ regionArray: [provinces, provinces[provinceIndex].children] });
        } else {
          self.setData({ regionArray: [provinces, provinces[provinceIndex].children, []] });
        }
        if (callback) callback();
      });
    },
    loadAreas(provinceId, cityId, callback) {
      var self = this;
      let provinces = self.data.provinces;
      let provinceIndex = provinces.findIndex(item=>item.id == provinceId);
      if (provinceIndex < 0) {
        provinceIndex = 0;
        // return console.error('省ID值无效:', provinceId, provinces);
      }
      let cities = provinces[provinceIndex].children;
      let cityIndex = cities.findIndex(item=>item.id == cityId);
      if (cityIndex < 0) {
        cityIndex = 0;
        cityId = 110100;
        // return console.error('市ID值无效:', cityId, cities);
      }
      // console.log('loadAreas', cities, cityId, cityIndex);
      if (cities[cityIndex].children && cities[cityIndex].children.length) {
        self.setData({ regionArray: [provinces, cities, cities[cityIndex].children] });
        return callback ? callback() : null;
      }
      http.post('COMMON_API_ZONE_GETAREA', { city_id: cityId }, function (res) {
        cities[cityIndex].children = res.info;
        self.setData({
          provinces: provinces,
          regionArray: [provinces, cities, cities[cityIndex].children]
        });
        if (callback) callback();
      });
    },

    idToIndex(array, id) {
      if (!id) return 0;
      for(let k in array) {
        if(id == array[k].id) return k;
      }
      return 0;
    },

    bindColumnChange: function(e) {
      const self = this;
      // console.log('修改的列为', e.detail.column, '，值为', e.detail.value);
      // console.log(this.data.loadedProvinces[e.detail.value].name);
      if (e.detail.column == 0) { // 换省
        var provinceIndex = e.detail.value;
        self.loadCities(self.data.provinces[provinceIndex].id, function() {
          if (self.properties.depth == 2) {
            self.setData({ indexes: [provinceIndex, 0] });
          } else {
            self.loadAreas(self.data.provinces[provinceIndex].id, self.data.provinces[provinceIndex].children[0].id, function() {
              self.setData({ indexes: [provinceIndex, 0, 0] });
              console.log('hengheng');
            });
          }
        });
      }
      if (e.detail.column == 1) { // 换市
        var provinceIndex = self.data.indexes[0];
        var cityIndex = e.detail.value;
        if (self.properties.depth == 2) {
          self.setData({ indexes: [provinceIndex, cityIndex] });
        } else {
          self.loadAreas(self.data.provinces[provinceIndex].id, self.data.provinces[provinceIndex].children[cityIndex].id, function() {
            self.setData({ indexes: [provinceIndex, cityIndex, 0] });
          });
        }
      }
      if (e.detail.column == 2) { // 换区
        var provinceIndex = self.data.indexes[0];
        var cityIndex = self.data.indexes[1];
        var areaIndex = e.detail.value;
        self.setData({ indexes: [provinceIndex, cityIndex, areaIndex] });
      }
    },

  },

  created() {
    this.loadProvinces();
  }

});