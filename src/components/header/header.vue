<template>
  <div class="head">
    <span class="title">{{ title }}</span>
    <div class="user">
      <svg-icon iconClass="user"></svg-icon>
      <span>李明</span>
    </div>
  </div>
</template>
<script>
import { title } from 'config';
export default {
  name: 'v-header',
  data() {
    return {
      title,
    };
  },
};
</script>
<style lang="scss">
.head {
  height: 70px;
  padding: 0 40px;
  background-color: $header-bg-color;
  display: flex;
  justify-content: space-between;
  .title,
  .user {
    display: inline-block;
    height: $head-height;
    line-height: $head-height;
  }
  .title {
    color: $base-color;
    font-size: $font-xl;
    font-weight: bold;
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
