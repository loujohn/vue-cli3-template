import "normalize.css";
import Vue from "vue";
import i18n from "@/i18n";
import "Lib";

// import Store from "./store";
import components from "./components";

<% if (options.pwa) {%>
  import './registerServiceWorker'
<% } %>

  
//加载filter和directives
import * as filters from '@/utils/filters'
import * as directives from '@/utils/directives'
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})
Object.keys(directives).forEach(key => {
  Vue.directive(key, directives[key])
})


export default (
  { Router, Component, routes, store = {}, options },
  resolve = () => {}
) => {
  // 批量注册组件
  Object.values(components).forEach(component => {
    Vue.component(component.name, component);
  });

  // 绑定路由
  const router = Router ? Router(store, routes, options) : {};
  // 动态加载当前语言包
  // eslint-disable-next-line
  store.dispatch("setSystemLanguage", Vue.config.lang).then(res => {
    // 创建单页实例
    const app = new Vue({
      el: "#app",
      render: h => h(Component),
      store,
      router,
      i18n
    });

    // 回调函数
    resolve(app);
  });

  // const app = new Vue({
  //   el: '#app',
  //   render: h => h(Component),
  //   store,
  //   router,
  //   i18n
  // })

  // // 回调函数
  // resolve(app)
};
