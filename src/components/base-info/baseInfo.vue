<template>
  <div class="base-info">
    <el-row :gutter="10">
      <el-col :span="12" v-for="field in fields" :key="field.id">
        <span class="label">{{ field.fieldAlias }}</span>
        <span class="content">{{ field.fieldValue }}</span>
      </el-col>
    </el-row>
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
  .label,
  .content {
    display: inline-block;
    padding-bottom: 25px;
  }
  .label {
    width: 110px;
    text-align: left;
  }
}
</style>