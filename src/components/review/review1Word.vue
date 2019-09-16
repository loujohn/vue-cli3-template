<template>
  <div class="qx-review-word">
    <div v-if="type === 'qx' && operator === 'check'">
      <div class="base-info-edit">
        <el-row :gutter="10">
          <el-col :span="12" v-for="item in fieldList" :key="item.id">
            <span class="label">{{ item.fieldAlias }}:</span>
            <el-input class="content" v-model="item.fieldValue"></el-input>
          </el-col>
        </el-row>
      </div>
    </div>
    <div v-else>
      <div class="base-info">
        <el-row :gutter="10">
          <el-col :span="12" v-for="item in fieldList" :key="item.id">
            <span class="label">{{ item.fieldAlias }}:</span>
            <span class="content">{{ item.fieldValue }}</span>
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'review1Word',
  components: {
  },
  props: {
    list: {
      type: Array,
    },
    type: {
      type: String,
    },
    operator: {
      type: String,
    },
  },
  data() {
    return {
      fieldList: [],
    };
  },
  computed: {},
  watch: {
    list: {
      handler: function(val) {
        if (val) {
          this.fieldList = Object.assign([], this.fieldList, this.list);
        }
      },
      immediate: true,
      deep: true,
    },
  },
  methods: {
  },
};
</script>

<style lang="scss">
.qx-review-word {
  .base-info-edit {
    padding: 30px 20px;
    color: #000;
    height: 250px;
    overflow: auto;
    box-sizing: border-box;
    border-bottom: 1px solid #e6e6e6;
    .label {
      display: inline-block;
      padding-bottom: 5px;
      width: 110px;
      text-align: left;
    }
    .content {
      display: inline-block;
      padding-bottom: 15px;
    }
  }
  .base-info {
    padding: 30px 20px;
    color: #000;
    height: 250px;
    overflow: auto;
    box-sizing: border-box;
    border-bottom: 1px solid #e6e6e6;
    .label,
    .content {
      display: inline-block;
      padding-bottom: 25px;
    }
    .label {
      width: 110px;
      text-align: left;
    }
  }
}
</style>
