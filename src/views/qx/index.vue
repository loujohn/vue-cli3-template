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
  .cards {
    display: flex;
    justify-content: space-between;
    padding-bottom: 30px;
  }
}
</style>
