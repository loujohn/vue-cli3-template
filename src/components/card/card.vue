<template>
  <div class="custom-card">
    <div class="data"></div>
    <div class="icon"></div>
  </div>
</template>
<script>
export default {
  props: {
    data: {
      type: Object,
      default: () => ({}),
    },
  },
};
</script>
<style lang="scss"></style>
