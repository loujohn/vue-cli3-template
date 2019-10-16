<template>
  <div class="baseinfo-wrapper">
    <div class="edit-trigger" v-if="canEdit">
      <span @click="doEdit()">
        <svg-icon iconClass="edit" />
        {{ edit ? '取消编辑' : '编辑' }}
      </span>
    </div>
    <div v-if="showForm" style="height: 100%;">
      <div class="base-info">
        <el-form label-position="top" ref="form" :model="form" :rules="rules">
          <el-row :gutter="10">
            <el-col :span="12" v-for="(value, key) in form" :key="key">
              <el-form-item
                :label="`${formConfig[key]['fieldAlias']}:`"
                :prop="key"
              >
                <template
                  v-if="
                    formConfig[key]['fieldType'] === 0 ||
                      formConfig[key]['fieldType'] === 3
                  "
                >
                  <el-input v-model="form[key]" size="small"></el-input>
                </template>
                <template v-else-if="formConfig[key]['fieldType'] === 1">
                  <el-select
                    v-model="form[key]"
                    size="small"
                    style="width:100%"
                    filterable
                    clearable
                  >
                    <el-option
                      v-for="option in formConfig[key]['options']"
                      :key="option.optionKey"
                      :label="option.optionValue"
                      :value="option.optionKey"
                    ></el-option>
                  </el-select>
                </template>
                <template v-else-if="formConfig[key]['fieldType'] === 2">
                  <el-date-picker
                    v-model="form[key]"
                    type="datetime"
                    align="right"
                    :size="size"
                    style="width:100%;"
                    unlink-panels
                    format="yyyy-MM-dd"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                  >
                  </el-date-picker>
                </template>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
    </div>
    <div v-else style="height: 100%;">
      <div class="base-info">
        <el-row :gutter="10">
          <el-col :span="12" v-for="item in constFieldList" :key="item.id">
            <template v-if="item.fieldType === 1">
              <span class="label-edit">{{ item.fieldAlias }}:</span>
              <span class="content">{{
                getValue(item.fieldValue, item.options)
              }}</span>
            </template>
            <template v-else>
              <span class="label-edit">{{ item.fieldAlias }}:</span>
              <span class="content">{{ item.fieldValue }}</span>
            </template>
          </el-col>
        </el-row>
      </div>
    </div>
    <div class="submit-box">
      <button class="btn btn-back" @click="back()">返回</button>
      <button class="btn btn-submit" v-show="canEdit" @click="submit()">
        提交
      </button>
    </div>
  </div>
</template>
<script>
export default {
  name: 'base-info',
  props: {
    fields: {
      type: Array,
      default: () => [],
    },
    canEdit: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      constFieldList: [],
      fieldList: [],
      size: 'small',
      edit: false,
      form: {},
      rules: {},
      formConfig: {},
    };
  },
  computed: {
    showForm() {
      return this.edit && this.canEdit;
    },
  },
  watch: {
    fields: {
      handler: function(val) {
        if (val) {
          this.constFieldList = JSON.parse(JSON.stringify(this.fields));
          const list = this.fields.filter(item => item.isEdit);
          this.fieldList = list;
          const { form, formConfig, rules } = this.getFormConfig(list);
          this.rules = rules;
          this.formConfig = formConfig;
          this.form = form;
        }
      },
      immediate: true,
      deep: true,
    },
  },
  methods: {
    getValue(value, options) {
      let item = options.filter(option => option.optionKey === value);
      if (item[0]) {
        return item[0].optionValue;
      } else {
        return value;
      }
    },
    getFormConfig(fields) {
      const form = {};
      const formConfig = {};
      const rules = {};
      fields.forEach(field => {
        let config = {};
        let rule = [];
        const {
          fieldAlias,
          fieldName,
          fieldValue,
          fieldType,
          isRequired,
          options,
        } = field;
        config['fieldType'] = fieldType;
        config['fieldAlias'] = fieldAlias;
        form[fieldName] = fieldValue;
        if (isRequired) {
          rule.push({
            required: true,
            message: `${fieldAlias}不能为空`,
            trigger: 'blur',
          });
        }
        if (fieldType === 3) {
          rule.push({
            pattern: /^[+-]?[\d]+([.][\d]*)?([Ee][+-]?[\d]+)?$/,
            message: `${fieldAlias}必须为数字`,
            trigger: 'blur',
          });
        }

        rules[fieldName] = rule;
        if (fieldType === 1) {
          config['options'] = options;
        }

        formConfig[fieldName] = config;
      });
      return {
        form,
        rules,
        formConfig,
      };
    },
    doEdit() {
      if (this.edit) {
        this.$confirm('是否保存当前编辑?', '提示', {
          confirmButtonText: '是',
          cancelButtonText: '否',
          type: 'info',
        })
          .then(() => {
            const fieldList = this.fieldList.map(item => {
              const { id, fieldValue } = item;
              return {
                taskFieldsId: id,
                fieldValue,
              };
            });
            this.$emit('save-info', JSON.stringify(fieldList));
            this.edit = !this.edit;
          })
          .catch(() => {
            const list = this.fields.filter(item => item.isEdit);
            this.fieldList = list;
            const { form } = this.getFormConfig(list);
            this.form = form;
            this.edit = !this.edit;
          });
      } else {
        this.edit = !this.edit;
      }
    },
    back() {
      this.$router.go(-1);
    },
    submit() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          const fieldList = this.fieldList.map(item => {
            const { id, fieldName } = item;
            return {
              taskFieldsId: id,
              fieldValue: this.form[fieldName],
            };
          });
          this.$emit('submit', JSON.stringify(fieldList));
        }
      });
    },
  },
};
</script>

<style lang="scss">
.baseinfo-wrapper {
  position: relative;
  height: 100%;
  padding-bottom: 56px;
  box-sizing: border-box;
}
.edit-trigger {
  padding: 5px 10px;
  text-align: right;
  span {
    color: #409eff;
    font-size: 14px;
    cursor: pointer;
  }
}
.base-info {
  padding: 30px 20px;
  height: 100%;
  box-sizing: border-box;
  color: #000;
  overflow: auto;
  box-sizing: border-box;
  font-size: 14px;
  .el-form-item__label {
    padding: 0;
    line-height: 0;
  }
  .label {
    display: inline-block;
    padding-bottom: 25px;
    width: 120px;
    text-align: left;
  }
  .content {
    display: inline-block;
    // padding-bottom: 25px;
  }
  .label-edit {
    display: inline-block;
    padding: 5px 0;
    width: 120px;
    text-align: left;
    color: #606266;
  }
  .content-deit {
    display: inline-block;
    padding-bottom: 15px;
  }
  .el-row--flex {
    flex-wrap: wrap;
  }
}
.submit-box {
  text-align: right;
  padding: 10px;
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  box-sizing: border-box;
  border-top: 1px solid #e6e6e6;
  background-color: #fff;
  .btn {
    height: 36px;
    width: 80px;
    cursor: pointer;
    outline: none;
    border-radius: 5px;
  }
  .btn-back {
    border: 1px solid #0e67f2;
    color: #0e67f2;
    background-color: #fff;
  }
  .btn-submit {
    margin-left: 10px;
    border: 1px solid #e6e6e6;
    background-color: #0e67f2;
    color: #fff;
  }
}
</style>
