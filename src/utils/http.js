import axios from 'axios';

const http = axios.create();

http.interceptors.request.use(
  config => {
    return config;
  },
  error => {
    console.error(error);
  },
);

http.interceptors.response.use(
  response => {
    return response;
  },
  error => {
    console.error(error);
  },
);

export default http;
