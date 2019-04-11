import Vue from "vue";
import axios from "./axios";
Object.defineProperties(Vue.prototype, {
  $http: {
    get() {
      return axios;
    }
  }
});
<% if (options['ui-framework'] === 'element-ui') {%>
  // 使用ElementUI
  import ElementUI from 'element-ui'
  import 'element-ui/lib/theme-chalk/index.css'
  Vue.use(ElementUI)
  <% } %>
  
  <% if (options['ui-framework'] === 'iview') {%>
  // 使用iView
  import iView from 'iview';
  import 'iview/dist/styles/iview.css';
  Vue.use(iView)
  <% } %>

//使用lodash
import lodash from "lodash";
Object.defineProperties(Vue.prototype, {
  $_: {
    get() {
      return lodash;
    }
  }
});
//lodash fp
import fp from "lodash/fp";
Object.defineProperties(Vue.prototype, {
  $fp: {
    get() {
      return fp;
    }
  }
});
