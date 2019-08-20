import Vue from 'vue';
import App from './App.vue';
import router from './router/index';
import store from './store/index';
import './icons';
import mWindow from 'mixins/window';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

Vue.config.productionTip = false;
Vue.use(ElementUI);
Vue.mixin(mWindow);

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app');
