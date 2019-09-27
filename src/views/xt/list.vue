<template>
  <div class="template-list">
    <div class="my-breadcrumb">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item><i class="el-icon-s-home"></i> 系统</el-breadcrumb-item>
      <el-breadcrumb-item>模版列表</el-breadcrumb-item>
    </el-breadcrumb>
    </div>
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
    toDeleteTemplate(id) {
      this.$confirm('此操作将永久删除该模版, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deleteTemplate(id);
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    async deleteTemplate(id) {
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
  .my-breadcrumb {
    background-color: #fff;
    border-radius: 4px;
    margin: 10px 0;
    .el-breadcrumb {
      padding: 0px;
    }
    .el-breadcrumb__item {
      color:#FFF;
      display:block;
      position:relative;
      text-decoration: none;
      background: #0094ec;
      height: 40px;
      width: 60px;
      line-height:40px;
      padding: 0 10px 0 5px;
      text-align: center;
      margin-right: 23px;
      &:first-child{
        padding-left:15px;
        border-radius: 4px 0 0 4px;
        &:before{
          border:none;
        }
      }

      &:before,
      &:after{
        content: "";
        position:absolute;
        top: 0;
        border:0 solid #0094ec;
        border-width:20px 10px;
        width: 0;
        height: 0;
      }
      &:before{
        left:-20px;
        border-left-color:transparent;
      }
      &:after{
        left:100%;
        border-color:transparent;
        border-left-color:#0094ec;
      }

      .el-breadcrumb__inner {
        color: #fff;
      }
      .el-breadcrumb__separator {
        display: none;
      }
    }
  }
}
</style>
