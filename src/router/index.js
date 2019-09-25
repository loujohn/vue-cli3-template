import Vue from 'vue';
import Router from 'vue-router';
import layout from 'components/container';
import store from '../store';

Vue.use(Router);

const router = new Router({
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
              name: 'sj-list',
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
              name: 'qx-list',
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
        {
          path: 'xt',
          component: () => import('views/xt/index'),
          redirect: 'xt/list',
          children: [
            {
              path: 'list',
              name: 'xt-list',
              component: () => import('views/xt/list'),
            },
          ],
        },
        {
          path: 'dc',
          component: () => import('views/dc/index'),
          redirect: 'dc/list',
          children: [
            {
              path: 'list',
              name: 'dc-list',
              component: () => import('views/dc/list'),
            },
            {
              path: 'detail',
              name: 'dc-detail',
              component: () => import('views/dc/detail'),
            },
          ],
        },
      ],
    },
    {
      path: '/login',
      component: () => import('views/user/login'),
    },
    {
      path: '*',
      component: () => import('views/404'),
    },
  ],
});

router.beforeEach(({ path }, from, next) => {
  const isLogin = Boolean(store.state.token);
  if (!isLogin && path !== '/login') return next({ path: '/login' });
  if (isLogin && path === '/login') return next({ path: '/' });
  next();
});

export default router;
