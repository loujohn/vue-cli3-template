<template>
  <div class="geojson-edit">
    编辑
  </div>
</template>
<script>
import d2c from 'd2c';
export default {
  name: 'geojson-edit',
  props: ['map'],
  data() {
    return {
      D2c: d2c || window.d2c,
      draw: null,
    };
  },
};
</script>
<style lang="scss"></style>
