import axios from 'axios';
import http from 'utils/http';
import { baseMapUrl } from 'config';
import url from '../config';
import qs from 'querystring';

const common = {
  async getMapConfig() {
    const res = await axios.create().get(baseMapUrl);
    return res.data;
  },
  async login(params) {
    const res = await http.post(url.login, qs.stringify(params));
    return res;
  },
};

export default common;
