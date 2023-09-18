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
      <!-- <div>
        {{ items }}
      </div> -->
    </b-overlay>
  </div>
</template>

<script>
import store from "../store/configuration";
export default {
  props: ["taskId"],
  name: "TaskNotesModal",
  data() {
    return {
      showSpinner: false,
      store: store,
      items: [],
      // items: [],
      fields: [
        { key: "index", label: "" },
        { key: "note_date", label: "Note Date", sortable: true },
        {
          key: "notes",
          label: "Task Note",
        },
        {
          key: "attachments",
          label: "Task Attachments",
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
    console.log("TaskNotesModal Mounted", this.taskId);
    this.fetchNotes();
    // this.model = schema.model();
    // this.fetchItems();
    // this.items = clientStore.getClientNotes(this.clientId);
  },

  methods: {
    fetchItems() {},
    fetchNotes() {
      this.items = this.store.getTaskNotes(this.taskId);
    },
    deleteHandler(id) {
      const tblName = "tbl_task_notes";

      this.$bvModal
        .msgBoxConfirm(
          "You are about to delete the selected task notes. Are you sure?"
        )
        .then((value) => {
          if (!value) {
            this.showSpinner = false;
            return;
          }
          this.showSpinner = true;
          google.script.run
            .withSuccessHandler((res) => {
              this.$bvToast.toast("Selected Notes Deleted", {
                title: `Deleted`,
                variant: "success",
                solid: true,
              });
              console.log("Deleted Successfully", res);
              this.store.state.tables[tblName].splice(
                store.state.tables[tblName].findIndex((a) => a.id === id),
                1
              );
              this.fetchNotes();
              this.showSpinner = false;
            })
            .withFailureHandler((error) => {
              console.log(error);
            })
            .deleteItem(tblName, id);
        })
        .catch((err) => {
          // An error occurred
        });
    },
  },
};
</script>
