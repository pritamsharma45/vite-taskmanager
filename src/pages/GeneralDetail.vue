<template>
  <div id="GeneralDetail">
    <div class="card has-background-primary-light">
      <header class="card-header">
        <p class="title is-4 my-3 ml-3">
    {{ record_type }} Form No : {{ req.Form_Number }}
    </p>
      </header>

      <div class="card-content">
        <div id="detail-section-1" class="mb-6 ml-6">
          <div class="columns">
            <div class="columnn" v-for="set in section_1_details">
              <table>
                <tr v-for="n in set" class="my-2">
                  <td class="subtitle is-6" style="width:240px">
                    {{ n.label | capitalize }}
                  </td>
                  <td style="width:20px">:</td>
                  <td class="title is-6" style="width:250px">{{ n.value }}</td>
                </tr>
              </table>
            </div>
            <!-- <div class="divider is-vertical">And</div> -->
          </div>
        </div>

        <div id="detail-section-2"></div>

        <div id="table-section" class="mt-6">
           <b-loading :is-full-page="false" v-model="isLoading" :can-cancel="true"></b-loading>
          <section>
            <b-tabs v-model="activeTab">
              <div v-for="(value, name, index) in tables">
                
                <b-tab-item :label="name | capitalize">
                  <b-table :data="value" :columns="tbl_columns[name]" class="has-background-info-light is-size-7"></b-table>
                </b-tab-item>
              </div>
            </b-tabs>
          </section>
        </div>
      </div>

      <footer class="card-footer">
        <a href="#" class="card-footer-item">Send Mail</a>
      </footer>
    </div>
  </div>
</template>

<script>
import _ from "lodash";
import GASBackEnd from "../services/GASBackEnd";

export default {
  name: "GeneralDetail",
  props: ["req", "record_type"],
  data: function() {
    return {
      bw: new GASBackEnd(),
      tables: {},
      tbl_columns: {},
      isLoading: false,
      section_2_details: {},
    };
  },
  mounted: function() {

    if (this.record_type === "PRF") {
      console.log("Row Clicked", this.req.Form_Number);
      this.getPRFTables(Number(this.req.Form_Number));
    } else {
      console.log("It's SRF");
      this.getSRFTables(Number(this.req.Form_Number));
    }
    this.openLoading();
  },
  computed: {
    section_1_details: function() {

      const { Form_Number,row_,ID, ...detail } = this.req;
console.log("Detail after omiting",detail);
      const keys = Object.keys(detail);
       const len = Math.floor(keys.length / 2);
        const res = [];
      for(var i in detail){
          res.push({
          label: i,
          value: detail[i],
        });
      };
      return _.chunk(res, len + 1);
    },
  },
  methods: {
      openLoading() {
                this.isLoading = true;
                setTimeout(() => {
                    this.isLoading = false;
                }, 10 * 1000);
            },
    getPRFTables(form_number) {
      this.bw.GetTablesInPRFEntries(form_number).then(
        function(res) {
          console.log("tables:", res);
          this.isLoading = false;
          this.tables = res.data;
          this.tbl_columns = res.columns ;

        }.bind(this),
        function(err) {
          console.log("Updated", res); //this.showError();
        }.bind(this)
      );
    },
    getSRFTables(form_number) {
      this.bw.GetTablesInSRFEntries(form_number).then(
        
        function(res) {
          this.tables = res.data;
          this.tbl_columns = res.columns ;
this.isLoading = false;

        }.bind(this),
        function(err) {
          console.log("Updated", res); //this.showError();
        }.bind(this)
      );
    },
  },
  filters: {
    capitalize: function(value) {
      if (!value) return "";
      value = value.toString();
      value = _.startCase(value);
      return value.toString();
    },
  },
};
</script>
