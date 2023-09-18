<template>
  <b-container fluid>
    <b-row>
      <!-- Button : Add New Button -->
      <b-col cols="5" md="2" class="p-0"
        ><b-button
          size="sm"
          class="my-2 mr-1 py-0 font-weight-bold"
          variant="warning"
          @click="addNewTask"
        >
          <b-icon
            icon="plus"
            aria-hidden="true"
            class="text-success font-weight-bold"
          ></b-icon>
          New Task
        </b-button>

        <b-button
          size="sm"
          class="my-2 py-0 font-weight-bold"
          variant="warning"
          :to="{
            name: 'CreateEntity',
            params: { schema: clientSchema, routerPath: 'createclient' },
          }"
        >
          <b-icon
            icon="plus"
            aria-hidden="true"
            class="text-success font-weight-bold"
          ></b-icon>
          New Client
        </b-button></b-col
      >
      <!-- Search Filter  -->
      <b-col cols="3" md="2" class="mx-0 p-0">
        <b-form-group class="my-2">
          <b-input-group size="sm">
            <b-form-select v-model="filter" size="sm">
              <b-form-select-option :value="null"
                >Search..</b-form-select-option
              >
              <b-form-select-option
                v-for="(option, index) in configStore.state.tables[
                  filterType.table_name
                ]"
                :key="index"
                :value="option.id"
                >{{ option[filterType.display] }}</b-form-select-option
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
      <!-- <b-col> <search-select></search-select></b-col> -->
      <!-- Button :  Show Search/Filter Panel -->
      <b-col cols="7" md="2" class="p-0"
        ><b-button
          size="sm"
          class="my-2 py-0 font-weight-bold"
          variant="warning"
          @click="showingFilterPanel = !showingFilterPanel"
        >
          Show Search Filters
          <b-icon
            :icon="showingFilterPanel ? 'chevron-up' : 'chevron-down'"
            aria-hidden="true"
            class="text-success font-weight-bold"
          ></b-icon> </b-button
      ></b-col>
      <!-- Button : Get Completion Status -->
      <b-col cols="5" md="2" class="p-0"
        ><b-button
          size="sm"
          class="my-2 mr-1 py-0 font-weight-bold"
          variant="warning"
          @click="showingExportDialog = !showingExportDialog"
        >
          Get completion status of tasks
          <b-icon
            :icon="!showingExportDialog ? 'chevron-up' : 'chevron-down'"
            aria-hidden="true"
            class="text-success font-weight-bold"
          ></b-icon> </b-button
      ></b-col>
      <!--Switch :  Show Completed As well -->
      <b-col cols="4" md="2" class="p-0">
        <b-form-checkbox
          class="mt-1 font-weight-bold"
          size="sm"
          v-model="showCompleted"
          name="check-button"
          switch
        >
          Show Completed Tasks
        </b-form-checkbox>
      </b-col>

      <!--Switch :  Bulk Edit -->
      <b-col cols="2" md="1">
        <b-form-checkbox
          size="sm"
          class="mt-1 font-weight-bold"
          v-model="bulkEditMode"
          name="check-button"
          @input="deselectRow"
          switch
        >
          Bulk Edit
        </b-form-checkbox>
      </b-col>
      <!-- Gmail LOGO -->
      <b-col cols="1" md="1">
        <div class="mr-1">
          <a
            href="https://mail.google.com/mail/u/0/#inbox"
            target="_blank"
            id="logo"
          >
            <img
              src="https://i.ibb.co/ygFKF2h/File-Gmail-icon-2020.png"
              alt="File:Gmail_icon_(2020)"
              border="0"
              style="width: 20px; height: auto"
          /></a>
        </div>
      </b-col>
      <!-- Button : Refresh -->
      <!-- <b-col>
        <b-button
          size="sm"
          variant="success"
          v-if="showRefreshButton"
          @click="fetchTasks"
        >
          <b-icon
            icon="arrow-clockwise"
            aria-label="Refresh"
          ></b-icon> </b-button
      ></b-col> -->
    </b-row>
    <!-- Card : Completion Status  -->
    <div class="my-2 mx-3" v-if="!showingExportDialog">
      <!-- <b-card
        bg-variant="warning"
        header="Get completion status as per selection criteria"
        style="max-width: 70rem"
      > -->
      <b-card-body>
        <strong>Get completion status as per selection criteria :</strong>

        <b-input-group>
          <template #prepend>
            <b-form-select v-model="exportTaskType">
              <b-form-select-option
                v-for="(option, index) in configStore.state.tables
                  .tbl_task_type"
                :key="index"
                :value="{ name: option.task_type, id: option.id }"
                >{{ option.task_type }}</b-form-select-option
              >
            </b-form-select>
          </template>
          <b-input-group-append is-text>
            <b-form-checkbox
              v-model="taskStatusPending"
              name="check-button"
              switch
            >
              Completed
            </b-form-checkbox>
          </b-input-group-append>
          <b-input-group-append>
            <download-excel
              class="btn btn-info"
              :data="exportTasks"
              :fields="json_fields"
              :header="exportHeader"
              :worksheet="exportTaskType"
              :name="exportFileName"
            >
              Click to download
            </download-excel>
          </b-input-group-append>
        </b-input-group>
      </b-card-body>
      <!-- </b-card> -->
    </div>

    <!--  Search/Filter Component -->
    <b-row>
      <!--  Filter By Other -->

      <b-col cols="2" md="1" class="mx-0" v-if="showingFilterPanel">
        <label style="font-size: 0.8em">Filter By:</label>
      </b-col>
      <b-col cols="6" md="5" class="mx-0" v-if="showingFilterPanel">
        <b-form-radio-group
          v-model="filterType"
          :options="filterCriterias"
          :aria-describedby="ariaDescribedby"
          name="radio-inline"
        ></b-form-radio-group>
      </b-col>
      <!-- Date Filter -->
      <b-col
        :cols="filter.cols"
        v-for="(filter, index) in filters"
        :key="index"
      >
        <div v-if="filter.type === 'date_from_to' && showingFilterPanel">
          <b-form inline>
            <b-form-datepicker
              placeholder="From Date"
              id="datepicker-sm"
              v-model="filter.from"
              size="sm"
              locale="en-UK"
              class="px-2 my-1"
            ></b-form-datepicker>
            <b-form-datepicker
              placeholder="To  Date "
              v-model="filter.to"
              id="datepicker-sm"
              size="sm"
              locale="en-UK"
              class="px-2 my-1"
            ></b-form-datepicker
          ></b-form>
        </div>
      </b-col>
    </b-row>
    <!-- MAIN TABLE   -->
    <!--         sort-by="deadline_date"
        sort-desc -->

    <b-overlay :show="configStore.state.loading" rounded="sm">
      <b-table
        small
        :style="[
          configStore.state.tableFont === 'small'
            ? 'font-size: 0.8em'
            : 'font-size: 2.2em',
        ]"
        :sticky-header="windowHeight"
        sort-by="deadline_date"
        :sort-desc="false"
        :tbody-tr-class="rowClass"
        ref="selectableTable"
        :filter="filter"
        filter-included-fields="['client_id']"
        filter-ignored-fields="['deadline_date','reminder_date','periodicity_id']"
        :selectable="bulkEdit"
        @row-selected="onRowSelected"
        @row-hovered="onRowClicked"
        @filtered="onFiltered"
        :items="tasks"
        :fields="fields"
      >
        <!-- Render S.No -->
        <template #cell(index)="data">
          {{ data.index + 1 }}
        </template>
        <template #cell(status)="data">
          <div v-if="showCompleted">
            <b-icon
              :icon="
                data.value === 'Completed' ? 'check-circle' : 'clock-history'
              "
              :variant="data.value === 'Completed' ? 'success' : 'danger'"
            ></b-icon>
          </div>

          <div v-else></div>
        </template>

        <!-- Row Details -->

        <template #row-details="row">
          <!--  Mark Complete And Recreate Task -->
          <b-button
            v-if="row.item.status === 'Pending' && row.item.periodicity_id != 6"
            pill
            variant="success"
            size="sm"
            class="m-1 py-0"
            style="font-size: 0.8em"
            @click="handleMarkCompletion(row.item, true)"
          >
            Mark Complete And Recreate Task
          </b-button>

          <!-- Edit -->
          <b-button
            pill
            variant="primary"
            size="sm"
            class="m-1 py-0"
            style="font-size: 0.8em"
            @click="handleEdit(row.item, row.index, $event.target)"
          >
            Edit Task
          </b-button>
          <!-- Mark complete -->
          <b-button
            v-if="row.item.status === 'Pending'"
            pill
            variant="success"
            size="sm"
            class="m-1 py-0"
            style="font-size: 0.8em"
            @click="handleMarkCompletion(row.item, false)"
          >
            Mark Complete And Finalise Task
          </b-button>
          <!-- Create Timesheet -->
          <b-button
            pill
            size="sm"
            class="m-1 py-0"
            variant="warning"
            :to="{
              name: 'CreateEntity',
              params: {
                schema: tsSchema,
                routerPath: 'createtimesheet',
                initialData: {
                  client_id: row.item.client_id,
                  task_type_id: row.item.task_type_id,
                  user_id: row.item.user_id,
                },
              },
            }"
          >
            <b-icon
              icon="plus"
              aria-hidden="true"
              class="text-success font-weight-bold"
            ></b-icon>
            Create Timesheet Entry
          </b-button>

          <!-- Mark Pending -->
          <b-button
            v-if="row.item.status === 'Completed'"
            pill
            variant="warning"
            size="sm"
            class="m-1 py-0"
            style="font-size: 0.8em"
            @click="markPending(row.item)"
          >
            Mark Pending
          </b-button>
          <!-- Client Details -->
          <b-button
            pill
            variant="info"
            size="sm"
            @click="clientDetails(row.item, row.index, $event.target)"
            class="m-1 py-0"
            style="font-size: 0.8em"
          >
            View Client Details
          </b-button>
          <!-- View Client Notes -->
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
                initialData: { client_id: row.item.client_id },
              },
            }"
          >
            Add Client Note
          </b-button>
          <!-- View Task Notes -->
          <b-button
            pill
            variant="info"
            size="sm"
            class="m-1 py-0"
            style="font-size: 0.8em"
            @click="viewTaskNote(row.item, row.index, $event.target)"
          >
            View Task Notes
          </b-button>
          <!-- Add Task Notes -->
          <b-button
            pill
            variant="info"
            size="sm"
            class="m-1 py-0"
            style="font-size: 0.8em"
            :to="{
              name: 'CreateEntity',
              params: {
                schema: taskNoteSchema,
                routerPath: 'tasknotes',
                initialData: { task_id: row.item.id },
              },
            }"
          >
            Add Task Note
          </b-button>
          <!-- Raise invoice -->
          <b-button
            pill
            variant="info"
            size="sm"
            class="m-1 py-0"
            style="font-size: 0.8em"
            @click="raiseInvoice(row.item, row.index)"
          >
            Raise Invoice
          </b-button>
          <!-- Whatsapp -->
          <!-- <b-link :href="whatsapp_click_to_chat" target="_blank"
            ><span class="material-icons"> whatsapp </span></b-link
          > -->
          <!-- <b-button size="sm" variant="light" @click="whatsapp(row.item)">
            <span class="material-icons"> whatsapp </span>
          </b-button> -->
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
          <!-- Delete -->
          <b-button
            pill
            variant="danger"
            size="sm"
            class="m-1 py-0"
            style="font-size: 0.8em"
            v-b-modal.modal-delete-task
            @click="selectedItem = row.item"
          >
            Delete Task
          </b-button>
        </template>
      </b-table>

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

      <!-- Task Delete  modal -->
      <b-modal
        id="modal-delete-task"
        :title="taskDeleteModal.title"
        @hide="resetTaskDeleteModal"
        @ok="handleDelete(selectedItem)"
      >
        {{ taskDeleteModal.content }}
      </b-modal>
      <!-- Bulk Change Warning  modal -->
      <b-modal
        ref="modal-bulk-change"
        title="Bulk edit warning!"
        @ok="fabClicked"
      >
        You are about to change status of multiple selected items. Are you sure
        to go ahead ?
      </b-modal>

      <!-- <b-col sm="7" md="6" class="my-1">
        <b-pagination
          v-model="currentPage"
          :total-rows="totalRows"
          :per-page="perPage"
          align="fill"
          size="sm"
          class="my-0"
        ></b-pagination>
      </b-col> -->
    </b-overlay>
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
    <!--  Related Task Notes Modal -->
    <b-modal
      id="related_taskNotesModal"
      title="Task Notes"
      ok-only
      @hide="resetTaskNoteModal"
      size="xl"
      scrollable
    >
      <b-card no-body style="max-width: 150rem">
        <modal-task-notes :taskId="this.selectedTaskId"></modal-task-notes>
      </b-card>
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
    <modal-mail :from="'Task Manager'" :mailObjects="mailObjects"> </modal-mail>

    <!-- Footer : Download Button -->
    <footer>
      <div class="invoice-footer float-left">
        <!-- Download Tasks Button -->
        <download-excel
          id="downloadTasks"
          class="btn btn-warning btn-sm py-1 font-weight-bold"
          :fetch="exportTable"
          :fields="exportOptions.jsonFields"
          :header="exportOptions.headerTitle"
          :worksheet="dfsdasdasd"
          :name="exportOptions.fileName"
        >
          Download Tasks
        </download-excel>
        <b-button
          style="display: inline-flex; align-items: center; padding: 5px 10px"
          variant="light"
          @click="openMailModal(tasks)"
          class="py-0"
        >
          <span class="material-icons red90"> email </span>Send Bulk Emails
        </b-button>
      </div>
    </footer>
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

    <!-- <pre>Prev : {{ prevSelected }}</pre> -->
    <!-- <div>
      <b-icon
        :icon="showCompleted ? 'patch-check-fill' : 'check-circle'"
      ></b-icon>
      <b-icon
        :icon="showCompleted ? 'check-circle-fill' : 'check-square-fill'"
      ></b-icon>
    </div> -->
  </b-container>
</template>

<script>
import CreateEntity from "./CreateEntity.vue";
import taskSchema from "../forms/task";
import clientSchema from "../forms/client";
import clientNoteSchema from "../forms/clientNote";
import taskNoteSchema from "../forms/taskNote";
import timesheetSchema from "../forms/timesheet";
import GASBackEnd from "../services/GASBackEnd";
import ConfirmDialogue from "../components/ConfirmDialogue.vue";
import moment from "moment";
import store from "../store/task";
import configStore from "../store/configuration";
import clientStore from "../store/client";
import ModalNotes from "../pages/ListAllNotesModal.vue";
import ModalTaskNotes from "../pages/ListTaskNotesModal.vue";
import ModalMail from "../components/MailModal.vue";
import actions from "../mixins/actions.js";
import sms from "../mixins/sms.js";
import admin from "../mixins/admin.js";
import fab from "../mixins/fab.js";
import whatsapp from "../mixins/whatsapp.js";
import { VueEditor } from "vue2-editor";

export default {
  mixins: [actions, sms, whatsapp, fab, admin],
  name: "AllTasks",
  components: {
    CreateEntity,
    ConfirmDialogue,
    ModalNotes,
    ModalTaskNotes,
    ModalMail,
    VueEditor,
  },
  data() {
    return {
      bw: new GASBackEnd(),
      windowHeight: window.innerHeight * 0.75 + "px",
      store,
      configStore,
      indexedDropdowns: {},
      bulkEditMode: false,
      bulkEdit: true,
      selectedItems: [],
      selectedClientId: "",
      showCompleted: false,
      taskStatusPending: false,
      currentPage: 1,
      perPage: 10,
      totalRows: "",
      filter: null,
      mailObjects: null,
      filterType: {
        table_name: "tbl_client",
        display: "client_name",
        filterField: "client_id",
      },
      showingFilterPanel: false,
      filterCriterias: [
        {
          text: "Task Type",
          value: {
            table_name: "tbl_task_type",
            display: "task_type",
            filterField: "task_type_id",
          },
        },
        {
          text: "Assigned Member",
          value: {
            table_name: "tbl_user",
            display: "user",
            filterField: "user_id",
          },
        },
        {
          text: "Manager",
          value: {
            table_name: "tbl_manager",
            display: "manager",
            filterField: "manager_id",
          },
        },
        {
          text: "Client",
          value: {
            table_name: "tbl_client",
            display: "client_name",
            filterField: "client_id",
          },
        },
      ],
      // Dates Filter
      filters: [
        {
          fld: "deadline_date",
          cols: "4",
          label: "Date",
          type: "date_from_to",
          from: null,
          to: null,
        },
      ],
      // filterCriteriaOptions: ['Tom','Hank'],
      model: taskSchema.model,
      schema: taskSchema,
      clientSchema: clientSchema,
      tsSchema: timesheetSchema,
      clientNoteSchema: clientNoteSchema,
      taskNoteSchema: taskNoteSchema,
      prevSelected: null,
      selectedClientName: "",
      selectedClientPhone: "",
      selectedItem: {},
      selectedTaskId: null,
      editItem: {},
      fields: [
        { key: "index", label: "" },
        //  { key: "selected", label: "" },
        {
          key: "client_id",
          label: "Client",
          formatter: (value) => {
            return this.config["tbl_client"]?.[value]?.["client_name"] ?? "#NA";
            // return value.charAt(0).toUpperCase();
          },
          sortable: true,
          sortByFormatted: true,
          // sortDirection: "desc",
        },
        {
          key: "task_type_id",
          label: "Task",
          formatter: (value) => {
            return (
              this.config["tbl_task_type"]?.[value]?.["task_type"] ?? "#NA"
            );
          },
        },
        {
          key: "deadline_date",
          label: "Deadline Date",
          formatter: (value, key, item) => {
            if (!value) return "";
            return moment(value).format("DD/MM/YYYY") || "";
          },
          // sortable: true,
        },
        {
          key: "reminder_date",
          formatter: (value, key, item) => {
            if (!value) return "";
            return moment(value).format("DD/MM/YYYY") || "";
          },
          label: "Reminder Date",
        },
        {
          key: "periodicity_id",
          label: "Periodicity",
          formatter: (value) => {
            return (
              this.config["tbl_periodicity"]?.[value]?.["periodicity"] ?? "#NA"
            );
          },
        },
        {
          key: "user_id",
          label: "Assigned To",
          formatter: (value) => {
            return this.config["tbl_user"]?.[value]?.["user"] ?? "#NA";
          },
        },
        {
          key: "manager_id",
          label: "Task Handler",
          formatter: (value) => {
            return this.config["tbl_manager"]?.[value]?.["manager"] ?? "#NA";
          },
        },
        { key: "status", label: "" },
      ],
      json_fields: {
        Client: "client_id",
        Task: "task_type_id",
        "Completion due date": "deadline_date",
      },
      exportHeader: "Outstanding Tasks",
      tblLoadingObject: {},
      exportFileName: "",
      exportTaskType: {},
      taskTypeName: "default",
      exportTaskTypeOptions: [],
      exportWorksheetName: "My sheet",
      showingExportDialog: "false",
      headers: taskSchema.fields,
      infoModal: {
        id: "info-modal",
        title: "",
        client: {},
        content: "",
      },
      taskDeleteModal: {
        id: "task-delete-modal",
        title: "Task Delete",
        content:
          "You are attempting to delete the selected task. Do you want to go ahead ?",
      },
      markCompletionMessage: "",
      exportOptions: {
        jsonFields: {
          Client: "client_id",
          Task: "task_type_id",
          "Deadline Date": "deadline_date",
          "Reminder Date": "reminder_date",
          "Assigned To": "user_id",
        },
        fileName: "Tasks",
        headerTitle: "Taks",
      },
    };
  },
  created() {
    // store.getTasks();
    // configStore.getIndexedTables();
  },
  mounted() {
    // this.fetchTasks();
    console.log("Task manger  Mounted");
    clientStore.getTables();
    configStore.getDrafts();
    configStore.loadTables(["tbl_task_notes"]);

    // if (localStorage.getItem('tbl_tasks'))
    //     this.todo_items = JSON.parse(localStorage.getItem('todo_items'));
    // console.log(taskSchema);
  },
  beforeDestroy() {
    console.log("Previous Selected", this.prevSelected);
    if (this.prevSelected != null) {
      this.prevSelected._showDetails = false;
    }
  },
  computed: {
    tasks() {
      let tasks = [];
      // Filtering for task status
      if (this.showCompleted) {
        tasks = configStore.state.tables["tbl_task"];
      } else {
        tasks = configStore.state.tables["tbl_task"].filter((task) => {
          return task.status === "Pending";
        });
      }
      // Filtering for date
      let filters = this.filters.filter((item) => {
        if (item.value != null) {
          return item.value != null && item.value !== "";
        } else {
          return item.from !== null && item.to !== null;
        }
      });
      // console.log("Filters", filters);
      if (filters.length == 0) {
        // return tasks;
      } else {
        tasks = tasks.filter((item) => {
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
      }

      // Filtering for manager
      if (this.filter != null) {
        console.log("Tasks filter did run");
        if (this.filterType.display === "manager") {
          let employees = this.configStore.state.tables["tbl_user"];
          employees = employees
            .filter((emp) => {
              return emp.manager_id === this.filter;
            })
            .map((emp) => {
              return emp.id;
            });

          console.log("Employees", employees);
          tasks = tasks.filter((task) => {
            return employees.includes(task.user_id);
          });
        } else {
          tasks = tasks.filter((task) => {
            return task[this.filterType.filterField] === this.filter;
          });
        }
      }
      // this.totalRows = tasks.length;

      return tasks.reverse();
    },
    config() {
      return configStore.state.indexedDropdowns;
    },

    showSpinner() {
      return store.state.loading;
    },
    taskItemWithShowDetail: function () {
      let taskItem = this.tasks.filter(
        (element) => element._showDetails == true
      );
      console.log("TaskItemWithShowDetail", taskItem);
    },
    exportTasks: function () {
      let exportTasks = configStore.state.tables["tbl_task"];

      if (this.taskStatusPending == false) {
        exportTasks = exportTasks.filter((task) => {
          return (
            task.status === "Pending" &&
            task.task_type_id === this.exportTaskType.id
          );
        });
        this.exportHeader = "Outstanding Tasks : " + this.exportTaskType.name;
        this.json_fields = {
          Client: "client_id",
          "Completion due date": "deadline_date",
        };
      } else {
        exportTasks = exportTasks.filter((task) => {
          return (
            task.status === "Completed" &&
            task.task_type_id === this.exportTaskType
          );
        });
        this.exportHeader = "Completed Tasks : " + this.exportTaskType.name;
        this.json_fields = {
          Client: "client_id",
          "Completed Date": "deadline_date",
        };
      }

      //  Render Foreing keys in tasks array
      const indexedTbl = configStore.state.indexedDropdowns["tbl_client"];

      this.exportFileName = this.exportTaskType.name + ".xls";

      exportTasks = exportTasks.map((task) => {
        const dtString = moment(task.deadline_date).format("DD/MM/YYYY");

        // const dtString = new Date( task.deadline_date);
        task.deadline_date = dtString;
        task.client_id = indexedTbl[task.client_id]["client_name"];
        return task;
      });
      return exportTasks;
    },
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
    rowClass(item, type) {
      if (!item || type !== "row") return;
      const a = moment();
      const b = moment(item.deadline_date);
      const diff = b.diff(a, "days"); //  Deadline date - Today

      switch (true) {
        case diff < 1:
          return "text-danger font-weight-bold";
          break;
        case diff > 0 && diff < 15:
          return "text-amber font-weight-bold";
          break;

        default:
          break;
      }
      // if (!item || type !== "row") return;
      // if (item.deadline  "awesome") return "text-success";
    },
    selectAllRows() {
      this.$refs.selectableTable.selectAllRows();
    },
    clearSelected() {
      this.$refs.selectableTable.clearSelected();
    },
    populateDropdown(tblName) {
      const obj = this.tblLoadingObject.relatedTables[tblName];
      const arr = Object.entries(obj).map(([k, v]) => {
        return v.name;
      });
      console.log("Task Type Drop Down Options", arr);
      return arr;
    },

    addNewTask() {
      const bl = configStore.isEmpty("tbl_user");
      if (bl) {
        this.$bvToast.toast("You need to  create a user first.", {
          title: `Sorry!`,
          variant: "warning",
          solid: true,
        });
        return;
      }
      this.$router.push({
        name: "CreateEntity",
        params: {
          schema: this.schema,
          routerPath: "createtask",
          redirectRoute: "/AllTasks",
        },
      });
    },
    exportTable() {
      let table = JSON.parse(JSON.stringify(this.tasks));
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
    // Date Filtering only here
    filteredItems: function () {
      let filters = this.filters.filter((item) => {
        if (item.value != null) {
          return item.value != null && item.value !== "";
        } else {
          return item.from !== null && item.to !== null;
        }
      });
      if (filters.length == 0) {
        return this.items;
      }
      console.log("Filters", filters);
      let filteredItems = this.items.filter((item) => {
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
        // console.log(pass);
        return pass;
        //  For loop of filter ends
      });
      console.log("Filtered Timesheet", filteredItems);
      return filteredItems;
    },
    // Helper function to stringify the values of an Object
    toString(value) {
      if (value === null || typeof value === "undefined") {
        return "";
      } else if (value instanceof Object) {
        return Object.keys(value)
          .sort()
          .map((key) => toString(value[key]))
          .join(" ");
      } else {
        return String(value);
      }
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
          Recipient: this.config["tbl_client"][row.client_id]["email"],
          "Client Name":
            this.config["tbl_client"][row.client_id]["client_name"],
          Task: this.config["tbl_task_type"][row.task_type_id]["task_type"],
          "Deadline Date": moment(row.deadline_date).format("DD/MM/YYYY") || "",
        };
      });
    },
  },
};
</script>
