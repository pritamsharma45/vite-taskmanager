<template>
  <b-overlay :show="showSpinner" rounded="sm">
    <div class="mt-2">
      <b-button variant="outline-info" @click="clearAllData()">Reset</b-button>
      <b-button variant="outline-success" @click="reloadDummyData()">Test with dummy data</b-button>
    </div>
  </b-overlay>
</template>

<script>
export default {
  data() {
    return {
      showSpinner: false,
      tableNames:['tbl_client','tbl_task','tbl_client_info','tbl_user'],
    };
  },
  methods: {
    clearAllData() {
      this.showSpinner = true;

      google.script.run
        .withSuccessHandler((res) => {
            this.showSpinner = false;
          console.log("All Tables Cleared:",res);
        })
        .withFailureHandler((error) => {
          console.log(error);
        })
        .ClearInitialData(this.tableNames);
    },
    reloadDummyData() {
      this.showSpinner = true;
      google.script.run
        .withSuccessHandler((res) => {
          console.log("Dummy data reloaded",res);
          this.showSpinner = false ;
        })
        .withFailureHandler((error) => {
          console.log(error);
          this.showSpinner = false ;
        })
        .ReloadDefaultData(this.tableNames);
    },
  },
};
</script>

<style>
</style>