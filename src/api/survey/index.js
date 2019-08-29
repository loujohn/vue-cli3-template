import http from 'utils/http';
import url from '../config';

export default {
  /**
   * params  { pageIndex, pageSize, keyword }
   */
  async getSurveyUserList(params) {
    const res = await http.get(url.surveyUserList, { params });
    return res;
  },
};
