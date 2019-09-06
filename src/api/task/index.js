import http from 'utils/http';
import url from '../config';
import qs from 'querystring';
export default {
  /**
   * 获取任务列表
   * params { pageSize, pageIndex }
   */
  async getTaskList(params) {
    const res = await http.get(url.taskList, { params });
    return res.data;
  },
  /**
   * 获取任务详情列表
   * params { id, pageSize, pageIndex }
   */
  async getTaskRecordList(params) {
    const res = await http.get(url.taskRocordList, { params });
    return res.data;
  },

  /**
   * 获取动态表头
   * params { taskId }
   */
  async getTaskField(params) {
    const res = await http.get(url.taskDynamicField, { params });
    return res.data;
  },

  /**
   * 获取任务详情
   * params { id }
   */
  async getTaskDetail(params) {
    const res = await http.get(url.taskDetail, { params });
    return res.data;
  },

  /**
   * 任务审核
   * params { taskReocrdId, suggestion, status }
   */
  async taskCheck(params) {
    const res = await http.get(url.taskCheck, { params });
    return res;
  },

  /**
   * 任务分派
   * params { ids, status, surveyUserId }
   */
  async taskDistribute(params) {
    const res = await http.post(url.taskDistribute, qs.stringify(params));
    return res;
  },

  /**
   * 获取geojson
   * params { taskId }
   */
  async getGeojson(params) {
    const res = await http.get(url.initMap, { params });
    return res;
  },
  /**
   * 获取模板列表
   */
  async getTemplateList(params) {
    const res = await http.get(url.templateList, { params });
    return res.data;
  },
  /**
   * 添加模版
   */
  async addTemplate(params) {
    const res = await http.post(url.templateAdd, params);
    return res.data;
  },
  /**
   * 获取模板详情
   * params { templateId }
   */
  async getTemplateDetail(params) {
    const res = await http.get(url.templateDetail, { params });
    return res;
  },
  /**
   * 添加删除
   */
  async deleteTemplate(params) {
    const res = await http.get(url.templateDelete, { params });
    return res;
  },
  /**
   * 数据导入
   * params { templateId, taskName, completeTime, importType, file }
   */
  async taskImport(params) {
    const res = await http.post(url.taskImport, qs.stringify(params));
    return res;
  },
};
