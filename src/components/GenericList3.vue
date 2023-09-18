<template>
  <b-container fluid>
    <b-row>
      <b-col cols="4" md="2" class="my-1 p-0">
        <b-button
          size="sm"
          class="font-weight-bold"
          variant="warning"
          :to="{
            name: 'CreateEntity',
            params: { schema: schema, routerPath: 'createclient' },
          }"
        >
          <b-icon
            icon="plus"
            aria-hidden="true"
            class="text-success font-weight-bold"
          ></b-icon>
          Add New Client
        </b-button>
      </b-col>
      <b-col cols="7" md="2" class="p-0 my-1 mx-0">
        <!-- If Filter Type is By Client : Auto complete -->
        <b-form-group v-if="filterType === 'client'">
          <b-input-group size="sm">
            <b-form-input
              id="filter-input"
              v-model="filter"
              type="search"
              placeholder="Search..                "
            ></b-form-input>

            <b-input-group-append>
              <b-button :disabled="!filter" @click="filter = null"
                >Clear</b-button
              >
            </b-input-group-append>
          </b-input-group>
        </b-form-group>
        <b-form-group v-if="filterType !== 'client'">
          <b-input-group size="sm">
            <b-form-select v-model="filter" placeholder="Filter .. " size="sm">
              <b-form-select-option :value="null"
                >Search..</b-form-select-option
              >
              <b-form-select-option
                v-for="(option, index) in configStore.state.tables[
                  'tbl_client_type'
                ]"
                :key="index"
                :value="option.id"
                >{{ option["client_type"] }}</b-form-select-option
              >
            </b-form-select>

            <b-input-group-append>
              <b-button :disabled="!filter" @click="filter = null" size="sm"
                >Clear</b-button
              >
            </b-input-group-append>
          </b-input-group>
        </b-form-group>
      </b-col>
      <b-col cols="3" md="1" class="p-0 my-1 mx-0">
        <label class="font-weight-bold">Filter By :</label>
      </b-col>
      <b-col cols="4" md="3" class="p-0 my-1 mx-0">
        <b-form-radio-group
          v-model="filterType"
          :options="filterCriterias"
          :aria-describedby="ariaDescribedby"
          class="font-weight-bold"
          name="radio-inline"
        ></b-form-radio-group>
      </b-col>

      <!--Switch :  Show all clients As well -->
      <b-col cols="3" md="2" class="p-0 my-1 mx-0">
        <b-form-checkbox
          class="font-weight-bold"
          v-model="showAll"
          name="check-button"
          switch
        >
          Show All Clients
        </b-form-checkbox>
      </b-col>
      <b-col cols="2" md="1" class="p-0 my-1 mx-0">
        <b-form-checkbox
          v-model="bulkEditMode"
          @input="deselectRow"
          name="check-button"
          class="font-weight-bold"
          switch
        >
          Bulk Edit
        </b-form-checkbox>
      </b-col>
      <!-- Gmail LOGO -->
      <b-col cols="1" md="1" class="my-1 mx-0">
        <div>
          <a
            href="https://mail.google.com/mail/u/0/#inbox"
            target="_blank"
            id="logo"
            ><img
              src="https://i.ibb.co/ygFKF2h/File-Gmail-icon-2020.png"
              alt="File:Gmail_icon_(2020)"
              border="0"
              style="width: 20px; height: auto"
          /></a>
        </div>
      </b-col>
    </b-row>
    <!-- Table Component -->
    <b-overlay :show="configStore.state.loading" rounded="sm">
      <b-table
        :items="items"
        :fields="fields"
        :tbody-tr-class="rowClass"
        sticky-header="660px"
        small
        class="table-condensed"
        :style="[
          configStore.state.tableFont === 'small'
            ? 'font-size: 0.8em'
            : 'font-size: 2.2em',
        ]"
        :selectable="bulkEdit"
        @row-selected="onRowSelected"
        @row-hovered="onRowClicked"
        ref="selectableTable"
      >
        <!-- Render S.No -->
        <template #cell(index)="data">
          {{ data.index + 1 }}
        </template>
        <!--  Actions Buttons  -->

        <template #row-details="row" v-if="!bulkEditMode">
          <!-- <b-button
            pill
            variant="info"
            size="sm"
            class="m-1 py-0"
            style="font-size: 0.8em"
            @click="updateClientInfo(row.item, row.index)"
          >
            Update Client Info
          </b-button> -->
          <!-- <b-button
            pill
            variant="info"
            size="sm"
            class="m-1 py-0"
            style="font-size: 0.8em"
            @click="viewClientInfo(row.item, row.index, $event.target)"
          >
            View Client Info
          </b-button> -->
          <!-- Client Details -->
          <b-button
            pill
            variant="info"
            size="sm"
            class="m-1 py-0"
            style="font-size: 0.8em"
            @click="viewClientDetails(row.item, row.index, $event.target)"
          >
            View Client Details
          </b-button>
          <!-- Add Client Notes -->
          <b-button
            pill
            variant="info"
            size="sm"
            class="m-1 py-0"
            style="font-size: 0.8em"
            :to="{
              name: 'CreateEntity',
              params: {
                schema: clientNoteSchema,
                routerPath: 'createnotes',
                initialData: { client_id: row.item.id },
              },
            }"
          >
            Add Client Note
          </b-button>
          <b-button
            pill
            variant="info"
            size="sm"
            class="m-1 py-0"
            style="font-size: 0.8em"
            @click="viewClientNote(row.item, row.index, $event.target)"
          >
            View Client Notes
          </b-button>
          <b-button
            pill
            variant="info"
            size="sm"
            @click="showRelatedTasks(row.item, row.index, $event.target)"
            class="m-1 py-0"
            style="font-size: 0.8em"
          >
            Show Related Tasks
          </b-button>
          <b-button
            pill
            variant="info"
            size="sm"
            class="m-1 py-0"
            style="font-size: 0.8em"
            @click="editClient(row.item, row.index)"
          >
            Edit Client
          </b-button>
          <b-button
            pill
            variant="info"
            size="sm"
            class="m-1 py-0"
            style="font-size: 0.8em"
            @click="raiseInvoice(row.item, 'INV')"
          >
            Raise Invoice
          </b-button>
          <b-button
            pill
            variant="info"
            size="sm"
            class="m-1 py-0"
            style="font-size: 0.8em"
            @click="raiseInvoice(row.item, 'CN')"
          >
            Raise Credit Note
          </b-button>
          <!-- Send Whatsapp -->
          <b-button
            size="sm"
            class="py-0"
            variant="success"
            @click="whatsapp_click_to_chat(row.item)"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              class="bi bi-whatsapp"
              viewBox="0 0 16 16"
            >
              <path
                d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.933 7.933 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.898 7.898 0 0 0 13.6 2.326zM7.994 14.521a6.573 6.573 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.557 6.557 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592zm3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.729.729 0 0 0-.529.247c-.182.198-.691.677-.691 1.654 0 .977.71 1.916.81 2.049.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232z"
              />
            </svg>
            Whatsapp
            <!-- <span class="material-icons green600 md-18"> whatsapp </span> -->
          </b-button>
          <!-- Send SMS -->
          <b-button
            pill
            variant="success"
            size="sm"
            class="m-1 py-0"
            style="font-size: 0.8em"
            @click="sendSMSClicked(row.item)"
          >
            Send SMS
          </b-button>
          <!-- Send Mail -->
          <b-button
            pill
            variant="light"
            size="sm"
            class="m-1 py-0"
            style="
              display: inline-flex;
              align-items: center;
              font-size: 0.8em;
              padding: 5px 10px;
            "
            @click="openMailModal([row.item])"
          >
            <span class="material-icons red90 md-18"> email </span>Send Mail
          </b-button>
          <!-- Create Task -->
          <b-button
            pill
            size="sm"
            class="m-1 py-0"
            style="font-size: 0.8em"
            variant="warning"
            :to="{
              name: 'CreateEntity',
              params: {
                schema: taskSchema,
                routerPath: 'createtask',
                initialData: { client_id: row.item.id },
              },
            }"
          >
            <b-icon
              icon="plus"
              aria-hidden="true"
              class="text-success"
            ></b-icon>
            Add Task for the selected client
          </b-button>
          <!-- Delete -->
          <b-button
            pill
            variant="danger"
            size="sm"
            class="m-1 py-0"
            style="font-size: 0.8em"
            v-b-modal.modal-delete-client
            @click="selectedClient = row.item"
          >
            Delete Client
          </b-button>
        </template>
        <div class="text-center">
          <b-spinner
            variant="primary"
            style="width: 3rem; height: 3rem"
            label="Large Spinner"
          ></b-spinner>
        </div>
      </b-table>
    </b-overlay>
    <!--  Related Task Modal -->
    <b-modal
      id="related_tasksModal"
      :title="'Tasks related to ' + selectedClientName"
      ok-only
      @hide="resetInfoModal"
      size="xl"
      scrollable
    >
      <b-card no-body style="max-width: 150rem">
        <modal-tasks :clientId="selectedClientId"></modal-tasks>
      </b-card>
    </b-modal>
    <!--  Related Notes Modal -->
    <b-modal
      id="related_noteModal"
      title="Client Notes"
      ok-only
      @hide="resetNoteModal"
      size="xl"
      scrollable
    >
      <b-card no-body style="max-width: 150rem">
        <modal-notes :clientId="selectedClientId"></modal-notes>
      </b-card>
    </b-modal>
    <!--  Client Info Modal -->
    <b-modal
      :id="clientInfoModal.id"
      title="Client Info"
      ok-only
      @hide="resetInfoModal"
    >
      <strong>{{ clientInfoError }}</strong>
      <b-card v-if="clientInfoError === ''" no-body style="max-width: 40rem">
        <b-list-group flush>
          <b-list-group-item v-for="fld in clientInfoModal.header" :key="fld.id"
            >{{ fld | capitalize }} :
            <strong>{{ clientInfoModal.item[fld] }}</strong>
          </b-list-group-item>
        </b-list-group>
      </b-card>
    </b-modal>
    <!-- Client Details modal -->
    <b-modal
      :id="infoModal.id"
      size="lg"
      :title="infoModal.title"
      ok-only
      @hide="resetInfoModal"
    >
      <b-card no-body>
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
            ><strong>Address: </strong>
            {{ infoModal.client.address }}</b-list-group-item
          >
          <b-list-group-item
            ><strong>City : </strong>{{ infoModal.client.city
            }}<strong> | Country : </strong>{{ infoModal.client.country
            }}<strong> | Postcode : </strong
            >{{ infoModal.client.postcode }}</b-list-group-item
          >
          <b-list-group-item
            ><strong>Key Contact: </strong>
            {{ infoModal.client.key_contact }}</b-list-group-item
          >
          <b-list-group-item
            ><strong>Miscellaneous Info: </strong>
            {{ infoModal.client.miscellaneous_info }}</b-list-group-item
          >
        </b-list-group>
      </b-card>
    </b-modal>
    <!-- Client Delete  modal -->
    <b-modal
      id="modal-delete-client"
      :title="clientDeleteModal.title"
      @hide="resetclientDeleteModal"
      @ok="handleDelete(selectedClient)"
    >
      {{ clientDeleteModal.content }}
    </b-modal>
    <!-- Send SMS Modal -->
    <b-modal
      size="lg"
      id="modal-sms-form"
      ref="modal"
      title="Write your message"
      @show="resetModal"
      @hidden="resetModal"
      @ok="handleOk"
    >
      <form ref="form" @submit.stop.prevent="handleSubmit">
        <b-row>
          <b-col sm="12">
            <b-form-textarea
              id="name-input"
              v-model="message"
              :state="nameState"
              rows="8"
              required
            ></b-form-textarea>
          </b-col>
        </b-row>
        <!-- <b-form-group
          label="Name"
          label-for="name-input"
          invalid-feedback="Message is required"
          :state="nameState"
        >
          <b-form-textarea
            id="name-input"
            v-model="message"
            :state="nameState"
            required
          ></b-form-textarea>
        </b-form-group> -->
      </form>
      <template #modal-footer="{ cancel }">
        <b-button size="sm" variant="danger" @click="cancel()">
          Cancel
        </b-button>
        <b-button size="sm" variant="success" @click="handleOk">
          Send Message
        </b-button>
      </template>
    </b-modal>
    <!-- Bulk Email Modal -->
    <modal-mail :from="'Client Manager'" :mailObjects="mailObjects">
    </modal-mail>
    <!-- Bulk Change Warning  modal -->
    <b-modal
      ref="modal-bulk-change"
      title="Bulk edit warning. !"
      @ok="fabClicked"
    >
      You are about to change status of multiple selected items. Are you sure to
      go ahead ?
    </b-modal>
    <!-- FAB -->
    <vue-fab
      icon="arrow_forward_ios"
      :mainBtnColor="mainBtnColor"
      v-if="bulkEditMode"
    >
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
  </b-container>
</template>

<script>
import CreateEntity from "../pages/CreateEntity.vue";
import ModalTasks from "../pages/ListAllTasksModal.vue";
import ModalNotes from "../pages/ListAllNotesModal.vue";
import ModalMail from "../components/MailModal.vue";
import clientInfoSchema from "../forms/clientInfo";
import clientNoteSchema from "../forms/clientNote";
import taskSchema from "../forms/task";
import GASBackEnd from "../services/GASBackEnd";
import editDeleteMixin from "../mixins/editDeleteHandlr";
import admin from "../mixins/admin";
import clientStore from "../store/client";
import configStore from "../store/configuration";
import moment from "moment";

export default {
  components: { CreateEntity, ModalTasks, ModalNotes, ModalMail },
  name: "GenericList3",
  mixins: [editDeleteMixin, admin],
  props: {
    schema: {
      type: Object,
      required: true,
    },
    routerPath: {
      type: String,
      required: false,
    },
  },
  data() {
    return {
      bw: new GASBackEnd(),
      mailObjects: null,
      message: "", // SMS
      nameState: null, //SMS
      taskSchema: taskSchema,
      bulkEditMode: false,
      bulkEdit: true,
      showAll: false,
      selectedItems: [],
      configStore,
      clientStore,
      title: "",
      fields: [
        { key: "index", label: "" },
        {
          key: "client_name",
          label: "Client",
          sortable: true,
        },

        "email",
        "address",

        "city",

        "postcode",
        {
          key: "client_type_id",
          label: "Type",
          formatter: (value, key, item) => {
            if (!value) return "";
            return this.config["tbl_client_type"][value]["client_type"];
          },
        },
      ],
      showSpinner: configStore.state.loading,
      showingPlus: true,
      clientInfoError: "",
      prevSelected: null,
      selectedClientId: "",
      selectedClientName: "",
      selectedClientPhone: "",
      totalRows: 1,
      currentPage: 1,
      perPage: 10,
      filter: null,
      filterOn: [],
      filterType: "client",
      infoModal: {
        id: "info-modal",
        title: "",
        client: {},
        content: "",
      },
      clientInfoModal: {
        id: "client_info_modal",
        title: "Client Info",
        item: {},
        header: [],
      },
      clientDeleteModal: {
        id: "client-delete-modal",
        title: "Client Delete",
        content:
          "You are attempting to delete the selected client. Do you want to go ahead ?",
      },
      clientInfoSchema: clientInfoSchema,
      clientNoteSchema: clientNoteSchema,
      filterCriterias: [
        {
          text: "Client Type",
          value: "type",
        },
        {
          text: "Client",
          value: "client",
        },
      ],
      menu: [
        {
          icon: "email",
          title: "Send Bulk Mails",
          color: "#FF0000",
          action: "sendBulkMails",
        },

        {
          icon: "visibility_off",
          title: "Deactivate",
          color: "#ecd534",
          action: "delete",
        },

        {
          icon: "visibility",
          title: "Activate",
          color: "#ecd534",
          action: "activate",
        },
        {
          icon: "delete_forever",
          title: "Delete Forever",
          color: "#ec243b",
          action: "delete",
        },
      ],
      mainBtnColor: "#3eaf7c",
    };
  },
  computed: {
    items() {
      let items = [];
      if (this.showAll) {
        items = configStore.state.tables["tbl_client"];
      } else {
        items = configStore.state.tables["tbl_client"].filter((client) => {
          return client.status === "A";
        });
      }

      if (this.filter != null) {
        if (this.filterType === "client") {
          items = items.filter((client) => {
            return client.client_name
              .toLowerCase()
              .includes(this.filter.toLowerCase());
          });
        } else {
          items = items.filter((client) => {
            return client["client_type_id"] === this.filter;
          });
        }
      }
      this.totalRows = items.length;
      return items;
    },
    config() {
      return configStore.state.indexedDropdowns;
    },
  },
  created() {
    clientStore.getTables();
  },
  mounted() {
    configStore.loadTables(["tbl_client_notes"]);
    this.title = this.schema.listTitle;
    this.taskSchema.goBackTo = "/AllClients";
  },
  beforeDestroy() {
    console.log("Previous Selected", this.prevSelected);
    if (this.prevSelected != null) {
      this.prevSelected._showDetails = false;
    }
  },
  methods: {
    fetchTables() {},
    onRowSelected(items) {
      console.log(items);
      this.selectedItems = items;
      // this.onRowClicked(items[0]);
    },
    deselectRow() {
      if (!this.bulkEditMode) {
        this.clearSelected();
      }
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
    rowClass(item, type) {
      if (!item || type !== "row") return;
      if (item.status === "D") return "text-muted";
    },
    selectAllRows() {
      this.$refs.selectableTable.selectAllRows();
    },
    clearSelected() {
      this.$refs.selectableTable.clearSelected();
    },
    updateClientInfo(item, index) {
      //admin restrictions
      console.log("Updating Client Info", item);
      const info = clientStore.getClientInfo(item.id);
      console.log("Client Info", info);
      if (info == null) {
        this.$router.push({
          name: "CreateEntity",
          params: {
            schema: this.clientInfoSchema,
            initialData: { client_id: item.id },
            redirectRoute: "/AllClients",
          },
        });
      } else {
        const formData = info;
        this.$router.push({
          name: "CreateEntity",
          params: {
            schema: this.clientInfoSchema,
            formData: formData,
            redirectRoute: "/AllClients",
          },
        });
      }
    },
    updateClientNotes(item, index) {
      //admin restrictions
      this.$router.push({
        name: "CreateEntity",
        params: {
          schema: this.clientNoteSchema,
          id: item.id,
          redirectRoute: "/AllClients",
        },
      });
    },
    viewClientInfo(item, index, button) {
      console.log("Client Id Clicked :", item.id);
      const clientInfo = clientStore.getClientInfo(item.id);
      console.log("Client Info :", clientInfo);
      if (clientInfo == null) {
        this.clientInfoError = "No client info found.!!";
        this.clientInfoModal.id = "client_info_modal";
        this.$root.$emit("bv::show::modal", this.clientInfoModal.id, button);
      } else {
        this.clientInfoModal.id = "client_info_modal";
        this.clientInfoError = "";
        this.clientInfoModal.item = clientInfo;
        this.clientInfoModal.item.associated_dob = moment(
          this.clientInfoModal.item.associated_dob
        ).format("DD/MM/YYYY");
        const header = clientStore.state.clientInfoHeader;
        const newHeader = [...header].splice(2);
        this.clientInfoModal.header = newHeader;
        console.log("Header ", clientStore.state.clientInfoHeader);
        this.$root.$emit("bv::show::modal", this.clientInfoModal.id, button);
      }
    },
    viewClientDetails(item, index, button) {
      this.infoModal.client = item;
      this.infoModal.title = "Client Details";
      this.infoModal.content = JSON.stringify(this.infoModal.client, null, 2);
      this.$root.$emit("bv::show::modal", this.infoModal.id, button);
    },
    viewClientNote(item, index, button) {
      console.log("Related Notes Button Clicked :", item);
      this.selectedClientId = item.id;
      this.$root.$emit("bv::show::modal", "related_noteModal", button);
    },
    showRelatedTasks(item, index, button) {
      console.log("Related Task Button Clicked.Clicked Client :", item);
      this.selectedClientId = item.id;
      this.selectedClientName = item.client_name;
      this.$root.$emit("bv::show::modal", "related_tasksModal", button);
    },
    editClient(item, index) {
      //admin restrictions
      // let taskItem = this.tblLoadingObject.keyedTable[index];
      console.log("Index", item);
      if (item.hasOwnProperty("_showDetails")) {
        delete item._showDetails;
      }
      console.log("Selected Item", item);
      // console.log(taskItem);
      //  this.$router.push({ name: 'EditTask', params: { task: taskItem } });
      this.$router.push({
        name: "CreateEntity",
        params: {
          schema: this.schema,
          formData: item,
          redirectRoute: "/AllClients",
        },
      });
    },
    raiseInvoice(item, docType) {
      //admin restrictions
      console.log("Index", item);
      if (item.hasOwnProperty("_showDetails")) {
        delete item._showDetails;
      }
      console.log("Selected Item", item);

      this.$router.push({
        name: "CustomInvoice",
        params: {
          clientId: item.id,
          type: "custom",
          docType: docType,
        },
      });
    },
    handleDelete(item) {
      //admin restrictions
      // Call Delete Item Method of GAS  with table name  and id as props
      this.configStore.state.loading = true;
      this.isDeletable(this.schema.table_name, item);
    },
    delete(item) {
      google.script.run
        .withSuccessHandler((res) => {
          this.configStore.state.loading = false;
          this.$bvToast.toast("Selected Item Deleted Successfully", {
            title: `Deleted`,
            variant: "success",
            solid: true,
          });
          console.log("Delete Successfully", res);
          configStore.state.tables["tbl_client"].splice(
            configStore.state.tables["tbl_client"].findIndex(
              (a) => a.id === item.id
            ),
            1
          );

          // this.showSpinner = false;
        })
        .withFailureHandler((error) => {
          console.log(error);
        })
        .deleteItem(this.schema.table_name, item.id);
    },
    isDeletable(tableName, item) {
      const bool = configStore.isDeletable(item, tableName, ["tbl_task"]);
      console.log("Is Deletable", bool);
      if (!bool) {
        this.$bvToast.toast(
          "Selected item cannot be deleted. Item found in Task table. !!",
          {
            title: `Deleted`,
            variant: "danger",
            solid: true,
          }
        );
        configStore.state.loading = false;
        // this.showSpinner = false;
        return;
      } else {
        this.delete(item);
      }
    },
    onFiltered(filteredItems) {
      // Trigger pagination to update the number of buttons/pages due to filtering
      this.totalRows = this.items.length;
      this.currentPage = 1;
    },
    handleBulkEdit(fabItem) {
      this.fabItem = fabItem;
      this.$refs["modal-bulk-change"].show();
    },
    fabClicked() {
      //admin restrictions
      const item = this.fabItem;
      console.log("FAB clicked Item", item);

      const tableName = "tbl_client";
      const ids = this.selectedItems.map((e) => {
        return e.id;
      });
      switch (this.menu[item.idx].action) {
        case "delete":
          configStore.deleteItems(this.selectedItems, tableName);
          break;
        case "sendBulkMails":
          this.openMailModal(this.selectedItems);
        case "activate":
          configStore.updateItems(ids, tableName, { status: "A" });
          break;
        case "deactivate":
          configStore.updateItems(ids, tableName, { status: "D" });
          break;
        default:
          break;
      }
    },
    deleteItems() {
      var res = configStore.deleteItems(this.selectedItems, "tbl_client");
      console.log(res);
    },
    isMobile() {
      return window.innerWidth <= 800 && window.innerHeight <= 600;
    },
    whatsapp_click_to_chat(item) {
      const client = item.client_name;
      const phoneNumber = item.phone;
      //       const task = this.config["tbl_task_type"][item.task_type_id]["task_type"];
      //       const deadline_date =
      //         moment(item.deadline_date).format("DD/MM/YYYY") || "";
      //       const phoneNumber = this.config["tbl_client"][item.client_id]["phone"];
      //       const message = `Dear ${client},
      // This is regarding your ${task} which is due on ${deadline_date}.
      // Please submit the required information before ${deadline_date} in order for us to file before the deadline.`;
      const messageText = encodeURIComponent("");
      const url =
        this.isMobile() === false
          ? `https://web.whatsapp.com/send?phone=${phoneNumber}&text=${messageText}`
          : `https://wa.me/${phoneNumber}?text=${messageText}`;
      window.open(url);
      // return web === true
      //   ? `https://web.whatsapp.com/send?phone=${phoneNumber}&text=${messageText}`
      //   : `https://wa.me/${phoneNumber}?text=${messageText}`;
    },

    //  SMS Modal related messages
    sendSMS() {
      google.script.run
        .withSuccessHandler((res) => {
          console.log(res);
          this.$bvToast.toast("Message sent successfully", {
            title: `Success`,
            variant: "success",
            solid: true,
          });
        })
        .withFailureHandler((error) => {
          console.log(error);
        })
        .sendElksSMS(this.message, [this.selectedClientPhone]);
    },
    sendSMSClicked(item) {
      this.selectedClientName = item.client_name;
      this.selectedClientPhone = "+" + item.phone;
      this.message = `Dear ${item.client_name},`;
      this.$root.$emit("bv::show::modal", "modal-sms-form");
    },
    checkFormValidity() {
      const valid = this.$refs.form.checkValidity();
      this.nameState = valid;
      return valid;
    },
    resetModal() {
      this.name = "";
      this.nameState = null;
    },
    handleOk(bvModalEvent) {
      bvModalEvent.preventDefault();
      this.handleSubmit();
    },
    handleSubmit() {
      if (!this.checkFormValidity()) {
        return;
      }
      this.sendSMS();
      this.$nextTick(() => {
        this.$bvModal.hide("modal-sms-form");
      });
    },

    // Mail Merge
    openMailModal(objs) {
      console.log("Mail Objs", objs);
      this.mailObjects = this.getMailObjects(objs);
      this.$root.$emit("bv::show::modal", "modal-Mails-form");
    },
    getMailObjects(objsArray) {
      // this.tasks, [this.selectedItem],this.selectedItems
      console.log("Passed objsArray for Bulk Mails", objsArray);
      return objsArray.map((row) => {
        return {
          Recipient: row["email"],
          "Client Name": row["client_name"],
          Task: "",
          "Deadline Date": "",
        };
      });
    },
  },
};
</script>
