<template>
  <div>
    <div class="float-right">
      <smart-filter
        :filterSchema="filterSchema"
        @filtersSubmitted="applyFilters"
        @filtersCleared="getFlatTable"
      ></smart-filter>
      <download-excel
        class="button is-primary is-light is-small"
        :fetch="fetchData"
      >
        Download
      </download-excel>
    </div>

    <b-table :data="data">
      <b-table-column
        v-for="(column, index) in columns"
        :key="index"
        :label="column.label"
        v-slot="props"
      >
        {{
          column.field in fKeyFields
            ? renderFkey(column.field, props.row[column.field])
            : column.type === "date"
            ? renderDate(props.row[column.field])
            : props.row[column.field]
        }}
      </b-table-column>
    </b-table>
  </div>
</template>

<script>
import store from "../store/store.js";
import SmartFilter from "../components/SmartFilter.vue";
import schema from "../schemas/timelog";
import moment from "moment";
export default {
  components: { SmartFilter },
  data() {
    return {
      schema: schema,
      data: [],
      columns: [
        { field: "date", label: "Date", type: "date" },
        { field: "user", label: "User", type: "text" },
        { field: "job", label: "Job #", type: "text" },
        { field: "work", label: "Work", type: "text" },
        { field: "work_hours", label: "Hours", type: "number" },
      ],
      filterSchema: {
        title: "Filter Daily Log",
        filters: [
          {
            label: "User",
            fld: "user",
            type: "select",
            value: "",
            label: "User",
            inputType: "select",
            name: "user",
            isForeignKey: true,
            keyRenderFld: "name",
            optionSource: "tbl_Users",
            optionDisplayField: "name",
          },
          {
            label: "Job #",
            fld: "job",
            type: "select_2",
            value: "",
            optionSource: "tbl_Jobs",
            selectOptions: { value: "job_name", name: "job_name" },
          },
          {
            fld: "date",
            type: "date",
            label: "Entry Date",
            value: null,
          },
          {
            fld: "date",
            type: "date_from_to",
            label: "Entry Date Range",
            from: null,
            to: null,
          },
        ],
      },
      json_fields: {
        Date: "date",
        User: "user",
        Job: "job",
        Work: "work",
      },
      fKeyFields: {},
      showDetailIcon: true,
      showingFilterPanel: true,
    };
  },
  computed: {},
  mounted() {
    // console.log("Indexed Dropdowns", store.state.indexedDropdowns);
    this.getFlatTable();
    this.fKeyFields = this.schema.fKeyFields();
    console.log("Foreing Key fields : ", this.fKeyFields);
    console.log("Daily Logs: ", this.data);
  },
  methods: {
    getFlatTable() {
      let logs = store.state.tables["tbl_TimeLog"];
      let tbl = [];
      logs.forEach((log) => {
        log.job_entries.forEach((entry) => {
          tbl.push({ user: log.user, date: log.date, ...entry });
        });
      });
      this.data = tbl;
    },
    applyFilters(filtersArray) {
      console.log("Filters:", filtersArray);
      let items = this.data;
      let filters = filtersArray;
      items = items.filter(function (item) {
        // Expects return of true or false
        let pass;
        for (let index = 0; index < filters.length; index++) {
          const filter = filters[index];
          // Check type of Filter like text , autocomplete, date range etc
          //  If even one filter is not satisfied, immediately return false to exclude items from filtered list
          switch (filter.type) {
            case "text":
              if (filter.value === "") break;
              pass = item[filter.fld] == filter.value;
              break;
            case "text_partial":
              if (filter.value === "") break;
              pass = item[filter.fld]
                .toLowerCase()
                .includes(filter.value.toLowerCase());
              break;
            case "select":
              pass = item[filter.fld] == filter.value;
              break;
            case "select_2":
              pass = item[filter.fld] == filter.value;
              break;
            case "instant_select":
              pass = item[filter.fld] == filter.value;
              break;
            case "date_from_to":
              if (filter.from == null || filter.to == null) break;
              pass = moment(item[filter.fld]).isBetween(
                moment(filter.from).subtract(1, "days"),
                moment(filter.to).add(1, "days")
              );
              break;
            case "date":
              if (filter.value == null) break;
              pass = moment(item[filter.fld]).isSame(filter.value, "day");
              // console.log("Date filter Pass/Fail :", pass);
              break;
            default:
              statement;
          }

          if (pass == false) {
            break;
          }
        }
        return pass;
        //  For loop of filter ends
      });
      console.log(items);
      this.data = items;
      return items;
    },
    clearFilters(res) {},
    renderFkey(fldName, key) {
      console.log(`Passed arg to renderFkey :- ${fldName}:${key}`);
      const dropdowns = store.state.indexedDropdowns;
      const tbl_Name = this.fKeyFields[fldName]["tblName"];
      const renderFld = this.fKeyFields[fldName]["keyRenderFld"];
      return dropdowns[tbl_Name][key][renderFld];
      // dropdowns['tbl_Suppliers']
    },
    renderDate(dtString) {
      const dt = new Date(dtString);
      var newDateOptions = {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      };
      return dt.toLocaleString("en-US", newDateOptions);
    },
    fetchData() {
      console.log(this.data);
      const dropdowns = store.state.indexedDropdowns;
      let data = JSON.parse(JSON.stringify(this.data));
      data = data.map((r) => {
        r.user = dropdowns["tbl_Users"][r.user]["name"];
        r.date = this.renderDate(r.date);
        return r;
      });
      console.log(data);
      return data;
    },
    extractHeaderFromSchema() {
      if (this.schema.header) {
        this.columns = header;
        return;
      }
      let header = [{ label: "ID", field: "id", type: "text" }];
      this.schema.fields.forEach((fld) => {
        if (
          fld.inputType !== "group" &&
          fld.inputType !== "showSectionButton"
        ) {
          let o = {};
          o.label = fld.label;
          o.field = fld.name;
          o.type = fld.inputType;
          header.push(o);
        }
      });
      this.columns = header;
      console.log("Header from Schema ", header);
    },
  },
};
</script>

<style>
</style>