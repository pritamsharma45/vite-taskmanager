<template>
  <b-container class="m-4">
    <b-row>
      <b-col cols="2">
        <div size="sm">
          <b-button
            pill
            v-for="(nav, idx) in navs"
            class="my-3 py-3"
            style="width: 180px"
            :variant="nav.active ? 'success' : 'light'"
            :key="idx"
            @click="activateNav(nav)"
          >
            {{ nav.title }}
          </b-button>
        </div>
      </b-col>
      <b-col>
        <b-card style="width: 700px">
          <div>
            <b-button
              size="sm"
              block
              variant="warning"
              class="font-weight-bold"
              :icon="showingPlus ? 'plus' : 'dash'"
              @click="addButtonClicked"
            >
              <b-icon
                aria-hidden="true"
                class="text-success font-weight-bold"
                :icon="showingPlus ? 'plus' : 'dash'"
                :variant="showingPlus ? 'primary' : 'danger'"
              ></b-icon
              >{{ showingPlus ? "Add  " : "Collapse" }}
            </b-button>
            <create-entity
              v-if="!showingPlus"
              :schema="schema"
              :formData="null"
              :showBackButton="false"
              :cardView="true"
              @formSubmitted="formSubmitted"
            ></create-entity>

            <b-container class="mt-2" fluid>
              <b-overlay :show="showSpinner" rounded="sm">
                <b-table
                  small
                  :sticky-header="windowHeight"
                  :items="items"
                  :fields="fields"
                >
                  <!-- Render S.No -->
                  <template #cell(index)="data">
                    {{ data.index + 1 }}
                  </template>
                  <template #cell(actions)="row">
                    <b-button-group>
                      <b-button
                        size="sm"
                        class="m-1 py-0"
                        style="font-size: 0.8em"
                        @click="
                          deleteHandler(row.item, row.index, $event.target)
                        "
                        variant="danger"
                      >
                        <b-icon icon="trash"></b-icon>
                      </b-button>
                      <b-button
                        size="sm"
                        class="m-1 py-0"
                        style="font-size: 0.8em"
                        @click="edit(row.item, row.index, $event.target)"
                        variant="light"
                      >
                        <b-icon variant="primary" icon="pencil"></b-icon>
                      </b-button>
                    </b-button-group>
                  </template>
                </b-table>
              </b-overlay>
            </b-container>
          </div>
          <!-- <pre>{{ activeTab }}</pre> -->
        </b-card>
      </b-col>
    </b-row>

    <!-- Edit Modal -->
    <b-modal id="bv-modal-example" hide-footer>
      <template #modal-title> Edit </template>
      <div>
        <create-entity
          :schema="schema"
          :formData="formData"
          :cardView="true"
          @formSubmitted="modalFormSubmitted"
        ></create-entity>
      </div>
    </b-modal>
  </b-container>
</template>

<script>
import clientType from "../forms/clientType";
import activityType from "../forms/activityType";
import taskType from "../forms/taskType";
import user from "../forms/user";
import manager from "../forms/manager";
import configStore from "../store/configuration";
import CreateEntity from "../pages/CreateEntity.vue";
import admin from "../mixins/admin.js";

export default {
  tableName: "ManageDropDownNav",
  mixins: [admin],
  components: { CreateEntity },
  data() {
    return {
      // **********Copied from generic list
      windowHeight: window.innerHeight * 0.7 + "px",
      title: "",
      items: [],
      fields: "",
      schema: {},
      formData: null,
      showingPlus: true,
      showSpinner: false,
      // *******************************************
      configStore: configStore,
      loaded: false,
      navs: [
        {
          tableName: "tbl_manager",
          active: true,
          title: "Managers",
          items: [],
          header: [{ key: "index", label: "" }, "manager", "email", "actions"],
          schema: manager,
        },
        {
          tableName: "tbl_user",
          active: false,
          title: "Users",
          items: [],
          header: [
            { key: "index", label: "" },
            "user",
            "email",
            {
              key: "manager_id",
              label: "Manager",
              formatter: (value) => {
                return this.config["tbl_manager"][value]["manager"];
              },
            },
            "actions",
          ],
          schema: user,
        },
        {
          tableName: "tbl_task_type",
          path: "/manage/",
          active: false,
          title: "Task Types",
          items: [],
          header: [{ key: "index", label: "" }, "task_type", "actions"],
          schema: taskType,
        },
        {
          tableName: "tbl_client_type",
          active: false,
          title: "Client Types",
          path: "/manage/clientType",
          items: [],
          header: [
            { key: "index", label: "" },
            { key: "client_type", label: "Client Type" },
            "actions",
          ],
          schema: clientType,
        },
        {
          tableName: "tbl_activity_type",
          active: false,
          title: "Activity Types",
          path: "/manage/activityType",
          items: [],
          header: [{ key: "index", label: "" }, "activity_type", "actions"],
          schema: activityType,
        },
      ],
    };
  },
  computed: {
    config() {
      return configStore.state.indexedDropdowns;
    },
    activeTab() {
      const nav = this.navs.find((nav) => nav.active);
      return nav;
    },
  },
  mounted() {
    console.log("Yay!I am mounted. Tab index");
    const nav = this.navs.find((nav) => nav.active);
    this.renderNavContent(nav);
  },
  methods: {
    // Activating and deactivating tab methods
    activateNav(nav) {
      this.showingPlus = true;
      this.navs.forEach((nav) => {
        nav.active = false;
      });
      nav.active = true;
      this.renderNavContent(nav);
    },
    renderNavContent(nav) {
      this.fields = nav.header;
      this.title = nav.title;
      this.schema = nav.schema;
      this.items = configStore.state.tables[nav.tableName];
    },
    // *********Copied from generic list**********
    addButtonClicked() {
      if (!this.securityCheckPassed()) return;
      if (this.schema.table_name === "tbl_user") {
        const bl = configStore.isEmpty("tbl_manager");
        if (bl) {
          this.$bvToast.toast("You need to  create a manager first.", {
            title: `Sorry!`,
            variant: "warning",
            solid: true,
          });
          return;
        }
      }
      this.showingPlus = !this.showingPlus;
    },
    deleteHandler(item, index, button) {
      // Call Delete Item Method of GAS  with table name  and id as props
      this.showSpinner = true;
      this.isDeletable(this.schema.table_name, item);
    },
    delete(item) {
      google.script.run
        .withSuccessHandler((res) => {
          this.$bvToast.toast("Selected Item Deleted Successfully", {
            title: `Deleted`,
            variant: "success",
            solid: true,
          });
          console.log("Delete Successfully", res);
          configStore.state.tables[this.activeTab.tableName].splice(
            configStore.state.tables[this.activeTab.tableName].findIndex(
              (a) => a.id === item.id
            ),
            1
          );
          this.showSpinner = false;
        })
        .withFailureHandler((error) => {
          console.log(error);
        })
        .deleteItem(this.schema.table_name, item.id);
    },
    isDeletable(tableName, item) {
      const bool = configStore.isDeletable(item, tableName, [
        "tbl_task",
        "tbl_client",
        "tbl_user",
        "tbl_timesheet",
      ]);
      console.log("Is Deletable", bool);
      if (!bool) {
        this.$bvToast.toast(
          "Selected item cannot be deleted. Item found in other tables!",
          {
            title: `Deleted`,
            variant: "danger",
            solid: true,
          }
        );
        this.showSpinner = false;
        return;
      } else {
        this.delete(item);
      }
    },
    edit(item, index, button) {
      this.showingPlus = true;
      if (!this.securityCheckPassed()) return;
      console.log("Index", item);
      this.formData = item;
      this.$bvModal.show("bv-modal-example");
      // document.getElementById("niceBtn").click();
      this.$router.push({
        tableName: "CreateEntity",
        params: { schema: this.schema, formData: item },
      });
    },
    modalFormSubmitted(event) {
      this.$bvModal.hide("bv-modal-example");
    },
    formSubmitted(event) {
      var items = this.items;
      let nextId = "";
      var arr = items.map((row) => {
        return row["id"];
      });
      if (arr.length == 0) {
        nextId = 1;
      } else {
        nextId = Math.max(...arr) + 1;
      }
      let item = event;
      item.id = nextId;
    },
    // ************
  },
};
</script>
