<template>
  <div class="image">
    <el-row :gutter="10">
      <el-col :span="8" v-for="image in images" :key="image.fileName">
        <el-image fit="fill" :src="`${staticUrl}${image.filePath}`">
          <div slot="error">
            <i class="el-icon-picture-outline"></i>
          </div>
        </el-image>
      </el-col>
    </el-row>
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
}
</style>
