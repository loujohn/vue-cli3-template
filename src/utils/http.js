import axios from 'axios';
const http = axios.create();
import { Message } from 'element-ui';
import { Loading } from 'element-ui';

http.interceptors.request.use(
  config => {
    config.headers['X-Token'] = sessionStorage.getItem('token');
    return config;
  },
  error => {
    console.error(error);
    return Promise.reject(error);
  },
);
let needLoadingRequestCount = 0;
let loadingInstance;
export function showLoading() {
  if (needLoadingRequestCount === 0) {
    loadingInstance = Loading.service({ fullscreen: true });
  }
  needLoadingRequestCount++;
}

export function hideLoading() {
  if (needLoadingRequestCount <= 0) return;
  needLoadingRequestCount--;
  if (needLoadingRequestCount === 0) {
    loadingInstance.close()
  }
}

// 拦截请求
http.interceptors.request.use(
  function(config) {
    if (!config.hideLoading) {
      showLoading();
    }
    return config;
  },
  function(err) {
    if (!err.config.hideLoading) {
      hideLoading();
    }
    return Promise.reject(err);
  },
);

http.interceptors.response.use(
  response => {
    if (!response.config.hideLoading) {
      hideLoading();
    }
    const { data } = response;
    const { code, message } = data;
    if (code && code.toString() === '401') {
      sessionStorage.clear();
      window.location.reload();
      return;
    }
    if (code && code.toString() === '200' && message && message === 'ok') {
      return Promise.resolve(data);
    } else {
      Message.error(message);
      return Promise.reject();
    }
  },
  error => {
    console.log(error);
    if (error.response.status == 401) {
      sessionStorage.clear();
      window.location.reload();
    }
    return Promise.reject(error);
  },
);

export default http;
