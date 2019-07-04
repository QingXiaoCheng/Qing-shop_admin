<template>
  <div>
    <!-- 面包屑导航部分 -->
    <el-breadcrumb separator-class="el-icon-arrow-right" id="breadcrumb">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <el-button type="success" plain style="margin:8px 0;" @click="addCates">添加分类</el-button>

    <!-- 要想indentSize生效 必须设置 levelKey="cat_level" 属性 -->
    <el-table :data="cateList">
      <el-table-tree-column
        file-icon="el-icon-notebook-2"
        folder-icon="el-icon-folder"
        prop="cat_name"
        label="分类名称"
        width="220"
        treeKey="cat_id"
        parentKey="cat_pid"
        :indentSize="20"
        levelKey="cat_level"
      ></el-table-tree-column>
      <el-table-column label="是否有效" width="180">
        <template>
          <span>{{cat_deleted ? "否" : "是"}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="cat_level" label="层级" width="180"></el-table-column>

      <el-table-column label="操作">
        <template>
          <el-button type="primary" plain size="mini" icon="el-icon-edit"></el-button>
          <el-button type="danger" plain size="mini" icon="el-icon-delete"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      background
      layout="prev, pager, next"
      :total="total"
      :current-page="pagenum"
      :page-size="pagesize"
      @current-change="currentPageChange"
    ></el-pagination>

    <el-dialog title="添加分类" :visible.sync="isAddCateDialogShow">
      <el-form ref="addSelect" :model="addCatesForm" label-width="80px">
        <el-form-item label="分类名称">
          <el-input v-model="addCatesForm.cat_name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="父级名称">
          <el-cascader
            :props="optionsProp"
            v-model="addCatesForm.cat_pid"
            :options="addCateOptions"
            @change="selecteOption"
          ></el-cascader>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="isAddCateDialogShow = false">取 消</el-button>
        <el-button type="primary" @click="addCateSure">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
let ElTreeGrid = require("element-tree-grid");

export default {
  data() {
    return {
      cateList: [],
      total: 0,
      pagenum: 1,
      pagesize: 5,
      cat_deleted: 0,
      isAddCateDialogShow: false,
      addCatesForm: {
        cat_name: "",
        cat_pid: "",
        cat_level: 0
      },
      addCateOptions: [],
      optionsProp: {
        value: "cat_id",
        label: "cat_name",
        checkStrictly: true
      }
    };
  },
  methods: {
    currentPageChange(val) {
      this.pagenum = val;
      this.getCateList();
    },
    async getCateList() {
      let res = await this.$http({
        url: "categories",
        params: {
          type: 3,
          pagenum: this.pagenum,
          pagesize: this.pagesize
        }
      });
      // console.log(res);
      this.total = res.data.data.total;
      this.cateList = res.data.data.result;
    },
    async addCates() {
      this.isAddCateDialogShow = true;
      let res = await this.$http({
        url: "categories",
        params: {
          type: 2
        }
      });
      // console.log(res);
      this.addCateOptions = res.data.data;
    },
    selecteOption(val) {
      // console.log(val);
      this.addCatesForm.cat_pid = val[val.length - 1];
      this.addCatesForm.cat_level = val.length;
      // console.log(this.addCatesForm);
    },
    async addCateSure() {
      // console.log(this.addCatesForm);
      let res = await this.$http({
        url: "categories",
        method: "post",
        data: this.addCatesForm
      });
      console.log(res); //  bug
      if (res.data.meta.status === 201) {
        this.$message({
          message: res.data.meta.msg,
          type: "success",
          duration: 1000
        });

        // 关闭对话框
        this.isAddCateDialogShow = false;

        // 重置表单resetFields
        // console.log(this.$refs.addSelect);
        // this.$refs.addSelect.resetFields();       //  无法重置
        this.addCatesForm.cat_name = "";
        this.addCatesForm.cat_pid = "";
        // 刷新页面
        this.getCateList();
      }
    }
  },
  created() {
    this.getCateList();
  },
  components: {
    [ElTreeGrid.name]: ElTreeGrid
  }
};
</script>

