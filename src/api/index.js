import request from '../utils/request';

var URL = require('../../config/url');
var proEnv = require('../../config/pro.env'); // 生产环境
var uatEnv = require('../../config/test.env'); // 测试环境
var devEnv = require('../../config/dev.env'); // 本地环境
var url = process.env.NODE_ENV === 'production' ? proEnv.hosturl : process.env.NODE_ENV === 'test' ? uatEnv.hosturl :devEnv.hosturl;

//post
export const postMethod = (ulrAddr, query) => {
  return new Promise((resolve, reject) => {
    request.post(ulrAddr,
      query
    ).then(response => {
      if (response.status === 200) {
        if (response.data.code == 401) {
          ELEMENT.Message.error('登录失效，请重新登录');
          setTimeout(function() {
            window.location.href = URL.loginUrl;
          }, 2000);
        } else {
          resolve(response.data);
        }
      } else {
        reject(response);
      }
    }).catch(error => {
      reject(error);
    });
  });
};
// get
export const getMethod = (ulrAddr, query) => {
  return new Promise((resolve, reject) => {
    request.get(ulrAddr).then(response => {
      if (response.status === 200) {
        if (response.data.code == 401) {
          ELEMENT.Message.error('登录失效，请重新登录');
          setTimeout(function() {
            window.location.href = URL.loginUrl;
          }, 2000);
        } else {
          resolve(response.data);
        }
      } else {
        reject(response);
      }
    }).catch(error => {
      reject(error);
    });
  });
};
//delete
export const deleteMethod = (ulrAddr, query) => {
  return new Promise((resolve, reject) => {
    request.delete(ulrAddr,
      query
    ).then(response => {
      if (response.status === 200) {
        if (response.data.code == 401) {
          ELEMENT.Message.error('登录失效，请重新登录');
          setTimeout(function() {
            window.location.href = URL.loginUrl;
          }, 2000);
        } else {
          resolve(response.data);
        }
      } else {
        reject(response);
      }
    }).catch(error => {
      reject(error);
    });
  });
};
//put
export const putMethod = (ulrAddr, query) => {
  return new Promise((resolve, reject) => {
    request.put(ulrAddr,
      query
    ).then(response => {
      if (response.status === 200) {
        if (response.data.code == 401) {
          ELEMENT.Message.error('登录失效，请重新登录');
          setTimeout(function() {
            window.location.href = URL.loginUrl;
          }, 2000);
        } else {
          resolve(response.data);
        }
      } else {
        reject(response);
      }
    }).catch(error => {
      reject(error);
    });
  });
};
