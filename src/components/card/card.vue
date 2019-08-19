<template>
  <div class="custom-card">
    <div class="data">
      <p>{{ data.name || 'Title' }}</p>
    </div>
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
<style lang="scss">
.custom-card {
  display: flex;
}
</style>
