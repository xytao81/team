 function isvalidUsername(str) {
    const valid_map = ['admin', 'editor']
    return valid_map.indexOf(str.trim()) >= 0
}

/* 合法uri*/
 function validateURL(textval) {
    const urlregex = /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/
    return urlregex.test(textval)
}

/* 小写字母*/
 function validateLowerCase(str) {
    const reg = /^[a-z]+$/
    return reg.test(str)
}

/* 大写字母*/
 function validateUpperCase(str) {
    const reg = /^[A-Z]+$/
    return reg.test(str)
}

/* 大小写字母*/
 function validateAlphabets(str) {
    const reg = /^[A-Za-z]+$/
    return reg.test(str)
}

/* 手机号码*/
 function validatePhone(str) {
    const reg = /^1[0-9]{10}$/
    return reg.test(str)
}

/* 验证身高体重*/
function validateHeightAndWeight(str) {
    const reg = /^([0-9]{1,3})+(.[0-9]{1})?$/
    return reg.test(str)
}


/* 验证电话*/
function validateTel(str) {
    const reg = /^[0-9]+$/

    return reg.test(str)
}


/**
 * validate email
 * @param email
 * @returns {boolean}
 */
 function validateEmail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    return re.test(email)
}

//身份证验证
function validateIdentity(certno){
    certno = certno.toUpperCase();
    var code = certno;
    var city = { 11: "北京", 12: "天津", 13: "河北", 14: "山西", 15: "内蒙古", 21: "辽宁", 22: "吉林", 23: "黑龙江 ", 31: "上海", 32: "江苏", 33: "浙江", 34: "安徽", 35: "福建", 36: "江西", 37: "山东", 41: "河南", 42: "湖北 ", 43: "湖南", 44: "广东", 45: "广西", 46: "海南", 50: "重庆", 51: "四川", 52: "贵州", 53: "云南", 54: "西藏 ", 61: "陕西", 62: "甘肃", 63: "青海", 64: "宁夏", 65: "新疆", 71: "台湾", 81: "香港", 82: "澳门", 91: "国外 " };
    var tip = "";
    var pass = true;
    var out_data = {};
    var year = "";
    var month = "";
    var day = "";
    var sex = "";  
    if (!code || !/^[1-9]{1}[0-9]{14}$|^[1-9]{1}[0-9]{16}([0-9]|[xX])$/.test(code)) {
        tip = "身份证号格式错误";
        pass = false;
    } else if (!city[code.substr(0, 2)]) {
        tip = "地址编码错误";
        pass = false;
    } else {
        //18位身份证需要验证最后一位校验位
        if (code.length == 18) {
            code = code.split('');
            //∑(ai×Wi)(mod 11)
            //加权因子
            var factor = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
            //校验位
            var parity = [1, 0, 'X', 9, 8, 7, 6, 5, 4, 3, 2];
            var sum = 0;
            var ai = 0;
            var wi = 0;
            for (var i = 0; i < 17; i++) {
                ai = code[i];
                wi = factor[i];
                sum += ai * wi;
            }
            var last = parity[sum % 11];
            if (parity[sum % 11] != code[17]) {
                // 放过校验位，不验证
                // tip = "校验位错误";
                // pass = false;
                year = certno.substring(6, 10);
                month = certno.substring(10, 12);
                day = certno.substring(12, 14);
                sex = certno.substring(16, 17) % 2;
            } else {
                // console.log(certno);
                year = certno.substring(6, 10);
                month = certno.substring(10, 12);
                day = certno.substring(12, 14);
                sex = certno.substring(16, 17) % 2;
                // console.log(year);
                // console.log(month);
                // console.log(day);
                // console.log(sex);
            }
        } else {
            pass = false;
        }
    }
    // if (!pass) alert(tip);

    var out_data={
        "result":pass,
        "message":tip,
    }
    if(pass==true){
        out_data["info"]={
            certno:certno,
            sex:sex,
            birthday: year + "-" + month + "-" + day
        }
    }
    return out_data;
}

export default {
    isvalidUsername,
    validateURL,
    validateLowerCase,
    validateUpperCase,
    validateAlphabets,
    validatePhone,
    validateTel,
    validateEmail,
    validateIdentity,
    validateHeightAndWeight,
}
