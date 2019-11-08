<template>
  <div class="equipment-manage">
    <div class="my-breadcrumb">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>
          <i class="el-icon-s-home"></i> 市级
        </el-breadcrumb-item>
        <el-breadcrumb-item>设备管理</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="list">
      <div class="filter">
        <el-row :gutter="30">
          <el-col :span="4">
            <span class="label">用户名:</span>
            <el-input
              v-model="keyword"
              placeholder="请输入用户名"
              size="small"
              class="my-input"
              clearable
              @input="getList(1)"
            ></el-input>
          </el-col>
          <el-col :span="4">
            <span class="label">行政区:</span>
            <el-select
              v-model="xzqh"
              size="small"
              clearable
              filterable
              @change="getList(1)"
            >
              <el-option
                v-for="item in xzqhList"
                :key="item.code"
                :label="item.name"
                :value="item.code"
              ></el-option>
            </el-select>
          </el-col>
          <el-col :span="4">
            <span class="label">设备类型:</span>
            <el-select
              v-model="deviceType"
              size="small"
              clearable
              @change="getList(1)"
            >
              <el-option
                v-for="item in equipmentList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-col>
          <el-col :span="4">
            <span class="label">状态:</span>
            <el-select
              v-model="status"
              size="small"
              clearable
              @change="getList(1)"
            >
              <el-option
                v-for="item in ztList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-col>
          <el-col :span="8" style="display: flex; justify-content: flex-end">
            <el-button type="info" size="small" @click="transAllDevices(0)"
              >批量注销</el-button
            >
            <el-button type="warning" size="small" @click="transAllDevices(-1)"
              >批量启用</el-button
            >
          </el-col>
        </el-row>
      </div>
      <el-table
        header-row-class-name="customer-table-header"
        ref="table"
        :data="list"
        @select="handleSelect"
        @select-all="handleSelectAll"
      >
        <el-table-column type="selection"></el-table-column>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="行政区" prop="xzqhName"></el-table-column>
        <el-table-column label="用户名" prop="userName"></el-table-column>
        <el-table-column label="真实姓名" prop="realName"></el-table-column>
        <el-table-column label="电话号码" prop="telephone"></el-table-column>
        <el-table-column label="设备类型" prop="type"></el-table-column>
        <el-table-column label="设备型号" prop="name"></el-table-column>
        <el-table-column label="注册时间" prop="createTime" width="160"></el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <el-tag
              size="medium"
              :class="scope.row.status === 0 ? 'normalTag' : 'logoutTag'"
            >
              {{ scope.row.status === 0 ? '正 常' : '已注销' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              :type="scope.row.status === 0 ? 'danger' : 'warning'"
              size="mini"
              @click="transOneDevices(scope)"
              >{{ scope.row.status === 0 ? '注销' : '启用' }}</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination
          :total="totalCount"
          layout="total, prev, pager, next"
          :small="true"
          :pager-count="5"
          :page-size="pageSize"
          :current-page="pageIndex"
          @current-change="getList"
          background
        ></el-pagination>
      </div>
    </div>
  </div>
</template>
<script>
import { task } from 'api';
export default {
  name: 'equipmentManage',
  data() {
    return {
      list: [],
      pageIndex: 1,
      pageSize: 10,
      totalCount: 0,
      keyword: '',
      xzqh: '',
      deviceType: '',
      status: '',
      xzqhList: [],
      selectList: [],
      equipmentList: [
        {
          label: '平板',
          value: '平板',
        },
        {
          label: '手机',
          value: '手机',
        },
      ],
      ztList: [
        {
          label: '正常',
          value: '0',
        },
        {
          label: '已注销',
          value: '-1',
        },
      ],
    };
  },
  mounted() {
    this.getXZQH();
    this.getList();
  },
  methods: {
    async getXZQH(pageIndex) {
      const data = await task.getXZQH();
      this.xzqhList = data;
    },
    async getList(pageIndex) {
      let params = {
        pageIndex: pageIndex || this.pageIndex,
        pageSize: this.pageSize,
        keyword: this.keyword || undefined,
        xzqh: this.xzqh || undefined,
        deviceType: this.deviceType || undefined,
        status: this.status || undefined,
      };
      const data = await task.getUserDevices(params);
      const { dataList, totalCount } = data;
      this.list = dataList;
      this.totalCount = totalCount;
    },
    handleSelect(selection, row) {
      const existed = this.$R.contains(row.userId)(this.selectList);
      if (existed) {
        this.selectList = this.$R.filter(e => e !== row.userId)(
          this.selectList,
        );
      } else {
        this.selectList.push(row.userId);
      }
    },
    handleSelectAll(selection) {
      this.selectList = [];
      this.selectList = this.$R.pluck('userId')(selection);
    },
    transOneDevices(scope) {
      if (scope.row.status === 0) {
        this.logoutDevices(scope.row.userId);
      } else {
        this.startDevices(scope.row.userId);
      }
    },
    transAllDevices(val) {
      if (this.selectList.length === 0) {
        this.$message({
          type: 'warning',
          message: '请选择设备',
        });
        return;
      }
      let ids = this.$R.join(',')(this.selectList);
      if (val === 0) {
        this.logoutDevices(ids);
      } else {
        this.startDevices(ids);
      }
    },
    async logoutDevices(ids) {
      let params = {
        userIdArrayStr: ids,
      };
      const data = await task.disableDevices(params);
      if (data.code === 200 && data.message === 'ok') {
        this.$message({
          type: 'success',
          message: '注销成功',
        });
        this.getList();
      } else {
        this.$message({
          type: 'error',
          message: data.message || '注销失败',
        });
      }
      this.$refs.table.clearSelection();
      this.selectList = [];
    },
    async startDevices(ids) {
      let params = {
        userIdArrayStr: ids,
      };
      const data = await task.enableDevices(params);
      if (data.code === 200 && data.message === 'ok') {
        this.$message({
          type: 'success',
          message: '启用成功',
        });
        this.getList();
      } else {
        this.$message({
          type: 'error',
          message: data.message || '启用失败',
        });
      }
      this.$refs.table.clearSelection();
      this.selectList = [];
    },
  },
};
</script>
<style lang="scss">
.equipment-manage {
  padding: 30px 40px;
  padding-top: 0;
  .list {
    background-color: $base-color;
    .filter {
      padding: 15px 20px;
      .label {
        width: 60px;
        font-size: $font-sm;
        padding-right: 8px;
      }
      .my-input,
      .el-select {
        width: calc(100% - 68px);
        .el-input__inner {
          background-color: #f8f8f8;
        }
      }
    }

    .normalTag {
      color: #409eff;
      border: 1px solid #d9ecff;
      background-color: #ecf5ff;
      width: 60px;
      text-align: center;
    }
    .logoutTag {
      background-color: #f4f4f5;
      border-color: #e9e9eb;
      color: #909399;
      width: 60px;
      text-align: center;
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
      color: #fff;
      display: block;
      position: relative;
      text-decoration: none;
      background: #0094ec;
      height: 40px;
      width: 60px;
      line-height: 40px;
      padding: 0 10px 0 5px;
      text-align: center;
      margin-right: 23px;
      &:first-child {
        padding-left: 15px;
        border-radius: 4px 0 0 4px;
        &:before {
          border: none;
        }
      }

      &:before,
      &:after {
        content: '';
        position: absolute;
        top: 0;
        border: 0 solid #0094ec;
        border-width: 20px 10px;
        width: 0;
        height: 0;
      }
      &:before {
        left: -20px;
        border-left-color: transparent;
      }
      &:after {
        left: 100%;
        border-color: transparent;
        border-left-color: #0094ec;
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
