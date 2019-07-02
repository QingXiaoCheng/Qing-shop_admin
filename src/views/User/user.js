export default {
  data() {
    return {
      searchQuery: '',
      userData: [],
      totalPage: 0,
      currentPage: 1,
      pageSize: 3,
      addUserDialogShow: false,
      editUserDialogShow: false,
      addUserFormData: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      editUserFormData: {
        username: '',
        email: '',
        mobile: ''
      },
      addUserFormRules: {
        username: [
          { required: true, message: '请输入用户名称', trigger: 'blur' },
          {
            min: 4,
            max: 8,
            message: '用户名长度在 3 到 8个字符',
            trigger: 'change'
          }
        ],

        password: [
          { required: true, message: '请输入用户密码', trigger: 'blur' },
          {
            min: 6,
            max: 12,
            message: '用户名长度在 6 到 12 个字符',
            trigger: 'change'
          }
        ],
        email: [
          {
            type: 'email',
            message: '邮箱格式不正确',
            pattern: /\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/,
            trigger: 'change'
          }
        ],
        mobile: [
          {
            message: '手机号码格式不正确',
            pattern: /^(0|86|17951)?(13[0-9]|15[012356789]|166|17[3678]|18[0-9]|14[57])[0-9]{8}$/,
            trigger: 'change'
          }
        ]
      },
      editUserFormRules: {
        email: [
          {
            type: 'email',
            message: '邮箱格式不正确',
            pattern: /\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/,
            trigger: 'change'
          }
        ],
        mobile: [
          {
            message: '手机号码格式不正确',
            pattern: /^(0|86|17951)?(13[0-9]|15[012356789]|166|17[3678]|18[0-9]|14[57])[0-9]{8}$/,
            trigger: 'change'
          }
        ]
      }
    }
  },
  created() {
    this.getUserList()
  },
  methods: {
    async getUserList() {
      try {
        let {
          data: { data, meta }
        } = await this.$http({
          url: 'users',
          params: {
            pagenum: this.currentPage,
            pagesize: this.pageSize,
            query: this.searchQuery
          }
        })
        // console.log(data);
        if (meta.status === 200) {
          this.userData = data.users
          this.totalPage = data.total
        }
      } catch (error) {
        console.log(error)
      }
    },
    handleCurrentChange(value) {
      // 这里是注册currentPage改变的时间，组件里面提供的
      // console.log(value);
      this.currentPage = value
      this.getUserList()
    },
    clickToShowDialog() {
      this.addUserDialogShow = true
    },
    closeDialogHandler() {
      // 这里点击确定添加按钮时候，再次点击不会重置----------有问题--后续解决
      this.$refs.addUserRuleForm.resetFields()
    },
    async sureToAddUser() {
      try {
        // console.log(this.$refs);
        let valid = await this.$refs.addUserRuleForm.validate()
        // console.log(valid);
        if (valid) {
          let {
            data: { data, meta }
          } = await this.$http({
            url: 'users',
            method: 'post',
            data: this.addUserFormData
          })
          // console.log(data, meta);
          if (meta.status === 201) {
            this.$message({
              message: meta.msg,
              type: 'success'
            })

            this.addUserDialogShow = false

            this.getUserList()
          } else {
            this.$message({
              message: meta.msg,
              type: 'error'
            })
          }
        }
      } catch (error) {
        console.log(error)
      }
    },

    async changeSwitchState(value) {
      try {
        // console.log(value);
        let res = await this.$http({
          url: `users/${value.id}/state/${value.mg_state}`,
          method: 'put'
        })
        // console.log(res);
        if (res.data.meta.status === 200) {
          this.$message({
            message: res.data.meta.msg,
            type: 'success'
          })
        } else {
          this.$message({
            message: res.data.meta.msg,
            type: 'error'
          })
        }
      } catch (error) {
        console.log(error)
      }
    },
    async editUserDialog(id) {
      try {
        this.editUserDialogShow = true
        // 获取点击编辑按钮的当前数据的id，请求最新的数据
        // 真实开发过程中是多人开发，可能其他人给其中添加了数据，因此通过v-slot="{row}"获取当前行的数据不可行，可能是没有更新的
        // console.log(id);
        let res = await this.$http({
          url: `users/${id}`
        })
        // console.log(res);
        if (res.data.meta.status === 200) {
          this.editUserFormData = res.data.data
        }
      } catch (error) {}
    },
    async sureEditUser(id) {
      console.log(id)
      try {
        let res = await this.$http({
          url: `users/${id}`,
          method: 'put',
          data: this.editUserFormData
        })
        console.log(res)
        if (res.data.meta.status === 200) {
          this.$message({
            message: res.data.meta.msg,
            type: 'success'
          })
          this.editUserDialogShow = false
          this.getUserList()
        }
      } catch (error) {}
    },
    async deleteUser(id) {
      try {
        await this.$confirm('此操作将永久删除该用户, 是否继续?', '温馨提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        let res = await this.$http({
          url: `users/${id}`,
          method: 'delete'
        })
        // console.log(res);
        if (res.data.meta.status === 200) {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this.currentPage = 1
          this.getUserList()
        }
      } catch (error) {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      }
    },
    searchUser() {
      console.log(this.searchQuery)
      this.getUserList()
    }
  }
}
