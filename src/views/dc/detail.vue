<template>
  <div class="dc-detail">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>调查员</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ name: 'dc-list' }"
        >任务列表</el-breadcrumb-item
      >
      <el-breadcrumb-item>任务详情</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="cards">
      <customer-card
        v-for="(item, index) in data"
        :key="index"
        :data="item"
        width="24%"
      />
    </div>
    <div class="content">
      <div class="list">
        <div class="filter">
          <el-row :gutter="30">
            <el-col :span="8">
              <el-input
                :size="size"
                placeholder="请输入关键字搜索"
                v-model="params.keyword"
              ></el-input>
            </el-col>
            <el-col :span="8">
              <span class="label">状态:</span>
              <el-select v-model="params.status" :size="size"></el-select>
            </el-col>
            <el-col :span="8" style="text-align: right;">
              <span class="count">已选择0项</span>
              <el-button
                :size="size"
                style="margin-left: 8px; background-color:#0e67f2;color: #fff;"
              >
                <svg-icon iconClass="upload"></svg-icon>
                全部提交
              </el-button>
            </el-col>
          </el-row>
        </div>
        <el-table>
          <el-table-column type="selection"></el-table-column>
          <el-table-column label="矿山名称"></el-table-column>
          <el-table-column label="地块编号"></el-table-column>
          <el-table-column label="关闭类型"></el-table-column>
          <el-table-column label="行政区划"></el-table-column>
          <el-table-column label="调查人员"></el-table-column>
          <el-table-column label="状态"></el-table-column>
          <el-table-column label="操作">
            <template>
              <el-button size="mini" type="text">详情</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="map-container">
        <v-map style="border-radius: 3px;" />
      </div>
    </div>
  </div>
</template>
<script>
import customerCard from 'components/card/card';
import vMap from 'components/map/map';
import list from 'mixins/list';
export default {
  name: 'dc-detail',
  components: {
    customerCard,
    vMap,
  },
  mixins: [list],
  data() {
    return {
      data: [
        { name: '总图斑数', num: 0 },
        { name: '已核实图斑', num: 0 },
        { name: '未核实图斑', num: 0 },
        { name: '已提交图斑', num: 0 },
      ],
      params: {
        pageIndex: 1,
        pageSize: 10,
        status: 0,
        keyword: '',
      },
      size: 'small',
    };
  },
};
</script>

<style lang="scss">
.dc-detail {
  padding: 30px 40px;
  padding-top: 0;
  height: 100%;
  box-sizing: border-box;
  .content {
    display: flex;
    justify-content: space-between;
    height: calc(100% - 150px);
    .list,
    .map-container {
      width: 49.3%;
      height: 100%;
      border-radius: 3px;
    }
    .list {
      background-color: $base-color;
      overflow: auto;
      .filter {
        padding: 15px 20px;
        .label {
          width: 60px;
          font-size: $font-sm;
          padding-right: 8px;
        }
        .el-input {
          .el-input__inner {
            background-color: #f8f8f8;
          }
        }
        .el-select {
          width: calc(100% - 68px);
          .el-input__inner {
            background-color: #f8f8f8;
          }
        }
        .count {
          color: #0e67f2;
          font-size: 14px;
        }
      }
    }
  }
}
</style>
