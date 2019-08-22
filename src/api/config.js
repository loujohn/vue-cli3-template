import { baseUrl } from 'config';
const url = {
  // user
  login: baseUrl + 'auth/login.do',

  // task
  taskList: baseUrl + 'manage/task/page.do',
  taskRocordList: baseUrl + 'manage/taskRecord/page.do',
  taskDynamicField: baseUrl + 'manage/taskRecord/getShowFields.do',
};

export default url;
