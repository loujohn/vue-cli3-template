<template>
  <div class="upload">
    <el-upload
      class="upload-demo"
      :action="url"
      :headers="requestHeader"
      ref="upload"
      :on-preview="handlePreview"
      :before-upload="progress"
      :on-success="onSuccess"
      :list-type="listType"
      :file-list="files"
      :auto-upload="true"
      :before-remove="removeFile"
      :on-exceed="exceed"
      :multiple="false"
      :limit="1"
    >
      <el-button
        slot="trigger"
        size="mini"
        icon="el-icon-upload"
        type="primary"
        class="my-button"
        >添加文件</el-button
      >
    </el-upload>
  </div>
</template>

<script>
import url from 'api/config';
export default {
  name: 'upload',
  methods: {
    handlePreview() {
      return true;
    },
    removeFile(file) {
      let files = this.$R.reject(item => {
        return item.uid === file.uid;
      }, this.tempList);
      this.tempList = files;
      this.$emit('file-remove');
      return true;
    },
    onSuccess(res, file) {
      this.toUpdateNum--;
      if (res.code.toString() === '200' && res.message === 'ok') {
        this.tempList = this.tempList.concat([file]);
        const { data } = res;
        this.$emit('upload-success', data);
      } else {
        this.$message({
          type: 'error',
          message: res.message,
        });
        this.$refs['upload'].clearFiles();
      }
    },
    exceed(file, fileList) {
      this.$message({
        type: 'warning',
        message: '只允许上传单个文件',
      });
    },
    progress(file) {
      // let fileType = file.type;
      // if (fileType === 'application/zip' || fileType === 'application/x-rar') {
      //   this.$message({
      //     message: '上传文件不能为压缩包',
      //     type: 'error',
      //   });
      //   return false;
      // }

      if (file.size > 1024 * 1024 * 100) {
        this.$message({
          message: '上传文件请不要大于100M',
          type: 'error',
        });
        return false;
      } else {
        this.toUpdateNum++;
        return true;
      }
    },
  },
  computed: {
    requestHeader: () => {
      if (sessionStorage.getItem('token')) {
        return { 'X-Token': sessionStorage.getItem('token') };
      }
    },
  },
  data() {
    return {
      toUpdateNum: 0,
      files: [],
      cancel: [],
      url: url.gdbUpload,
      tempList: [],
    };
  },
  props: {
    fileList: {
      type: Array,
      default: () => [],
    },
    isUploading: {
      type: Boolean,
      default: false,
    },
    listType: {
      type: String,
    },
  },
};
</script>
<style lang="scss">
.upload {
  .el-upload-list {
    display: flex;
    flex-wrap: wrap;
    .el-upload-list__item {
      width: 33%;
      &:first-child {
        margin-top: 5px;
      }
    }
  }
  .el-upload-list--picture {
    .el-upload-list__item {
      margin: 10px 10px;
      width: 30%;
      &:first-child {
        margin-top: 10px;
      }
    }
  }
  .my-button {
    color: #fff;
    background-color: #0094ec;
  }
}
</style>
