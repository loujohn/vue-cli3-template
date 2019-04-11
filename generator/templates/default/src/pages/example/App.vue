<template>
  <div class="app-view">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: "app",
  components: {}
};
</script>

<style>
.app-view {
  display: flex;

  min-height: 100%;
}
</style>
