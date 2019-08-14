import url from '../config';
import http from 'utils/http';
const common = {
  test: params => {
    return http.get(url.test, { params });
  },
};

export default common;
