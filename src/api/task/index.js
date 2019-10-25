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
    const res = await http.post(url.taskCheck, params);
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
   * 通过空间选择分派
   * params { geojson, taskId }
   */
  async taskDistributeByRange(params) {
    const res = await http.post(
      url.taskDistributeByRange,
      qs.stringify(params),
    );
    return res;
  },

  /**
   * 获取geojson
   * params { taskId }
   */
  async getGeojson(params) {
    const res = await http.get(url.initMap, {
      params: params,
      hideLoading: true,
    });
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
   * params { id }
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
   * params { templateId, gdbFilepath, extraFieldStr, taskName, taskDataTypeId, completeTime, importType }
   */
  async taskImport(params) {
    const res = await http.post(url.taskImport, qs.stringify(params));
    return res;
  },

  /**
   * 获取统计信息
   */
  async getStatistic() {
    const res = await http.get(url.statistic, { hideLoading: true });
    return res.data || {};
  },
  /**
   * 获取任务统计信息
   * params { taskId }
   */
  async getTaskStatistic(params) {
    const res = await http.get(url.taskStatistic, {
      params,
      hideLoading: true,
    });
    return res.data || {};
  },
  /**
   * 获取图斑统计信息
   * params { taskId }
   */
  async getTuBanStatistic(params) {
    const res = await http.get(url.tubanStatistic, {
      params,
      hideLoading: true,
    });
    return res.data || {};
  },
  /**
   * 获取枚举信息
   * params { taskId }
   */
  async getDictionaryKey(params) {
    const res = await http.get(url.getDictionaryKey, {
      params,
      hideLoading: true,
    });
    return res.data || {};
  },
  /**
   * 获取审核日志
   * params { taskReocrdId }
   */
  async getFlowLog(params) {
    const res = await http.get(url.getFlowLog, {
      params,
      hideLoading: true,
    });
    return res.data || {};
  },

  /**
   * 获取单个geojson
   * params { taskReocrdId }
   */
  async getGeojsonById(params) {
    const res = await http.get(url.getGeojson, {
      params,
      hideLoading: true,
    });
    return res.data || {};
  },

  /**
   * params { id }
   */
  async deleteTask(params) {
    const res = await http.get(url.taskDelete, {
      params,
      hideLoading: true,
    });
    return res;
  },
};
