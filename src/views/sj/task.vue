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
        <el-form label-width="100px" ref="form" :model="form" :rules="rules">
          <el-form-item label="任务名称:" prop="taskName">
            <el-input v-model="form.taskName" :style="style"></el-input>
          </el-form-item>
          <el-form-item label="创建方式:" prop="importType">
            <el-select v-model="form.importType" :style="style" clearable>
              <el-option
                v-for="item in createWayList"
                :key="item.name"
                :label="item.name"
                :value="item.value"
              >
              </el-option>
            </el-select>
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
          <el-form-item label="数据选择:" prop="gdbFilePath">
            <upload ref="upload" @upload-success="handleUploadSuccess" />
            <field
              ref="field"
              :fieldList="fieldList"
              v-if="!showTemplate && !isEmpty"
            />
          </el-form-item>
          <el-form-item label="完成时间:" prop="completeTime">
            <el-date-picker
              :style="style"
              type="datetime"
              placeholder="选择日期时间"
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
        gdbFilePath: '',
        extraFieldStr: '',
        taskName: '',
        taskDataTypeId: '28ba2788-71a1-4897-ad8b-9ddcdfdf3ead',
        completeTime: '',
        importType: '',
      },
      rules: {
        taskName: [
          { required: true, message: '任务名称不能为空', trigger: 'blur' },
        ],
        gdbFilePath: [
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
    },
    handleUploadSuccess(data) {
      const { fields, gdbFilePath } = data;
      this.form.gdbFilePath = gdbFilePath;
      if (!this.form.importType) {
        this.fieldList = fields;
      }
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
        color: #0e67f2;
      }
      .confirm {
        text-align: right;
      }
    }
  }
}
</style>
