import configStore from "../store/configuration";
export default {
  data() {
    return {
      fabItem: "",
      menu: [
        {
          icon: "delete_forever",
          title: "Delete",
          color: "#ec243b",
          action: "delete",
        },
        {
          icon: "task_alt",
          title: "Mark complete",
          color: "#3e9213",
          action: "complete",
        },
        {
          icon: "email",
          title: "Send Bulk Mails",
          color: "#FF0000",
          action: "sendBulkMails",
        },
        // {
        //   icon: "history_toggle_off",
        //   title: "Mark pending",
        //   color: "#ff9900",
        //   action: "pending",
        // },
      ],
      mainBtnColor: "#073d5e",
    };
  },
  methods: {
    fabClicked() {
      const item = this.fabItem;
      console.log("FAB clicked Item", item);
      const tableName = "tbl_task";
      const ids = this.selectedItems.map((e) => {
        return e.id;
      });
      switch (this.menu[item.idx].action) {
        case "delete":
          configStore.deleteItems(this.selectedItems, tableName);
          break;
        case "complete":
          configStore.updateItems(ids, tableName, { status: "Completed" });
          break;
        case "pending":
          configStore.updateItems(ids, tableName, { status: "Pending" });
          break;
        case "sendBulkMails":
          this.openMailModal(this.selectedItems);
        default:
          break;
      }
    },
  },
};
