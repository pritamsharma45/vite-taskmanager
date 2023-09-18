<template>
  <div>
    <b-overlay :show="showSpinner">
      <b-table striped hover :items="items" :fields="fields">
        <template #cell(note_date)="data">
          <p>{{ data.value | formatAsDate }}</p>
        </template>
        <!-- Render S.No -->
        <template #cell(index)="data">
          {{ data.index + 1 }}
        </template>
        <template #cell(attachments)="data">
          <div v-for="(item, i) in data.value" :key="i">
            <b-link :href="item.url" target="_blank">{{ item.name }}</b-link>
          </div>
        </template>
        <template #cell(action)="data">
          <b-button
            size="sm"
            class="m-1 p-0"
            style="font-size: 0.8em"
            @click="deleteHandler(data.item.id)"
            variant="danger"
          >
            <b-icon icon="trash"></b-icon>
          </b-button>
        </template>
      </b-table>
    </b-overlay>
  </div>
</template>

<script>
import clientStore from "../store/client";
import store from "../store/configuration";
export default {
  props: ["clientId"],
  name: "ClineNoteListModal",
  data() {
    return {
      showSpinner: false,
      clientStore: clientStore,
      // items: [],
      fields: [
        { key: "index", label: "" },
        { key: "note_date", label: "Note Date", sortable: true },
        {
          key: "notes",
          label: "Client Note",
        },
        {
          key: "attachments",
          label: "Client Attachments",
          formatter: (value, key, item) => {
            try {
              return JSON.parse(value);
            } catch (error) {
              return [];
            }
          },
        },

        { key: "action", label: "" },
      ],
    };
  },
  mounted() {
    // this.model = schema.model();
    // this.fetchItems();
    // this.items = clientStore.getClientNotes(this.clientId);
  },
  computed: {
    items() {
      return clientStore.getClientNotes(this.clientId);
    },
  },
  methods: {
    fetchItems() {},
    deleteHandler(id) {
      const tblName = "tbl_client_notes";
      this.showSpinner = true;
      google.script.run
        .withSuccessHandler((res) => {
          this.$bvToast.toast("Selected Notes Deleted", {
            title: `Deleted`,
            variant: "success",
            solid: true,
          });
          console.log("Delete Successfully", res);
          clientStore.state.tables[tblName].splice(
            clientStore.state.tables[tblName].findIndex((a) => a.id === id),
            1
          );
          this.showSpinner = false;
        })
        .withFailureHandler((error) => {
          console.log(error);
        })
        .deleteItem(tblName, id);
    },
  },
};
</script>
