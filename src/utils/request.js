import axios from 'axios';
import Cookies from 'js-cookie';
import router from '@/router';
import isPlainObject from 'lodash/isPlainObject';
var proEnv = require('../../config/pro.env');  // 生产环境
var uatEnv = require('../../config/test.env');  // 测试环境
var devEnv = require('../../config/dev.env');  // 本地环境

// 默认是本地环境
const env = process.env.NODE_ENV;
let target = '';
if(env==='production'){  // 生产环境
    target = proEnv.hosturl;
}else if(env==='test'){ // 测试环境
    target = uatEnv.hosturl;
}else{  // 本地环境
    target = devEnv.hosturl;
}
const setToken = () => {
  axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
  axios.defaults.baseURL = target
  // axios.defaults.headers.common['Authorization'] = Cookies.get('platAdminToken');
  // console.log(Cookies.get('platAdminToken'));
};
const http = axios.create({
    // baseURL: '/smlw-gateway-api',
	baseURL: '/nft-api',
    timeout: 1000 * 180,
    withCredentials: true
});
/**
 * 请求拦截
 */
http.interceptors.request.use(config => {
    config.headers['Accept-Language'] = Cookies.get('language') || 'zh-CN';
    config.headers['Authorization'] = 'Bearer ' + (Cookies.get('token') || '');
    config.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'
    // 默认参数
    var defaults = {};
    // 防止缓存，GET请求默认带_t参数
    if (config.method === 'get') {
        config.params = {
            ...config.params,
            ...{'_t': new Date().getTime()}
        };
    }
    if (isPlainObject(config.params)) {
        config.params = {
            ...defaults,
            ...config.params
        };
    }
    if (isPlainObject(config.data)) {
        config.data = {
            ...defaults,
            ...config.data
        };
        if (/^application\/x-www-form-urlencoded/.test(config.headers['content-type'])) {
            config.data = qs.stringify(config.data);
        }
    }
	// if(config.method === 'post'){
	// 	config.data = qs.stringify(config.data)
	// }
    return config;
}, error => {
    return Promise.reject(error);
});

/**
 * 响应拦截
 */
http.interceptors.response.use(response => {
    if (response.data.code === 401 || response.data.code === 10001) {
		Cookies.remove('currentUserInfo')
		Cookies.remove('token');
		localStorage.removeItem('crumbsTab');
        router.replace({name: 'login'});
        return Promise.reject(response.data.msg);
    }
    return response;
}, error => {
    return Promise.reject(error);
});
export default http;
