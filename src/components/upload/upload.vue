<template>
  <div class="upload"></div>
</template>
<script>
export default {
  name: 'upload',
  data() {
    return {
      toUpdateNum: 0,
      files: [],
      cancel: [],
      url: '',
      tempList: [],
    };
  },
  computed: {
    requestHeader: () => {
      if (sessionStorage.getItem('token')) {
        return { 'X-Token': sessionStorage.getItem('token') };
      }
    },
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
