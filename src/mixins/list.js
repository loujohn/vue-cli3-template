export default {
  data() {
    return {
      params: {
        pageIndex: 1,
        pageSize: 10,
        keyword: '',
      },
      totalCount: 0,
      list: [],
    };
  },
  methods: {
    handleSearch() {
      this.params.pageIndex = 1;
      this.getList && this.getList();
    },
  },
};
