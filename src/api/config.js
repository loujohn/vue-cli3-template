import { baseUrl } from 'config';
const url = {
  login: baseUrl + 'auth/login.do',
  taskList: baseUrl + 'manage/task/page.do',
  taskRocordList: baseUrl + 'manage/taskRecord/page.do',
  taskDynamicField: baseUrl + 'manage/taskRecord/getShowFields.do',
  taskDetail: baseUrl + 'manage/taskRecord/get.do',
  taskCheck: baseUrl + 'manage/taskRecord/check.do',
  taskDistribute: baseUrl + 'manage/taskRecord/distribution.do',
  taskImport: baseUrl + 'manage/tasl/import.do',
  initMap: baseUrl + 'manage/taskRecord/initMap.do',
  templateList: baseUrl + 'manage/surveyTemplate/page.do',
  templateAdd: baseUrl + 'manage/surveyTemplate/save.do',
  tempalteDetail: baseUrl + 'manage/surveyTemplate/getTemplateFields.do',
  surveyUserList: baseUrl + 'manage/surveyUser/list.do',
};

export default url;
