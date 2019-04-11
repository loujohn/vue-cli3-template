<template>
  <div class="layout">
    <el-col>
      <el-breadcrumb separator="/" style="margin-bottom: 20px">
        <el-breadcrumb-item :to="{ path: '/' }">Home</el-breadcrumb-item>
      </el-breadcrumb>
      <h2>基于vue cli3 web前端项目骨架</h2>
      <ul>
        <li>
          <router-link to="echart">echart组件</router-link>
        </li>
        <li>
          <router-link to="/project">项目结构</router-link>
        </li>
      </ul>
    </el-col>
  </div>
</template>

<script>
export default {
  components: {},
  data() {
    return {};
  },
  methods: {}
};
</script>
