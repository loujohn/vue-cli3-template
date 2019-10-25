<template>
  <div class="head">
    <router-link tag="span" :to="{ path: '/' }" class="title"
      ><img class="img" :src="titleLogo" alt="" />{{ title }}</router-link
    >
    <el-dropdown @command="handleCommand">
      <div class="user">
        <svg-icon iconClass="user"></svg-icon>
        <span>{{ realName }} {{ userName }}</span>
      </div>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item command="logout">退出登录</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </div>
</template>
<script>
import { title } from 'config';
import { mapGetters } from 'vuex';
// const logo = require('../../assets/images/header/kuangshan.png');
import titleLogo from 'assets/images/sj/kuangshan .png';
export default {
  name: 'v-header',
  data() {
    return {
      title,
      titleLogo,
    };
  },
  computed: {
    ...mapGetters(['userName', 'realName']),
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
  },
};
</script>
<style lang="scss">
.head {
  height: 70px;
  padding: 0 40px;
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
      width: 45px;
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
}
</style>
