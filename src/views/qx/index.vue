<template>
  <div class="qx-container">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'qx-container',
};
</script>
<style lang="scss">
.qx-container {
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
