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
            <el-input v-model="keyword" placeholder="请输入用户名" size="small" class="my-input" clearable></el-input>
          </el-col>
          <el-col :span="4">
            <span class="label">行政区:</span>
            <el-select
              v-model="xzqh"
              size="small"
              clearable
            >
              <el-option
                v-for="item in xzqhList"
                :key="item.label"
                :label="item.label"
                :value="item.value"
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
            ></el-date-picker>
          </el-col>
        </el-row>
      </div>
      <el-table header-row-class-name="customer-table-header">
        <el-table-column type="index"></el-table-column>
        <el-table-column label="行政区"></el-table-column>
        <el-table-column label="用户名"></el-table-column>
        <el-table-column label="真实姓名"></el-table-column>
        <el-table-column label="所在单位"></el-table-column>
        <el-table-column label="访问终端"></el-table-column>
        <el-table-column label="访问IP"></el-table-column>
        <el-table-column label="访问时间"></el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination
          :total="20"
          layout="total, prev, pager, next"
          :small="true"
          :pager-count="5"
          :current-page="1"
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
      keyword: '',
      xzqh: '',
      time: [],
      xzqhList: [
        {
          label: '重庆市',
          value: '1',
        },
        {
          label: '万州区',
          value: '2',
        },
      ],
    };
  },
  mounted() {},
  methods: {},
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
      .my-input, .el-select {
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
