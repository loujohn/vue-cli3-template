<% if (options['ui-framework'] === 'element-ui') {%>
  import zh from 'element-ui/lib/locale/lang/zh-CN'
  <% } %>
  <% if (options['ui-framework'] === 'iview') {%>
  import zh from 'iview/dist/locale/zh-CN'
<% } %>

export default Object.assign(
  {
    // 站点配置信息
    webconfig: {
      title: "test",
      copyright: "Copyright"
    },

    // 页面头部
    header: {
      nav: {
        home: "首页",
        echart: "图表"
      },
      profile: {
        menu: {
          logout: "登出"
        }
      }
    },
    echart: {
      pie: "环形图",
      bar: "柱形图"
    }
  },
  zh
);
