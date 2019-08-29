import { baseUrl } from 'config';
const url = {
  // user
  login: baseUrl + 'auth/login.do',

  // task
  taskList: baseUrl + 'manage/task/page.do',
  taskRocordList: baseUrl + 'manage/taskRecord/page.do',
  taskDynamicField: baseUrl + 'manage/taskRecord/getShowFields.do',
  taskDetail: baseUrl + 'manage/taskRecord/get.do',
  taskCheck: baseUrl + 'manage/taskRecord/check.do',
  taskDistribute: baseUrl + 'manage/taskRecord/distribution.do',
  initMap: baseUrl + 'manage/taskRecord/initMap.do',

  // survey
  surveyUserList: baseUrl + 'manage/surveyUser/list.do',
};

export default url;
