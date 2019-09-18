<template>
  <div class="manual-upload">
    <el-upload
      ref="upload"
      multiple
      action=""
      :file-list="fileList"
      :auto-upload="false"
      :on-change="handleChange"
    >
      <el-button size="small" icon="el-icon-upload" type="primary"
        >添加文件</el-button
      >
    </el-upload>
  </div>
</template>
<script>
export default {
  name: 'manual-upload',
  props: {
    files: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      fileList: [],
    };
  },
  methods: {
    handleChange(file, fileList) {
      this.fileList = fileList;
    },
  },
};
</script>

<style lang="scss">
.manual-upload {
  padding: 10px;
}
</style>
