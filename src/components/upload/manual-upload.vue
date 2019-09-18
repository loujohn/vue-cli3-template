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
import { staticUrl } from 'config';
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
  mounted() {
    if (this.files.length !== 0) {
      this.initFile(this.files);
    }
  },
  watch: {
    files: function(val) {
      this.initFile(val);
    },
  },
  methods: {
    handleChange(file, fileList) {
      this.fileList = fileList;
    },
    initFile(files) {
      this.fileList = files.map(file => {
        const { id, originName, filePath } = file;
        return {
          id,
          name: originName,
          url: `${staticUrl}${filePath}`,
        };
      });
    },
  },
};
</script>

<style lang="scss">
.manual-upload {
  padding: 10px;
}
</style>
