import schemaMixin from "../mixins/schemaMixin";
import mix from "../mixins/mix";
var schema = {
  table_name: "tbl_task_type",
  doSecurityCheck: false,
  formTitle: "",
  listTitle: "Task Types",
  defaultModelData: {},

  fields: [
    {
      type: "input",
      inputType: "text",
      label: "Task Type",
      model: "task_type",
      required: true,
      validator: ["string", "required"],
    },

    // {
    //   type: "input",
    //   inputType: "text",
    //   label: "Status",
    //   model: "status",
    //   required: true,
    //   validator: ["string"],
    //   styleClasses: "form-group-sm",
    // },
  ],
};

const mixed = mix({}, schema, schemaMixin);

export default mixed;
