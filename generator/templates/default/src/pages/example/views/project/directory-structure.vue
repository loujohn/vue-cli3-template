<template>
  <div class="mume markdown-preview   ">
    <!-- prettier-ignore -->
    <!-- eslint-disable -->
    <vue-markdown>
      ## 项目目录结构
      ----
      ````
      test1
      ├── .gitignore
      ├── READEME.md
      ├── babel.config.js
      ├── dist #发布目录
      ├── package-lock.json
      ├── package.json
      ├── public
      ├── src #资源目录
      │   ├── assets #项目级公共资产文件
      │   │   └── sass
      │   │   └── var.scss #全局sass变量
      │   ├── bootstrap.js #单页初始化函数
      │   ├── components #项目级公共组件
      │   │   ├── charts
      │   │   │   ├── bar.vue
      │   │   │   ├── index.js
      │   │   │   ├── pie.vue
      │   │   │   └── theme.json
      │   │   ├── index.js
      │   │   └── svg-icon
      │   │   └── index.vue
      │   ├── config.js #项目级配置文件
      │   ├── i18n #国际化文件
      │   │   ├── en-US.js
      │   │   ├── index.js
      │   │   └── zh-CN.js
      │   ├── icons #svg图标
      │   ├── lib #初始化第三方库
      │   │   ├── axios.js
      │   │   └── index.js
      │   ├── pages #页面文件夹
      │   │   ├── simple #简单页面示列
      │   │   │   ├── App.vue #必须，页面根组件
      │   │   │   ├── index.html #必须，页面模板文件
      │   │   │   └── main.js #必须，页面入口文件
      │   │   └── test #复杂页面示列
      │   │   ├── App.vue #必须，页面根组件
      │   │   ├── components #页面级公用组件
      │   │   │   ├── common
      │   │   │   │   ├── footer.vue
      │   │   │   │   └── header.vue
      │   │   │   ├── index.js
      │   │   │   ├── language.vue
      │   │   │   └── layout.vue
      │   │   ├── index.html
      │   │   ├── main.js
      │   │   ├── routes #路由配置
      │   │   │   ├── echart.js
      │   │   │   ├── index.js
      │   │   │   ├── manage.js
      │   │   │   └── system.js
      │   │   ├── store #页面store配置
      │   │   │   ├── actions.js
      │   │   │   ├── index.js
      │   │   │   ├── modules #页面store子模块
      │   │   │   │   ├── article.js
      │   │   │   │   └── index.js
      │   │   │   ├── mutations.js
      │   │   │   └── state.js
      │   │   └── views #页面SPA各子view
      │   │   ├── 404.vue
      │   │   ├── account.vue
      │   │   ├── echart.vue
      │   │   ├── home.vue
      │   │   ├── login.vue
      │   │   ├── manage
      │   │   │   ├── hello.vue
      │   │   │   ├── index.vue
      │   │   │   └── world.vue
      │   │   └── system.vue
      │   ├── registerServiceWorker.js #PWA
      │   ├── router.js #项目路由设置
      │   ├── store #项目级公用store
      │   │   ├── index.js
      │   │   ├── modules #项目级store子模块
      │   │   │   ├── Language.js
      │   │   │   ├── User.js
      │   │   │   ├── Webconfig.js
      │   │   │   └── index.js
      │   │   ├── mutation-type.js #store常量
      │   │   └── plugins.js #store日志函数
      │   └── utils #工具函数
      │   ├── auth.js
      │   └── validate.js
      ├── tests
      └── vue.config.js
      ````
    </vue-markdown>
  </div>
</template>

<script>
import VueMarkdown from 'vue-markdown';
export default {
  components: {
    VueMarkdown,
  },
  methods: {},
};
</script>
