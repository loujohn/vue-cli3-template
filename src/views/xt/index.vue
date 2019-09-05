<template>
  <div class="xt-container">
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'xt-container',
};
</script>

<style lang="scss">
.xt-container {
  .el-breadcrumb {
    padding: 10px 0;
  }
  .cards {
    display: flex;
    justify-content: space-between;
    padding-bottom: 30px;
  }
}
</style>
