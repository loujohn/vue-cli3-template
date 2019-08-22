<template>
  <div class="investigator-manage">
    <div class="wrapper">
      <div class="operation">
        <div class="btns">
          <el-button icon="el-icon-plus" :size="size" type="primary"
            >新增</el-button
          >
          <el-button :size="size"
            ><svg-icon iconClass="导入"></svg-icon>导入</el-button
          >
        </div>
        <div class="search">
          <el-input :size="size" suffix-icon="el-icon-search"></el-input>
        </div>
      </div>
      <el-table header-row-class-name="customer-table-header" :data="data">
        <el-table-column label="用户名" prop="name"></el-table-column>
        <el-table-column label="姓名" prop="username"></el-table-column>
        <el-table-column label="电话" prop="tel"></el-table-column>
        <el-table-column label="区域" prop="area"></el-table-column>
        <el-table-column label="部门" prop="depat"></el-table-column>
        <el-table-column label="设备型号" prop="device"></el-table-column>
        <el-table-column label="操作">
          <template>
            <el-button type="text">编辑</el-button>
            <el-button type="text">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination
          :pager-count="5"
          background
          layout="total, prev, pager, next"
          :total="100"
        ></el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'investigator-manage',
  data() {
    return {
      size: 'small',
      data: [
        {
          name: 'fja',
          username: 'fasfaj',
          tel: '47823',
          area: '78r7849',
          depat: 'ru8ur4q',
          device: '482389723895',
        },
      ],
    };
  },
};
</script>

<style lang="scss">
.investigator-manage {
  padding: 30px;
  .wrapper {
    background-color: #fff;
    .operation {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 15px 20px;
    }
  }
}
</style>
