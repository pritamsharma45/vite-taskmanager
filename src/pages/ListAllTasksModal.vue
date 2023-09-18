<template>
  <div>
    <b-row>
      <b-col class="float-left">
        <b-button
          size="sm"
          class="my-2 mx-2 py-0 font-weight-bold"
          variant="warning"
          :to="{
            name: 'CreateEntity',
            params: {
              schema: schema,
              routerPath: 'createtask',
              initialData: { client_id: clientId },
            },
          }"
        >
          <b-icon icon="plus" aria-hidden="true" class="text-success"></b-icon>
          Add New Task
        </b-button>
      </b-col>
      <b-col class="float-right">
        <b-form-checkbox
          class="mt-1 font-weight-bold float-right"
          size="sm"
          v-model="showCompleted"
          name="check-button"
          switch
        >
          Show Completed Tasks
        </b-form-checkbox>
      </b-col>
    </b-row>

    <div>
      <strong>{{ errorMsg }}</strong>
    </div>
    <b-overlay :show="configStore.state.loading" rounded="sm">
      <b-table
        small
        style="font-size: 0.8em"
        sticky-header
        sort-by="deadline_date"
        :sort-desc="false"
        :tbody-tr-class="rowClass"
        ref="selectableTable"
        @row-hovered="onRowClicked"
        :items="tasks"
        :fields="fields"
      >
        <template #cell(deadline_date)="data">
          <p>{{ data.value | formatAsDate }}</p>
        </template>
        <template #cell(reminder_date)="data">
          <p>{{ data.value | formatAsDate }}</p>
        </template>
        <!-- Render S.No -->
        <template #cell(index)="data">
          {{ data.index + 1 }}
        </template>
        <template #cell(client_id)="data">
          {{ config["tbl_client"][data.value]["client_name"] }}
        </template>
        <template #cell(task_type_id)="data">
          {{ config["tbl_task_type"][data.value]["task_type"] }}
        </template>
        <template #cell(periodicity_id)="data">
          {{ config["tbl_periodicity"][data.value]["periodicity"] }}
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
        <template #row-details="row">
          <b-button
            v-if="row.item.status === 'Pending'"
            pill
            variant="success"
            size="sm"
            class="my-2 mr-2 py-0 font-weight-bold"
            style="font-size: 0.9em"
            @click="markComplete(row.item, false)"
          >
            Mark Complete And Finalise Task
          </b-button>
          <b-button
            v-if="row.item.status === 'Pending' && row.item.periodicity_id != 6"
            pill
            variant="success"
            size="sm"
            class="my-2 mr-2 py-0 font-weight-bold"
            style="font-size: 0.9em"
            @click="markComplete(row.item, true)"
          >
            Mark Complete And Recreate Task
          </b-button>
          <b-button
            pill
            variant="warning"
            size="sm"
            class="my-2 mr-2 py-0 font-weight-bold"
            style="font-size: 0.9em"
            @click="markPending(row.item)"
          >
            Mark Pending
          </b-button>
          <!-- Create Timesheet -->
          <b-button
            pill
            size="sm"
            class="my-2 mr-2 py-0 font-weight-bold"
            style="font-size: 0.9em"
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
          <!-- 
          <b-button
            pill
            variant="info"
            size="sm"
            @click="clientInfo(row.item, row.index, $event.target)"
            class="m-1 py-0"
            style="font-size: 0.8em"
          >
            Client Info
          </b-button> -->
          <b-button
            pill
            variant="info"
            size="sm"
            class="m-1 py-0"
            style="font-size: 0.8em"
            @click="handleEdit(row.item, row.index, $event.target)"
          >
            Edit Task
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
            Delete Task
          </b-button>
        </template>
      </b-table>
    </b-overlay>
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
    <!-- Task Delete  modal -->
    <b-modal
      id="modal-delete-task"
      :title="taskDeleteModal.title"
      @hide="resetTaskDeleteModal"
      @ok="handleDelete(selectedItem)"
    >
      {{ taskDeleteModal.content }}
    </b-modal>
  </div>
</template>

<script>
import taskSchema from "../forms/task";
import timesheetSchema from "../forms/timesheet";
import GASBackEnd from "../services/GASBackEnd";
import ConfirmDialogue from "../components/ConfirmDialogue.vue";
import configStore from "../store/configuration";
import moment from "moment";

export default {
  props: ["clientId"],
  name: "AllTasks",
  components: { ConfirmDialogue },
  data() {
    return {
      bw: new GASBackEnd(),
      configStore: configStore,
      model: taskSchema.model,
      errorMsg: "",
      schema: taskSchema,
      tsSchema: timesheetSchema,
      prevSelected: null,
      showCompleted: false,
      selectedItem: {},
      editItem: {},
      fields: [
        { key: "selected", label: "" },
        // {
        //   key: "client_id",
        //   label: "Client",
        //   sortable: true,
        //   sortDirection: "desc",
        // },
        {
          key: "task_type_id",
          label: "Task",
        },
        { key: "periodicity_id", label: "Periodicity" },
        { key: "deadline_date", label: "Deadline Date", sortable: true },
        { key: "reminder_date", label: "Reminder Date" },
        { key: "status", label: "" },
      ],
      tblLoadingObject: {},
      // tasks: [],

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
    };
  },

  mounted() {},
  computed: {
    tasks() {
      let tasks = [];
      tasks = configStore.state.tables["tbl_task"].filter((task) => {
        return task.client_id === this.clientId;
      });
      // Filtering for task status
      if (!this.showCompleted) {
        tasks = tasks.filter((task) => {
          return task.status === "Pending";
        });
      }
      return tasks;
    },
    config() {
      return configStore.state.indexedDropdowns;
    },
    showSpinner() {
      return configStore.state.loading;
    },
  },

  methods: {
    onRowClicked(item, index) {
      this.$set(item, "_showDetails", !item._showDetails);
      if (this.prevSelected != null) {
        this.prevSelected._showDetails = !this.prevSelected._showDetails;
      }
      this.prevSelected = item;
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
          return "text-amber  font-weight-bold";
          break;

        default:
          break;
      }
      // if (!item || type !== "row") return;
      // if (item.deadline  "awesome") return "text-success";
    },
    resetInfoModal() {
      this.infoModal.title = "";
      this.infoModal.content = "";
    },
    markComplete(item, reCreate) {
      this.showSpinner = true;
      this.configStore.state.loading = true;

      let msg = "";
      if (reCreate) {
        msg =
          "Selected item has been marked completed along with task recreation.";
      } else {
        msg = "Selected item has been marked completed.";
      }
      // console.log("Index", index);
      console.log("Selcted Task Item", item);

      google.script.run
        .withSuccessHandler((res) => {
          console.log("Mark Completed", res);
          this.configStore.state.loading = false;
          if (reCreate) {
            item.status = "Completed";
            configStore.state.tables["tbl_task"].push(res);
          } else {
            item.status = "Completed";
          }

          // this.showRefreshButton = true;
          // this.showSpinner = false;
          this.$bvToast.toast(msg, {
            title: `Marked Completed`,
            variant: "success",
            solid: true,
          });
        })
        .withFailureHandler((error) => {
          console.log(error);
          // this.showSpinner = false;
        })
        .MarkComplete(item, reCreate);
    },
    markPending(item) {
      var res = configStore.updateItems([item.id], "tbl_task", {
        status: "Pending",
      });
      console.log("Marked Pending", res);
    },
    handleEdit(item, index) {
      this.$router.push({
        name: "CreateEntity",
        params: {
          schema: taskSchema,
          formData: item,
          redirectRoute: "/AllTasks",
        },
      });
    },
    handleDelete(item) {
      console.log("Task Item to delete", item);
      this.showSpinner = true;
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
          configStore.state.tables["tbl_task"].splice(
            configStore.state.tables["tbl_task"].findIndex(
              (a) => a.id === item.id
            ),
            1
          );
          this.showSpinner = false;
        })
        .withFailureHandler((error) => {
          console.log(error);
        })
        .deleteItem("tbl_task", item.id);

      // this.tasks.splice(this.tasks.findIndex(a => a.id === item.id) , 1);
    },
  },
};
</script>
