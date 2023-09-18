export default {
  methods: {
    handleDelete(item, index) {
      // Call Delete Item Method of GAS  with table name  and id as props
      google.script.run
        .withSuccessHandler((res) => {
          console.log("Delete Successfully", res);
        })
        .withFailureHandler((error) => {
          console.log(error);
        })
        .deleteItem(this.schema.table_name, id);
    },
    handleEdit(item, index) {
      // let taskItem = this.tblLoadingObject.keyedTable[index];
      console.log("Index", item);
      // console.log(taskItem);
      //  this.$router.push({ name: 'EditTask', params: { task: taskItem } });
      this.$router.push({
        name: "CreateEntity",
        params: { schema: this.schema, formData: item },
      });
    },
  },
};
