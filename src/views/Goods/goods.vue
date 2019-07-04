<template>
  <div>
    <!-- 面包屑导航部分 -->
    <el-breadcrumb separator-class="el-icon-arrow-right" id="breadcrumb">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-button type="success" plain style="margin:8px 0;" @click="$router.push('/goods-add')">添加商品</el-button>
    <el-table :data="goodsList" style="width: 100%">
      <el-table-column type="index"></el-table-column>
      <el-table-column prop="goods_name" label="商品名称" width="180"></el-table-column>
      <el-table-column prop="goods_price" label="商品价格" width="180"></el-table-column>
      <el-table-column prop="goods_weight" label="商品重量" width="180"></el-table-column>
      <el-table-column label="创建时间" width="180">
        <template v-slot="{row}">
          <span>{{row.add_time | dateFormat}}</span>
        </template>
      </el-table-column>
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
  </div>
</template>

<script>
export default {
  data() {
    return {
      goodsList: [],
      pagenum: 1,
      pagesize: 5,
      total: 0
    };
  },
  filters: {
    dateFormat(val) {
      let addTimd = new Date(val);
      //   console.log(addTimd);
      let yy = addTimd.getFullYear();
      let mm = addTimd.getMonth() + 1;
      let dd = addTimd.getDate();
      let hh = addTimd.getHours();
      let mmi = addTimd.getMinutes();
      let ss = addTimd.getSeconds();
      return `${yy}-0${mm}-${dd} ${hh}:${mmi}:${ss}`;
    }
  },
  methods: {
    async getGoodsList() {
      let res = await this.$http({
        url: "goods",
        params: {
          pagenum: this.pagenum,
          pagesize: this.pagesize
        }
      });
      //   console.log(res);
      this.goodsList = res.data.data.goods;
      this.total = res.data.data.total;
    },
    currentPageChange(val) {
      //   console.log(val);
      this.pagenum = val;
      this.getGoodsList();
    }
  },
  created() {
    this.getGoodsList();
  }
};
</script>

