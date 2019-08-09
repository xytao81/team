// import map from './url_map'
import Crypto from './crypto.js'
import config from '../config/config.js'

const urlsConfig_aqm = {
  "COMMON_API_ZONE_GETPROVINCE": "/aqm/common/api/zone/get-province",
  "COMMON_API_ZONE_GETCITY": "/aqm/common/api/zone/get-city",
  "COMMON_API_ZONE_GETAREA": "/aqm/common/api/zone/get-area",
  "COMMON_API_OTHER_COLOR": "/aqm/common/api/other/get-color",
  "COMMON_API_ZONE_GEOCODER": "/aqm/common/api/zone/geocoder",

  "COMMON_API_AD_AD1":"/aqm/common/api/ad/ad1",

  "COMMON_API_HELP_LIST": "/aqm/common/api/help/list",
  "COMMON_API_HELP_DETAIL": "/aqm/common/api/help/detail",

  "WX_API_INDEX_GETSESSION": "/wx/api/index/get-session",
  "WX_API_INDEX_DECODE": "/wx/api/index/decode",

  "ACCOUNT_API_INDEX_GETCODE": "/aqm/account/api/index/get-code",
  "ACCOUNT_API_INDEX_LOGIN": "/aqm/account/api/index/login",
  "ACCOUNT_API_INDEX_LOGIN_BY_TOKEN": "/aqm/account/api/index/login-by-token",
  "ACCOUNT_API_INDEX_FINISH":"/aqm/account/api/index/finish",
  "ACCOUNT_API_INDEX_LOGOUT": "/aqm/account/api/index/logout",
  "ACCOUNT_API_INDEX_DETAIL": "/aqm/account/api/index/detail",
  "ACCOUNT_API_INDEX_DETAIL2": "/aqm/account/api/index/detail_v2",
  "ACCOUNT_API_INDEX_SETINFO": "/aqm/account/api/index/set-info",
  "ACCOUNT_API_INDEX_SETINFO2": "/aqm/account/api/index/set_v2",
  "ACCOUNT_API_INDEX_REGISTER": "/aqm/account/api/index/register",
  "ACCOUNT_API_INDEX_SET_PASSWORD": "/aqm/account/api/index/set-password",
  "ACCOUNT_API_INDEX_CHANGE_PASSWORD": "/aqm/account/api/index/change-password",
  "ACCOUNT_API_INDEX_FORGET_USERNAME": "/aqm/account/api/index/forget-username",
  "ACCOUNT_API_INFO_GET_EDUCATION": "/aqm/account/api/info/get-education",
  "ACCOUNT_API_INFO_SET_EDUCATION": "/aqm/account/api/info/set-education",
  "ACCOUNT_API_INFO_REMOVE_EDUCATION": "/aqm/account/api/info/remove-education",
  "ACCOUNT_API_INFO_EDUCATION_DETAIL": "/aqm/account/api/info/education-detail",
  "ACCOUNT_API_INFO_GET_WORK": "/aqm/account/api/info/get-work",
  "ACCOUNT_API_INFO_SET_WORK": "/aqm/account/api/info/set-work",
  "ACCOUNT_API_INFO_REMOVE_WORK": "/aqm/account/api/info/remove-work",
  "ACCOUNT_API_INFO_WORK_DETAIL": "/aqm/account/api/info/work-detail",

  "ACCOUNT_API_INFO_GET_CONTACTS": "/aqm/account/api/info/get-contacts",
  "ACCOUNT_API_INFO_SET_CONTACTS": "/aqm/account/api/info/set-contacts",
  "ACCOUNT_API_INFO_REMOVE_CONTACTS": "/aqm/account/api/info/remove-contacts",
  "ACCOUNT_API_INFO_CONTACTS_DETAIL": "/aqm/account/api/info/contacts-detail",

  "ACCOUNT_API_INDEX_SIZE_GET": "/aqm/account/api/info/get-sizes",
  "ACCOUNT_API_INDEX_SIZE_SET": "/aqm/account/api/info/set-sizes",

  "ACCOUNT_API_INDEX_ADD_WX_FORM_ID": "/aqm/account/api/index/add_wx_form_id",

  "PAY_API_PRICE_GET_GOODS": "/aqm/pay/api/price/get-goods",
  "PAY_API_PRICE_CALCULATE": "/aqm/pay/api/price/calculate",
  "PAY_API_COUPON_TOTAL": "/aqm/pay/api/coupon/total",
  "PAY_API_COUPON_GET_REMAIN_LIST": "/aqm/pay/api/coupon/get-remain-list",
  "PAY_API_PAY_PURCHASE": "/aqm/pay/api/pay/purchase",
  "PAY_API_PAY_PREPAY": "/aqm/pay/api/pay/prepay",
  "PAY_API_PAY_CANCEL_ORDER": "/aqm/pay/api/pay/cal-order",
  "PAY_API_PAY_GET_ORDER_LIST": "/aqm/pay/api/coupon/get-order-list",
  "PAY_API_PAY_GET_ORDER_STATISTICS": "/aqm/pay/api/pay/get-order-statistics",
  "PAY_API_PAY_GET_MEAL_RESULT": "/aqm/pay/api/pay/get-meal-result",
  "PAY_API_PAY_GET_MEAL": "/aqm/pay/api/pay/get-meal",

  "TEAM_API_INDEX_CREATE": "/aqm/team/api/index/create",
  "TEAM_API_INDEX_EDIT": "/aqm/team/api/index/edit",
  "TEAM_API_INDEX_DETAIL": "/aqm/team/api/index/detail",
  "TEAM_API_INDEX_SEARCH": "/aqm/team/api/index/search",
  "TEAM_API_INDEX_MY": "/aqm/team/api/index/my",
  "TEAM_API_INDEX_STATISTICS": "/aqm/team/api/index/statistics",

  "TEAM_API_NOTICE_ADD": "/aqm/team/api/notice/add",
  "TEAM_API_NOTICE_EDIT": "/aqm/team/api/notice/edit",
  "TEAM_API_NOTICE_LIST": "/aqm/team/api/notice/get-list",
  "TEAM_API_NOTICE_GETLAST": "/aqm/team/api/notice/get-last",
  "TEAM_API_NOTICE_DETAIL": "/aqm/team/api/notice/detail",
  "TEAM_API_NOTICE_REMOVE": "/aqm/team/api/notice/remove",

  "TEAM_API_OPERATE_LIST":"/aqm/team/api/operate/get-list",
  "TEAM_API_OPERATE_NO_DONE": "/aqm/team/api/operate/is-no-done",
  "TEAM_API_OPERATE_SET_DONE": "/aqm/team/api/operate/set-done",

  "TEAM_API_PLAYER_CREATE": "/aqm/team/api/player/create",
  "TEAM_API_PLAYER_DETAIL": "/aqm/team/api/player/detail",
  "TEAM_API_PLAYER_KICK": "/aqm/team/api/player/kick",
  "TEAM_API_PLAYER_MYRIGHTS": "/aqm/team/api/player/my-rights",
  "TEAM_API_PLAYER_GETLIST_BY_JOB":"/aqm/team/api/player/get-list-by-job",
  "TEAM_API_PLAYER_SETINFO": "/aqm/team/api/player/set-info",
  "TEAM_API_PLAYER_ADD": "/aqm/team/api/player/add",
  "TEAM_API_PLAYER_AGREE": "/aqm/team/api/player/agree",
  "TEAM_API_PLAYER_LEAVE": "/aqm/team/api/player/leave",
  "TEAM_API_PLAYER_GETLIST": "/aqm/team/api/player/get-list",
  "TEAM_API_PLAYER_USER_INFO":"/aqm/team/api/player/query-user-info",
  "TEAM_API_PLAYER_RECORD_STATUS":"/aqm/team/api/player/record-status",
  "TEAM_API_PLAYER_QUICK_JOIN":"/aqm/team/api/player/quick-join",

  "TEAM_API_MESSAGE_GETLAST": "/aqm/team/api/message/get-last",
  "TEAM_API_MESSAGE_LIST": "/aqm/team/api/message/get-list",
  "TEAM_API_MY_MESSAGE_LIST": "/aqm/team/api/message/get-my-list",
  "LEAGUE_TEAM_DETAIL_URL": "/aqm/team/api/index/league-detail",
  "LEAGUE_TEAM_JOIN_LEAGUE_PLAYER": "/aqm/team/api/player/get-join-league-player-list",
  "LEAGUE_TEAM_JOIN_LEAGUE_PLAYER2": "/aqm/team/api/player/get-join-league-player-list2",

  "TEAM_API_VIEW_INFO": "/aqm/team/api/view/info",

  "LEAGUE_API_MY_LIST": "/aqm/league/api/index/team-league",
  "LEAGUE_API_ALL_LIST": "/aqm/league/api/index/get-list",
  "LEAGUE_API_ALL_CHILD_LIST": "/aqm/league/api/index/get-child-list",
  "LEAGUE_API_DETAIL": "/aqm/league/api/index/detail",
  "LEAGUE_CONFIG_URL": "/aqm/league/api/index/config",
  "LEAGUE_QUERY_SCHEDULE_ROUND": "/aqm/league/api/index/query-schedule-round",
  "LEAGUE_QUERY_SCHEDULE": "/aqm/league/api/index/query-schedule",
  "LEAGUE_ASSISTS_LIST": "/aqm/league/api/index/get-assist",
  "LEAGUE_CARD_LIST": "/aqm/league/api/index/get-card",
  "LEAGUE_GOAL_LIST": "/aqm/league/api/index/get-goal",
  "LEAGUE_LEAGUETABLE_LIST": "/aqm/league/api/index/get-leaguetable",
  "LEAGUE_LEAGUEVS_LIST": "/aqm/league/api/index/get-leaguevs",
  "LEAGUE_TEAM_RANK_LIST": "/aqm/league/api/index/get-team-rank",
  "LEAGUE_JOIN_TEAM_URL": "/aqm/league/api/index/get-team",
  "LEAGUE_ADD_PLAYER_URL": "/aqm/league/api/index/add-player",
  "LEAGUE_API_MATCH_DATA":"/aqm/team/api/index/league-match-data",
  "LEAGUE_API_MY_JOIN_LIST":"/aqm/league/api/index/my-join",

  "SCHEDULE_API_LIST":"/aqm/schedule/api/index/list",
  "SCHEDULE_API_LIST_BY_DAY":"/aqm/schedule/api/index/list_by_day",
  "SCHEDULE_API_MY_LIST":"/aqm/schedule/api/index/my_list",
  "SCHEDULE_API_DETAIL":"/aqm/schedule/api/index/detail",
  "SCHEDULE_API_ADD":"/aqm/schedule/api/index/add",
  "SCHEDULE_API_EDIT":"/aqm/schedule/api/index/edit",
  "SCHEDULE_API_SAVE_SCORE": "/aqm/schedule/api/index/save_score",
  "SCHEDULE_API_DELETE":"/aqm/schedule/api/index/delete",
  "SCHEDULE_API_GET_ENROLL_FIELDS":"/aqm/schedule/api/index/get_enroll_fields",
  "SCHEDULE_API_ENROLL_LIST": "/aqm/schedule/api/enroll/list",
  "SCHEDULE_API_ENROLL_DETAIL": "/aqm/schedule/api/enroll/detail",
  "SCHEDULE_API_ENROLL_ENROLL": "/aqm/schedule/api/enroll/enroll",
  "SCHEDULE_API_ENROLL_DELETE": "/aqm/schedule/api/enroll/delete",
  "SCHEDULE_API_ENROLL_OPERATE": "/aqm/schedule/api/enroll/operate",
  "SCHEDULE_API_ENROLL_SIGNIN": "/aqm/schedule/api/enroll/signin",
  "SCHEDULE_API_GET_POSTER":"/aqm/schedule/api/index/get_poster",

  "SCHEDULE_API_LIVE_ADD": "/aqm/schedule/api/live/add",
  "SCHEDULE_API_LIVE_CANCEL": "/aqm/schedule/api/live/cancel",
  "SCHEDULE_API_LIVE_GET_BY_DATE": "/aqm/schedule/api/live/get-by-date",
  "SCHEDULE_API_LIVE_DETAIL": "/aqm/schedule/api/live/detail",

  // "TEST": "/campus/league/api/index/add-player"
};

const urlsConfig_campus = {
  "COMMON_API_ZONE_GETPROVINCE": "/aqm/common/api/zone/get-province",
  "COMMON_API_ZONE_GETCITY": "/aqm/common/api/zone/get-city",
  "COMMON_API_ZONE_GETAREA": "/aqm/common/api/zone/get-area",
  "COMMON_API_OTHER_COLOR": "/aqm/common/api/other/get-color",

  "WX_API_INDEX_GETSESSION": "/wx/api/index/get-session",
  "WX_API_INDEX_DECODE": "/wx/api/index/decode",

  "ACCOUNT_API_INDEX_GETCODE": "/campus/account/api/index/get-code",
  "ACCOUNT_API_INDEX_LOGIN": "/campus/account/api/index/login",
  "ACCOUNT_API_INDEX_REGISTER": "/campus/account/api/index/register",

  "TEAM_API_INDEX_CREATE": "/campus/team/api/index/create",
  "TEAM_API_INDEX_DETAIL": "/campus/team/api/index/detail",
  "TEAM_API_INDEX_SEARCH": "/campus/team/api/index/search",
  "TEAM_API_INDEX_MY": "/campus/team/api/index/my",

  "TEAM_API_NOTICE_ADD": "/campus/team/api/notice/add",
  "TEAM_API_NOTICE_EDIT": "/campus/team/api/notice/edit",
  "TEAM_API_NOTICE_LIST": "/campus/team/api/notice/get-list",
  "TEAM_API_NOTICE_GETLAST": "/campus/team/api/notice/get-last",
  "TEAM_API_NOTICE_DETAIL": "/campus/team/api/notice/detail",
  "TEAM_API_NOTICE_REMOVE": "/campus/team/api/notice/remove",

  "TEAM_API_PLAYER_CREATE": "/campus/team/api/player/create",
  "TEAM_API_PLAYER_DETAIL": "/campus/team/api/player/detail",
  "TEAM_API_PLAYER_MYRIGHTS": "/campus/team/api/player/my-rights",
  "TEAM_API_PLAYER_SETINFO": "/campus/team/api/player/set-info",
  "TEAM_API_PLAYER_ADD": "/campus/team/api/player/add",
  "TEAM_API_PLAYER_GETLIST": "/campus/team/api/player/get-list",

  "TEAM_API_MESSAGE_GETLAST": "/campus/team/api/message/get-last",
  "TEAM_API_MESSAGE_LIST": "/campus/team/api/message/get-list",
  "LEAGUE_TEAM_DETAIL_URL": "/campus/team/api/index/league-detail",
  "LEAGUE_TEAM_JOIN_LEAGUE_PLAYER": "/campus/team/api/player/get-join-league-player-list",
  "LEAGUE_TEAM_JOIN_LEAGUE_PLAYER2": "/campus/team/api/player/get-join-league-player-list2",

  "TEAM_API_VIEW_INFO": "/campus/team/api/view/info",

  "LEAGUE_API_MY_LIST":"/campus/league/api/index/team-league",
  "LEAGUE_API_ALL_LIST": "/campus/league/api/index/get-list",
  "LEAGUE_API_ALL_CHILD_LIST": "/campus/league/api/index/get-child-list",
  "LEAGUE_API_DETAIL": "/campus/league/api/index/detail",
  "LEAGUE_CONFIG_URL": "/campus/league/api/index/config",
  "LEAGUE_QUERY_SCHEDULE_ROUND": "/campus/league/api/index/query-schedule-round",
  "LEAGUE_QUERY_SCHEDULE": "/campus/league/api/index/query-schedule",
  "LEAGUE_ASSISTS_LIST":"/campus/league/api/index/get-assist",
  "LEAGUE_CARD_LIST":"/campus/league/api/index/get-card",
  "LEAGUE_GOAL_LIST":"/campus/league/api/index/get-goal",
  "LEAGUE_LEAGUETABLE_LIST":"/campus/league/api/index/get-leaguetable",
  "LEAGUE_LEAGUEVS_LIST":"/campus/league/api/index/get-leaguevs",
  "LEAGUE_TEAM_RANK_LIST": "/campus/league/api/index/get-team-rank",
  "LEAGUE_JOIN_TEAM_URL":"/campus/league/api/index/get-team",
  "LEAGUE_ADD_PLAYER_URL": "/campus/league/api/index/add-player"

};

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
    return wx.showModal({ content: 'url key:' + key + '不存在', confirmText: '确定', confirmColor: '#00a7f2', showCancel: false });

  // console.info(key + ' Req:::', requestData, { token: token });
  wx.request({
    url: config.BASE_URL + realKey,
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
      console.log(realKey, ' Req:::', requestData, { token: token }, '  Res:::', obj);
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