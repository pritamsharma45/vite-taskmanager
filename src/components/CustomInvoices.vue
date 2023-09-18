<template>
  <div>
    <b-row class="m-1">
      <b-col
        :md="filter.cols"
        cols="3"
        v-for="(filter, index) in filters"
        :key="index"
      >
        <div v-if="filter.type === 'select'">
          <b-form-select
            :id="'selectInput-' + index"
            size="sm"
            style="background-color: #ffe847"
            class="mr-2 font-weight-bold"
            v-model="filter.value"
            :options="configStore.state.tables[filter.optionSource]"
            value-field="id"
            :text-field="filter.optionDisplayField"
          >
            <template #first>
              <b-form-select-option :value="filter.option1.value">{{
                filter.option1.text
              }}</b-form-select-option>
            </template>
          </b-form-select>
        </div>
        <div v-if="filter.type === 'radio'">
          <b-form-radio-group
            :id="'selectInput-' + index"
            v-model="filter.value"
            style="font-size: 0.8em"
            class="px-2 my-1"
            :options="filter.optionSource"
            :aria-describedby="ariaDescribedby"
            name="radio-inline"
          ></b-form-radio-group>
        </div>
        <div v-if="filter.type === 'date_from_to'">
          <b-form inline>
            <b-form-datepicker
              placeholder="From Date"
              id="datepicker-sm"
              v-model="filter.from"
              size="sm"
              locale="en-UK"
              class="px-2 my-0 mx-1"
            ></b-form-datepicker>
            <b-form-datepicker
              placeholder="To  Date "
              v-model="filter.to"
              id="datepicker-sm"
              size="sm"
              locale="en-UK"
              class="px-2 my-0"
            ></b-form-datepicker
          ></b-form>
        </div>
      </b-col>
      <b-col cols="4" md="2">
        <!-- Download Invoices -->
        <download-excel
          id="downloadInvoices"
          class="btn btn-warning btn-sm py-1 font-weight-bold"
          :fetch="exportTable"
          :fields="exportOptions.jsonFields"
          :header="exportOptions.headerTitle"
          :worksheet="dfsdasdasd"
          :name="exportOptions.fileName"
        >
          Download Displayed Invoices
        </download-excel>
      </b-col>
      <b-col cols="4" md="2" class="p-0">
        <b-form-checkbox
          class="mt-1 font-weight-bold"
          size="sm"
          v-model="showCompleted"
          name="check-button"
          switch
        >
          Show Completed
        </b-form-checkbox>
      </b-col>
    </b-row>

    <b-table
      :fields="fields"
      :items="filteredItems"
      small
      :style="[
        configStore.state.tableFont === 'small'
          ? 'font-size: 0.8em'
          : 'font-size: 2.2em',
      ]"
      :sticky-header="windowHeight"
      select-mode="single"
      responsive="sm"
      ref="customInvoiceRecord"
      selectable
      @row-selected="onRowSelected"
    >
    </b-table>
    <footer>
      <div class="invoice-footer float-left">
        <b-button
          variant="primary"
          size="sm"
          class="mx-2"
          @click="viewInvoice"
          :disabled="actionButtonDisable"
        >
          View Selected Invoice
        </b-button>
        <b-button
          variant="primary"
          size="sm"
          class="mx-2"
          @click="sendCustomInvoice"
          :disabled="actionButtonDisable"
        >
          Send Invoice
        </b-button>
        <b-button
          variant="info"
          size="sm"
          class="mx-2"
          @click="changePaymentStatus"
          :disabled="actionButtonDisable"
        >
          {{
            selectedInvoice.payment_status === "Pending"
              ? "Mark Payment Status" + " Received"
              : "Mark Payment Status" + " Pending"
          }}
        </b-button>
        <b-button
          variant="danger"
          size="sm"
          class="mx-2"
          @click="deleteInvoice"
          :disabled="actionButtonDisable"
        >
          Delete Selected Invoice
        </b-button>
      </div>
    </footer>
  </div>
</template>

<script>
import configStore from "../store/configuration";
import moment from "moment";
export default {
  data() {
    return {
      windowHeight: window.innerHeight * 0.75 + "px",
      configStore: configStore,
      showCompleted: false,
      selectedInvoice: {},
      items: configStore.state.tables["tbl_custom_invoice"],
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
            let dt = value === "" ? "" : JSON.parse(value);
            return dt;
          },
          sortable: true,
        },
        {
          key: "invoice_no",
          label: "Invoice Number",
          formatter: (value, key, item) => {
            const prefix = item.type + "-";
            return this.$options.filters.pad(value, 4, prefix);
          },
        },
        {
          key: "invoice_total",
          label: "Invoice Total",
          // class: "text-right",
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
          formatter: (value, key, item) => {
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
      showingFilterPanel: false,
      filters: [
        {
          label: "Client",
          option1: { text: "All Clients    ", value: "" },
          cols: "2",
          fld: "client_id",
          type: "select",
          value: "",
          keyRenderFld: "client_name",
          optionSource: "tbl_client",
          optionDisplayField: "client_name",
        },

        // Dates Filter
        {
          fld: "invoice_date",
          cols: "4",
          label: "Invoice Date",
          type: "date_from_to",
          from: null,
          to: null,
        },
      ],
      exportOptions: {
        jsonFields: {
          Client: "client_id",
          "Invoice Date": "invoice_date",
          "Invoice No": "invoice_no",
          "Invoice Total": "invoice_total",
        },
        fileName: "Invoices",
        headerTitle: "Invoices",
      },
      actionButtonDisable: true,
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
    filteredItems: function () {
      let items = [];
      // Filtering for invoices status
      if (this.showCompleted) {
        items = configStore.state.tables["tbl_custom_invoice"];
      } else {
        items = configStore.state.tables["tbl_custom_invoice"].filter(
          (invoice) => {
            return invoice.payment_status === "Pending";
          }
        );
      }
      let filters = this.filters.filter((item) => {
        if (item.value != null) {
          return item.value != null && item.value !== "";
        } else {
          return item.from !== null && item.to !== null;
        }
      });
      if (filters.length == 0) {
        return items;
      }
      console.log("Filters", filters);
      let filteredItems = items.filter((item) => {
        var pass;
        for (let index = 0; index < filters.length; index++) {
          const filter = filters[index];

          switch (filter.type) {
            case "select":
              pass = item[filter.fld] == filter.value;
              break;
            case "date_from_to":
              pass = moment(item[filter.fld]).isBetween(
                moment(filter.from).subtract(1, "days"),
                moment(filter.to).add(1, "days")
              );
              break;
            default:
              pass = item[filter.fld] == filter.value;
              break;
          }

          if (pass == false) {
            break;
          }
        }

        return pass;
      });
      console.log("Filtered Timesheet", filteredItems);
      return filteredItems;
    },
  },
  methods: {
    onRowSelected(items) {
      this.selectedInvoice = items[0];
      this.actionButtonDisable = false;
      console.log("Selected Invoice", this.selectedInvoice);
    },
    viewInvoice() {
      this.$router.push({
        name: "CustomInvoice",
        params: {
          selected_invoice: this.selectedInvoice,
          clientId: this.selectedInvoice.client_id,
          type: "custom",
          docType: this.selectedInvoice.type,
        },
      });
    },
    sendCustomInvoice() {
      console.log("Send Invoice", this.selectedInvoice);
      this.$bvToast.toast("Sending ...", {
        title: "Progress",
        variant: "success",
        solid: true,
        autoHideDelay: 6000,
      });
      this.actionButtonDisable = true;
      const clientId = this.selectedInvoice.client_id;
      const invoicePayload = {
        invoiceNumber: this.$options.filters.pad(
          this.selectedInvoice.invoice_no,
          4,
          "INV-"
        ),

        invoiceDate: this.$options.filters.formatAs(
          this.selectedInvoice.invoice_date,
          "date"
        ),
        invoiceTotal: this.selectedInvoice.invoice_total,
        clientName: this.config["tbl_client"][clientId]["client_name"],
        clientEmail: this.config["tbl_client"][clientId]["email"],
        invoiceUrl: this.selectedInvoice.invoice,
        invoiceId: this.selectedInvoice.id,
        invoiceTableName: "tbl_custom_invoice",
      };
      google.script.run
        .withSuccessHandler((res) => {
          console.log(res);
          this.$bvToast.toast("Invoice sent successfully! ", {
            title: "Success",
            variant: "success",
            solid: true,
          });
          this.actionButtonDisable = false;
          configStore.updateStoreTable_(
            [this.selectedInvoice.id],
            "tbl_custom_invoice",
            { invoice_sent: true }
          );
        })

        .withFailureHandler((error) => {
          console.log(error);
        })
        .sendInvoiceByEmail(invoicePayload);
    },
    changePaymentStatus() {
      // this.showCompleted = true;

      // Clone this.selectedInvoice.id
      const invId = { ...this.selectedInvoice.id };
      console.log("Invoice Id", invId);

      let flag =
        this.selectedInvoice.payment_status === "Pending"
          ? "Received"
          : "Pending";
      var res = configStore.updateItems(
        [this.selectedInvoice.id],
        "tbl_custom_invoice",
        {
          payment_status: flag,
        }
      );
      console.log("Payment Status Marked", res);
    },
    exportTable() {
      let table = JSON.parse(JSON.stringify(this.filteredItems));
      table = table.map((row) => {
        this.fields.forEach((fld) => {
          if (fld.formatter) {
            row[fld.key] = fld.formatter(row[fld.key], fld.key, row);
          }
        });
        return row;
      });
      console.log("Filtered Table", table);
      return table;
    },
    deleteInvoice() {
      this.$bvModal
        .msgBoxConfirm("Do you want to go ahead?", {
          title: "Delete Confirmation",
          size: "sm",
          buttonSize: "sm",
          okVariant: "danger",
          headerClass: "p-2 border-bottom-0",
          footerClass: "p-2 border-top-0",
          centered: true,
        })
        .then((value) => {
          if (value) {
            this.handleDelete(this.selectedInvoice, "tbl_custom_invoice");
          }
        })
        .catch((err) => {
          // An error occurred
        });
    },
    handleDelete(item, tableName) {
      this.configStore.state.loading = true;
      google.script.run
        .withSuccessHandler((res) => {
          this.configStore.state.loading = false;
          this.$bvToast.toast("Selected Item Deleted Successfully", {
            title: `Deleted`,
            variant: "success",
            solid: true,
          });
          console.log("Delete Successfully", res);
          this.actionButtonDisable = true;
          configStore.state.tables[tableName].splice(
            configStore.state.tables[tableName].findIndex(
              (a) => a.id === item.id
            ),
            1
          );
        })
        .withFailureHandler((error) => {
          console.log(error);
        })
        .deleteItem(tableName, item.id);

      // this.invoices.splice(this.invoices.findIndex(a => a.id === item.id) , 1);
    },
    sendPaymentReminder() {},
  },
};
</script>

<style></style>
