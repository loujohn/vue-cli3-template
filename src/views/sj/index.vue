<template>
  <div class="sj-container">
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'sj-container',
};
</script>

<style lang="scss">
.sj-container {
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
