<template>
  <div class="progress-list">
    <div class="cards">
      <customer-card
        width="24%"
        v-for="(item, index) in data"
        :key="index"
        :data="item"
      />
    </div>
    <div class="list">
      <div class="operation">
        <a-button type="primary" icon="plus">新增任务</a-button>
      </div>
      <a-table :columns="columns"></a-table>
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
      columns: [
        { title: '序号' },
        { title: '任务名称' },
        { title: '总数' },
        { title: '完成数' },
        { title: '进度' },
        { title: '操作' },
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
    padding-bottom: 30px;
  }
  .list {
    .operation {
      padding: 13px 20px;
      background-color: $base-color;
    }
  }
}
</style>
