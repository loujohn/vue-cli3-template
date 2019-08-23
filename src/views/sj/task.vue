<template>
  <div class="sj-task">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>市级</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ name: 'sj-list' }"
        >任务列表</el-breadcrumb-item
      >
      <el-breadcrumb-item>新增任务</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="panel">
      <div class="form-container">
        <p class="title">数据导入</p>
        <el-form label-width="80px">
          <el-form-item label="任务名称:">
            <el-select v-model="form.taskName" :style="style"></el-select>
          </el-form-item>
          <el-form-item label="调查模板:">
            <el-select v-model="form.dcmb" :style="style"></el-select>
          </el-form-item>
          <el-form-item label="字段:">
            <template>
              <div class="field">
                <el-button type="text" icon="el-icon-plus">添加字段</el-button>
                <span>
                  <svg-icon iconClass="导入" :style="{ fill: '#0e67f2' }" />
                </span>
              </div>
            </template>
          </el-form-item>
          <el-form-item label="完成时间">
            <el-date-picker
              :style="style"
              v-model="form.finishTime"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="导入方式">
            <el-select v-model="form.drfs" :style="style"></el-select>
          </el-form-item>
          <el-form-item label="数据选择">
            <el-input></el-input>
            <span class="import">
              <svg-icon iconClass="导入" :style="{ fill: '#0e67f2' }"></svg-icon
              >导入
            </span>
          </el-form-item>
          <div class="confirm">
            <el-button type="primary">确定</el-button>
          </div>
        </el-form>
      </div>
      <div class="guide">
        <p class="title">
          <svg-icon iconClass="提示" :style="{ fill: '#0e67f2' }"></svg-icon>
          <span>使用提示</span>
        </p>
        <p>
          任务名称：对当前任务取一个名称。支持选择已建的任务名称和新建任务名称两种方式。选择已键的任务名称，其数据导入方式包括追加和覆盖两种，其中覆盖要求该任务还未开展调查。
        </p>
        <p>
          调查模板：支持导入已有的模板和通过数据创建两种模式，用于调查指标的定义。
        </p>
        <p>
          字段编辑：用于调查指标项的增、删、改。
        </p>
        <p>
          数据选择：选择需要导入的任务包文件，支持dgb、excel两种文件格式。要求数据内容必须包含XZQH（行政区划）字段。
        </p>
        <p>
          坐标系要求：大地2000坐标系
        </p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'task',
  data() {
    return {
      form: {
        taskName: '',
        dcmb: '',
        field: '',
        finishTime: '',
        drfs: '',
        sjxz: '',
      },
      style: {
        width: '100%',
      },
    };
  },
};
</script>

<style lang="scss">
.sj-task {
  padding: 30px 40px;
  padding-top: 0;
  .panel {
    display: flex;
    background-color: #fff;
    padding: 30px 50px 100px 50px;
    .form-container {
      width: 40%;
      padding-right: 30px;
      box-sizing: border-box;
      .field {
        display: flex;
        justify-content: space-between;
      }
      .import {
        color: #0e67f2;
      }
      .confirm {
        text-align: right;
      }
    }
    .guide {
      padding: 30px 20px;
      box-sizing: border-box;
      width: 60%;
      background-color: #f8f8f8f8;
      border-radius: 3px;
      .title {
        margin: 0;
        span {
          font-size: 14px;
          padding-left: 5px;
        }
      }
      p:not(.title) {
        margin: 0;
        padding-top: 30px;
        font-size: 14px;
        color: #606266;
      }
    }
  }
}
</style>
