<template>
  <div class="progress-list">
    <div class="cards">
      <customer-card v-for="(item, index) in data" :key="index" :data="item" />
    </div>
  </div>
</template>
<script>
import customerCard from 'components/card/card';
export default {
  name: 'sj-list',
  components: {
    customerCard,
  },
  data() {
    return {
      data: [
        { name: '总任务数', num: 10 },
        { name: '已开展任务数', num: 5 },
        { name: '总完成进度', num: '30%' },
        { name: '即将到期任务数', num: 2 },
      ],
    };
  },
};
</script>
<style lang="scss">
.progress-list {
  padding: 30px 40px;
  .cards {
    display: flex;
    justify-content: space-around;
  }
}
</style>
