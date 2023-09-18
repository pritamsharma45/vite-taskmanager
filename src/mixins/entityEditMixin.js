export default {
  data() {
    return {
      bw: new GASBackEnd(),
      model: entityType.model(),
      schema: entityType,
      title: entityType.formTitle,
      subTitle: entityType.formSubTitle,

      formOptions: {
        validateAfterChanged: true,
      },
      isSaving: false,
    };
  },

  methods: {
    getFormData(table_name, id) {
      console.log(this.model);
      this.bw.createEntity(this.model, this.schema.table_name).then(
        function(res) {
          console.log("Updated", res);
        }.bind(this),
        function(err) {
          console.log("Updated", res); //this.showError();
        }.bind(this)
      );
    },
    clickMe() {
      console.log("I am Clicked");
    },
  },
};
