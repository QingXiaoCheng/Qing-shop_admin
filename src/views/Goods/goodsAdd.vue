<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right" id="breadcrumb">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>

    <el-steps :active="activeStep" finish-status="success">
      <el-step title="第一步" description="基本信息"></el-step>
      <el-step title="第二步" description="商品图片"></el-step>
      <el-step title="第三步" description="商品内容"></el-step>
    </el-steps>

    <el-tabs
      tab-position="left"
      style="margin-top: 20px;"
      v-model="selecTab"
      @tab-click="tabClickHandler"
    >
      <el-tab-pane label="基本信息" name="basicInfo">
        <el-form ref="goodsForm" :model="goodsFormData" label-width="80px">
          <el-form-item label="商品名称">
            <el-input v-model="goodsFormData.goods_name"></el-input>
          </el-form-item>
          <el-form-item label="商品价格">
            <el-input v-model="goodsFormData.goods_price"></el-input>
          </el-form-item>
          <el-form-item label="商品重量">
            <el-input v-model="goodsFormData.goods_weight"></el-input>
          </el-form-item>
          <el-form-item label="商品数量">
            <el-input v-model="goodsFormData.goods_number"></el-input>
          </el-form-item>
          <el-form-item label="商品分类">
            <el-cascader
              v-model="goodsFormData.goodscatArr"
              :props="optionsProps"
              :options="addGoodsOptions"
            ></el-cascader>
          </el-form-item>
          <el-form-item label="是否促销">
            <el-radio v-model="goodsFormData.is_promote" label="1">是</el-radio>
            <el-radio v-model="goodsFormData.is_promote" label="0">否</el-radio>
          </el-form-item>
        </el-form>
        <el-button type="primary" @click="nextStep(1, 'proPic')">下一步</el-button>
      </el-tab-pane>
      <el-tab-pane label="商品图片" name="proPic">
        <el-upload
          :headers="setHeader"
          class="upload-demo"
          action="http://localhost:8888/api/private/v1/upload"
          list-type="picture-card"
          :on-success="fileUpload"
        >
          <el-button size="small" type="primary">点击上传</el-button>
          <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
        </el-upload>
        <el-button type="primary" @click="nextStep(2, 'proCon')">下一步</el-button>
      </el-tab-pane>
      <el-tab-pane label="商品内容" name="proCon">
        <quill-editor v-model="goodsFormData.goods_introduce" ref="myQuillEditor"></quill-editor>
        <el-button type="primary" @click="sureAddGoods">确定</el-button>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>



<script>
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";

import { quillEditor } from "vue-quill-editor";
export default {
  components: {
    quillEditor
  },
  data() {
    return {
      selecTab: "basicInfo",
      activeStep: 0,
      goodsFormData: {
        goods_name: "",
        goodscatArr: [],
        goods_price: 0,
        goods_number: 0,
        goods_weight: 0,
        goods_introduce: "",
        is_promote: "",
        pics: []
      },
      addGoodsOptions: [],
      optionsProps: {
        label: "cat_name",
        value: "cat_id"
      },
      setHeader: { Authorization: localStorage.getItem("token") }
    };
  },
  methods: {
    tabClickHandler(val) {
      // console.log(val);
      this.activeStep = +val.index;
    },
    nextStep(index, tabName) {
      // console.log(index, tabName);
      this.selecTab = tabName;
      this.activeStep = index;
    },
    fileUpload(res) {
      // console.log(res);
      if (res.meta.status === 200) {
        this.goodsFormData.pics.push({ pic: res.data.tmp_path });
        // console.log(this.goodsFormData.pics);
      }
    },
    async sureAddGoods() {
      // console.log(this.goodsFormData);
      let newgoodsFormData = {
        goods_name: this.goodsFormData.goods_name,
        goods_cat: this.goodsFormData.goodscatArr.join(),
        goods_price: this.goodsFormData.goods_price,
        goods_number: this.goodsFormData.goods_number,
        goods_weight: this.goodsFormData.goods_weight,
        goods_introduce: this.goodsFormData.goods_introduce,
        is_promote: this.goodsFormData.is_promote,
        pics: this.goodsFormData.pics
      };
      let res = await this.$http({
        url: "goods",
        method: "post",
        data: newgoodsFormData
      });
      // console.log(res);
      if (res.data.meta.status === 201) {
        this.$message({
          message: res.data.meta.msg,
          type: "success",
          duration: 1000
        });
        this.$router.push("/goods");
      }
    }
  },
  async created() {
    let res = await this.$http({
      url: "categories",
      params: {
        type: 3
      }
    });
    // console.log(res);
    this.addGoodsOptions = res.data.data;
  }
};
</script>

<style scoped>
#breadcrumb {
  margin-bottom: 10px;
}
</style>

