import Vue from 'vue';
import App from './App.vue';
import router from './router/index';
import store from './store/index';
import './icons';
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/antd.css';
import mWindow from 'mixins/window';

Vue.config.productionTip = false;

Vue.use(Antd);
Vue.mixin(mWindow);

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app');
