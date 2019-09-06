<template>
  <div>
    <el-button
      type="primary"
      size="small"
      icon="el-icon-plus"
      @click="centerDialogVisible = true"
      v-if="btnText === '新增模版'"
    >{{btnText}}</el-button>
    <el-button type="text" size="small" @click="getTemplate" v-else>{{btnText}}</el-button>

    <el-dialog :title="btnText" :visible.sync="centerDialogVisible" width="1000px" center>
      <el-form :model="form" :label-width="formLabelWidth" ref="template">
        <div class="form-card">
          <div class="form-title">
            <div class="form-rectangle">
              <div class="form-prefix"></div>
              <a>模版信息</a>
              <div class="form-triangle"></div>
            </div>
          </div>
          <div class="form-content">
            <el-row :gutter="0">
              <el-col :md="24" :lg="24" :xl="24">
                <el-form-item label="模版名称：" :rules="rules.tempName" prop="name">
                  <el-input v-model="form.name" autocomplete="off"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </div>
        </div>
        <div class="form-card">
          <div class="form-title">
            <div class="form-rectangle">
              <div class="form-prefix"></div>
              <a>字段信息</a>
              <div class="form-triangle"></div>
            </div>
          </div>
          <div class="form-table">
            <table>
              <thead>
                <tr>
                  <th style="width: 20%">别名</th>
                  <th style="width: 20%">字段名称</th>
                  <th style="width: 15%">是否是行政区划</th>
                  <th style="width: 15%">是否可编辑</th>
                  <th style="width: 15%">是否在pc展示</th>
                  <th style="width: 15%">是否在app展示</th>
                  <th style="width: 10%">操作</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, index) in form.params" :key="index">
                  <td>
                    <el-form-item>
                      <el-input v-model="item.fieldAlias"></el-input>
                    </el-form-item>
                  </td>
                  <td>
                    <el-form-item :prop="'params.' + index + '.fieldName'" :rules="rules.name">
                      <el-input v-model="item.fieldName"></el-input>
                    </el-form-item>
                  </td>
                  <td>
                    <el-form-item :prop="'params.' + index + '.isXzqh'">
                      <el-select v-model="item.isXzqh" placeholder="请选择" style="width:100%">
                        <el-option
                          v-for="item in showList"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value"
                        ></el-option>
                      </el-select>
                    </el-form-item>
                  </td>
                  <td>
                    <el-form-item :prop="'params.' + index + '.isEdit'">
                      <el-select v-model="item.isEdit" placeholder="请选择" style="width:100%">
                        <el-option
                          v-for="item in showList"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value"
                        ></el-option>
                      </el-select>
                    </el-form-item>
                  </td>
                  <td>
                    <el-form-item :prop="'params.' + index + '.isPcShow'">
                      <el-select v-model="item.isPcShow" placeholder="请选择" style="width:100%">
                        <el-option
                          v-for="item in showList"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value"
                        ></el-option>
                      </el-select>
                    </el-form-item>
                  </td>
                  <td>
                    <el-form-item :prop="'params.' + index + '.isAppShow'">
                      <el-select v-model="item.isAppShow" placeholder="请选择" style="width:100%">
                        <el-option
                          v-for="item in showList"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value"
                        ></el-option>
                      </el-select>
                    </el-form-item>
                  </td>
                  <td>
                    <el-button type="text" style="color: #F56C6C;" @click="removeParam(index)">
                      <i class="el-icon-remove"></i> 删除
                    </el-button>
                  </td>
                </tr>
              </tbody>
            </table>
            <div class="table-add-fk">
              <el-button @click="addParma" icon="el-icon-plus">新增字段</el-button>
            </div>
          </div>
        </div>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="centerDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addTemplate">保存</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { task } from 'api';

export default {
  data() {
    return {
      centerDialogVisible: false,
      form: {
        name: '',
        params: [],
      },
      showList: [
        {
          label: '是',
          value: 1,
        },
        {
          label: '否',
          value: 0,
        },
      ],
      formLabelWidth: '100px',
      rules: {
        tempName: [
          {
            required: true,
            message: '模版名称不能为空',
            trigger: 'blur',
          },
        ],
        name: [
          {
            required: true,
            message: '字段名称不能为空',
            trigger: 'blur',
          },
        ],
      },
    };
  },
  props: {
    btnText: {
      type: String,
    },
    id: {
      type: [Number, String],
    }
  },
  watch: {
    // 'form.params.fieldName': {
    //   handler: function() {
    //     this.form.params.forEach(item => {
    //       if (!item.fieldAlias) {
    //         item.fieldAlias = item.fieldName;
    //       }
    //     });
    //   },
    //   deep: true,
    // }
  },
  methods: {
    addParma() {
      let param = {
        fieldName: '',
        isPcShow: 0,
        isAppShow: 0,
        fieldType: 0,
        fieldAlias: '',
        isXzqh: 0,
        isEdit: 0,
      };
      this.form.params.push(param);
    },
    removeParam(index) {
      this.form.params = this.$R.remove(index, 1)(this.form.params);
    },
    async addTemplate() {
      this.centerDialogVisible = false;
      this.$refs['template'].validate(async valid => {
        if (valid) {
          let params;
          if (this.btnText === '新增模版') {
            params = {
              templateName: this.form.name,
              referenceInfo: { fields: this.form.params },
            };
          } else {
            params = {
              id: this.form.id,
              templateName: this.form.name,
              referenceInfo: { fields: this.form.params },
            };
          }
          let res = await task.addTemplate(params);
          this.$emit('add-success');
        } else {
          return false;
        }
      });
    },
    async getTemplate() {
      let data = {
        id: this.id,
      };
      let res = await task.getTemplateDetail(data);
      this.form.id = res.data.id;
      this.form.name = res.data.templateName;
      this.form.params = Object.assign([], this.form.params, res.data.referenceInfo.fields);
      this.centerDialogVisible = true;
    },
  },
};
</script>
<style lang="scss">
.form-card {
  margin: 20px 0;
  .form-title {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 16px;
    line-height: 42px;
    letter-spacing: 0px;
    color: #fff;
    margin-bottom: 10px;
    background-color: #eef2f7;
    .form-rectangle {
      display: inline-block;
      align-items: center;
      height: 42px;
      background-color: #0094ec;
      .form-prefix {
        float: left;
        height: 14px;
        border-right: 4px solid #fff;
        margin: 14px 0px 14px 30px;
      }
      a {
        margin: 0 30px 0 10px;
      }
      .form-triangle {
        float: right;
        width: 0px;
        height: 0px;
        border-top: 21px solid #eef2f7;
        border-right: 21px solid #eef2f7;
        border-bottom: 21px solid #0094ec;
        border-left: 21px solid #0094ec;
      }
    }
    .form-button {
      margin-right: 10px;
      background-color: #0094ec;
      color: #fff;
      border-color: #0094ec;
    }
  }
  .form-table-title-qx {
    width: 66%;
  }
  .form-table-total {
    color: #f56c6c;
    float: right;
  }
  .form-table {
    table {
      border: none;
      width: 100%;
      float: left;
      text-align: left;
      color: #606266;
      .el-form-item {
        margin-bottom: 0;
      }
      .el-form-item__content {
        margin-left: 0 !important;
      }
      th {
        border: none;
        background: none;
        font-weight: inherit;
      }
      td {
        border: none;
        padding: 10px 2% 0 0;
        font-size: 14px;
        .el-button.is-circle {
          padding: 6px;
        }
      }
    }
  }
  .form-content {
    margin: 25px 30px;
    .el-form-item {
      margin-bottom: 10px;
    }
    .el-form--label-top .el-form-item__label {
      padding-bottom: 0;
    }
    .upload-card {
      display: flex;
      flex-direction: column;
      .upload-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        background: #e9f0fa;
        border-radius: 5px 5px 0 0;
        padding: 0 10px;
        height: 40px;
        .title {
          font-size: 14px;
          .title-icon {
            color: #f56c6c;
            margin-right: 4px;
          }
        }
      }
      .upload-content {
        background: #f3f8fe;
        padding: 10px 10px;
        border-radius: 0 0 5px 5px;
      }
    }
    table td .el-input__inner {
      height: auto;
    }
  }
  .table-add-fk {
    width: 100%;
    .el-button {
      margin-top: 20px;
      width: 100%;
      background-color: #f3f8fe;
    }
  }
}
</style>