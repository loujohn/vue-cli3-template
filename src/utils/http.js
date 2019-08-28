import axios from 'axios';
const http = axios.create();
import { Message } from 'element-ui';

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

http.interceptors.response.use(
  response => {
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
