var CryptoJS = require('crypto-js');

function encrypt(buf,key,iv) {
    // var key = getAPIDESKEY();
    // var iv = getAPIDESIV();
    var keyHex = CryptoJS.enc.Utf8.parse(key);
    var ivHex = CryptoJS.enc.Utf8.parse(iv);

    buf = JSON.stringify(buf);
    var encrypted = CryptoJS.TripleDES.encrypt(buf, keyHex, {
        iv:ivHex,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
    });

    return encrypted.ciphertext.toString(CryptoJS.enc.Base64);
}

function decrypt(buf,key,iv) {
    // var key = getAPIDESKEY();
    // var iv = getAPIDESIV();
    var keyHex = CryptoJS.enc.Utf8.parse(key);
    var ivHex = CryptoJS.enc.Utf8.parse(iv);
    var decrypted = CryptoJS.TripleDES.decrypt({
        ciphertext: CryptoJS.enc.Base64.parse(buf)
    }, keyHex, {
        iv:ivHex,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
    });

    var result_value = decrypted.toString(CryptoJS.enc.Utf8);
    return result_value;
}

export default {
    encrypt,
    decrypt,
}
