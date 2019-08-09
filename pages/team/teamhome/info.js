import http from "../../../utils/http.js";
import teamConfig from "../../../utils/team_config.js";
import config from '../../../config/config.js'

const app = getApp();

Page({

  // 页面的初始数据
  data: {

    teampLogoPath: '',
    teamRights: 0,

    types: teamConfig.getTypes(),
    typeIndex: 0,

    loadedProvinces: [],
    loadedCitys: [],
    loadedAreas: [],
    regionArray: [],
    regionIndexes: [],
    regionString: '',

    editData: {
      logoUrl: '',
      name: '',
      color: [{
        player: {
          shirt: {
            id: 0,
            color: "https://team-v2.oss-cn-hangzhou.aliyuncs.com/color/%E6%97%A0.png",
            name: ""
          },
          shorts: {
            id: 0,
            color: "https://team-v2.oss-cn-hangzhou.aliyuncs.com/color/%E6%97%A0.png",
            name: ""
          },
          shoes: {
            id: 0,
            color: "https://team-v2.oss-cn-hangzhou.aliyuncs.com/color/%E6%97%A0.png",
            name: ""
          }
        },
        goalkeeper: {
          shirt: {
            id: 0,
            color: "https://team-v2.oss-cn-hangzhou.aliyuncs.com/color/%E6%97%A0.png",
            name: ""
          },
          shorts: {
            id: 0,
            color: "https://team-v2.oss-cn-hangzhou.aliyuncs.com/color/%E6%97%A0.png",
            name: ""
          },
          shoes: {
            id: 0,
            color: "https://team-v2.oss-cn-hangzhou.aliyuncs.com/color/%E6%97%A0.png",
            name: ""
          }
        }
      }, {
        player: {
          shirt: {
            id: 0,
            color: "https://team-v2.oss-cn-hangzhou.aliyuncs.com/color/%E6%97%A0.png",
            name: ""
          },
          shorts: {
            id: 0,
            color: "https://team-v2.oss-cn-hangzhou.aliyuncs.com/color/%E6%97%A0.png",
            name: ""
          },
          shoes: {
            id: 0,
            color: "https://team-v2.oss-cn-hangzhou.aliyuncs.com/color/%E6%97%A0.png",
            name: ""
          }
        },
        goalkeeper: {
          shirt: {
            id: 0,
            color: "https://team-v2.oss-cn-hangzhou.aliyuncs.com/color/%E6%97%A0.png",
            name: ""
          },
          shorts: {
            id: 0,
            color: "https://team-v2.oss-cn-hangzhou.aliyuncs.com/color/%E6%97%A0.png",
            name: ""
          },
          shoes: {
            id: 0,
            color: "https://team-v2.oss-cn-hangzhou.aliyuncs.com/color/%E6%97%A0.png",
            name: ""
          }
        }
      },],
      region: [{
        id: 110000,
        name: '北京'
      },
      {
        id: 110100,
        name: '北京'
      }
      ],

      type: 0,

      familyUrl: '',
      intro: ''
    }
  },

  loadRights(callback) {
    const self = this;
    wx.showLoading();
    http.post('TEAM_API_PLAYER_MYRIGHTS', { team_id: self.data.teamId }, function (res) {
      wx.hideLoading();
      if (res.code != 200) {
        return wx.showModal({ content: res.err, confirmText: '确定', confirmColor: '#00a7f2', showCancel: false });
      }
      const rights = res.info.rights ? res.info.rights : 0;
      self.setData({ teamRights: rights });
      if (callback) callback();
    });
  },


  // 生命周期函数--监听页面加载
  onLoad(options) {
    this.setData({
      teamId: options.team_id
    })
  },
  onReady: function () {
    let self = this;
    self.loadRights(function () {
      loadData(self);
    });
  }

});

function loadData(self) {

  wx.showLoading();
  http.post('TEAM_API_INDEX_DETAIL', {
    id: self.data.teamId
  }, function (res) {
    wx.hideLoading();
    if (res.code != 200) {
      return wx.showModal({ content: res.err, confirmText: '确定', confirmColor: '#00a7f2', showCancel: false });
    }
    var data = self.data.editData;
    data["id"] = res.info.id;
    data["logoUrl"] = res.info.logo;
    data["name"] = res.info.name;
    data["type"] = res.info.type;
    data["region"] = [
      { id: res.info.province_id, name: res.info.province_name },
      { id: res.info.city_id, name: res.info.city_name }
    ]
    data["intro"] = res.info.desc;
    data["familyUrl"] = res.info.photo;

    if (res.info.colors) {
      data.color = res.info.colors;
    }

    data["contact_name"] = res.info.contact_name;
    data["contact_phone"] = res.info.contact_phone;
    data["contact_wx"] = res.info.contact_wx;

    self.setData({ editData: data })
  });
}