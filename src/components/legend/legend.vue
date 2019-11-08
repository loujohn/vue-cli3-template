<template>
  <div class="map-legend" :style="position">
    <div class="legend-item" v-for="option in legendOption" :key="option.name">
      <span
        class="legend-dot"
        :style="{ backgroundColor: option.color }"
      ></span>
      <span class="legend-text">{{ option.name }}</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'map-legend',
  props: {
    legendOption: {
      type: Array,
      default: () => [
        {
          name: '未调查',
          color: '#909399',
        },
        {
          name: '未提交',
          color: '#e6a23c',
        },
        {
          name: '审核中',
          color: '#409eff',
        },
        {
          name: '审核未通过',
          color: '#f56c6c',
        },
        {
          name: '已完成',
          color: '#67c23a',
        },
      ],
    },
    position: {
      type: Object,
      default: () => ({
        bottom: '10px',
        right: '10px',
      }),
    },
  },
};
</script>

<style lang="scss">
.map-legend {
  padding: 10px;
  background-color: rgba(255, 255, 255, 0.7);
  border-radius: 3px;
  position: absolute;
  .legend-item {
    .legend-dot {
      display: inline-block;
      height: 15px;
      width: 15px;
      border-radius: 100%;
      vertical-align: middle;
      margin-right: 8px;
    }
    .legend-text {
      font-size: 14px;
    }
  }
}
</style>
