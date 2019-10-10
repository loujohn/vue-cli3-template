import axios from 'axios';
import http from 'utils/http';
import { baseMapUrl } from 'config';
import url from '../config';
import qs from 'querystring';
import crypto from 'crypto';

const common = {
  async getMapConfig() {
    const res = await axios.create().get(baseMapUrl);
    return res.data;
  },
  async login(params) {
    const md5 = crypto.createHash('md5');
    md5.update(params.password);
    params.password = md5.digest('hex');
    const res = await http.post(url.login, qs.stringify(params));
    return res;
  },
};

export default common;
