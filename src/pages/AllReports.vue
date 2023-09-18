<template>
  <div>
    <b-container class="mt-2" fluid>
      <b-row class="mb-1">
        <b-col class="px-0" cols="1" md="1">
          <label class="font-weight-bold" style="font-size: 0.8em" for="input-3"
            >Task Type:</label
          >
        </b-col>
        <b-col class="px-0" cols="4" md="2">
          <b-form-select
            id="input-3"
            size="sm"
            style="background-color: #ffe847"
            v-model="taskType"
            :options="configStore.state.tables['tbl_task_type']"
            value-field="id"
            text-field="task_type"
          >
          </b-form-select>
        </b-col>

        <b-col class="px-1" cols="7" md="4">
          <b-form-radio-group
            v-model="taskStatus"
            style="font-size: 0.8em"
            class="py-1 font-weight-bold"
            :options="taskOptions"
            :aria-describedby="ariaDescribedby"
            name="radio-inline"
          ></b-form-radio-group>
        </b-col>
        <b-col class="px-0" cols="5" md="2">
          <!-- Download Tasks Button -->
          <download-excel
            id="downloadTasks"
            class="btn btn-warning btn-sm font-weight-bold"
            :fetch="fetchItems"
            :fields="exportOptions.jsonFields"
            :header="exportOptions.headerTitle"
            :worksheet="dfsdasdasd"
            :name="exportOptions.fileName"
          >
            Download Displayed Clients
          </download-excel>
        </b-col>
        <b-col class="px-0" cols="7" md="3">
          <b-input-group>
            <template #prepend>
              <b-form-select
                style="background-color: #ffe847"
                size="sm"
                v-model="exportClientType"
              >
                <b-form-select-option
                  v-for="(option, index) in clientOptions"
                  :key="index"
                  :value="{ text: option.text, value: option.value }"
                  >{{ option.text }}</b-form-select-option
                >
              </b-form-select>
            </template>
            <b-input-group-append>
              <download-excel
                class="btn btn-success btn-sm"
                id="downloadClients"
                :fetch="fetchClients"
                :fields="exportOptions.jsonFields"
                :header="'Showing ' + exportClientType.text"
                :worksheet="dfsdasdasd"
                :name="exportClientType.text"
              >
                <b-icon icon="download" b-icon></b-icon>
              </download-excel>
            </b-input-group-append>
          </b-input-group>
        </b-col>
      </b-row>
    </b-container>

    <!-- Preview Table -->

    <b-table
      striped
      hover
      sticky-header="560px"
      small
      :style="[
        configStore.state.tableFont === 'small'
          ? 'font-size: 0.8em'
          : 'font-size: 2.2em',
      ]"
      :items="items"
      :fields="fields"
    ></b-table>
  </div>
</template>
<script>
import moment from "moment";
// import store from "../store/task";
import configStore from "../store/configuration";
export default {
  //   props:["task"],
  //   mixins: [createEntity("task")],
  data() {
    return {
      taskStatus: "Pending",
      taskType: "",
      exportClientType: { text: "Download All Active Clients", value: "A" },
      exportItems: [],
      configStore: configStore,
      taskOptions: [
        { text: "Completed Tasks", value: "Completed" },
        { text: "Pending Tasks", value: "Pending" },
        { text: "All Tasks", value: "All" },
      ],
      clientOptions: [
        { text: "Download All Active Clients", value: "A" },
        { text: "Download All Inactive Clients", value: "D" },
        { text: "Download All Clients", value: "All" },
      ],
      fields: [
        {
          key: "client_name",
          label: "Client Name",
          sortable: true,
        },
        {
          key: "email",
          label: "Email",
        },
        {
          key: "phone",
          label: "Phone",
        },
        {
          key: "client_type_id",
          label: "Client Type",
          formatter: (value) => {
            return configStore.state.indexedDropdowns["tbl_client_type"][value][
              "client_type"
            ];
          },
        },
      ],
    };
  },
  name: "AllReports",
  mounted() {},
  computed: {
    items() {
      return configStore.getClientListBasedOnCriteria(
        this.taskStatus,
        this.taskType
      );
    },
    exportOptions() {
      var headerTitle;
      var taskType;
      if (this.taskType === "") {
        headerTitle = `Showing clients with  ${this.taskStatus} Tasks.`;
      } else {
        taskType =
          configStore.state.indexedDropdowns["tbl_task_type"][this.taskType][
            "task_type"
          ];
        headerTitle = `Showing clients with  ${this.taskStatus} Task : ${taskType}`;
      }
      const fileName = `${this.taskStatus}-Task-${taskType}.xls`;
      return {
        jsonFields: {
          Client: "client_name",
          Email: "email",
          Phone: "phone",
          Type: "client_type_id",
        },
        fileName: fileName,
        headerTitle: headerTitle,
      };
    },
  },
  methods: {
    showFilteredClients() {},
    fetchItems() {
      var items = JSON.parse(JSON.stringify(this.items));
      items = items.map((item) => {
        const clientType =
          this.configStore.state.indexedDropdowns["tbl_client_type"][
            item.client_type_id
          ]["client_type"];
        item.client_type_id = clientType;
        return item;
      });
      return items;
    },
    fetchClients() {
      var items = this.configStore.getClientsByStatus(
        this.exportClientType.value
      );
      items = items.map((item) => {
        const clientType =
          this.configStore.state.indexedDropdowns["tbl_client_type"][
            item.client_type_id
          ]["client_type"];
        item.client_type_id = clientType;
        return item;
      });
      return items;
    },
  },
};
</script>
</script>
