<template>
  <div>
    <div class="edit-trigger">
      <span @click="doEdit()" v-show="showForm">
        <svg-icon iconClass="edit" />
        {{ isEdit ? '取消编辑' : '编辑' }}
      </span>
    </div>
    <div v-if="showForm && isEdit">
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
                    value-format="yyyy-MM-dd"
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
    <div v-else>
      <div class="base-info">
        <el-row :gutter="10">
          <el-col :span="24" v-for="item in constFieldList" :key="item.id">
            <template v-if="item.fieldType === 0">
              <span class="tips"
                ><span v-if="item.is_pc_required === 1 && item.isEdit === 1"
                  >*
                </span></span
              >
              <span class="label-edit">{{ item.fieldAlias }}:</span>
              <span class="content">{{ item.fieldValue }}</span>
            </template>
            <template v-else-if="item.fieldType === 1">
              <span class="tips"
                ><span v-if="item.is_pc_required === 1 && item.isEdit === 1"
                  >*
                </span></span
              >
              <span class="label-edit">{{ item.fieldAlias }}:</span>
              <span class="content">{{
                getValue(item.fieldValue, item.options)
              }}</span>
            </template>
            <template v-else-if="item.fieldType === 2">
              <span class="tips"
                ><span v-if="item.is_pc_required === 1 && item.isEdit === 1"
                  >*
                </span></span
              >
              <span class="label-edit">{{ item.fieldAlias }}:</span>
              <span class="content">{{ item.fieldValue }}</span>
            </template>
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>
<script>
import baseinfoCommon from './baseinfo.common';
export default {
  name: 'base-info',
  mixins: [baseinfoCommon],
  props: {
    type: {
      type: String,
    },
    operator: {
      type: String,
    },
    fields: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      isEdit: false,
    };
  },
  computed: {
    showForm() {
      return (
        this.type === 'qx' &&
        (this.operator === 'check' || this.operator === 'recheck')
      );
    },
  },
  methods: {
    doEdit() {
      if (this.isEdit) {
        this.$confirm('是否保存当前编辑?', '提示', {
          confirmButtonText: '是',
          cancelButtonText: '否',
          type: 'info',
        })
          .then(() => {
            this.$refs['form'].validate(valid => {
              if (valid) {
                for (let item of this.constFieldList) {
                  if (item.isEdit === 1) {
                    item.fieldValue = this.form[item.fieldName];
                  }
                }
                this.isEdit = !this.isEdit;
              }
            });
          })
          .catch(() => {
            this.isEdit = !this.isEdit;
          });
      } else {
        for (let item of this.constFieldList) {
          if (item.isEdit === 1) {
            this.form[item.fieldName] = item.fieldValue;
          }
        }
        this.isEdit = !this.isEdit;
      }
    },
  },
};
</script>

<style lang="scss">
.edit-trigger {
  height: 20px;
  padding: 5px 10px;
  text-align: right;
  span {
    color: #409eff;
    font-size: 14px;
    cursor: pointer;
  }
}
.base-info {
  padding: 0px 20px 30px 20px;
  color: #000;
  height: 310px;
  overflow: auto;
  box-sizing: border-box;
  border-bottom: 1px solid #e6e6e6;
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
  .tips {
    display: inline-block;
    width: 10px;
    color: #f56c6c;
  }
}
</style>
