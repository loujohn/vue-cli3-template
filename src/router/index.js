import Vue from 'vue';
import Router from 'vue-router';

import layout from 'components/container';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      component: layout,
      redirect: '/sj',
      children: [
        {
          path: 'sj',
          component: () => import('views/sj/index'),
          redirect: 'sj/list',
          children: [
            {
              path: 'list',
              component: () => import('views/sj/list'),
            },
            {
              path: 'task',
              name: 'task',
              component: () => import('views/sj/task'),
              props: route => ({ ...route.query }),
            },
            {
              path: 'detail',
              name: 'detail',
              component: () => import('views/sj/detail'),
              props: route => ({ ...route.query }),
            },
          ],
        },
        {
          path: 'qx',
          component: () => import('views/qx/index'),
        },
      ],
    },
  ],
});
