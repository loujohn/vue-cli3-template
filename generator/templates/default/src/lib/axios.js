/* eslint-disable */
import axios from "axios";
import config from "@/config";

const api = axios.create({
  baseURL: config.baseURL
});

const rainbow = [
  "color: #e74c3c",
  "color: #e67e22",
  "color: #f1c40f",
  "color: #2ecc71",
  "color: #1abc9c",
  "color: #3498db",
  "color: #9b59b6",
  "color: #333"
];
const print = val => {
  console.log("%c>>>%c>>>%c>>>%c>>>%c>>>%c>>>%c>>>%c " + val, ...rainbow);
};
const groupStart = val => {
  console.group("%c>>>%c>>>%c>>>%c>>>%c>>>%c>>>%c>>>%c " + val, ...rainbow);
};
const printError = response => {
  if (process.env.NODE_ENV === "development") {
    groupStart("出错了哦");
    console.log(
      response.config.method.toUpperCase() + " " + response.config.url
    );
    if (response.config.headers[config.axios.header.token]) {
      console.log("%c>>>>>> token ok", "color: #2ecc71");
    }
    if (response.config.data) {
      console.log("%c↓↓↓↓↓↓ payload", "color: #e67e22");
      console.table(JSON.parse(response.config.data));
    }
    console.log(response.data.err);
    console.log(response.data.msg);
    console.groupEnd();
  }
};
const printList = response => {
  if (process.env.NODE_ENV === "development") {
    console.group(
      "%c>>>>>> " +
        response.config.method.toUpperCase() +
        " " +
        response.config.url,
      "color: #e67e22"
    );
    if (response.config.headers[config.axios.header.token]) {
      console.log("%c>>>>>> token ok", "color: #2ecc71");
    }
    if (response.config.params) {
      console.log("%c↓↓↓↓↓↓ query params", "color: #e67e22");
      console.table(response.config.params);
    }
    if (response.config.data) {
      console.log("%c↓↓↓↓↓↓ request payload", "color: #e67e22");
      console.table(JSON.parse(response.config.data));
    }
    console.log("%c↓↓↓↓↓↓ response page", "color: #3498db");
    console.table(response.data.page);
  }
  console.log("%c↓↓↓↓↓↓ response list", "color: #3498db");
  console.table(response.data.list);
  console.groupEnd();
};
const printData = response => {
  if (process.env.NODE_ENV === "development") {
    console.group(
      "%c>>>>>> " +
        response.config.method.toUpperCase() +
        " " +
        response.config.url,
      "color: #e67e22"
    );
    if (response.config.headers[config.axios.header.token]) {
      console.log("%c>>>>>> token ok", "color: #2ecc71");
    }
    if (response.config.params) {
      console.log("%c↓↓↓↓↓↓ query params", "color: #e67e22");
      console.log(response.config.params);
    }
    if (response.config.data) {
      console.log("%c↓↓↓↓↓↓ request payload", "color: #e67e22");
      console.table(JSON.parse(response.config.data));
    }
    console.log("%c↓↓↓↓↓↓ response data", "color: #3498db");
    console.table(response.data.data);
    console.groupEnd();
  }
};

api.interceptors.request.use(
  option => {
    return option;
  },
  err => {
    console.log("error");
    console.log(err);
    return Promise.reject(err);
  }
);
api.interceptors.response.use(
  response => {
    //   if (response.data.err) {
    //     printError(response)
    //     return Promise.reject(response.data)
    //   } else {
    //     if (response.data.page) {
    //       printList(response)
    //       return Promise.resolve(response.data)
    //     } else {
    //       printData(response)
    //       return Promise.resolve(response.data.data)
    //     }
    //   }
    return Promise.resolve(response.data.data);
  },
  error => {
    if (error.response.status == 401) {
      localStorage.clear();
      window.location.reload();
    }
    return Promise.reject(error);
  }
);

/**
 * GET method
 * @param {*} url  请求地址
 * @param {*} data 查询参数
 */
api.fetch = async config => {
  const result = await api(config);
  return result;
};
export default api;
