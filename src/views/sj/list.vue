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
        <el-button
          type="primary"
          size="small"
          icon="el-icon-plus"
          @click="$router.push({ name: 'sj-task' })"
        >
          新增任务
        </el-button>
      </div>
      <el-table :data="tableData" header-row-class-name="customer-table-header">
        <el-table-column type="index"></el-table-column>
        <el-table-column label="任务名称" prop="name"></el-table-column>
        <el-table-column label="总数" prop="totalCount"></el-table-column>
        <el-table-column label="完成数" prop="finishCount"></el-table-column>
        <el-table-column label="进度">
          <template slot-scope="scope">
            <v-progress :percent="scope.row.percent" />
          </template>
        </el-table-column>
        <el-table-column label="操作" width="100px">
          <template slot-scope="scope">
            <el-button type="text" size="mini">追加</el-button>
            <el-button type="text" size="mini" @click="toDetail(scope.row.id)"
              >详情</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination
          :total="100"
          layout="total, prev, pager, next"
          :small="true"
          :pager-count="5"
          background
        ></el-pagination>
      </div>
    </div>
  </div>
</template>
<script>
import customerCard from 'components/card/card';
import vProgress from 'components/progress/progress';
export default {
  name: 'sj-list',
  components: {
    customerCard,
    vProgress,
  },
  data() {
    return {
      data: [
        { name: '总任务数', num: 10 },
        { name: '已开展任务数', num: 5 },
        { name: '总完成进度', num: '30%' },
        { name: '即将到期任务数', num: 2 },
      ],
      tableData: [
        {
          id: 0,
          num: 0,
          name: '测试',
          totalCount: 100,
          finishCount: 20,
          percent: 20,
        },
        {
          id: 1,
          num: 1,
          name: '测试1',
          totalCount: 390,
          finishCount: 70,
          percent: 50,
        },
        {
          id: 2,
          num: 2,
          name: '测试2',
          totalCount: 300,
          finishCount: 50,
          percent: 70,
        },
        {
          id: 3,
          num: 3,
          name: '测试3',
          totalCount: 150,
          finishCount: 50,
          percent: 100,
        },
      ],
    };
  },
  methods: {
    toDetail(id) {
      this.$router.push({ name: 'sj-detail', query: { id } });
    },
  },
};
</script>
<style lang="scss">
.progress-list {
  padding: 30px 40px;
  .list {
    background-color: $base-color;
    .operation {
      padding: 13px 20px;
      background-color: $base-color;
    }
  }
}
</style>
