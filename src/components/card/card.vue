<template>
  <div class="custom-card" :style="{ width }">
    <div class="data">
      <p class="title">{{ data.name || 'Title' }}</p>
      <p class="content">
        <svg-icon class="num" iconClass="icon" />
        <span class="value">{{ data.num }}</span>
      </p>
    </div>
    <div class="icon">
      <svg-icon
        :style="{ fill: colorMap[data.name] }"
        :iconClass="svgClassMap[data.name]"
      />
    </div>
  </div>
</template>
<script>
/**
 *总任务: #0e67f2
 *已开展任务数: #fcb852
 *已完成进度 #00ca89
 * 即将到期任务数 #ff5757
 */
export default {
  props: {
    data: {
      type: Object,
      default: () => ({}),
    },
    width: {
      type: String,
      default: '250px',
    },
  },
  data() {
    return {
      svgClassMap: {
        总任务数: '总任务数',
        已开展任务数: '已开展任务',
        总完成进度: '完成',
        即将到期任务数: '到期',
      },
      colorMap: {
        总任务数: '#0e67f2',
        已开展任务数: '#fcb852',
        总完成进度: '#00ca89',
        即将到期任务数: '#ff5757',
      },
    };
  },
};
</script>
<style lang="scss">
.custom-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  box-shadow: 0 0 1px $shadow-color;
  background-color: $base-color;
  border-radius: 3px;
  .data {
    p {
      margin: 0;
    }
    .content {
      padding: 10px 0 0 0;
      display: flex;
      align-items: center;
    }
    .num {
      fill: #99c0f2;
    }
    .value {
      font-weight: 700;
      font-size: $font-xx;
      padding-left: 10px;
    }
  }
  .icon {
    padding: 15px;
    background-color: #f3f3f3;
    border-radius: 100%;
  }
  .svg-icon {
    height: 2em;
    width: 2em;
  }
}
</style>
