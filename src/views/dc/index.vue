<template>
  <div class="dc-container">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'dc-container',
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
