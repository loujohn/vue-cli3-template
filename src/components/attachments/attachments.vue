<template>
  <div class="attachments">
    <div class="wrapper">
      <div
        class="attachment"
        v-for="(attachment, index) in attachments"
        :key="attachment.id"
        @mouseenter="enter(index)"
        @mouseleave="leave(index)"
      >
        <div class="left">
        <div class="icon"><i class="el-icon-document"></i></div>
        <a
          class="my-list"
          target="_blank"
          :href="`${staticUrl}${attachment.filePath}`"
          :download="attachment.originName"
        >
          <span class="name">{{ attachment.originName }}</span>
        </a>
        </div>
        <div class="operate" >
          <el-button type="text" @click="downLoad(attachment)" v-if="showButton && index === current">下载</el-button>
          <el-button type="text" @click="previewFile(attachment)" v-if="
                  showButton &&
                    index === current &&
                    isPreviewType.indexOf(attachment.suffix) > -1
                ">预览</el-button>
        </div>
      </div>
    </div>
    <div class="no-attachment" v-show="isEmpty">
      <span>暂无附件</span>
    </div>
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
  name: 'attachments',
  props: {
    attachments: {
      type: Array,
      default: () => [],
    },
  },
  components: {
    pdf,
  },
  data() {
    return {
      staticUrl,
      showButton: false,
      current: 0,
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
  computed: {
    isEmpty() {
      return this.attachments.length === 0;
    },
  },
  methods: {
    enter(index) {
      this.showButton = true;
      this.current = index;
    },
    leave() {
      this.showButton = false;
      this.current = null;
    },
    downLoad(attachment) {
      window.open(`${staticUrl}${attachment.filePath}`);
    },
    previewFile(item) {
      this.url = `${staticUrl}${item.filePath}`;
      if (item.suffix === 'pdf' || item.suffix === 'PDF') {
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

<style lang="scss" scoped>
.attachments {
  padding: 10px;
  overflow: auto;
  height: 470px;
  overflow: auto;
  box-sizing: border-box;
  .attachment {
    display: flex;
    align-items: center;
    justify-content: space-between;
    .left {
      display: flex;
      align-items: center;
      justify-content: flex-start;
    }
    .operate {
      margin-right: 10px;
    }
    a {
      color: inherit;
      text-decoration: none;
    }
    a:hover {
      color: #409eff;
    }
    .name {
      padding: 0 5px;
    }
  }
  .no-attachment {
    position: relative;
    height: 100%;
    span {
      font-size: 18px;
      font-weight: bold;
      color: #909399;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
  }
  .attachment {
    border-radius: 4px;
    margin-bottom: 10px;
    height: 30px;
    box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
    display: flex;
    align-items: center;
    .icon {
      border-top-left-radius: 4px;
      border-bottom-left-radius: 4px;
      width: 30px;
      height: 30px;
      background-color: #409eff;
      display: flex;
      align-items: center;
      justify-content: center;
      i {
        font-size: 20px;
        display: inline-block;
        color: #fff;
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
        font-size: 50px;
      }
    }
    .my-pdf {
      height: 100%;
    }
  }
}
</style>