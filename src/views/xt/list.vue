<template>
  <div class="template-list">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>系统</el-breadcrumb-item>
      <el-breadcrumb-item>模版列表</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="list">
      <div class="operation">
        <edit-template @add-success="getList" btnText="新增模版"></edit-template>
      </div>
      <el-table
        :data="list"
        header-row-class-name="customer-table-header"
      >
        <el-table-column type="index"></el-table-column>
        <el-table-column
          label="模版名称"
          prop="templateName"
        ></el-table-column>
        <el-table-column
          label="创建时间"
          prop="createTime"
        ></el-table-column>
        <el-table-column
          label="操作"
          width="130px"
        >
          <template slot-scope="scope">
            <div style="display: flex; justify-content: space-around">
              <qx-detail :id="scope.row.id"></qx-detail>
              <edit-template @add-success="getList" btnText="编辑" :id="scope.row.id"></edit-template>
              <el-button
                type="text"
                size="mini"
                @click="toDeleteTemplate(scope.row.id)"
              >删除</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination
          :total="totalCount"
          layout="total, prev, pager, next"
          :small="true"
          :pager-count="5"
          background
          @current-change="handleCurrentPageChange"
        ></el-pagination>
      </div>
    </div>
  </div>
</template>
<script>
import { task } from 'api';
import list from 'mixins/list';
import editTemplate from './editTemplate';
import qxDetail from './qxDetail';
export default {
  name: 'template-list',
  components: {
    editTemplate,
    qxDetail,
  },
  mixins: [list],
  data() {
    return {
    };
  },
  mounted() {
    this.getList();
  },
  methods: {
    async toDeleteTemplate(id) {
      let params = {
        id: id,
      }
      let res = await task.deleteTemplate(params);
      if (res.code === 200 && res.message === 'ok') {
        this.$message({
          message: '删除成功',
          type: 'success',
        });
        this.getList();
      } else {
        this.$message({
          message: '删除失败',
          type: 'error',
        });
      }
    },
    async getList() {
      const data = await task.getTemplateList(this.params);
      const { dataList, totalCount } = data;
      this.list = dataList;
      this.totalCount = totalCount;
    },
    handleCurrentPageChange(val) {
      this.params.pageIndex = val;
      this.getList();
    },
  },
};
</script>
<style lang="scss">
.template-list {
  padding: 30px 40px;
  padding-top: 0;
  .list {
    background-color: $base-color;
    .operation {
      padding: 13px 20px;
      background-color: $base-color;
    }
  }
}
</style>
