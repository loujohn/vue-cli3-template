<template>
  <div>
    <div v-if="showForm">
      <div class="base-info">
        <el-row :gutter="10">
          <el-col :span="12" v-for="item in fieldList" :key="item.id">
            <template v-if="item.fieldType === 0">
              <span class="label-edit">{{ item.fieldAlias }}:</span>
              <el-input
                size="small"
                class="content-edit"
                v-model="item.fieldValue"
              ></el-input>
            </template>
            <template v-else-if="item.fieldType === 1">
              <span class="label-edit">{{ item.fieldAlias }}:</span>
              <el-select
                class="content-edit"
                v-model="item.fieldValue"
                size="small"
                style="width: 100%;"
              >
                <el-option
                  v-for="option in item.options"
                  :key="option.optionKey"
                  :label="option.optionValue"
                  :value="option.optionKey"
                >
                </el-option>
              </el-select>
            </template>
            <template v-else-if="item.fieldType === 2">
              <span class="label-edit">{{ item.fieldAlias }}:</span>
              <el-date-picker
                v-model="item.fieldValue"
                type="datetime"
                align="right"
                :size="size"
                unlink-panels
                value-format="yyyy-MM-dd HH:mm:ss"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
              >
              </el-date-picker>
            </template>
          </el-col>
        </el-row>
      </div>
    </div>
    <div v-else>
      <div class="base-info">
        <el-row :gutter="10">
          <el-col :span="12" v-for="item in fieldList" :key="item.id">
            <template v-if="item.fieldType === 0">
              <span class="label-edit">{{ item.fieldAlias }}:</span>
              <span class="content">{{ item.fieldValue }}</span>
            </template>
            <template v-else-if="item.fieldType === 1">
              <span class="label-edit">{{ item.fieldAlias }}:</span>
              <span class="content">{{
                getValue(item.fieldValue, item.options)
              }}</span>
            </template>
            <template v-else-if="item.fieldType === 2">
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
export default {
  name: 'base-info',
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
      fieldList: [],
      size: 'small',
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
  watch: {
    fields: {
      handler: function(val) {
        if (val) {
          this.fieldList = Object.assign([], this.fieldList, this.fields);
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
      }
    },
  },
};
</script>

<style lang="scss">
.base-info {
  padding: 30px 20px;
  color: #000;
  height: 250px;
  overflow: auto;
  box-sizing: border-box;
  border-bottom: 1px solid #e6e6e6;
  .label {
    display: inline-block;
    padding-bottom: 25px;
    width: 120px;
    text-align: left;
  }
  .content {
    display: inline-block;
    padding-bottom: 25px;
  }
  .label-edit {
    display: inline-block;
    padding: 5px 0;
    width: 120px;
    text-align: left;
  }
  .content-deit {
    display: inline-block;
    padding-bottom: 15px;
  }
  .el-row--flex {
    flex-wrap: wrap;
  }
}
</style>
