## vue template 
![build](https://img.shields.io/badge/build-passing-brightgreen.svg)  ![license](https://img.shields.io/badge/license-MIT-green.svg)  ![node](https://img.shields.io/badge/node%40latest-%3E%3D%208.0.0-brightgreen.svg)  
**基于vue cli3的web项目模版**

功能列表：
 多页面多入口打包
+ vue全家桶
+  elment ui/iview可选(新项目建议使用ivew，更新比较快，组件比较多)
+ css预处理器(less/sass/scss可选)，全局变量自动引入
+ postcss集成(autoprefixer)
+  eslint和prettier规范格式化代码
+  i18n实现国际化（多语言采用模块异步延迟加载方式，首先检测语言环境及用户上次使用的语言。在切换语言后，如果尚未加载的语言包将从服务器中加载，达到项目按需加载资源优化。）
+ mock server(easy mock)
+ PWA
+ 集成 axios ，nprogress ，echart，lodash等三方常用组件

### 快速开始
----

````
# 安装vue cli3
> npm install -g @vue/cli
# 从仓库加载
> vue create --preset direct:http://192.168.11.158/liujunhong/vue-cli3-template.git [project-name] --clone
# 从本地加载
> git clone http://192.168.11.158/liujunhong/vue-cli3-template.git
> vue create --preset ./vue-cli3-template [project-name] --no-git

# 根据需要选择设置
# ESLint config建议选择perttier
# css预编译建议选择scss
# vue router有后端支持选择histiory，没有选hash
# 建议选择PWA
# UI框架建议选择ivew，ivew示列模版没有写

cd [project-name]

# 运行开发版本
npm run dev

# 运行构建版本
npm run dev

# 格式化所有代码
npm run format

# 运行代码检查
npm run lint
````

### 项目结构
----
````
├── .gitignore
├── babel.config.js
├── dist                                #项目输出目录
├── package-lock.json
├── package.json
├── public
├── src                                 #源代码
│   ├── api                             #存放接口文件    
│   ├── assets                          #项目级公共资产文件
│   │   └── sass                        
│   │       └── var.scss                #全局sass变量
│   ├── bootstrap.js                    #单页初始化函数
│   ├── components                      #项目级公共组件
│   │   ├── charts                      #echart组件
│   │   ├── index.js                    #公共组件输出
│   │   ├── language.vue                #语言切换组件
│   │   ├── login.vue                   #登陆组件
│   │   └── svg-icon                    #svg组件
│   ├── config.js                       #项目配置文件
│   ├── i18n                            #国际化目录
│   │   ├── en-US.js
│   │   ├── index.js
│   │   └── zh-CN.js
│   ├── icons                           #svg图标目录
│   │   ├── index.js
│   │   ├── svg
│   ├── lib                             #第三方公共文件
│   │   ├── axios.js
│   │   └── index.js
│   ├── pages                           #页面文件夹
│   │   ├── example                     #复杂页面示例   
│   │   │   ├── App.vue                 #必须，页面根组件
│   │   │   ├── components              #页面级公共组件
│   │   │   │   ├── common
│   │   │   │   ├── index.js
│   │   │   │   └── layout.vue
│   │   │   ├── index.html              #必须，页面模板文件
│   │   │   ├── main.js                 #必须，页面入口文件
│   │   │   ├── routes                  #路由配置
│   │   │   │   ├── echart.js
│   │   │   │   ├── index.js
│   │   │   │   └── project.js
│   │   │   ├── store                   #页面store
│   │   │   │   ├── actions.js
│   │   │   │   ├── index.js
│   │   │   │   ├── modules             #页面子store
│   │   │   │   ├── mutations.js
│   │   │   │   └── state.js
│   │   │   └── views                   #SPA页面各子view
│   │   │       ├── 404.vue
│   │   │       ├── echart.vue
│   │   │       ├── home.vue
│   │   │       ├── login.vue
│   │   │       └── project
│   │   ├── index                       #空的复杂页面模版
│   │   │   ├── App.vue
│   │   │   ├── components
│   │   │   ├── index.html
│   │   │   ├── main.js
│   │   │   ├── routes
│   │   │   │   └── index.js
│   │   │   ├── store
│   │   │   │   ├── actions.js
│   │   │   │   ├── index.js
│   │   │   │   ├── modules
│   │   │   │   ├── mutations.js
│   │   │   │   └── state.js
│   │   │   └── views
│   │   │       ├── 404.vue
│   │   │       └── home.vue
│   │   └── simple                     #简单页面示列     
│   │       ├── App.vue
│   │       ├── index.html
│   │       └── main.js
│   ├── registerServiceWorker.js       #pwa
│   ├── router.js                      #项目路由设置
│   ├── store                          #项目级公用store
│   │   ├── index.js
│   │   ├── modules                    #项目级store子模块
│   │   │   ├── Language.js
│   │   │   ├── User.js
│   │   │   ├── Webconfig.js
│   │   │   └── index.js
│   │   ├── mutation-type.js           #store常量
│   │   └── plugins.js                 #store日志插件
│   └── utils                          #工具函数
│       ├── directives.js               
│       ├── filters.js
│       └── validate.js
├── tests
└── prettier.config.js                 #prettier定制
└── vue.config.js                      #webpack配置修改
````

### 项目子结构说明
----

#### 业务子结构

部分目录根据业务分割：

+ src/api
+ src/store/modules
+ src/pages/
+ src/pages/views
+ src/pages/store/modules
+ src/page/routes

#### 通用结构

+ utils , assets 文件夹可以根据情况添加，原则是放在里面的文件只有同级或者同级的子级会用到。

### 页面结构

+ 页面文件夹最少需要 App.vue、index.js、index.html 三个文件组成。
+ 最简结构：
  
  ````
  └── simple                     #简单页面示列     
  ├── App.vue
  ├── index.html
  └── main.js
  ````

### TodoList
----
- [x] 项目目录结构
- [x] elment ui集成
- [x] echart 集成
- [x] scss编译
- [x] scss自动引入变量
- [x] vue-router/vuex
- [x] easy mock
- [x] i18n 
- [x] axios集成
- [x] lodash集成
- [x] proxy 配置
- [x] pwa可选
- [x] prettier集成
- [x] postcss集成
- [x] less/scss可选
- [x] elemnet/iview可选
- [x] eslint配置
- [x] babel配置