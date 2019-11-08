<template>
  <div class="visit-log">
    <div class="my-breadcrumb">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>
          <i class="el-icon-s-home"></i> 市级
        </el-breadcrumb-item>
        <el-breadcrumb-item>访问日志</el-breadcrumb-item>
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
              filterable
              clearable
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
          <el-col :span="12">
            <span class="label">访问时间:</span>
            <el-date-picker
              v-model="time"
              size="small"
              type="datetimerange"
              unlink-panels
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              format="yyyy-MM-dd HH:mm:ss"
              value-format="yyyy-MM-dd HH:mm:ss"
              @change="getList(1)"
            ></el-date-picker>
          </el-col>
        </el-row>
      </div>
      <el-table header-row-class-name="customer-table-header" :data="list">
        <el-table-column type="index"></el-table-column>
        <el-table-column label="行政区" prop="xzqhName"></el-table-column>
        <el-table-column label="用户名" prop="userName"></el-table-column>
        <el-table-column label="真实姓名" prop="realName"></el-table-column>
        <el-table-column label="访问终端" prop="os"></el-table-column>
        <el-table-column label="访问IP" prop="loginIp"></el-table-column>
        <el-table-column label="访问时间" prop="actionTime"></el-table-column>
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
  name: 'visitLog',
  data() {
    return {
      list: [],
      pageIndex: 1,
      pageSize: 10,
      totalCount: 0,
      keyword: '',
      xzqh: '',
      time: [],
      xzqhList: [],
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
      let startTime, endTime;
      if (this.time && this.time.length !== 0) {
        startTime = this.time[0];
        endTime = this.time[1];
      }
      let params = {
        pageIndex: pageIndex || this.pageIndex,
        pageSize: this.pageSize,
        xzqh: this.xzqh || undefined,
        startTime: startTime || undefined,
        endTime: endTime || undefined,
        keyword: this.keyword || undefined,
      };
      const data = await task.getLoginLog(params);
      const { dataList, totalCount } = data;
      this.list = dataList;
      this.totalCount = totalCount;
    },
  },
};
</script>
<style lang="scss">
.visit-log {
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
      .el-range-editor--small.el-input__inner {
        background-color: #f8f8f8;
        .el-range-input {
          background-color: #f8f8f8;
        }
      }
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
