<template>
  <div>
    <b-button size="sm" block variant="light" @click="addButtonClicked">
      <b-icon
        aria-hidden="true"
        class="text-success"
        :icon="showingPlus ? 'plus' : 'dash'"
        :variant="showingPlus ? 'primary' : 'danger'"
      ></b-icon
      >{{ showingPlus ? "Add  " : "Collapse" }}
    </b-button>
    <create-entity
      v-if="!showingPlus"
      :schema="schema"
      :formData="formData"
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
                @click="deleteHandler(row.item, row.index, $event.target)"
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
</template>

<script>
import CreateEntity from "../pages/CreateEntity.vue";
import admin from "../mixins/admin.js";
import configStore from "../store/configuration";
export default {
  mixins: [admin],
  components: { CreateEntity },
  name: "GenericList",
  props: {
    listObject: {
      type: Object,
      required: true,
    },
    routerPath: {
      type: String,
      required: false,
    },
    criteria: {
      type: Object,
      required: false,
    },
  },
  data() {
    return {
      windowHeight: window.innerHeight * 0.7 + "px",
      title: "",
      items: [],
      fields: "",
      schema: {},
      formData: null,
      showingPlus: true,
      showSpinner: false,
    };
  },
  mounted() {
    console.log("Yay!I am mounted. Tab index");
    this.fields = this.listObject.header;
    this.title = this.listObject.title;
    this.schema = this.listObject.schema;
    this.items = configStore.state.tables[this.listObject.name];
    // this.fetchTables();
  },
  methods: {
    addButtonClicked() {
      if (!this.securityCheckPassed()) return;
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
          configStore.state.tables[this.listObject.name].splice(
            configStore.state.tables[this.listObject.name].findIndex(
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
        "tbl_users",
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
      if (!this.securityCheckPassed()) return;
      console.log("Index", item);
      this.formData = item;
      // document.getElementById("niceBtn").click();
      this.$router.push({
        name: "CreateEntity",
        params: { schema: this.schema, formData: item },
      });
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
  },
};
</script>
