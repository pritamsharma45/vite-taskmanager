<template>
  <div class="panel is-success mx-1" style="background-color: #fff9c4">
    <div class="panel-heading">
      <p>Job Costing Sheet</p>
      <div class="level">
        <div class="level-left">
          <div class="level-item">
            <smart-filter
              :filterSchema="filterSchema"
              @filtersSubmitted="applyFilters"
              @filtersCleared="clearFilters"
            ></smart-filter>
          </div>
        </div>
      </div>
    </div>

    <nav class="level">
      <div
        class="level-item has-text-centered"
        v-for="(total, i) in totals"
        :key="i"
      >
        <div class="box m-1 p-1">
          <div style="font-size: 0.65em">{{ total.l }}</div>
          <p class="title is-size-6">{{ total.v }}</p>
        </div>
      </div>
    </nav>

    <div class="columns is-multiline gapless">
      <div v-for="(tblPref, id) in prefs" :key="id" class="column is-half">
        <b-table
          class="m-1"
          style="font-size: 0.65rem"
          scrollable
          sticky-header
          height="300"
          :data="data[tblPref.tableName]"
          :columns="tblPref.columns"
        ></b-table>
      </div>
    </div>
    <!-- <download-excel
      class="button is-primary is-light is-small float-right"
      :fetch="fetchData"
      :fields="json_fields"
      worksheet="Profit Sheet"
      name="ProfitSheet.xls"
    >
      Download
    </download-excel>

    <b-table :data="data" :columns="columns"></b-table> -->
  </div>
</template>

<script>
import store from "../store/store.js";
import SmartFilter from "../components/SmartFilter.vue";
export default {
  components: { SmartFilter },
  name: "JobCosting",
  data() {
    return {
      showingFilterPanel: false,
      data: {},
      prefs: [],
      totals: [
        {
          k: "amount",
          l: "Customer PO Amount",
          tb: "tbl_CustomerPORequest",
          v: "",
        },
        {
          k: "amount_credited",
          l: "Customer Payments Received",
          tb: "tbl_CustomerPayments",
          v: "",
        },
        { k: "cost", l: "Supplier PO Amount", tb: "tbl_ETCSPORequest", v: "" },
        {
          k: "final_payment",
          l: "Supplier Payments Received",
          tb: "tbl_SupplierPayments",
          v: "",
        },
        { k: "amount", l: "ETCS Tool Shop Expenses", tb: "tbl_TimeLog", v: "" },
        {
          k: "",
          l: "Total Credit Amount",
          tb: "",
          v: "",
          computed: (a) => {
            return a[1].v;
          },
        },
        {
          k: "",
          l: "Total Debit Amount",
          tb: "",
          v: "",
          computed: (a) => {
            return Number(a[3].v) + Number(a[4].v);
          },
        },
        {
          k: "",
          l: "Total Profit Amount",
          tb: "",
          v: "",
          computed: (a) => {
            return Number(a[1].v) - (Number(a[3].v) + Number(a[4].v));
          },
        },
      ],
      model: {
        program_name: "",
        job_no: "",
      },
      filterSchema: {
        title: "",
        filters: [
          {
            label: "Program Name",
            fld: "program_name",
            inputType: "select_multilevel",
            optionSource: "tbl_Programs",
            filterOptions: {
              tblToFilter: "tbl_Jobs",
              filterOn: "program_name",
            },
            name: "program_name",
            type: "select_multilevel",
            value: "",
          },
          {
            label: "Project Name",
            fld: "project_name",
            inputType: "select",
            optionSource: "tbl_Projects",
            name: "project",
            type: "select",
            value: "",
          },
          {
            label: "ETCS Tool No",
            inputType: "select_multilevel",
            fld: "ETCS_job_no",
            type: "select_multilevel",
            optionSource: "tbl_Jobs",
            selectOptions: { value: "job_name", name: "job_name" },
            name: "ETCS_job_no",
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
    console.log("Job costing mounted");
    this.getData();
    // this.getAggregation();
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
      if (!filtersArray.length) {
        this.getData();
      } else {
        this.model.job_no = filtersArray[filtersArray.length - 1]["value"];
        this.getData();
      }
    },
    clearFilters() {
      this.filterSchema.filters = this.filterSchema.filters.map((f) => {
        f.value = "";
        return f;
      });
      this.model.job_no = "";
      this.model.program_name = "";
      this.getData();
    },
    getData() {
      const indexDD = store.state.indexedDropdowns;
      // console.log("Indexed DD", indexDD);

      const prefs = [
        {
          tableName: "tbl_CustomerPORequest",
          repeatKeys: [
            "request_date",
            "customer_PO_#",
            "po_status",
            "description",
          ],
          filterKey: "job_no",
          groupKey: "accounts", // amount , job_no
          columns: [
            {
              field: "request_date",
              label: "Request Date",
              formatter: (value) => {
                if (!value) return "";
                return new Intl.DateTimeFormat("en-US").format(new Date(value));
              },
            },
            { field: "customer_PO_#", label: "Customer PO #" },
            { field: "po_status", label: "PO Status" },
            {
              field: "amount",
              label: "Total Value",
              numeric: true,
              prefix: "$",
            },
            { field: "description", label: "Notes/description" },
          ],
        },
        {
          tableName: "tbl_ETCSPORequest",
          repeatKeys: [
            "request_date",
            "company_name",
            "item_name",
            "ETCS_PO_#",
            "po_status",
            "notes",
          ],
          columns: [
            {
              field: "request_date",
              label: "Request Date",
              formatter: (value) => {
                if (!value) return "";
                return new Intl.DateTimeFormat("en-US").format(new Date(value));
              },
            },
            {
              field: "company_name",
              label: "Company Name",
              formatter: (val) => {
                console.log("Passedkey in formatter", val);
                if (val === undefined || val === "") return "";
                return indexDD["tbl_Suppliers"]?.[val]?.["short_name"];
              },
            },
            { field: "item_name", label: "Item Name" },
            { field: "ETCS_PO_#", label: "ETCS PO #" },
            { field: "po_status", label: "PO Status" },
            { field: "notes", label: "Notes" },
            {
              field: "cost",
              label: "PO Value(USD)",
              numeric: true,
              prefix: "$",
            },
            { field: "notes", label: "Notes/description" },
          ],
          filterKey: "job_no",
          groupKey: "accounts", // cost , job_no
        },
        {
          tableName: "tbl_CustomerPayments",
          repeatKeys: [
            "po_no",
            "payment_date",
            "amount_credited",
            "description",
            "notes",
          ],
          columns: [
            { field: "po_no", label: "PO No" },
            {
              field: "payment_date",
              label: "Payment Date",
              formatter: (value) => {
                if (!value) return "";
                return new Intl.DateTimeFormat("en-US").format(new Date(value));
              },
            },
            { field: "description", label: "Description" },
            {
              field: "amount_credited",
              label: "Amount Credited(USD)",
              numeric: true,
              prefix: "$",
            },
            { field: "notes", label: "Notes/Remarks" },
          ],
          filterKey: "job_no",
          groupKey: null,
        },
        {
          tableName: "tbl_SupplierPayments",
          repeatKeys: [
            "initiator",
            "supplier_name",
            "etcs_po_no",
            "supplier_invoice_no",
            "payment_release_date",
            "homeline_deductions",
            "final_payment",
          ],
          columns: [
            {
              field: "initiator",
              label: "Initiator",
              formatter: (val) => {
                if (val === undefined || val === "") return "";
                return indexDD["tbl_Users"]?.[val]?.["name"] ?? "";
              },
            },
            {
              field: "supplier_name",
              label: "Supplier Name",
              formatter: (val) => {
                if (val === undefined || val === "") return "";
                return indexDD["tbl_Suppliers"]?.[val]?.["short_name"] ?? "";
              },
            },
            { field: "etcs_po_no", label: "ETCS PO No" },
            { field: "supplier_invoice_no", label: "Supplier Invoice No" },
            { field: "payment_release_date", label: "Payment Release Date" },
            { field: "homeline_deductions", label: "Homeline Deductions" },
            {
              field: "final_payment",
              label: "Final Payment",
              numeric: true,
              prefix: "$",
            },
          ],
          filterKey: "ETCS_Job_#",
          groupKey: null,
        },
        {
          tableName: "tbl_TimeLog",
          repeatKeys: ["date", "user"],
          filterKey: "job",
          groupKey: "job_entries", // cost , job_no
          columns: [
            {
              field: "date",
              label: "Date",
              formatter: (value) => {
                if (!value) return "";
                return new Intl.DateTimeFormat("en-US").format(new Date(value));
              },
            },
            {
              field: "user",
              label: "Employee",
              formatter: (val) => {
                if (val === undefined || val === "") return "";
                return indexDD["tbl_Users"]?.[val]?.["name"] ?? "";
              },
            },
            { field: "work", label: "Work" },
            { field: "work_hours", label: "Work Hours" },
            {
              field: "supplier_name",
              label: "",
              formatter: (val) => {
                if (val === undefined || val === "") return "";
                return indexDD["tbl_Suppliers"]?.[val]?.["short_name"] ?? "";
              },
            },
            {
              field: "rate",
              label: "Rate(USD/Hr)",
              computed: (row) => {
                const workRow = store.state.tables["tbl_Works"].find(
                  (r) => r.description === row.work
                );
                console.log("Work Row", workRow);
                if (workRow === undefined) return 0;
                const amount = workRow?.rate ?? 0;
                return amount;
              },
            },
            {
              field: "amount",
              label: "Amount",
              computed: (row) => {
                const workRow = store.state.tables["tbl_Works"].find(
                  (r) => r.description === row.work
                );
                if (workRow === undefined) return 0;
                const amount = workRow?.rate ?? 0;

                return amount * row.work_hours;
              },
            },
          ],
        },
      ];
      this.prefs = prefs;
      // const o = {};
      prefs.forEach((pref) => {
        this.data[pref.tableName] = this.getFlatTable(pref);
      });
      this.getTotal();
      // console.log("Flat Tables", this.data);
      // this.getFlatAggregatedTable(o);
    },
    getFlatTable({ tableName, repeatKeys, groupKey, columns, filterKey }) {
      let tbl = store.state.tables[tableName];
      let flatTable = [];
      tbl = tbl
        .map((o) => o.model)
        .forEach((row) => {
          if (groupKey == null) {
            const o = {};
            repeatKeys.forEach((repeatKey) => {
              o[repeatKey] = row[repeatKey];
            });
            flatTable.push({ ...o });
          } else {
            row[groupKey].forEach((r) => {
              const o = {};
              repeatKeys.forEach((repeatKey) => {
                o[repeatKey] = row[repeatKey];
              });
              flatTable.push({ ...o, ...r });
            });
          }
        });
      // console.log("Flat Table", flatTable);
      if (this.model.job_no) {
        flatTable = flatTable.filter((r) => r[filterKey] === this.model.job_no);
      }

      // console.log("Flat Table", flatTable);

      return this.renderKeys(flatTable, columns);
    },
    renderKeys(table, columns) {
      table.map((row) => {
        columns.forEach((c) => {
          if (c.formatter) {
            // console.log("Row with key", row);
            row[c.field] = c.formatter(row[c.field]);
          }
          if (c.computed) {
            row[c.field] = c.computed(row);
          }
        });
        return row;
      });
      // console.log("Flat table with rendered keys", table);

      return table;
    },
    getTotal() {
      this.totals = this.totals.map((t, i, a) => {
        if (t.k !== "") {
          const tbl = this.data[t.tb];
          t.v =
            tbl.length > 0
              ? tbl.reduce((pv, cv) => pv + Number(cv[t.k]), 0)
              : 0;
        }
        if (t.computed) {
          t.v = t.computed(a);
        }
        return t;
      });
      this.totals = this.totals.map((t) => {
        t.v = new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(t.v);
        return t;
      });
      console.log(JSON.stringify(this.totals));
    },
    fetchData() {
      return this.data;
    },
  },
};
</script>

<style>
</style>