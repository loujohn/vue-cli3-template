<template>
  <div class="manual-upload">
    <p class="tips">* 上传文件不能为压缩包</p>
    <el-upload
      ref="upload"
      multiple
      action=""
      :file-list="fileList"
      :auto-upload="false"
      :on-change="handleChange"
      :on-remove="handleRemove"
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
      deletedFileIds: [],
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
      let type = file.name.substring(file.name.lastIndexOf('.') + 1);
      if (
        type === 'zip' ||
        type === 'ZIP' ||
        type === 'rar' ||
        type === 'RAR'
      ) {
        this.$message({
          message: '上传文件不能为压缩包',
          type: 'error',
        });
        for (let i = 0; i < this.fileList.length; ++i) {
          if (this.fileList[i].uid === file.uid) {
            this.fileList.splice(i, 1);
          }
        }
      }
    },
    initFile(files) {
      this.deletedFileIds = [];
      this.fileList = files.map(file => {
        const { id, originName, filePath } = file;
        return {
          id,
          name: originName,
          url: `${staticUrl}${filePath}`,
        };
      });
    },
    handleRemove(file) {
      if (file.id) {
        this.deletedFileIds.push(file.id);
      }
    },
  },
};
</script>

<style lang="scss">
.manual-upload {
  padding: 10px;
  .tips {
    color: #f56c6c;
    font-size: 14px;
    margin: 0 0 5px 0px;
  }
}
</style>
