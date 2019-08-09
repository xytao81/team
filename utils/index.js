import http from './http.js';
import teamConfig from './team_config.js';

// const Promise = require('./Promise');

const app = getApp();

// 解密微信数据
function wxDecrypt(buf, iv) {
  return new Promise((resolve, reject) => {
    http.post('WX_API_INDEX_DECODE', { app_id: app.globalData.appid, session_key: app.globalData.sessionKey, iv: iv, buf: buf }, function (res) {
      console.log(res);
      if (res.code != 200) {
        reject(res)
      }
      resolve(res.info);
    });
  });
}

// login by token
function loginByToken(token, callback) {
  http.post('ACCOUNT_API_INDEX_LOGIN_BY_TOKEN', { token: token }, function (res) {
    if (res.code != 200) {
      if (callback) callback(res);
      return;
    }
    if (app.globalData.user.info.uid != res.info.uid) {
      app.globalData.user.info = res.info;
      wx.removeStorageSync('currentTeamId');
      wx.setStorageSync('updateMyTeams', 1);
    }

    if (callback) callback(res);
  });

}

// checkLogin
function checkLogin() {
  if (app.globalData.user.info.token != '') return;
  return wx.navigateTo({ url: '/pages/login' });
}

function gotoUrl(e) {
  const url = e.target.dataset.url;
  return wx.navigateTo({ url: url });
}

function getValueFromEnrollFields(enrollFields, jobId = 0) {
  let dict = {};
  for (let k in enrollFields) {
    for (let k2 in enrollFields[k]) {
      let field = enrollFields[k][k2];
      if (field.is_select) {
        dict[field.key] = field.value;
        if (field.key == 'cert_type') {
          dict[field.key] = [' ', '身份证', '护照','其他'][field.value];
        }
        if (field.key == 'position') {
          dict[field.key] = teamConfig.getPosition(field.value).name;
        }
        if (field.key == 'sub_rights' && jobId) {
          let subJob = teamConfig.getSubJob(jobId, field.value);
          dict[field.key] = subJob ? subJob.name : '';
        }
        if (field.key == 'education') {
          let degree = teamConfig.getDegree(field.value);
          dict[field.key] = degree ? degree.name : '';
        }
        if (field.key == 'address') {
          dict[field.key] = field.value[0].name ? field.value[0].name + '-' + field.value[1].name : field.value;
        }
        if (field.key == 'marriage') {
          dict[field.key] = ['已婚', '未婚'][field.value] ? ['已婚', '未婚'][field.value] : '';
        }
        if (field.key == 'emergency_relationship') {
          dict[field.key] = ['父亲','母亲','亲属','朋友','同学','其他'][field.value] ? ['父亲','母亲','亲属','朋友','同学','其他'][field.value] : '';
        }
        if (field.key == 'sex') {
          dict[field.key] = [' ', '男', '女'][field.value] ? [' ', '男', '女'][field.value] : '';
        }
      }
    }
  }
  return dict;
}

function getEnrollFieldsFromFields(enrollFields, fields, jobId = 0) {
  for (let k in enrollFields) {
    for (let k2 in enrollFields[k]) {
      let field = enrollFields[k][k2];
      if (!field.is_select) continue;
      let field2 = fields.find(item => item.key == field.key);
      if (field2) {
        field.value = field2.value;
      }
      if (field.type == 'number') {
        field.value = parseInt(field.value);
      }
      if (field.key == 'sub_rights' && jobId) {
        let subJob = teamConfig.getSubJobByName(jobId, field.value);
        field.value = subJob ? subJob.id : '';
      }
      if (field.key == 'cert_type') {
        field.value = [' ', '身份证', '护照','其它'].findIndex(item => item == field.value);
      }
      if (field.key == 'position') {
        let position = teamConfig.getPositionByName(field.value);
        field.value = position ? position.id : field.value;
      }
      if (field.key == 'sex') {
        field.value = [' ', '男', '女'].findIndex(item => item == field.value);
      }
      if (field.key == 'marriage') {
        field.value = ['已婚', '未婚'].findIndex(item => item == field.value);
      }
      if (field.key == 'education') {
        let degree = teamConfig.getDegreeByName(field.value);
        field.value = degree ? degree.id : field.value;
      }
      if (field.key == 'emergency_relationship') {
        let idx = ['父亲','母亲','亲属','朋友','同学','其他'].findIndex(item => item == field.value);
        field.value = (idx >= 0) ? idx : 5;
      }
    }
  }
  return enrollFields;
}

export default {
  wxDecrypt,
  loginByToken,
  checkLogin,
  gotoUrl,
  getValueFromEnrollFields,
  getEnrollFieldsFromFields
}
