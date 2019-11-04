<template>
  <div class="sj-task">
    <div class="my-breadcrumb">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item
          ><i class="el-icon-s-home"></i> 市级</el-breadcrumb-item
        >
        <el-breadcrumb-item :to="{ name: 'sj-list' }"
          >任务列表</el-breadcrumb-item
        >
        <el-breadcrumb-item>新增任务</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="panel">
      <div class="form-container">
        <p class="title">数据导入</p>
        <el-form label-width="110px" ref="form" :model="form" :rules="rules">
          <el-form-item label="任务名称:" prop="taskName">
            <el-input v-model="form.taskName" :style="style"></el-input>
          </el-form-item>
          <el-form-item label="创建方式:" prop="importType">
            <el-radio-group v-model="form.importType">
              <el-radio
                v-for="item in createWayList"
                :key="item.name"
                :label="item.value"
                >{{ item.name }}</el-radio
              >
            </el-radio-group>
          </el-form-item>
          <el-form-item label="调查模板:" v-if="showTemplate" prop="templateId">
            <el-select
              v-model="form.templateId"
              filterable
              remote
              placeholder="请输入关键词"
              :remote-method="remoteMethod"
              :loading="loading"
              :style="style"
              clearable
              @change="handleSelectChange"
            >
              <el-option
                v-for="item in options"
                :key="item.id"
                :label="item.templateName"
                :value="item.id"
              >
              </el-option>
            </el-select>
            <field
              ref="field"
              :fieldList="fieldList"
              v-show="form.templateId"
            />
          </el-form-item>
          <el-form-item label="数据选择:" prop="layerNameArrayStr">
            <upload
              ref="upload"
              @upload-success="handleUploadSuccess"
              @file-remove="handleFileRemove"
            />
            <field
              ref="field"
              :fieldList="fieldList"
              v-if="!showTemplate && !isEmpty"
            />
          </el-form-item>
          <el-form-item label="要求完成时间:" prop="completeTime">
            <el-date-picker
              :style="style"
              type="date"
              placeholder="选择日期时间"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd HH:mm:ss"
              v-model="form.completeTime"
            ></el-date-picker>
          </el-form-item>
          <div class="confirm">
            <el-button type="primary" @click="submit()" v-loading="loading"
              >确定</el-button
            >
          </div>
        </el-form>
      </div>
      <guide />
    </div>
  </div>
</template>

<script>
// 支持选择已建的任务名称和新建任务名称两种方式。选择已建的任务名称，其数据导入方式包括追加和覆盖两种，其中覆盖要求该任务还未开展调查。
import { task } from 'api';
import guide from 'components/guide/guide';
import field from 'components/field/field';
import upload from 'components/upload/upload';
export default {
  name: 'task',
  components: {
    guide,
    field,
    upload,
  },
  data() {
    return {
      form: {
        templateId: '',
        layerNameArrayStr: '',
        extraFieldStr: '',
        taskName: '',
        taskDataTypeId: '28ba2788-71a1-4897-ad8b-9ddcdfdf3ead',
        completeTime: '',
        importType: 1,
      },
      rules: {
        taskName: [
          { required: true, message: '任务名称不能为空', trigger: 'blur' },
        ],
        layerNameArrayStr: [
          { required: true, message: '请上传数据文件', trigger: 'blur' },
        ],
        templateId: [
          { required: true, message: '请选择模板', trigger: 'blur' },
        ],
        completeTime: [
          { required: true, message: '请选择完成时间', trigger: 'blur' },
        ],
        importType: [
          { required: true, message: '请选择创建方式', trigger: 'blur' },
        ],
      },
      createWayList: [
        { name: '通过模板创建', value: 1 },
        { name: '通过GDB创建', value: 0 },
      ],
      fieldList: [],
      showTemplate: true,
      loading: false,
      options: [],
      style: {
        width: '100%',
      },
    };
  },
  computed: {
    isEmpty() {
      return this.fieldList.length === 0;
    },
  },
  watch: {
    'form.importType': function(val) {
      val = val.toString();
      this.showTemplate = val === '1' || val === '';
      this.form.templateId = '';
      this.fieldList = [];
      this.$refs['upload'].$refs['upload'].clearFiles();
    },
  },
  mounted() {
    this.remoteMethod('');
  },
  methods: {
    async remoteMethod(query) {
      this.loading = true;
      const data = await task.getTemplateList({ keyword: query });
      this.loading = false;
      const { dataList } = data;
      this.options = dataList;
    },
    async handleSelectChange(val) {
      if (!val) return false;
      const params = {
        id: val,
      };
      const res = await task.getTemplateDetail(params);
      const {
        data: {
          referenceInfo: { fields },
        },
      } = res;
      this.fieldList = fields;
      this.$refs['form'].clearValidate('templateId');
    },
    handleUploadSuccess(data) {
      const { fields, layerNameArrayStr } = data;
      this.form.layerNameArrayStr = layerNameArrayStr;
      this.$refs['form'].clearValidate('layerNameArrayStr');
      if (!this.form.importType) {
        this.fieldList = fields;
      }
    },
    handleFileRemove() {
      this.fieldList = [];
      this.form.layerNameArrayStr = '';
    },
    submit() {
      this.$refs['form'].validate(async valid => {
        if (valid) {
          const extraFields = this.$refs['field'].extraFields;
          this.form.extraFieldStr = extraFields.join(',');
          const res = await task.taskImport(this.form);
          if (res.code.toString() === '200') {
            this.$message({
              type: 'success',
              message: '成功',
            });
            this.$refs['form'].resetFields();
            this.fieldList = [];
            this.$refs['field'].extraFields = [];
            this.$refs['upload'].$refs['upload'].clearFiles();
          }
        }
      });
    },
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
      .import {
        color: #0094ec;
      }
      .confirm {
        text-align: right;
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
