<template>
  <div class="guide">
    <p class="title">
      <svg-icon iconClass="提示" :style="{ fill: '#0094ec' }"></svg-icon>
      <span>使用提示</span>
    </p>
    <p v-for="tip in tips" :key="tip.name">{{ tip.name }}： {{ tip.value }}</p>
  </div>
</template>
<script>
export default {
  name: 'guide',
  data() {
    return {
      tips: [
        { name: '任务名称', value: '对当前任务取一个名称。' },
        {
          name: '调查模板',
          value:
            '支持导入已有的模板和通过数据创建两种模式，用于调查指标的定义。',
        },
        { name: '字段编辑', value: '用于调查指标项的增、删、改。' },
        {
          name: '数据选择',
          value:
            '选择需要导入的任务包文件，支持gdb文件格式。要求数据内容必须包含XZQH（行政区划）字段。',
        },
        { name: '坐标系要求', value: '大地2000坐标系。' },
      ],
    };
  },
};
</script>
<style lang="scss">
.guide {
  padding: 30px 20px;
  box-sizing: border-box;
  width: 60%;
  background-color: #f8f8f8f8;
  border-radius: 3px;
  .title {
    margin: 0;
    span {
      font-size: 14px;
      padding-left: 5px;
    }
  }
  p:not(.title) {
    margin: 0;
    padding-top: 30px;
    font-size: 14px;
    color: #606266;
  }
}
</style>
