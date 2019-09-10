<template>
  <div class="image">
    <el-row :gutter="10" v-show="!isEmpty">
      <el-col :span="8" v-for="image in images" :key="image.fileName">
        <el-image fit="fill" :src="`${staticUrl}${image.filePath}`">
          <div slot="error">
            <i class="el-icon-picture-outline"></i>
          </div>
        </el-image>
      </el-col>
    </el-row>
    <div v-show="isEmpty" class="no-image">
      <span>暂无图片</span>
    </div>
  </div>
</template>

<script>
import { staticUrl } from 'config';
export default {
  name: 'v-image',
  props: {
    images: {
      type: Array,
      default: () => [],
    },
  },
  computed: {
    isEmpty() {
      return this.images.length === 0;
    },
  },
  data() {
    return {
      staticUrl,
    };
  },
};
</script>

<style lang="scss">
.image {
  padding: 10px;
  overflow: auto;
  height: 470px;
  overflow: auto;
  box-sizing: border-box;
  .no-image {
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
