<template>
  <div class="fields">
    <el-row :gutter="10">
      <el-col :span="12" v-for="field in fields" :key="field" :style="style">
        <span class="field">{{ field }}</span>
      </el-col>
      <el-col
        :span="12"
        v-for="field in extraFields"
        :key="field"
        :style="style"
      >
        <div class="field extra">
          <span>{{ field }}</span>
          <i class="el-icon-delete remove" @click="remove(field)"></i>
        </div>
      </el-col>
      <el-col :span="12" v-if="isAdd">
        <div class="add">
          <el-input size="mini" v-model="tempField">
            <el-button slot="append" @click="confirm()">确定</el-button>
          </el-input>
        </div>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <div class="add-field">
          <el-button type="text" icon="el-icon-plus" @click="addField()"
            >添加字段</el-button
          >
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: 'fields',
  props: {
    fieldList: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      style: {
        lineHeight: 1,
      },
      extraFields: [],
      isAdd: false,
      tempField: '',
    };
  },
  computed: {
    fields() {
      return this.fieldList.map(e => {
        if (Object.prototype.toString.call(e) === '[object Object]') {
          return e.fieldAlias;
        } else {
          return e;
        }
      });
    },
  },
  watch: {
    fieldList(val) {
      if (val) {
        this.extraFields = [];
      }
    },
  },
  methods: {
    addField() {
      this.isAdd = true;
    },
    confirm() {
      if (this.tempField === '') {
        this.$message({
          type: 'error',
          message: '新加字段不能为空',
        });
      } else {
        this.extraFields.push(this.tempField);
        this.isAdd = false;
        this.tempField = '';
      }
    },
    remove(field) {
      this.extraFields = this.extraFields.filter(e => e !== field);
    },
  },
};
</script>

<style lang="scss">
.fields {
  background-color: #f1f8fe;
  margin-top: 10px;
  .field {
    background-color: #e9f3ff;
    margin: 5px 8px;
    border: 1px solid #e0ecfd;
    box-sizing: border-box;
    display: inline-block;
    width: calc(100% - 16px);
    padding: 5px;
    border-radius: 3px;
  }
  .add-field,
  .add {
    margin: 5px 8px;
  }
  .extra {
    display: flex;
    justify-content: space-between;
    align-items: center;
    span {
      display: inline-block;
      flex-grow: 1;
      word-break: break-all;
    }
  }
  .remove {
    color: #409eff;
    cursor: pointer;
  }
}
</style>
