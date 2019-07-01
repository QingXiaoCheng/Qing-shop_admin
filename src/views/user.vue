<template>
  <div class="userMainContainer">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 搜索框以及添加按钮 -->
    <!-- 
      
      @keyup.enter.native="searchUser" 
      
    一般注册的事件都是vue的合成事件不是原生事件，这里注册vue里面的keyup事件无效，因此使用.native修饰符使用原生的事件
    -->
    <el-row :gutter="20">
      <el-col :span="8">
        <el-input
          placeholder="请输入搜索内容"
          class="input-with-select"
          v-model="searchQuery"
          @keyup.enter.native="searchUser"
        >
          <el-button slot="append" icon="el-icon-search" @click="searchUser"></el-button>
        </el-input>
      </el-col>
      <el-col :span="8">
        <el-button type="success" plain @click="clickToShowDialog">添加用户</el-button>
      </el-col>
    </el-row>

    <!-- 列表渲染部分 -->
    <el-table :data="userData" stripe style="width: 100%">
      <el-table-column prop="username" label="姓名" width="180"></el-table-column>
      <el-table-column prop="email" label="邮箱" width="180"></el-table-column>
      <el-table-column prop="mobile" label="电话"></el-table-column>
      <el-table-column label="用户状态">
        <template v-slot="{row}">
          <!-- {{row}} -->
          <el-switch
            active-color="#13ce66"
            inactive-color="#ff4949"
            v-model="row.mg_state"
            @change="changeSwitchState(row)"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template v-slot="{row}">
          <el-button
            type="primary"
            plain
            size="mini"
            icon="el-icon-edit"
            @click="editUserDialog(row.id)"
          ></el-button>
          <el-button
            type="danger"
            plain
            size="mini"
            icon="el-icon-delete"
            @click="deleteUser(row.id)"
          ></el-button>
          <el-button type="success" plain size="mini" icon="el-icon-check">分配角色</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页器 -->
    <el-pagination
      background
      layout="prev, pager, next"
      :total="totalPage"
      :page-size="pageSize"
      :current-page="currentPage"
      @current-change="handleCurrentChange"
    ></el-pagination>

    <!-- 添加用户的对话框 -->
    <el-dialog title="添加用户" :visible.sync="addUserDialogShow" @close="closeDialogHandler">
      <el-form
        label-width="80px"
        :model="addUserFormData"
        ref="addUserRuleForm"
        :rules="addUserFormRules"
      >
        <el-form-item label="用户名" prop="username">
          <el-input autocomplete="off" v-model="addUserFormData.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input
            autocomplete="off"
            v-model="addUserFormData.password"
            type="password"
            show-password
          ></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input autocomplete="off" v-model="addUserFormData.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input autocomplete="off" v-model="addUserFormData.mobile"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addUserDialogShow = false">取 消</el-button>
        <el-button type="primary" @click="sureToAddUser">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 编辑用户的对话框 -->
    <el-dialog title="编辑用户" :visible.sync="editUserDialogShow" @close="closeDialogHandler">
      <el-form
        label-width="80px"
        :model="editUserFormData"
        :rules="editUserFormRules"
        ref="addUserRuleForm"
      >
        <el-form-item label="用户名" prop="username">
          <el-tag type="info">{{editUserFormData.username}}</el-tag>
        </el-form-item>

        <el-form-item label="邮箱" prop="email">
          <el-input autocomplete="off" v-model="editUserFormData.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input autocomplete="off" v-model="editUserFormData.mobile"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editUserDialogShow = false">取 消</el-button>
        <el-button type="primary" @click="sureEditUser(editUserFormData.id)">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>                                                                                                                                                                                
<script>
export default {
  data() {
    return {
      searchQuery: "",
      userData: [],
      totalPage: 0,
      currentPage: 1,
      pageSize: 3,
      addUserDialogShow: false,
      editUserDialogShow: false,
      addUserFormData: {
        username: "",
        password: "",
        email: "",
        mobile: ""
      },
      editUserFormData: {
        username: "",
        email: "",
        mobile: ""
      },
      addUserFormRules: {
        username: [
          { required: true, message: "请输入用户名称", trigger: "blur" },
          {
            min: 4,
            max: 8,
            message: "用户名长度在 3 到 8个字符",
            trigger: "change"
          }
        ],

        password: [
          { required: true, message: "请输入用户密码", trigger: "blur" },
          {
            min: 6,
            max: 12,
            message: "用户名长度在 6 到 12 个字符",
            trigger: "change"
          }
        ],
        email: [
          {
            type: "email",
            message: "邮箱格式不正确",
            pattern: /\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/,
            trigger: "change"
          }
        ],
        mobile: [
          {
            message: "手机号码格式不正确",
            pattern: /^(0|86|17951)?(13[0-9]|15[012356789]|166|17[3678]|18[0-9]|14[57])[0-9]{8}$/,
            trigger: "change"
          }
        ]
      },
      editUserFormRules: {
        email: [
          {
            type: "email",
            message: "邮箱格式不正确",
            pattern: /\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/,
            trigger: "change"
          }
        ],
        mobile: [
          {
            message: "手机号码格式不正确",
            pattern: /^(0|86|17951)?(13[0-9]|15[012356789]|166|17[3678]|18[0-9]|14[57])[0-9]{8}$/,
            trigger: "change"
          }
        ]
      }
    };
  },
  created() {
    this.getUserList();
  },
  methods: {
    async getUserList() {
      try {
        let {
          data: { data, meta }
        } = await this.$http({
          url: "users",
          params: {
            pagenum: this.currentPage,
            pagesize: this.pageSize,
            query: this.searchQuery
          }
        });
        // console.log(data);
        if (meta.status === 200) {
          this.userData = data.users;
          this.totalPage = data.total;
        }
      } catch (error) {
        console.log(error);
      }
    },
    handleCurrentChange(value) {
      // 这里是注册currentPage改变的时间，组件里面提供的
      // console.log(value);
      this.currentPage = value;
      this.getUserList();
    },
    clickToShowDialog() {
      this.addUserDialogShow = true;
    },
    closeDialogHandler() {
      // 这里点击确定添加按钮时候，再次点击不会重置----------有问题--后续解决
      this.$refs.addUserRuleForm.resetFields();
    },
    async sureToAddUser() {
      try {
        // console.log(this.$refs);
        let valid = await this.$refs.addUserRuleForm.validate();
        // console.log(valid);
        if (valid) {
          let {
            data: { data, meta }
          } = await this.$http({
            url: "users",
            method: "post",
            data: this.addUserFormData
          });
          // console.log(data, meta);
          if (meta.status === 201) {
            this.$message({
              message: meta.msg,
              type: "success"
            });

            this.addUserDialogShow = false;

            this.getUserList();
          } else {
            this.$message({
              message: meta.msg,
              type: "error"
            });
          }
        }
      } catch (error) {
        console.log(error);
      }
    },

    async changeSwitchState(value) {
      try {
        // console.log(value);
        let res = await this.$http({
          url: `users/${value.id}/state/${value.mg_state}`,
          method: "put"
        });
        // console.log(res);
        if (res.data.meta.status === 200) {
          this.$message({
            message: res.data.meta.msg,
            type: "success"
          });
        } else {
          this.$message({
            message: res.data.meta.msg,
            type: "error"
          });
        }
      } catch (error) {
        console.log(error);
      }
    },
    async editUserDialog(id) {
      try {
        this.editUserDialogShow = true;
        // 获取点击编辑按钮的当前数据的id，请求最新的数据
        // 真实开发过程中是多人开发，可能其他人给其中添加了数据，因此通过v-slot="{row}"获取当前行的数据不可行，可能是没有更新的
        // console.log(id);
        let res = await this.$http({
          url: `users/${id}`
        });
        // console.log(res);
        if (res.data.meta.status === 200) {
          this.editUserFormData = res.data.data;
        }
      } catch (error) {}
    },
    async sureEditUser(id) {
      console.log(id);
      try {
        let res = await this.$http({
          url: `users/${id}`,
          method: "put",
          data: this.editUserFormData
        });
        console.log(res);
        if (res.data.meta.status === 200) {
          this.$message({
            message: res.data.meta.msg,
            type: "success"
          });
          this.editUserDialogShow = false;
          this.getUserList();
        }
      } catch (error) {}
    },
    async deleteUser(id) {
      try {
        await this.$confirm("此操作将永久删除该用户, 是否继续?", "温馨提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        });
        let res = await this.$http({
          url: `users/${id}`,
          method: "delete"
        });
        // console.log(res);
        if (res.data.meta.status === 200) {
          this.$message({
            type: "success",
            message: "删除成功!"
          });
          this.currentPage = 1;
          this.getUserList();
        }
      } catch (error) {
        this.$message({
          type: "info",
          message: "已取消删除"
        });
      }
    },
    searchUser() {
      console.log(this.searchQuery);
      this.getUserList();
    }
  }
};
</script>


<style scoped>
.userMainContainer {
  height: 100%;
}
.el-breadcrumb {
  line-height: 50px;
  background-color: #d4dae0;
  font-size: 16px;
  padding-left: 10px;
}
</style>
