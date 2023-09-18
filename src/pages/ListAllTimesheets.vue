<template>
  <div>
    <!-- Top Menu Buttons -->
    <b-row>
      <b-col cols="12" md="5">
        <div class="d-flex flex-row bd-highlight mb-2">
          <b-button
            size="sm"
            class="my-2 mr-4 py-0 font-weight-bold"
            variant="warning"
            :to="{
              name: 'CreateEntity',
              params: { schema: schema, routerPath: 'createtimesheet' },
            }"
          >
            <b-icon
              icon="plus"
              aria-hidden="true"
              class="text-success font-weight-bold"
            ></b-icon>
            New Timesheet Entry
          </b-button>
          <b-button
            size="sm"
            class="my-2 mr-4 py-0 font-weight-bold"
            variant="warning"
            @click="showingInvoicingPanel = !showingInvoicingPanel"
          >
            Invoicing
            <b-icon
              :icon="showingInvoicingPanel ? 'chevron-up' : 'chevron-down'"
              aria-hidden="true"
              class="text-success font-weight-bold"
            ></b-icon>
          </b-button>
          <b-button
            size="sm"
            class="my-2 mr-4 py-0 font-weight-bold"
            variant="warning"
            @click="showingReportingPanel = !showingReportingPanel"
          >
            Reporting
            <b-icon
              :icon="showingReportingPanel ? 'chevron-up' : 'chevron-down'"
              aria-hidden="true"
              class="text-success font-weight-bold"
            ></b-icon>
          </b-button>
        </div>
      </b-col>
      <b-col cols="10" md="5">
        <div class="float-left">
          <download-excel
            class="btn btn-warning btn-sm my-2 mr-4 py-0 font-weight-bold"
            :fetch="exportTable"
            :fields="exportOptions.jsonFields"
            :header="exportOptions.headerTitle"
            :worksheet="dfsdasdasd"
            :name="exportOptions.fileName"
          >
            Export as Excel file
          </download-excel>
          <b-button
            size="sm"
            class="my-2 mr-4 py-0 font-weight-bold"
            variant="success"
            @click="showInvoiceModal('new')"
            v-if="showingInvoicingPanel"
            >Generate Invoice</b-button
          >
          <b-button
            size="sm"
            variant="info"
            class="my-2 mr-4 py-0 font-weight-bold"
            v-b-modal.modal-invoice-record
            v-if="showingInvoicingPanel"
            >View Invoices</b-button
          >
        </div>
      </b-col>
      <b-col cols="2" md="2">
        <div class="d-flex flex-row bd-highlight float-right">
          <b-form-checkbox
            size="sm"
            class="my-2 mr-4 font-weight-bold"
            v-model="bulkEditMode"
            name="check-button"
            @input="deselectRow"
            switch
          >
            Bulk Edit
          </b-form-checkbox>
        </div>
      </b-col>
    </b-row>

    <!-- Panel : Reporting -->
    <div v-if="showingReportingPanel || showingInvoicingPanel">
      <b-row class="mt-2 mb-4">
        <b-col
          cols="6"
          :md="filter.md"
          v-for="(filter, index) in filters"
          :key="index"
        >
          <div v-if="filter.type === 'select'">
            <b-form-select
              :id="'selectInput-' + index"
              size="sm"
              style="background-color: #ffe847"
              class="mr-4 font-weight-bold py-1"
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
                class="px-2 py-0 my-1"
              ></b-form-datepicker>
              <b-form-datepicker
                placeholder="To  Date "
                v-model="filter.to"
                id="datepicker-sm"
                size="sm"
                locale="en-UK"
                class="px-2 py-0 my-1"
              ></b-form-datepicker
            ></b-form>
          </div>
        </b-col>
      </b-row>
    </div>
    <!-- @@@@@@@@@                  MAIN TABLE  @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ -->
    <b-overlay :show="configStore.state.loading" rounded="sm">
      <b-table
        small
        :style="[
          configStore.state.tableFont === 'small'
            ? 'font-size: 0.8em'
            : 'font-size: 2.2em',
        ]"
        :sticky-header="windowHeight"
        ref="selectableTable"
        :items="filteredItems"
        :fields="fields"
        :selectable="bulkEdit"
        @row-selected="onRowSelected"
        @row-hovered="onRowClicked"
      >
        <template #cell(invoiced)="data">
          <!-- <div v-if="blAllTask === ''"> -->
          <div>
            <b-icon
              :icon="
                data.value === 'Y' ? 'check-circle' : 'exclamation-circle-fill'
              "
              :variant="data.value === 'Y' ? 'success' : 'danger'"
            ></b-icon>
          </div>
        </template>
        <!-- Row Details -->
        <template #row-details="row">
          <b-button
            pill
            variant="success"
            size="sm"
            class="m-1 py-0"
            style="font-size: 0.8em"
            @click="flagInvoiced(row.item, 'Y')"
          >
            Flag Invoiced
          </b-button>
          <b-button
            pill
            variant="success"
            size="sm"
            class="m-1 py-0"
            style="font-size: 0.8em"
            @click="flagInvoiced(row.item, 'N')"
          >
            Unflag Invoiced
          </b-button>
          <b-button
            pill
            variant="warning"
            size="sm"
            class="m-1 py-0"
            style="font-size: 0.8em"
            @click="clientInfo(row.item, row.index, $event.target)"
          >
            View Client Details
          </b-button>

          <b-button
            pill
            variant="info"
            size="sm"
            class="m-1 py-0"
            style="font-size: 0.8em"
            @click="handleEdit(row.item, row.index, $event.target)"
          >
            Edit Timesheet
          </b-button>
          <b-button
            pill
            variant="danger"
            size="sm"
            class="m-1 py-0"
            style="font-size: 0.8em"
            v-b-modal.modal-delete-task
            @click="selectedItem = row.item"
          >
            Delete Timesheet
          </b-button>
        </template>
      </b-table>
    </b-overlay>
    <!-- @@@@@@@@@                  MAIN TABLE  @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ -->
    <!-- $$$$$   Bottom Button set $$$$$   -->
    <footer></footer>

    <!-- Client Info modal -->
    <b-modal
      :id="infoModal.id"
      :title="infoModal.title"
      ok-only
      @hide="resetInfoModal"
    >
      <b-card no-body style="max-width: 40rem">
        <b-list-group flush>
          <b-list-group-item
            ><strong>Client Name : </strong>
            {{ infoModal.client.client_name }}</b-list-group-item
          >
          <b-list-group-item
            ><strong>Email : </strong>{{ infoModal.client.email
            }}<strong> | Phone : </strong
            >{{ infoModal.client.phone }}</b-list-group-item
          >
          <b-list-group-item
            ><strong>Address 1 : </strong>
            {{ infoModal.client.address }}</b-list-group-item
          >
          <b-list-group-item
            ><strong>City : </strong>{{ infoModal.client.city
            }}<strong> | Country : </strong>{{ infoModal.client.country
            }}<strong> | Postcode : </strong
            >{{ infoModal.client.postcode }}</b-list-group-item
          >
        </b-list-group>
      </b-card>
    </b-modal>
    <!-- TimesheetDelete  modal -->
    <b-modal
      id="modal-delete-task"
      :title="timesheetDeleteModal.title"
      @ok="handleDelete(selectedItem)"
    >
      {{ timesheetDeleteModal.content }}
    </b-modal>
    <!-- Bulk Change Warning  modal -->
    <b-modal
      ref="modal-bulk-change"
      title="Bulk edit warning!"
      @ok="fabClicked"
    >
      You are about to change status of multiple selected items. Are you sure to
      go ahead ?
    </b-modal>
    <!-- Moadal Panel : Invoice Draft -->
    <div>
      <b-modal
        size="xl"
        id="modal-invoice"
        scrollable
        headerBgVariant="dark"
        headerTextVariant="light"
        title="Printable Invoice"
        hide-footer
      >
        <!-- Generated Invoice Modal -->

        <invoice-modal
          :items="invoice_modal.items"
          :clientId="invoice_modal.client_id"
          :inv_no="invoice_modal.inv_no"
          :inv_date="invoice_modal.inv_date"
          :docType="docType"
          ref="invoiceModal"
        >
        </invoice-modal>
        <!-- <template #modal-footer>
          <div class="float-right">
            <b-button variant="success" size="sm" @click="print">
              Save and Print Invoice
            </b-button>

            <b-button variant="primary" size="sm" @click="saveInvoice">
              Save Invoice
            </b-button>
          </div>
        </template> -->
      </b-modal>
    </div>
    <!--  Modal Invoice Records  -->
    <div>
      <b-modal
        size="xl"
        id="modal-invoice-record"
        scrollable
        footer-bg-variant="success"
        headerBgVariant="dark"
        headerTextVariant="light"
        title="All Invoices"
      >
        <invoice-record
          :items="configStore.state.tables['tbl_invoice']"
          ref="invoiceRecordModal"
        >
        </invoice-record>
        <template #modal-footer>
          <div class="float-right">
            <b-button
              variant="danger"
              class="mx-4"
              size="sm"
              @click="deleteInvoice(selectedInvoice)"
            >
              Delete Invoice
            </b-button>
            <b-button
              variant="primary"
              size="sm"
              @click="markPaymentReceived(selectedInvoice, 'Received')"
            >
              Mark Payment Received
            </b-button>

            <b-button
              variant="primary"
              size="sm"
              class="mx-4"
              @click="showInvoiceModal('fromRecord')"
            >
              View Invoice
            </b-button>
            <b-button
              variant="warning"
              size="sm"
              class="mx-4"
              @click="sendTimesheetInvoice"
            >
              Send Invoice
            </b-button>
          </div>
        </template>
      </b-modal>
    </div>
    <!-- FAB -->
    <div v-if="bulkEditMode">
      <vue-fab icon="arrow_forward_ios" :mainBtnColor="mainBtnColor">
        <fab-item
          v-for="(item, idx) in menu"
          :idx="idx"
          :title="item.title"
          :color="item.color"
          :icon="item.icon"
          @clickItem="handleBulkEdit"
          :key="idx"
        />
      </vue-fab>
    </div>
  </div>
</template>

<script>
import tsSchema from "../forms/timesheet";
import ConfirmDialogue from "../components/ConfirmDialogue.vue";
import InvoiceModal from "../components/InvoiceModal.vue";
import InvoiceRecord from "../components/InvoiceRecord.vue";
import moment from "moment";
import configStore from "../store/configuration";

export default {
  name: "AllTasks",
  components: { InvoiceModal, InvoiceRecord },
  data() {
    return {
      windowHeight: window.innerHeight * 0.85 + "px",
      model: tsSchema.model,
      docType: "INV",
      schema: tsSchema,
      configStore: configStore,
      prevSelected: null,
      blAllTask: "",
      selectedItem: {},
      showingInvoicingPanel: true,
      showingReportingPanel: false,
      bulkEditMode: false,
      bulkEdit: true,
      fabItem: "",
      localeOptions: {},
      selectedItems: [],
      menu: [
        {
          icon: "delete_forever",
          title: "Delete",
          color: "#ec243b",
          action: "delete",
        },
        {
          icon: "task_alt",
          title: "Flag Invoiced",
          color: "#3e9213",
          action: "flagInvoiced",
        },
        {
          icon: "history_toggle_off",
          title: "Unflag Invoiced",
          color: "#ff9900",
          action: "unflagInvoiced",
        },
      ],
      mainBtnColor: "#073d5e",
      editItem: {},
      fields: [
        {
          key: "date",
          label: "Activity Date",
          formatter: (value, key, item) => {
            if (!value) return "";
            return moment(value).format("DD/MM/YYYY");
          },
        },
        {
          key: "client_id",
          label: "Client",
          formatter: (value, key, item) => {
            if (!value) return "";
            return this.config["tbl_client"][value]["client_name"];
          },
          sortable: true,
          sortByFormatted: true,
          // sortDirection: "desc",
        },
        {
          key: "activity_type_id",
          label: "Activity",
          formatter: (value, key, item) => {
            if (!value) return "";
            return this.config["tbl_activity_type"][value]["activity_type"];
          },
        },
        {
          key: "task_type_id",
          label: "Task ",
          formatter: (value, key, item) => {
            if (!value) return "";
            return this.config["tbl_task_type"][value]["task_type"];
          },
        },
        {
          key: "time",
          label: "Time",
          formatter: (value, key, item) => {
            // if (!value) return "";
            const hrs = item["hours"] || "";
            const mins = item["minutes"] || "";
            let str = hrs + " Hrs " + mins + " Mins";

            return str;
          },
        },
        {
          key: "rate",
          label: "Rate",
          formatter: (value) => {
            if (!value) return "";
            return this.$options.filters.formatAs(
              value,
              "currency",
              this.localeOptions
            );
          },
          class: "text-right",
        },
        {
          key: "charge",
          label: "Charge",
          formatter: (value) => {
            if (!value) return "";
            return this.$options.filters.formatAs(
              value,
              "currency",
              this.localeOptions
            );
          },
          class: "text-right",
        },
        {
          key: "user_id",
          label: "Team ",
          formatter: (value, key, item) => {
            if (!value) return "";
            return this.config["tbl_user"][value]["user"];
          },
        },
        { key: "comments", label: "Comment" },
        { key: "invoiced", label: "Invoiced" },
      ],

      invoicingFilters: [
        {
          label: "Client",
          option1: { text: "All Clients    ", value: "" },
          md: "3",
          fld: "client_id",
          type: "select",
          value: "",
          keyRenderFld: "client_name",
          optionSource: "tbl_client",
          optionDisplayField: "client_name",
        },
        {
          label: "",
          fld: "invoiced",
          md: "4",
          type: "radio",
          value: "N",
          optionSource: [
            { text: "Non-Invoiced Tasks", value: "N" },
            { text: "Invoiced Tasks", value: "Y" },
            { text: "All Tasks", value: "" },
          ],
          visible: false,
        },
      ],
      invoice: {
        client_id: "",
        data: [],
      },
      invoice_modal: {
        items: [],
        client_id: "",
        invoice_details: null,
        inv_no: "",
        inv_date: "",
      },

      reportingFilters: [
        {
          label: "Client",
          option1: { text: "All Clients    ", value: "" },
          md: "3",
          fld: "client_id",
          type: "select",
          value: "",
          keyRenderFld: "client_name",
          optionSource: "tbl_client",
          optionDisplayField: "client_name",
        },

        {
          label: "Activity",
          option1: { text: "All Activities  ", value: "" },
          md: "3",
          fld: "activity_type_id",
          type: "select",
          value: "",
          keyRenderFld: "activity_type",
          optionSource: "tbl_activity_type",
          optionDisplayField: "activity_type",
        },
        {
          label: "Task",
          option1: { text: "All Tasks      ", value: "" },
          md: "3",
          fld: "task_type_id",
          type: "select",
          value: "",
          keyRenderFld: "task_type",
          optionSource: "tbl_task_type",
          optionDisplayField: "task_type",
        },
        {
          label: "Team",
          option1: { text: "All Employees   ", value: "" },
          md: "3",
          fld: "user_id",
          type: "select",
          value: "",
          keyRenderFld: "user",
          optionSource: "tbl_user",
          optionDisplayField: "user",
        },
        {
          label: "",
          fld: "invoiced",
          md: "4",
          type: "radio",
          value: "",
          optionSource: [
            { text: "Non-Invoiced Tasks", value: "N" },
            { text: "Invoiced Tasks", value: "Y" },
            { text: "All Tasks", value: "" },
          ],
        },

        // Dates Filter
        {
          fld: "date",
          md: "4",
          label: "Activity Date",
          type: "date_from_to",
          from: null,
          to: null,
        },
      ],
      exportOptions: {
        jsonFields: {
          Date: "date",
          Client: "client_id",
          Activity: "activity_type_id",
          Task: "task_type_id",
          Team: "user_id",
          Time: "time",
          Rate: "rate",
          Charge: "charge",
          Comment: "comments",
        },
        headerTitle: "Timesheet Report",
        fileName: "Timesheet Reporting",
      },
      timesheetDeleteModal: {
        id: "timesheet-delete-modal",
        title: "Timesheet Delete",
        content:
          "You are attempting to delete the selected timesheet. Do you want to go ahead ?",
      },
      tblLoadingObject: {},
      timesheets: [],
      headers: tsSchema.fields,
      infoModal: {
        id: "info-modal",
        title: "",
        client: {},
        content: "",
      },
    };
  },
  mounted() {
    this.timesheets = this.configStore.state.tables["tbl_timesheet"];
    this.localeOptions = {
      locale: configStore.state.prefs.locale,
      currency: configStore.state.prefs.currency,
    };
  },
  computed: {
    filteredItems: function () {
      let filters = this.filters.filter((item) => {
        if (item.value != null) {
          return item.value != null && item.value !== "";
        } else {
          return item.from !== null && item.to !== null;
        }
      });
      if (filters.length == 0) {
        return this.timesheets;
      }
      console.log("Filters", filters);
      let items = this.timesheets.filter((item) => {
        var pass;
        for (let index = 0; index < filters.length; index++) {
          const filter = filters[index];

          switch (filter.type) {
            case "select":
              pass = item[filter.fld] == filter.value;
              break;
            case "date_from_to":
              pass = moment(item[filter.fld]).isBetween(
                moment(filter.from),
                moment(filter.to)
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
        // console.log(pass);
        return pass;
        //  For loop of filter ends
      });
      console.log("Filtered Timesheet", items);
      return items;
    },
    config() {
      return configStore.state.indexedDropdowns;
    },
    filters() {
      if (this.showingReportingPanel == true) {
        this.blAllTask = this.reportingFilters[4].value;
        return this.reportingFilters;
      }
      if (this.showingInvoicingPanel == true) {
        this.blAllTask = this.invoicingFilters[1].value;
        return this.invoicingFilters;
      }
      return this.reportingFilters;
    },
    selectedInvoice() {
      return this.$refs.invoiceRecordModal.selectedInvoice;
    },
  },
  beforeDestroy() {
    console.log("Previous Selected", this.prevSelected);
    if (this.prevSelected != null) {
      this.prevSelected._showDetails = false;
    }
  },
  methods: {
    onRowSelected(items) {
      console.log(items);
      this.selectedItems = items;
      // this.onRowClicked(items[0]);
    },
    onRowClicked(item, index) {
      if (!this.bulkEditMode) {
        this.$set(item, "_showDetails", !item._showDetails);
        if (this.prevSelected != null) {
          this.prevSelected._showDetails = !this.prevSelected._showDetails;
        }
        this.prevSelected = item;
      }
    },
    deselectRow() {
      if (!this.bulkEditMode) {
        this.clearSelected();
      }

      if (this.prevSelected != null) {
        this.prevSelected._showDetails = false;
        delete this.prevSelected._showDetails;
        this.bulkEdit = true;
      } else {
        this.bulkEdit = false;
      }
      this.prevSelected = null;
    },
    fabClicked() {
      const item = this.fabItem;
      console.log("FAB clicked Item", item);
      const tableName = "tbl_timesheet";
      const ids = this.selectedItems.map((e) => {
        return e.id;
      });
      switch (this.menu[item.idx].action) {
        case "delete":
          configStore.deleteItems(this.selectedItems, tableName);
          break;
        case "flagInvoiced":
          configStore.updateItems(ids, tableName, { invoiced: "Y" });
          break;
        case "unflagInvoiced":
          configStore.updateItems(ids, tableName, { invoiced: "N" });
          break;
        default:
          break;
      }
    },
    selectAllRows() {
      this.$refs.selectableTable.selectAllRows();
    },
    clearSelected() {
      this.$refs.selectableTable.clearSelected();
    },
    clientInfo(item, index, button) {
      console.log("Index:", index);
      let client_id = this.tblLoadingObject.keyedTable[index]["client_id"];
      console.log("client ID:", client_id);
      console.log("Client Table:", this.tblLoadingObject.relatedTables_normal);
      this.infoModal.client =
        this.tblLoadingObject.relatedTables_normal["tbl_client"][client_id];
      this.infoModal.title = "Client Info";
      this.infoModal.content = JSON.stringify(this.infoModal.client, null, 2);
      this.$root.$emit("bv::show::modal", this.infoModal.id, button);
    },
    resetInfoModal() {
      this.infoModal.title = "";
      this.infoModal.content = "";
    },
    handleEdit(item, index) {
      this.$router.push({
        name: "CreateEntity",
        params: {
          schema: tsSchema,
          formData: item,
          redirectRoute: "/AllTimesheets",
        },
      });
    },
    handleDelete(item) {
      console.log("Timesheet to delete", item);
      const tableName = "tbl_timesheet";

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

      // this.tasks.splice(this.tasks.findIndex(a => a.id === item.id) , 1);
    },
    handleBulkEdit(fabItem) {
      this.fabItem = fabItem;
      this.$refs["modal-bulk-change"].show();
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
      console.log(table);
      return table;
    },
    clientInfo(item, index, button) {
      let client_id = item.client_id;
      console.log("client ID:", client_id);
      // console.log("Client Table:", this.tblLoadingObject.relatedTables_normal);
      this.infoModal.client = this.config["tbl_client"][client_id];
      this.infoModal.title = "Client Info";
      this.infoModal.content = JSON.stringify(this.infoModal.client, null, 2);
      this.$root.$emit("bv::show::modal", this.infoModal.id, button);
    },
    flagInvoiced(item, flag) {
      var res = configStore.updateItems([item.id], "tbl_timesheet", {
        invoiced: flag,
      });
      console.log("Flagged", res);
    },
    markPaymentReceived(item, flag) {
      var res = configStore.updateItems([item.id], "tbl_invoice", {
        payment_status: flag,
      });
      console.log("Payment Status Marked", res);
    },
    deleteInvoice(item) {
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
            this.handleDelete(item, "tbl_invoice");
          }
        })
        .catch((err) => {
          console.log(err.message);
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

    showInvoiceModal(type) {
      if (type === "new") {
        const clientId = this.invoicingFilters[0].value;
        const invNo = this.getNextInvNo();
        if (clientId === "") {
          //
          this.$bvToast.toast(
            "No client selected! Please select from the filter dropdown menu.",
            {
              title: `Select Client`,
              variant: "warning",
              solid: true,
            }
          );
          return;
        }
        var dt = new Date();

        dt = dt.toLocaleDateString("en-GB").split("/").reverse().join("-");
        this.invoice_modal.inv_date = dt;
        this.invoice_modal.items = this.filteredItems;
        this.invoice_modal.client_id = this.invoicingFilters[0].value;
        this.invoice_modal.inv_no = invNo;
      } else {
        const selectedInvoice = this.$refs.invoiceRecordModal.selectedInvoice;
        const ts_ids = selectedInvoice["ts_ids"];
        const items = this.timesheets.filter((row) => {
          return ts_ids.includes(row.id);
        });
        const invDetails = JSON.parse(selectedInvoice.invoice_details);
        this.invoice_modal.inv_no = invDetails.invoice_no.value;
        this.invoice_modal.inv_date = invDetails.invoice_date.value;
        this.invoice_modal.items = items;
        this.invoice_modal.client_id = selectedInvoice.client_id;
        this.invoice_modal.invoice_details = invDetails;
        this.$bvModal.hide("modal-invoice-record");
      }

      console.log("Invoice No :", this.invoice_modal.inv_no);
      this.$bvModal.show("modal-invoice");
      // this.$bvModal.hide("modal-invoice-record");
    },
    sendTimesheetInvoice() {
      const selectedInvoice = this.$refs.invoiceRecordModal.selectedInvoice;

      console.log("Send Invoice", selectedInvoice);
      this.$bvToast.toast("Sending ...", {
        title: "Progress",
        variant: "success",
        solid: true,
        autoHideDelay: 6000,
      });
      this.actionButtonDisable = true;
      const clientId = selectedInvoice.client_id;
      const invoicePayload = {
        invoiceNumber: this.$options.filters.pad(
          selectedInvoice.invoice_no,
          4,
          "INV-"
        ),

        invoiceDate: this.$options.filters.formatAs(
          selectedInvoice.invoice_date,
          "date"
        ),
        invoiceTotal: selectedInvoice.invoice_total,
        clientName: this.config["tbl_client"][clientId]["client_name"],
        clientEmail: this.config["tbl_client"][clientId]["email"],
        invoiceUrl: selectedInvoice.invoice,
        invoiceId: selectedInvoice.id,
        invoiceTableName: "tbl_invoice",
      };

      console.log("Invoice Payload", invoicePayload);

      google.script.run
        .withSuccessHandler((res) => {
          console.log(res);
          this.$bvToast.toast("Invoice sent successfully! ", {
            title: "Success",
            variant: "success",
            solid: true,
          });
          // this.actionButtonDisable = false;
          configStore.updateStoreTable_([selectedInvoice.id], "tbl_invoice", {
            invoice_sent: true,
          });
        })

        .withFailureHandler((error) => {
          console.log(error);
        })
        .sendInvoiceByEmail(invoicePayload);
    },
    saveInvoice() {
      const clientId = this.invoicingFilters[0].value;
      var invoiceDetails = this.$refs.invoiceModal.invoiceDetails;
      var invoiceFooter = this.$refs.invoiceModal.invoiceFooter;

      const ts_ids = this.filteredItems.map((el) => {
        return el.id;
      });

      let o = {};
      o["client_id"] = clientId;
      o["invoice_total"] = invoiceFooter["gt"];
      o["ts_ids"] = JSON.stringify(ts_ids);
      o["invoice_details"] = JSON.stringify(invoiceDetails);
      o["payment_status"] = "Pending";

      console.log("invoice item payload", o);
      return o;
      // google.script.run
      //   .withSuccessHandler((res) => {
      //     console.log("Invoice Record Updated", res);
      //     configStore.updateOrAddItem(o, "tbl_invoice");
      //     // this.$bvModal["modal-invoice"].hide();
      //     this.$bvToast.toast("Invoice Saved.", {
      //       title: `Success`,
      //       variant: "success",
      //       solid: true,
      //     });
      //     // this.$refs.invoiceModal.reset();
      //   })
      //   .withFailureHandler((error) => {
      //     console.log(error);
      //   })
      //   .createEntity(o, "tbl_invoice");
      // configStore.updateItems(ts_ids, "tbl_timesheet", { invoiced: "Y" });
    },
    async print() {
      // Pass the element id here
      this.saveInvoice();
      if (this.invoicingFilters[0].value === "") return;
      await this.$htmlToPaper("printableInvoice");
    },

    getNextInvNo() {
      let id = Math.max.apply(
        Math,
        configStore.state.tables["tbl_invoice"].map(function (o) {
          let n = JSON.parse(o.invoice_details).invoice_no.value;
          return n;
        })
      );
      if (!isFinite(id)) {
        id = 0;
      }
      return id + 1;
    },
  },
};
</script>
