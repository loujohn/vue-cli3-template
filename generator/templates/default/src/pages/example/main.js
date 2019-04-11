import Vue from "vue";
import bootstrap from "@/bootstrap";
import Router from "@/router";
import routes from "./routes";
import store from "./store";
import App from "./App";
import "@/icons";

// 单页组件
import components from "./components";

// 单页语言配置
import "@/i18n";
// eslint-disable-next-line
bootstrap({ Router, Component: App, routes, store: store }, app => {
  // 批量注册单页全局组件
  Object.values(components).forEach(component => {
    Vue.component(component.name, component);
  });
});
