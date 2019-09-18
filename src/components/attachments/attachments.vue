<template>
  <div class="attachments">
    <div class="wrapper">
      <div
        class="attachment"
        v-for="attachment in attachments"
        :key="attachment.id"
      >
        <a
          :href="`${staticUrl}${attachment.filePath}`"
          :download="attachment.originName"
        >
          <i class="el-icon-document"></i>
          <span class="name">{{ attachment.originName }}</span>
        </a>
      </div>
    </div>
    <div class="no-attachment" v-show="isEmpty">
      <span>暂无附件</span>
    </div>
  </div>
</template>

<script>
import { staticUrl } from 'config';
export default {
  name: 'attachments',
  props: {
    attachments: {
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
      return this.attachments.length === 0;
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
}
</style>