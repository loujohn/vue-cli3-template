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
};

export default url;
