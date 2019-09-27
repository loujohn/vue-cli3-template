<template>
  <div class="attachments">
    <div class="wrapper">
      <div
        class="attachment"
        v-for="attachment in attachments"
        :key="attachment.id"
      >
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
}
</style>