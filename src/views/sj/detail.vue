<template>
  <div class="sj-detail">
    <div class="cards">
      <customer-card
        v-for="(item, index) in data"
        :key="index"
        :data="item"
        width="24%"
      />
    </div>
    <div class="list">
      <div class="operation"></div>
      <el-table header-row-class-name="customer-table-header" :data="tableData">
        <el-table-column label="图斑编号" prop="tbbh"></el-table-column>
        <el-table-column label="图斑名称" prop="tbmc"></el-table-column>
        <el-table-column label="图斑类型" prop="tblx"></el-table-column>
        <el-table-column label="描述信息" prop="msxx"></el-table-column>
        <el-table-column label="备注" prop="bz"></el-table-column>
        <el-table-column label="调查人员" prop="dcry"></el-table-column>
        <el-table-column label="调查事件" prop="dcsj"></el-table-column>
        <el-table-column label="调查状态" prop="dczt"></el-table-column>
        <el-table-column label="审核状态" prop="shzt"></el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination
          layout="total, prev, pager, next"
          :total="100"
          :small="true"
          background
          :pager-count="5"
        ></el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import customerCard from 'components/card/card';
export default {
  name: 'detail',
  components: {
    customerCard,
  },
  props: {
    id: {
      type: [Number, String],
    },
  },
  data() {
    return {
      data: [
        { name: '总图斑数', num: 300 },
        { name: '已完成', num: 200 },
        { name: '待审核', num: 50 },
        { name: '调查中', num: 50 },
      ],
      tableData: [
        {
          tbbh: '010071',
          tbmc: '洛阳村',
          tblx: '300',
          msxx: '200',
          bz: '已经废弃',
          dcry: '侯良月',
          dcsj: '2019-05-06 12:56',
          dczt: 0,
          shzt: 0,
        },
      ],
    };
  },
};
</script>

<style lang="scss">
.sj-detail {
  padding: 30px 40px;
  .list {
    background-color: $base-color;
    .operation {
      padding: 13px 20px;
      background-color: $base-color;
    }
    .customer-table-header,
    .customer-table-header th {
      background-color: #f1f1f1;
      color: #000;
    }
    .pagination {
      padding: 30px 10px;
      text-align: right;
    }
  }
}
</style>
