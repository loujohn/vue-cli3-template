// import url from '../config';
import http from 'utils/http';
import { baseMapUrl } from 'config';
const common = {
  async getMapConfig() {
    let res = await http.get(baseMapUrl);
    return res.data;
  },
};

export default common;
