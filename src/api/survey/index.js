import http from 'utils/http';
import url from '../config';
import qs from 'querystring';

export default {
  /**
   * params  { pageIndex, pageSize, keyword }
   */
  async getSurveyUserList(params) {
    const res = await http.get(url.surveyUserList, {
      params,
      hideLoading: true,
    });
    return res;
  },
  async statistic() {
    const res = await http.get(url.surverUserStatistic, {
      hideLoading: true,
    });
    return res.data;
  },
  /**
   * params { taskId }
   */
  async taskStatistics(params) {
    const res = await http.get(url.surveyUserTaskStatistic, {
      params,
      hideLoading: true,
    });
    return res.data;
  },
  /**
   * params { taskRecordId, pcGeojson, recordJsonStr, annex, delete, deleteAnnexIdStr }
   */
  async saveTaskRecordInfo(params) {
    const res = await http.post(url.saveTaskRecordInfo, params, {
      hideLoading: true,
    });
    return res;
  },
  /**
   * params { taskRecordIds }
   */
  async taskSubmit(params) {
    const res = await http.post(url.taskSubmit, qs.stringify(params));
    return res;
  },
};
