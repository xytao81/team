// import map from './url_map'
import Crypto from './crypto.js'
import config from '../config/config.js'

const urlsConfig_aqm = {

  "LOGIN": "/account/api/team/login",
  "LOGIN_LEAGUE":"/account/api/account/login",
  "MY_TEAM":"/account/api/team/my",
  "JOIN_LEAGUE":"/league/api/league/league-in",
  "INVITE_LEAGUE":"/league/api/league/league-invite",
  "MY_MATCH": "/league/api/match/query-by-team",
  "MATCH_INFO": "/league/api/match/query-info",
  "GET_LINEUP":"/league/api/match/get-player",
  "GET_ALL_LINEUP":"/league/api/match/get-all-player",
  'ADD_ALL_PLAYER':'/league/api/match/add-all-player',
  'TEAM_JOIN':'/league/api/league/team-join',

  "WX_API_INDEX_GETSESSION": "/wx/api/index/get-session",

  "SCHEDULE_API_LIST":"/aqm/schedule/api/index/list",
  "SCHEDULE_API_LIST_BY_DAY":"/aqm/schedule/api/index/list_by_day",
  "SCHEDULE_API_MY_LIST":"/aqm/schedule/api/index/my_list",
  "SCHEDULE_API_DETAIL":"/schedule/api/index/detail", //来自赛事的接口
  "SCHEDULE_API_ADD":"/aqm/schedule/api/index/add",
  "SCHEDULE_API_EDIT":"/aqm/schedule/api/index/edit",
  "SCHEDULE_API_DELETE":"/aqm/schedule/api/index/delete",
  "SCHEDULE_API_GET_ENROLL_FIELDS":"/aqm/schedule/api/index/get_enroll_fields",
  "SCHEDULE_API_ENROLL_LIST": "/schedule/api/enroll/list",
  "SCHEDULE_API_ENROLL_DETAIL": "/schedule/api/enroll/detail",//来自赛事的接口
  "SCHEDULE_API_ENROLL_ENROLL": "/schedule/api/enroll/enroll",//来自赛事的接口
  "SCHEDULE_API_ENROLL_DELETE": "/aqm/schedule/api/enroll/delete",
  "SCHEDULE_API_ENROLL_OPERATE": "/aqm/schedule/api/enroll/operate",
  "SCHEDULE_API_ENROLL_SIGNIN": "/aqm/schedule/api/enroll/signin",
  "SCHEDULE_API_GET_POSTER":"/aqm/schedule/api/index/get_poster",
  "ACCOUNT_API_INDEX_DETAIL": "/aqm/account/api/index/detail",

};

const urlsConfig_campus = {};

// 获取用户token做为专属密钥
function getUserToken() {
  if (config.DEBUG && config.DEBUG_TOKEN ) {
    return config.DEBUG_TOKEN;
  }
  var app = getApp()
  let token= app ? app.globalData.user.info.token : '';
  // console.log(app, token, app.globalData.user.info.token)
  if (token.length == 0) token = config.DES_KEY;
  return token;
}

// post
function post(key, requestData, cb) {

  requestData["source"] = 'aiqiumi-team-wx';
  requestData["from"] = config.FROM;

  let token = getUserToken();
 
  let des_key = token ? token : config.DES_KEY;
  let des_iv = des_key.substr(0, 8);
  
  requestData.from = config.FROM;

  let realDataBuf = Crypto.encrypt(requestData, des_key, des_iv);

  let realKey = "";
  if (config.FROM == 'aqm') {
    realKey = urlsConfig_aqm[key];
  } else {
    realKey = urlsConfig_campus[key];
  }

  if (!realKey)
    return wx.showModal({ content: 'url key:' + key + '不存在', confirmText: '确定', showCancel: false });

  // console.info(key + ' Req:::', requestData, { token: token });
  wx.request({
    url: config.LEAGUE_BASE_URL + realKey,
    method: 'POST',
    data: { DATA: realDataBuf }, //参数为键值对字符串
    header: { token: token },
    success: function (res) {
      if (res.statusCode != 200) {
        return console.error(realKey, res.statusCode+' Error:::', res, ' Req:::', requestData);
      }
      if (res.data.DATA) {
        // console.log(res.data.DATA)
        var d = Crypto.decrypt(res.data.DATA, des_key, des_iv);
        var obj = JSON.parse(d);
      } else {
        var obj = res.data;
      }
      console.info(realKey, ' Req:::', requestData, { token: token }, '  Res:::', obj);
      if (cb) cb(obj);

    },
    fail: function (parameter) {
      console.error('http fail:::', parameter, ' Req:::', requestData);
      if (cb) cb(500, parameter.title, null);
    }

  });
}

function uploadFile(path, callback) {
  wx.uploadFile({
    url: config.BASE_URL + '/aqm/tool/api/upload/file',
    // url: 'http://192.168.0.21:3000/tool/api/upload/file',
    filePath: path,
    name: 'file',
    formData: {},
    success(res) {
      console.log('upload result', path, res);
      if (res.statusCode != 200) {
        if (callback) callback(res);
        return;
      }
      var obj = JSON.parse(res.data);
      if (callback) callback(obj.result);
    }
  });
}
function uploadFiles(paths, callback, urls = []) {
  if (!paths || paths.length == 0) return [];
  uploadFile(paths[urls.length], function (url) {
    urls.push(url);
    if (paths.length == urls.length) {
      return callback(urls);
    } else {
      return uploadFiles(paths, callback, urls);
    }
  });
}

function uploadPhoto(paths, callback) {
  if (!paths || paths.length == 0) return [];
  if ( !Array.isArray(paths) ) {
    paths = [paths];
  }
  uploadFiles(paths, function(urls) {
    if (callback) callback(urls);
  });
}

export default {
  post,
  uploadPhoto
}