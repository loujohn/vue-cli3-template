<template>
  <div class="video">
    <el-row :gutter="10" v-show="!isEmpty">
      <el-col :span="8" v-for="video in videos" :key="video.fileName">
        <video
          class="item"
          controls
          :src="`${staticUrl}${video.filePath}`"
        ></video>
      </el-col>
    </el-row>
    <div v-show="isEmpty" class="no-video">
      <span>暂无视频</span>
    </div>
  </div>
</template>

<script>
import { staticUrl } from 'config';
export default {
  name: 'v-video',
  props: {
    videos: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      staticUrl,
    };
  },
  computed: {
    isEmpty() {
      return this.videos.length === 0;
    },
  },
};
</script>

<style lang="scss">
.video {
  padding: 10px;
  overflow: auto;
  height: 470px;
  overflow: auto;
  box-sizing: border-box;
  .item {
    width: 100%;
  }
  .no-video {
    height: 100%;
    position: relative;
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
}
</style>