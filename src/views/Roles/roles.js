export default {
  data() {
    return {
      roleListData: [],
      isAssignRoleDialogShow: false,
      assignRolesData: [],
      checkedRoles: [],
      defaultProps: {
        children: 'children',
        label: 'authName'
      },
      currentRoleId: -1
    }
  },
  methods: {
    async getAllRoleList() {
      let res = await this.$http({
        url: 'roles'
      })
      //   console.log(res);
      this.roleListData = res.data.data
    },
    async showAssignDialogBtn(row) {
      // 使用currentId保存当前项的id 用于角色授权
      this.currentRoleId = row.id
      // 展示分配权限的对话框
      this.isAssignRoleDialogShow = true

      //   发送请求获取所有权限列表
      let res = await this.$http({
        url: 'rights/tree'
      })
      //   console.log(res);
      //   绑定空间的data
      this.assignRolesData = res.data.data

      //   获取当前行的选中项的id，遍历生成数组，绑定到  default-checked-keys属性上
      let level1Ids = []
      let level2Ids = []
      let level3Ids = []
      row.children.forEach(level1 => {
        level1Ids.push(level1.id)
        level1.children.forEach(level2 => {
          level2Ids.push(level2.id)
          level2.children.forEach(level3 => {
            level3Ids.push(level3.id)
          })
        })
      })
      //   this.checkedRoles = [...level1Ids, ...level2Ids, ...level3Ids];

      this.checkedRoles = [...level3Ids]
      //   console.log(this.checkedRoles);
    },
    async updateAssignRole() {
      // 1.  定义一个数组用于保存所有选中权限的id
      let allChecked = []

      // 2. 给tree控件绑定ref属性  为 roleRight
      //   通过this.$refs.roleRight 获取到tree控件
      //   getCheckedNodes是这个控件的方法  返回目前被选中的节点所组成的数组
      //   接收两个 boolean 类型的参数，1. 是否只是叶子节点，默认值为 false 2. 是否包含半选节点，默认值为 false
      // 3.  使用 this.$refs.roleRight.getCheckedNodes(false, true)可以获取所有选中（包括半选的）的数组
      // 4.  遍历该数组获取所有的id;
      this.$refs.roleRight.getCheckedNodes(false, true).forEach(item => {
        allChecked.push(item.id)
      })
      // console.log(allChecked);
      //   5. 将获取的所有id的数组组合成字符串（接口要求）
      let ids = allChecked.join()
      // console.log(ids);

      //   第二种写法
      //   let check = this.$refs.roleRight.getCheckedKeys();
      //   let checkHalf = this.$refs.roleRight.getHalfCheckedKeys();
      //   console.log(check, checkHalf);
      //   let ids = [...check, ...checkHalf].join();

      //   6. 发送请求
      let res = await this.$http({
        url: `roles/${this.currentRoleId}/rights`,
        method: 'post',
        data: {
          rids: ids
        }
      })
      // console.log(res);
      if (res.data.meta.status === 200) {
        this.$message({
          message: res.data.meta.msg,
          type: 'success',
          duration: 1000
        })
      }
      this.getAllRoleList()
      this.isAssignRoleDialogShow = false
    },
    async deleteRight(row, id) {
      // 点击tag标签的关闭按钮close事件  点击的时候获取当前行的id并存储
      this.currentRoleId = row.id
      // console.log(id);

      // 遍历三级权限获取所有权限的id组合   过滤掉当前点击的那个id重新发送请求重新渲染
      let level1Ids = []
      let level2Ids = []
      let level3Ids = []
      row.children.forEach(level1 => {
        level1Ids.push(level1.id)
        level1.children.forEach(level2 => {
          level2Ids.push(level2.id)
          level2.children.forEach(level3 => {
            level3Ids.push(level3.id)
          })
        })
      })
      let allLevelIds = [...level1Ids, ...level2Ids, ...level3Ids]
        .filter(v => v !== id)
        .join()
      // console.log(allLevelIds);
      let res = await this.$http({
        url: `roles/${this.currentRoleId}/rights`,
        method: 'post',
        data: {
          rids: allLevelIds
        }
      })
      // console.log(res);
      this.getAllRoleList()
    }
  },
  created() {
    this.getAllRoleList()
  }
}
