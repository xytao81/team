//人员信息字段
const league_enroll_key_dict = {
  "photo": "照片",
  "name": "姓名",
  "rights": "角色",
  "sub_rights": "职务",
  "certnumber": "证件号码",
  "cert_type": "证件类型",
  "sex": "性别",
  "birthday": "出生日期",
  "number": "球衣号码",
  "height": "身高",
  "weight": "体重",
  "phone": "手机号",
  "email": "邮箱",
}


function getEnrollKeyByZh(zh) {
  const dict = league_enroll_key_dict;
  for (let k in dict) {
    if (dict[k] == zh) return k;
  }
  return zh;
}


module.exports = {
  getEnrollKeyByZh
}
