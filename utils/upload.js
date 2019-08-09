import axios from 'axios'
import map from './url_map'
import Crypto from './crypto'
import * as Cookies from "js-cookie"

// create an axios instance
const service = axios.create({
    method: 'post',
    baseURL: process.env.HOST_URL+"/tool/api/upload/file", 
   // timeout: 10000, // request timeout
    headers: {'Content-Type': 'multipart/form-data'}
})

// request interceptor
service.interceptors.request.use(config => {
    var token =Cookies.get('token') || '';
    config.headers['token'] = token;
    
    return config
}, error => {
    // Do something with request error
    console.log(error) // for debug
    return {code:500,err:error}
})

// respone interceptor
service.interceptors.response.use(
    response => {
        // const res = response.data;
        // console.log(res);
        // console.log(response);
        // //处理解密
        // let des_key = process.env.DES_KEY;
        // var token =Cookies.get('token') || '';
        // if (token.length>0) des_key = token;

        // let des_iv = des_key.substr(0, 8);
        // console.log("token",Cookies.get('token'))
        // console.log("DES_KEY",process.env.DES_KEY)
        // console.log("key",des_key)
        // console.log("iv",des_iv)
        // var d = Crypto.decrypt(res.DATA, des_key, des_iv);
        // let obj = eval('(' + d + ')');
        // console.log(obj);
        return response;
    },
    error => {
        console.log('err' + error)// for debug
        return {code:500,err:error}
    }
)

export default service