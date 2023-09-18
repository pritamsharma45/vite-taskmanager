import taskSchema from "../forms/task";
import configStore from "../store/configuration";
export default {
  methods: {
    clientDetails(item, index, button) {
      let client_id = item.client_id;
      console.log("client ID:", client_id);
      // console.log("Client Table:", this.tblLoadingObject.relatedTables_normal);
      this.infoModal.client = this.config["tbl_client"][client_id];
      this.infoModal.title = "Client Details";
      this.infoModal.content = JSON.stringify(this.infoModal.client, null, 2);
      this.$root.$emit("bv::show::modal", this.infoModal.id, button);
    },
    viewClientNote(item, index, button) {
      console.log("Related Notes Button Clicked :", item);
      this.selectedClientId = item["client_id"];
      this.$root.$emit("bv::show::modal", "related_noteModal", button);
    },
    viewTaskNote(item, index, button) {
      console.log("Related Task Notes Button Clicked :", item);
      this.selectedTaskId = item.id;
      this.$root.$emit("bv::show::modal", "related_taskNotesModal", button);
    },
    resetInfoModal() {
      this.infoModal.title = "";
      this.infoModal.content = "";
    },
    handleMarkCompletion(item, reCreate) {
      //admin restrictions
      let msg1 = reCreate
        ? "The selected task will be marked complete. The task will also be recreated."
        : "The selected task will be marked complete.";
      if (item.periodicity_id == 6) {
        msg1 = `${msg1} As the task is 'One-Off', it won't be recreated.`;
      }
      msg1 = msg1 + " Do you want to go ahead?";
      this.$bvModal
        .msgBoxConfirm(msg1, {
          title: "Confirmation",
          size: "sm",
          buttonSize: "sm",
          okVariant: "success",
          headerClass: "p-2 border-bottom-0",
          footerClass: "p-2 border-top-0",
          centered: true,
        })
        .then((value) => {
          if (value) {
            this.markComplete(item, reCreate);
          }
        })
        .catch((err) => {
          // An error occurred
        });
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
            configStore.state.tables["tbl_task"].unshift(res);
          } else {
            item.status = "Completed";
          }
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
      //admin restrictions
      var res = configStore.updateItems([item.id], "tbl_task", {
        status: "Pending",
      });
      console.log("Marked Pending", res);
    },
    raiseInvoice(item, index) {
      console.log("Index", item);
      if (item.hasOwnProperty("_showDetails")) {
        delete item._showDetails;
      }
      console.log("Selected Item", item);

      this.$router.push({
        name: "CustomInvoice",
        params: {
          clientId: item.client_id,
          type: "custom",
          docType: "INV",
        },
      });
    },

    handleEdit(item, index) {
      //admin restrictions
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
      //admin restrictions
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
    handleBulkEdit(fabItem) {
      //admin restrictions
      this.fabItem = fabItem;
      this.$refs["modal-bulk-change"].show();
    },
  },
};
