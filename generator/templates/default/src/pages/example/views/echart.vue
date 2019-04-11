<template>
  <el-col>
    <el-breadcrumb separator="/" style="margin-bottom: 20px">
      <el-breadcrumb-item :to="{ path: '/' }">Home</el-breadcrumb-item>
      <el-breadcrumb-item>Ehcart</el-breadcrumb-item>
    </el-breadcrumb>
    <el-row :gutter="20" style="margin-top: 20px;">
      <el-col :span="8">
        <el-card shadow>
          <chart-pie
            style="height: 300px;"
            :value="pieData"
            :text="$t('echart.pie')"
          ></chart-pie>
        </el-card>
      </el-col>
      <el-col :span="16">
        <el-card shadow>
          <chart-bar
            style="height: 300px;"
            :value="barData"
            :text="$t('echart.bar')"
          />
        </el-card>
      </el-col>
    </el-row>
  </el-col>
</template>

<script>
import { ChartPie, ChartBar } from "@/components/charts";
export default {
  components: {
    ChartPie,
    ChartBar
  },
  data() {
    return {
      pieData: [
        { value: 335, name: "直接访问" },
        { value: 310, name: "邮件营销" },
        { value: 234, name: "联盟广告" },
        { value: 1548, name: "搜索引擎" }
      ],
      barData: {
        Mon: 13253,
        Tue: 34235,
        Wed: 26321,
        Thu: 12340,
        Fri: 24643,
        Sat: 1322,
        Sun: 1324
      }
    };
  },
  methods: {
    getLangInforTitle(title) {
      return this.$t(`dashboard.${title}`);
    }
  }
};
</script>
