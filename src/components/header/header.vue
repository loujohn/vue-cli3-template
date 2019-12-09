<template>
  <div class="head">
    <router-link tag="span" :to="{ path: getRoutePath() }" class="title">
      <img class="img" :src="titleLogo" alt />
      <!-- {{ '重庆市矿山调查系统' }} -->
    </router-link>
    <div class="right">
      <div class="menu-wrapper" v-if="getPermission()">
        <div
          class="menu-item"
          v-for="(item, index) in menuList"
          :key="index"
          :class="{
            active: item.router && activePart === item.name,
          }"
          @click="handleMenuSelect(item)"
        >
          <span>
            <svg-icon :iconClass="item.icon" />
            <p>{{ item.name }}</p>
          </span>
        </div>
      </div>
      <el-dropdown @command="handleCommand">
        <div class="user">
          <svg-icon iconClass="user"></svg-icon>
          <span>{{ realName }}</span>
        </div>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="logout">退出登录</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>
<script>
import { title } from 'config';
import { mapGetters } from 'vuex';
import titleLogo from 'assets/images/sj/logo_01.png';
export default {
  name: 'v-header',
  data() {
    return {
      title,
      titleLogo,
      menuList: [
        {
          name: '任务管理',
          router: 'sj-list',
          icon: '任务管理',
        },
        {
          name: '设备管理',
          router: 'equipment-manage',
          icon: '设备管理',
        },
        {
          name: '访问日志',
          router: 'visit-log',
          icon: '访问日志',
        },
      ],
      activePart: '任务管理',
    };
  },
  computed: {
    ...mapGetters(['userName', 'realName']),
  },
  mounted() {
    let currentPath = this.$route.path.substring(
      this.$route.path.lastIndexOf('/') + 1,
    );
    if (currentPath === 'visitLog') {
      this.activePart = '访问日志';
    } else if (currentPath === 'list') {
      this.activePart = '任务管理';
    } else if (currentPath === 'equipmentManage') {
      this.activePart = '设备管理';
    }
  },
  methods: {
    handleCommand(command) {
      switch (command) {
        case 'logout':
          sessionStorage.clear();
          window.location.reload();
          break;
        default:
          break;
      }
    },
    handleMenuSelect(item) {
      this.$router.push({
        name: item.router,
      });
      this.activePart = item.name;
    },
    getPermission() {
      let userInfo = sessionStorage.getItem('userInfo');
      let type;
      if (userInfo) {
        userInfo = JSON.parse(userInfo);
        ({ type } = userInfo);
      }
      if (type === 1) {
        return true;
      } else {
        return false;
      }
    },
    getRoutePath() {
      const userInfo = JSON.parse(sessionStorage.getItem('userInfo') || '{}');
      const { type } = userInfo;
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
    },
  },
};
</script>
<style lang="scss">
.head {
  height: 70px;
  padding: 0 30px;
  // background-color: $header-bg-color;
  background-color: #0087d7;
  display: flex;
  justify-content: space-between;
  .title,
  .user {
    display: inline-block;
    height: $head-height;
    line-height: $head-height;
    cursor: pointer;
  }
  .title {
    color: $base-color;
    font-size: $font-xl;
    font-weight: bold;
    display: flex;
    align-items: center;
    .img {
      height: 45px;
      width: 292px;
      margin-right: 8px;
    }
  }
  .user {
    color: $user-color;
    font-size: $font-sm;
    span {
      padding-left: 5px;
    }
  }
  .right {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    .menu-wrapper {
      height: 70px;
      display: flex;
      margin-right: 40px;
      .menu-item {
        position: relative;
        cursor: pointer;
        display: flex;
        flex-flow: column;
        align-items: center;
        justify-content: center;
        padding: 0 20px;
        span {
          height: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: flex-end;
          .svg-icon {
            font-size: 30px;
            color: #fff;
          }
          p {
            font-weight: bold;
            font-size: 14px;
            margin: 0;
            padding: 5px 0;
            box-sizing: content-box;
            color: #fff;
          }
        }
      }
      .menu-item.active {
        position: relative;
        background-color: #0094ec;
        // &:before {
        //   content: '';
        //   position: absolute;
        //   bottom: 0px;
        //   left: 42%;
        //   border-width: 0 10px 10px;
        //   border-style: solid;
        //   border-color: #eff4fb transparent;
        //   display: block;
        //   width: 0;
        // }
      }
    }
  }
}
</style>
