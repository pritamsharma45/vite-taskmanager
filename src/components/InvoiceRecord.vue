<template>
  <div>
    <b-table
      :fields="fields"
      :items="configStore.state.tables['tbl_invoice']"
      small
      select-mode="single"
      responsive="sm"
      ref="invoiceRecord"
      selectable
      @row-selected="onRowSelected"
    >
    </b-table>
  </div>
</template>

<script>
import configStore from "../store/configuration";
import moment from "moment";
export default {
  props: {
    type: {
      type: String,
      required: false,
    },
  },
  data() {
    return {
      configStore: configStore,
      selectedInvoice: {},
      items: [],
      localeOptions: {},
      fields: [
        {
          key: "client_id",
          label: "Client",
          formatter: (value, key, item) => {
            return this.config["tbl_client"][value]["client_name"];
          },
          sortable: true,
          sortByFormatted: true,
          // sortDirection: "desc",
        },

        {
          key: "invoice_date",
          label: "Invoice Date",
          formatter: (value, key, item) => {
            const inv_details = JSON.parse(item["invoice_details"]);
            const dt = inv_details.invoice_date["value"];
            return this.$options.filters.formatAs(dt, "date");
          },
          sortable: true,
        },
        {
          key: "invoice_number",
          label: "Invoice Number",
          formatter: (value, key, item) => {
            let inv_details = JSON.parse(item["invoice_details"]);
            const inv_no = inv_details.invoice_no["value"];
            return this.$options.filters.pad(inv_no, 4, "INV-");
          },
        },
        {
          key: "invoice_total",
          label: "Invoice Total",
          formatter: (value, key, item) => {
            return this.$options.filters.formatAs(
              value,
              "currency",
              this.localeOptions
            );
          },
        },
        {
          key: "invoice_sent",
          label: "Mail Sent",
          formatter: (value) => {
            return value ? "Yes" : "No";
          },
          tdClass: (value) => {
            return value
              ? "text-success font-weight-bold"
              : "text-warning font-weight-bold";
          },
        },
        {
          key: "payment_status",
          label: "Payment Status",
          tdClass: (value) => {
            return value === "Received"
              ? "text-success font-weight-bold"
              : "text-danger";
          },
        },
      ],
    };
  },
  mounted() {
    this.localeOptions = {
      locale: configStore.state.prefs.locale,
      currency: configStore.state.prefs.currency,
    };
  },
  computed: {
    config() {
      return configStore.state.indexedDropdowns;
    },
  },
  methods: {
    onRowSelected(items) {
      this.selectedInvoice = items[0];
    },
    getNextInvoiceId() {},
    viewInvoice() {},
    flagInvoice() {},
    deleteInvoice() {},
    sendPaymentReminder() {},
    invoiceClicked(item) {
      this.$emit("invoiceClicked", item);
    },
  },
};
</script>

<style></style>
