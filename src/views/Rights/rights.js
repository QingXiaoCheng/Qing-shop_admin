export default {
  data() {
    return {
      rightsListData: []
    }
  },
  filters: {
    levelFormat(val) {
      //   console.log(val);
      switch (+val) {
        case 0:
          return '一级'
          break
        case 1:
          return '二级'
          break
        case 2:
          return '三级'
          break
      }
    }
  },

  async created() {
    let {
      data: { data, meta }
    } = await this.$http({
      url: 'rights/list'
    })

    // console.log(data);
    this.rightsListData = data
  }
}
