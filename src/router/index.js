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
              name: 'sj-task',
              component: () => import('views/sj/task'),
              props: route => ({ ...route.query }),
            },
            {
              path: 'detail',
              name: 'sj-detail',
              component: () => import('views/sj/detail'),
              props: route => ({ ...route.query }),
            },
          ],
        },
        {
          path: 'qx',
          component: () => import('views/qx/index'),
          redirect: 'qx/list',
          children: [
            {
              path: 'list',
              component: () => import('views/qx/list'),
            },
            {
              path: 'detail',
              name: 'qx-detail',
              component: () => import('views/qx/detail'),
              props: route => ({ ...route.query }),
            },
            {
              path: 'taskAllocation',
              name: 'task-allocation',
              component: () => import('views/qx/task-allocation'),
              props: route => ({ ...route.query }),
            },
            {
              path: 'investigatorManage',
              name: 'investigator-manage',
              component: () => import('views/qx/investigator-manage'),
            },
          ],
        },
      ],
    },
  ],
});
