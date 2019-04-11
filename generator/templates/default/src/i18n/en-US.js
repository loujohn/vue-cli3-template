<% if (options['ui-framework'] === 'element-ui') {%>
  import en from 'element-ui/lib/locale/lang/en'
  <% } %>
  <% if (options['ui-framework'] === 'iview') {%>
  import en from 'iview/dist/locale/en-US'
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
        home: "Home",
        echart: "Echart"
      },
      profile: {
        menu: {
          logout: "Logout"
        }
      }
    },
    echart: {
      pie: "pie",
      bar: "bar"
    }
  },
  en
);
