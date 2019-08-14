import axios from 'axios';

const http = axios.create();

http.interceptors.request.use(config => {}, error => {});

http.interceptors.response.use(reponse => {}, error => {});

export default http;
