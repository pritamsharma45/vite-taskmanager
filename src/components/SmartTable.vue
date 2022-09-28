<template>
  <div class="panel is-success mx-4 my-1">
    <div class="panel-heading">
      <nav class="level">
        <div class="level-left">
          <div class="level-item has-text-centered">
            <h6 class="title is-6 has-text-weight-bold mr-4">
              {{ schema.title }}
            </h6>
          </div>
          <div class="level-item has-text-centered">
            <div class="buttons ml-4">
              <b-button
                size="is-small"
                @click="addNew"
                type="is-info"
                icon-left="plus"
              >
                Add New
              </b-button>
              <b-button
                size="is-small"
                type="is-warning"
                :icon-right="showingFilterPanel ? 'chevron-up' : 'chevron-down'"
                @click="showingFilterPanel = !showingFilterPanel"
              >
                Show Filter panel
              </b-button>
            </div>
          </div>
        </div>
      </nav>
    </div>
    <div v-if="showingFilterPanel">
      <smart-filter
        :filterSchema="schema.filterSchema"
        @filtersSubmitted="applyFilters"
        @filtersCleared="clearFilters"
      ></smart-filter>
      <download-excel
        class="button is-primary is-light is-small mx-4 mt-1"
        :fetch="fetchData"
        :fields="jsonFields"
        worksheet="Sheet"
        :name="schema.recordName"
      >
        Download
      </download-excel>
    </div>
    <b-table
      :data="data"
      detailed
      height="600"
      hoverable
      scrollable
      class="myTable is-size-7"
      sticky-header
      detail-key="id"
      @details-open="(row, index) => $buefy.toast.open(`Expanded ${row.id}`)"
      :show-detail-icon="showDetailIcon"
    >
      <!-- <b-table-column
        v-for="(column, index) in columns"
        :key="index"
        :label="column.label"
        :visible="column.visible"
        v-slot="props"
      >
        {{ props.row[column.field] }}
      </b-table-column> -->
      <b-table-column
        v-for="(column, index) in columns"
        :key="index"
        :label="column.label"
        :visible="column.visible"
        v-slot="props"
      >
        <span v-if="column.type != 'link'">
          {{
            column.field in fKeyFields
              ? renderFkey(column.field, props.row[column.field])
              : column.type === "date"
              ? renderDate(props.row[column.field])
              : props.row[column.field]
          }}
        </span>
        <span v-if="column.type === 'link'">
          <a :href="props.row[column.field]"> Tracking Link </a>
        </span>
      </b-table-column>

      <!-- Row Details -->
      <template #detail="props">
        <div class="buttons">
          <b-button
            @click="deleteEntry(props.row.id)"
            type="is-danger"
            size="is-small"
            icon-left="delete"
          >
            Delete
          </b-button>
          <b-button
            @click="edit(props.row)"
            type="is-success"
            size="is-small"
            icon-right="pencil"
          >
            Edit
          </b-button>
          <b-button
            @click="viewDetail(props.row)"
            type="is-success"
            size="is-small"
            icon-right="eye"
          >
            View
          </b-button>
        </div>
      </template>
    </b-table>
  </div>
</template>

<script>
import store from "../store/store.js";
import SmartFilter from "./SmartFilter.vue";
import moment from "moment";
export default {
  name: "SmartTable",
  components: { SmartFilter },
  props: {
    schema: {
      type: Object,
      required: false,
    },
  },
  data() {
    return {
      filterSchema: {},
      data: [],
      columns: [],
      jsonFields: {},
      fKeyFields: {},
      showDetailIcon: true,
      showingFilterPanel: false,
    };
  },
  computed: {},
  mounted() {
    // console.log("Indexed Dropdowns", store.state.indexedDropdowns);
    this.fetchRecord();
    this.fKeyFields = this.schema.fKeyFields();
    console.log("Foreing Key fields : ", this.fKeyFields);
  },
  filters: {
    capitalize(value) {
      if (!value) return "";
      value = value.toString().replace(/_/g, " ");

      return value.charAt(0).toUpperCase() + value.slice(1);
    },
  },
  methods: {
    toggle(row) {
      this.$refs.table.toggleDetails(row);
    },
    fetchRecord() {
      this.data = store.state.tables["tbl_" + this.schema.recordName];
      console.log(
        `Method : SmartTable >> fetchRecord() , EXPECTED log : Table    ${this.schema.recordName} in Smart Table Component
        OUTPUT : `,
        this.data
      );
      // this.extractHeader();
      this.extractHeaderFromSchema();
    },

    extractHeader() {
      if (this.schema.header) {
        this.columns = header;
        return;
      }
      let header = [];
      for (const [k, v] of Object.entries(this.data[0])) {
        if (typeof v !== "object") {
          if (k !== "model") {
            let o = {};
            o.field = k;
            let value = k.toString().replace(/_/g, " ");
            o.label =
              value.toString().replace(/_/g, " ").charAt(0).toUpperCase() +
              value.slice(1);

            header.push(o);
          }
        }
      }
      console.log("Header from server data ", header);
      this.columns = header;
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
          fld.inputType !== "showSectionButton" &&
          fld.inputType !== "file"
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
    parseRecord(res) {
      let tableLite = {};
      let header = [{ field: "id", label: "ID" }];
      for (const [k, v] of Object.entries(JSON.parse(res[0].model))) {
        if (typeof v !== "object") {
          let o = {};
          o.field = k;
          let value = k.toString().replace(/_/g, " ");
          o.label =
            value.toString().replace(/_/g, " ").charAt(0).toUpperCase() +
            value.slice(1);
          header.push(o);
        }
      }
      tableLite.header = header;

      tableLite.data = res.map((o) => {
        let row = {};
        row.id = o.id;
        // o = JSON.parse(o.model);
        for (const [k, v] of Object.entries(JSON.parse(o.model))) {
          if (typeof v !== "object") {
            row[k] = v;
          }
        }
        row.model = JSON.parse(o.model);
        return row;
      });

      //   console.log("Table Data", this.data);
      console.log("Table", tableLite);
      return tableLite;
    },
    viewDetail(clickedRowObj) {
      const row = JSON.parse(JSON.stringify(clickedRowObj));
      let files = row.files ? row.files : {};
      let detail = row.model;
      const dropdowns = store.state.indexedDropdowns;
      const dateReg = /^\d{4}[./-]\d{2}[./-]\d{2}$/;

      console.log("Fkeys", this.fKeyFields);
      for (let [k, v] of Object.entries(detail)) {
        if (v === "") {
          detail[k] = "";
        } else if (dateReg.test(v)) {
          var dt = v.split("-");
          dt = String(dt[1]) + "-" + String(dt[2]) + "-" + String(dt[0]);
          detail[k] = dt;
        } else {
          if (this.fKeyFields[k]) {
            console.log(`${k}:${v}`);

            console.log(`Found in fKeyFields: ${k}:${v}`);
            const tbl_Name = this.fKeyFields[k]["tblName"];
            const renderFldName = this.fKeyFields[k]["keyRenderFld"];
            if (Array.isArray(v)) {
              if (typeof v[0] === "number") {
                v = v.map((n) => {
                  return dropdowns[tbl_Name][n][renderFldName];
                });
                detail[k] = v.join("  |  ");
                console.log("Array", v);
              }
            } else {
              console.log("redered Val", dropdowns[tbl_Name][v][renderFldName]);
              detail[k] = dropdowns[tbl_Name][v][renderFldName];
            }
          }
        }
      }
      detail = { ...detail, files };
      console.log("Detail Object", detail);

      // Render Prefix
      this.schema.fields.forEach((fld) => {
        if (fld.prefix) {
          if (detail[fld.name]) {
            switch (fld.prefix) {
              case "lbs":
                detail[fld.name] = detail[fld.name] + " lbs";
                break;

              default:
                detail[fld.name] = fld.prefix + "  " + detail[fld.name];
                break;
            }
          }
        }
      });

      this.$router.push({
        name: "SmartDetail",
        params: { detail: detail, schema: this.schema, id: row.id },
      });
    },
    edit(row) {
      console.log("Edit", row);
      row;
      this.$router.push({
        name: "Form",
        params: { schema: this.schema, row: row },
      });
    },
    deleteEntry(id) {
      console.log("Delete", id);
      google.script.run
        .withSuccessHandler((res) => {
          console.log(res);
          this.$buefy.toast.open({
            message: "Deleted successfully.!",
            type: "is-warning",
          });

          store.state.tables["tbl_" + this.schema.recordName].splice(
            store.state.tables["tbl_" + this.schema.recordName].findIndex(
              (a) => a.id === id
            ),
            1
          );
        })
        .withFailureHandler((error) => {
          console.log(error);
        })
        .deleteEntryByID(id, this.schema.recordName);
      // this.$router.push({
      //   name: "SmartForm",
      //   params: { model: model },
      // });
    },
    addNew() {
      console.log(this.schema);
      this.$router.push({
        name: "Form",
        params: { schema: this.schema },
      });
    },
    renderFkey(fldName, key) {
      // console.log(`Passed arg to renderFkey :- ${fldName}:${key}`);
      if (key === "") return "";
      if (typeof key === "object") return key.length;
      const dropdowns = store.state.indexedDropdowns;
      const tbl_Name = this.fKeyFields[fldName]["tblName"];
      const renderFld = this.fKeyFields[fldName]["keyRenderFld"];
      return dropdowns[tbl_Name][key][renderFld];
      // dropdowns['tbl_Suppliers']
    },
    renderDate(dtString) {
      if (dtString === "") {
        return "";
      } else {
      }
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
      const columns = this.columns;
      columns.forEach((column) => {
        // Render keys
        if (column.field in this.fKeyFields) {
          const fldName = column.field;
          data = data.map((r) => {
            const tbl_Name = this.fKeyFields[fldName]["tblName"];
            const renderFld = this.fKeyFields[fldName]["keyRenderFld"];
            r[fldName] =
              r[fldName] === ""
                ? ""
                : (r[fldName] = dropdowns[tbl_Name][r[fldName]][renderFld]);
            return r;
          });
          // Render Date format
          if (column.type === "date") {
            data = data.map((r) => {
              r[column.field] = this.renderDate(r[fldName]);
              return r;
            });
          }
        }
      });

      // data = data.map((r) => {
      //   r.user = dropdowns["tbl_Users"][r.user]["name"];
      //   r.date = this.renderDate(r.date);
      //   return r;
      // });
      console.log("Data from fetch data", data);

      this.columns.forEach((col) => {
        this.jsonFields[col.label] = col.field;
      });
      return data;
    },
    renderFkeyInPassedModel() {},
    clearFilters() {
      this.data = store.state.tables["tbl_" + this.schema.recordName];
    },
    applyFilters(filtersArray) {
      console.log("Filters to be applied:", filtersArray);
      let beforeFilterItems = JSON.parse(JSON.stringify(this.data));
      let filters = filtersArray;
      let filteredItems = beforeFilterItems.filter(function (item) {
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
          // console.log("Filter:",pass)
        }
        return pass;
        //  For loop of filter ends
      });
      console.log("Filtered Items", filteredItems);
      this.data = filteredItems;
    },
    calculate(calculateElements) {
      const [operation, ...els] = calculateElements;
      // console.log(operation);
      // console.log(
      //   els.reduce((s, v) => {
      //     return s + Number(v);
      //   }, 0)
      // );
      switch (operation) {
        case "add":
          return els.reduce((s, v) => {
            return s + Number(v);
          }, 0);
          break;
        case "substract":
          const res = els[0] - els[1] > 0 ? els[0] - els[1] : "";
          return res;
          break;
        default:
          break;
      }
    },
  },
};
</script>

<style></style>
