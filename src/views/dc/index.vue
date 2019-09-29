<template>
  <div class="dc-container">
    <keep-alive :include="keepAliveComponents">
      <router-view></router-view>
    </keep-alive>
  </div>
</template>

<script>
export default {
  name: 'dc-container',
  data() {
    return {
      keepAliveComponents: ['dc-detail', 'dc-particular'],
    };
  },
};
</script>
<style lang="scss">
.dc-container {
  .el-breadcrumb {
    padding: 10px 0;
  }
  .cards {
    display: flex;
    justify-content: space-between;
    padding-bottom: 20px;
  }
}
</style>
