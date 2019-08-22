import axios from 'axios';
import http from 'utils/http';
import { baseMapUrl } from 'config';
import url from '../config';

const common = {
  async getMapConfig() {
    const res = await axios.create().get(baseMapUrl);
    return res.data;
  },
  async login(params) {
    const res = await http.get(url.login, { params });
    return res;
  },
};

export default common;
