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
 *总任务: #0094ec
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
        总图斑数: '图斑',
        已完成: '完成',
        待审核: '审核',
        调查中: '调查中',
        已核实图斑: '已开展任务',
        未核实图斑: '未分发',
        已提交图斑: '完成',
      },
      colorMap: {
        总任务数: '#0094ec',
        已开展任务数: '#fcb852',
        总完成进度: '#00ca89',
        即将到期任务数: '#ff5757',
        总图斑数: '#0094ec',
        已完成: '#00ca89',
        待审核: '#fcb852',
        调查中: '#ff5757',
        已核实图斑: '#fcb852',
        未核实图斑: '#ff5757',
        已提交图斑: '#00ca89',
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
  box-sizing: border-box;
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
