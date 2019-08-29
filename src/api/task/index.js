import http from 'utils/http';
import url from '../config';
import qs from 'querystring';
export default {
  /**
   * params { pageSize, pageIndex }
   */
  async getTaskList(params) {
    const res = await http.get(url.taskList, { params });
    return res.data;
  },
  /**
   * params { id, pageSize, pageIndex }
   */
  async getTaskRecordList(params) {
    const res = await http.get(url.taskRocordList, { params });
    return res.data;
  },

  /**
   * params { taskId }
   */
  async getTaskField(params) {
    const res = await http.get(url.taskDynamicField, { params });
    return res.data;
  },

  /**
   * params { id }
   */
  async getTaskDetail(params) {
    const res = await http.get(url.taskDetail, { params });
    return res.data;
  },

  /**
   * params { taskReocrdId, suggestion, status }
   */
  async taskCheck(params) {
    const res = await http.get(url.taskCheck, { params });
    return res;
  },

  /**
   * params { ids, status, surveyUserId }
   */
  async taskDistribute(params) {
    const res = await http.post(url.taskDistribute, qs.stringify(params));
    return res;
  },

  /**
   * params { taskId }
   */
  async getGeojson(params) {
    const res = await http.get(url.initMap, { params });
    return res;
  },
};
