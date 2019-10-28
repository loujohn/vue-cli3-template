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
              props: route => ({ ...route.query }),
            },
            {
              path: 'particular',
              name: 'dc-particular',
              component: () => import('views/dc/particular'),
              props: route => ({ ...route.query }),
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

function getRootPath(type) {
  switch (type) {
    case 1:
      return '/sj';
    case 2:
      return '/qx';
    case 3:
      return '/dc';
    default:
      return '';
  }
}

function preventRoute(type, path, from, next) {
  if (path === '/login') {
    return next();
  }
  const regMap = {
    '1': /(sj|xt)/,
    '2': /qx/,
    '3': /dc/,
  };
  if (!regMap[type].test(path)) {
    if (from.path === '/') {
      return next(getRootPath(type));
    }
    return next(from.path);
  }
  next();
}

router.beforeEach(({ path }, from, next) => {
  const isLogin = Boolean(store.state.token);
  let userInfo = sessionStorage.getItem('userInfo');
  let type;
  if (userInfo) {
    userInfo = JSON.parse(userInfo);
    ({ type } = userInfo);
  }
  if (!isLogin && path !== '/login') return next({ path: '/login' });
  if (isLogin && path === '/login') return next(getRootPath(type));

  preventRoute(type, path, from, next);
});

export default router;
