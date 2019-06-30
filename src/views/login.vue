<template>
  <el-row type="flex" class="row-bg" justify="center" align="middle">
    <el-col :span="12" :xs="4" :sm="6" :md="8" :lg="10" :xl="12">
      <el-form
        ref="formData"
        :model="formData"
        label-width="80px"
        :rules="loginrules"
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
          <el-button type="primary" @click="onSubmit('formData')">登录</el-button>
          <el-button @click="onReset('formData')">重置</el-button>
        </el-form-item>
      </el-form>
    </el-col>
  </el-row>
</template>
<script>
export default {
  data() {
    return {
      formData: {
        username: "",
        password: ""
      },
      loginrules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 4, max: 8, message: "用户名在4-8位", trigger: "change" }
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 6, max: 12, message: "密码在6-12位", trigger: "change" }
        ]
      }
    };
  },

  methods: {
    onSubmit(value) {
      this.$refs[value].validate(valid => {
        if (valid) {
          this.$http({
            url: "login",
            method: "post",
            data: this.formData
          }).then(({ data: { data, meta } }) => {
            if (meta.status === 200) {
              localStorage.setItem("token", data.token);
              this.$router.push("/home");
            } else {
              //   console.log("用户名或密码错误");
              this.messagePrompt();
            }
          });
        } else {
          return false;
        }
      });
    },
    onReset(value) {
      this.$refs[value].resetFields();
    },
    messagePrompt() {
      this.$message.error("用户名或密码错误");
    }
  }
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
