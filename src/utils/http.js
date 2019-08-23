import axios from 'axios';
const http = axios.create();

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
    const { meta } = data;
    if (meta && meta.code.toString() === '401') {
      sessionStorage.clear();
      window.location.reload();
      return;
    }
    return Promise.resolve(data);
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
