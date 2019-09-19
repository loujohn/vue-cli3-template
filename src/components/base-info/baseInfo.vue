<template>
  <div>
    <div v-if="showForm">
      <div class="base-info">
        <el-row :gutter="10">
          <el-col :span="12" v-for="item in fieldList" :key="item.id">
            <span class="label-edit">{{ item.fieldAlias }}:</span>
            <el-input class="content-edit" v-model="item.fieldValue"></el-input>
          </el-col>
        </el-row>
      </div>
    </div>
    <div v-else>
      <div class="base-info">
        <el-row :gutter="10">
          <el-col :span="12" v-for="item in fieldList" :key="item.id">
            <span class="label">{{ item.fieldAlias }}:</span>
            <span class="content">{{ item.fieldValue }}</span>
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
  methods: {},
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
    width: 110px;
    text-align: left;
  }
  .content {
    display: inline-block;
    padding-bottom: 25px;
  }
  .label-edit {
    display: inline-block;
    padding-bottom: 5px;
    width: 110px;
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
