<template>
  <div class="container">
    <v-header />
    <router-view class="view"></router-view>
  </div>
</template>
<script>
import vHeader from 'components/header/header';
export default {
  name: 'container',
  components: {
    vHeader,
  },
};
</script>
<style lang="scss">
.container {
  height: 100%;
  .view {
    height: calc(100% - 70px);
    overflow: auto;
    background-color: $bg-color;
  }
}
</style>
