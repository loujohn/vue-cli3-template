<template>
  <div class="manual-upload">
    <p class="tips">* 上传文件不能为压缩包</p>
    <el-upload
      ref="upload"
      multiple
      action
      :file-list="fileList"
      :auto-upload="false"
      :on-change="handleChange"
      :on-remove="handleRemove"
    >
      <div slot="file" slot-scope="{file}" class="my-list" @mouseenter="currentId = file.id"
        @mouseleave="currentId = ''">
        <span><i class="el-icon-document"></i> {{file.name}}</span>
        <div class="my-operate">
          <div v-if="currentId === file.id">
            <span @click="handlePreview(file)" class="my-preview" v-if="file.url && isPreviewType.indexOf(file.name.substring(file.name.lastIndexOf('.') + 1)) > -1">
              <i class="el-icon-zoom-in"></i>
            </span>
            <span @click="handleDownload(file)" class="my-download" v-if="file.url">
              <i class="el-icon-download"></i>
            </span>
            <span @click="handleRemove(file)" class="my-remove">
              <i class="el-icon-delete"></i>
            </span>
          </div>
          <div v-else class="my-success"><i class="el-icon-check"></i></div>
        </div>
      </div>
      <el-button size="small" icon="el-icon-upload" type="primary">添加文件</el-button>
    </el-upload>
    <div v-if="dialogVisible" class="my-dialog" @click="dialogVisible = false">
      <el-button
        class="dialog-close"
        type="primary"
        icon="el-icon-close"
        circle
        @click="dialogVisible = false"
      ></el-button>
      <el-image :src="url" fit="contain" v-if="type === 'image'">
        <div slot="placeholder" class="image-slot">
          加载中
          <span class="dot">...</span>
        </div>
        <div slot="error" class="image-slot">
          <i class="el-icon-picture-outline"></i>
          <a>加载失败</a>
        </div>
      </el-image>
      <div v-if="type === 'pdf'" class="my-pdf">
        <pdf
          v-for="i in numPages"
          :key="i"
          :src="src"
          :page="i"
          style="width: 100%"
        ></pdf>
      </div>
    </div>
  </div>
</template>
<script>
import pdf from 'vue-pdf';
import { staticUrl } from 'config';
export default {
  name: 'manual-upload',
  props: {
    files: {
      type: Array,
      default: () => [],
    },
  },
  components: {
    pdf,
  },
  data() {
    return {
      fileList: [],
      deletedFileIds: [],
      currentId: '',

      isPreviewType: [
        'png',
        'jpg',
        'pdf',
        'jpeg',
        'bmp',
        'PNG',
        'JPG',
        'PDF',
        'JPEG',
        'BMP',
      ],
      dialogVisible: false,
      type: '',
      url: '',
      src: null,
      numPages: undefined,
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
      console.log(this.fileList);
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
        for (let i = 0; i < this.fileList.length; ++i) {
          if (this.fileList[i].id === file.id) {
            this.fileList.splice(i, 1);
          }
        }
      }
    },
    handleDownload(file) {
      window.open(file.url);
    },
    handlePreview(file) {
      this.url = file.url;
      let fileType = file.name.substring(file.name.lastIndexOf('.') + 1)
      if (fileType === 'pdf' || fileType === 'PDF') {
        this.type = 'pdf';
        this.showPdf();
      } else {
        this.type = 'image';
      }
      this.dialogVisible = true;
    },
    showPdf() {
      if (this.type === 'pdf') {
        var loadingTask = pdf.createLoadingTask(this.url);
        this.src = loadingTask;
        this.src.then(pdf => {
          this.numPages = pdf.numPages;
        });
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
  .my-list {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .my-success {
      width: 12px;
      height: 12px;
      border: 1px solid #67c23a;
      border-radius: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 8px;
      i {
        color: #67c23a;
      }
    }
    .my-operate {
      .my-preview {
        font-size: 14px;
        margin-right: 8px;
        color: #0087d7;
        cursor:pointer
      }
      .my-download {
        font-size: 14px;
        margin-right: 8px;
        color: #0087d7;
        cursor:pointer
      }
      .my-remove {
        font-size: 14px;
        color: #f56c6c;
        cursor:pointer
      }
    }
  }
  .my-dialog {
    width: 100%;
    height: 100%;
    z-index: 122;
    position: fixed;
    top: 0;
    left: 0;
    padding: 10% 20%;
    background: rgba(0, 0, 0, 0.411);
    display: flex;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    overflow-y: auto;
    .dialog-close {
      position: absolute;
      top: 50px;
      right: 80px;
      background-color: #909399;
      border-color: #909399;
      .el-icon-close {
        font-size: 20px;
      }
    }
    .my-pdf {
      height: 100%;
    }
  }
}
</style>
