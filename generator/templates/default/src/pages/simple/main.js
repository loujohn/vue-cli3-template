import bootstrap from "@/bootstrap";
import Router from "@/router";
import App from "./App";
import generateStore from "@/store";

// 单页语言配置
import "@/i18n";

let routes = [];
const param = {
  state: {},
  actions: {},
  mutations: {},
  modules: {}
};
let store = generateStore(param);
// eslint-disable-next-line
bootstrap({ Router, Component: App, routes, store }, app => {});