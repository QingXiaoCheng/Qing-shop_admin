<template>
  <div>
    <!-- 面包屑导航部分 -->
    <el-breadcrumb separator-class="el-icon-arrow-right" id="breadcrumb">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 角色列表部分 -->
    <el-table :data="rightsListData" highlight-current-row style="width: 100%">
      <el-table-column type="index"></el-table-column>
      <el-table-column prop="authName" label="权限名称" width="180"></el-table-column>
      <el-table-column prop="path" label="路径" width="180"></el-table-column>
      <el-table-column prop="level" label="层级" width="180">
        <template v-slot="{row}">
          <span>{{row.level | levelFormat}}</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>


<script>
export default {
  data() {
    return {
      rightsListData: []
    };
  },
  filters: {
    levelFormat(val) {
      //   console.log(val);
      switch (+val) {
        case 0:
          return "一级";
          break;
        case 1:
          return "二级";
          break;
        case 2:
          return "三级";
          break;
      }
    }
  },

  async created() {
    let {
      data: { data, meta }
    } = await this.$http({
      url: "rights/list"
    });

    console.log(data);
    this.rightsListData = data;
  }
};
</script>

