<template>
  <div>
    <smart-filter
      :filterSchema="filterSchema"
      @filtersSubmitted="applyFilters"
      @filtersCleared="getFlatTable"
    ></smart-filter>
    <download-excel
      class="button is-primary is-light is-small float-right"
      :fetch="fetchData"
      :fields="json_fields"
      worksheet="Profit Sheet"
      name="ProfitSheet.xls"
    >
      Download
    </download-excel>

    <b-table :data="data" :columns="columns"></b-table>
  </div>
</template>

<script>
import store from "../store/store.js";
import SmartFilter from "../components/SmartFilter.vue";
export default {
  components: { SmartFilter },
  name: "Report",
  data() {
    return {
      columns: [
        {
          field: "program_name",
          label: "Program",
        },
        {
          field: "amount_credited",
          label: "Customer Payment(USD)",
          numeric: true,
        },
        {
          field: "final_payment",
          label: "Supplier Payment(USD)",
          numeric: true,
        },
        {
          field: "total_value",
          label: "Customer POs(USD)",
          numeric: true,
        },
        {
          field: "PO_value",
          label: "Supplier POs(USD)",
          numeric: true,
        },
        {
          field: "profit",
          label: "Profit(USD)",
          numeric: true,
        },
        {
          field: "profit_percent",
          label: "Profit %",
          numeric: true,
        },
      ],
      showingFilterPanel: false,
      data: [],

      filterSchema: {
        title: "",
        filters: [
          {
            label: "Program Name",
            fld: "program_name",
            inputType: "select",
            optionSource: "tbl_Programs",
            name: "program_name",
            type: "select",
            value: "",
          },
        ],
      },
      json_fields: {
        "Program Name": "program_name",
        "Customer Payments(USD)": "amount_credited",
        "Supplier Payments(USD)": "final_payment",
        "Customer POs(USD)": "total_value",
        "Supplier POs(USD)": "PO_value",
        "Profits(USD)": "profit",
        "Profit(%)": "profit_percent",
      },
    };
  },
  mounted() {
    this.getAggregation();
  },
  methods: {
    getAggregation() {
      const tables = [
        { tblName: "tbl_CustomerPORequest", property: "total_value" },
        { tblName: "tbl_ETCSPORequest", property: "PO_value" },
        { tblName: "tbl_CustomerPayments", property: "amount_credited" },
        { tblName: "tbl_SupplierPayments", property: "final_payment" },
      ];
      const programs = store.state.programs;
      const aggregations = programs.map((program) => {
        const o = {};
        tables.forEach((e) => {
          const t = store.state.tables[e.tblName].filter((o) => {
            const bl = o.po_status ? o.po_status === "Closed" : true;
            return o["program_name"] === program && bl;
          });
          o[e.property] =
            t.length > 0
              ? t.reduce(
                  (previousValue, currentValue) =>
                    previousValue + Number(currentValue[e.property]),
                  0
                )
              : 0;
        });
        o["profit"] = o["total_value"] - o["PO_value"];
        let profit_percent = "";
        if (o["total_value"] == 0) {
          profit_percent = "NaN %";
        } else {
          profit_percent =
            ((o["profit"] * 100) / o["total_value"]).toFixed(2) + " %";
        }

        o["profit_percent"] = profit_percent;

        o["program_name"] = program;
        return o;
      });
      this.data = aggregations;
      console.log("Aggregated tbl", aggregations);
      return aggregations;
      // console.log("Aggregated tbl", aggregations);
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
    getFlatTable() {
      this.getAggregation();
    },
    fetchData() {
      return this.data;
    },
  },
};
</script>

<style>
</style>