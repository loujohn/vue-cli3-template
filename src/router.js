import Vue from 'vue';
import Router from 'vue-router';

import layout from 'components/container';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      component: layout,
    },
  ],
});
