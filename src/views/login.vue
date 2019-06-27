<template>
  <el-row type="flex" class="row-bg" justify="center" align="middle">
    <el-col :span="12" :xs="4" :sm="6" :md="8" :lg="10" :xl="12">
      <el-form
        ref="formData"
        :model="formData"
        label-width="80px"
        label-position="top"
        class="loginForm"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="formData.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="formData.password"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary">登录</el-button>
          <el-button>重置</el-button>
        </el-form-item>
      </el-form>
    </el-col>
  </el-row>
</template>
<script>
// import axios from "axios";
export default {
  data() {
    return {
      formData: {
        username: "",
        password: ""
      }
    };
  },

  methods: {}
};
</script>

<style>
.row-bg {
  height: 100%;
  background-color: #202136;
}
.loginForm {
  background-color: #fff;
  min-width: 400px;
  padding: 20px 20px;
  border-radius: 20px;
}
</style>
