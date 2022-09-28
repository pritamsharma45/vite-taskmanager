<template>
  <nav class="card">
    <b-loading
      :is-full-page="false"
      v-model="isLoading"
      :can-cancel="true"
    ></b-loading>
    <div class="card-content">
      <p class="title is-4">PRF List</p>
      <b-table :data="isEmpty ? [] : data">
        <b-table-column
          field="Form_Number"
          label="ID"
          width="40"
          numeric
          v-slot="props"
        >
          {{ props.row.Form_Number }}
        </b-table-column>

        <b-table-column
          field="Created_Date"
          label="Created On"
          width="180"
          centered
          v-slot="props"
        >
          <span class="tag is-success">
            {{ new Date(props.row.Created_Date).toLocaleDateString() }}
          </span>
        </b-table-column>

        <b-table-column centered v-slot="props" width="180" label="Status">
          <span
            :class="[
              'tag',
              { 'is-danger': props.row.Status === 'Closed' },
              { 'is-success': props.row.Status === 'Active' },
            ]"
          >
            {{ props.row.Status }}
          </span>
        </b-table-column>
        <b-table-column
          field="Closed_Date"
          label="Closed On"
          width="180"
          centered
          v-slot="props"
        >
          <span class="tag is-success" v-if="props.row.Closed_Date !== ''">
            {{ new Date(props.row.Closed_Date).toLocaleDateString() }}
          </span>
        </b-table-column>
        <b-table-column field="id" label="Action" width="180" v-slot="props">
          <b-button
            width="180"
            type="is-success  is-small"
            @click="openPRFForm(props.row.Form_Number)"
            v-if="props.row.Status === 'Active'"
            >Update</b-button
          >
          <b-button
            width="180"
            type="is-success  is-small"
            @click="openPRFForm(props.row.Form_Number)"
            v-if="props.row.Status === 'Closed'"
          >
            View
          </b-button>
        </b-table-column>

        <b-table-column field="id" label="Action" width="200" v-slot="props">
          <b-button type="is-info  is-small" @click="sendMail(props.row.Form_Number)"
            >Send Reminder</b-button
          >
        </b-table-column>
      </b-table>
    </div>
  </nav>
</template>

<script>
import GASBackEnd from "../services/GASBackEnd";

export default {
  name: "ActivePRF",
  data: function() {
    return {
      bw: new GASBackEnd(),
      data: [],
      // selected : null,
      isLoading: false,
    };
  },
  computed: {},
  mounted: function() {
    this.openLoading();
    this.bw.GetTableDataSource("ListPRF").then(
      function(res) {
        this.isLoading = false;
        console.log(res);
        this.data = res.items;
        //   this.columns = res.columns ;
      }.bind(this),
      function(err) {
        console.log("Updated", res); //this.showError();
      }.bind(this)
    );
  },
  methods: {
    openLoading() {
      this.isLoading = true;
      setTimeout(() => {
        this.isLoading = false;
      }, 10 * 1000);
    },
    rowClicked(row) {
      let f_num = row.Form_Number;
    },
    openPRFForm(form_id) {
      this.$router.push({
        name: "PrfSTAGE2Dynamic",
        params: { form_id: String(form_id) },
      });
    },
    sendMail(form_id) {
      let mailIds = [
        "notifications.borl@gmail.com",
        "jamesfd4cast@gmail.com",
        "james@fd4cast.com",
        "hempel.metals.data@gmail.com",
      ];
      this.bw.sendMailPRF(form_id, mailIds,"PRF_List").then(
        function(res) {
          console.log("Mail sent successfully", res);
          this.$buefy.toast.open({
            message: "Mail sent Successfully!",
            type: "is-success",
          });
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
