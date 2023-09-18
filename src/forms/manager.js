import schemaMixin from "../mixins/schemaMixin";
import mix from "../mixins/mix";

var schema = {
  table_name: "tbl_manager",
  formTitle: "",
  listTitle: "Managers",
  doSecurityCheck: false,
  permission: {
    crud: "ADMIN",
  },
  defaultModelData: {},
  fields: [
    {
      type: "input",
      inputType: "text",
      label: "Manager",
      model: "manager",
      required: true,
      validator: ["string", "required"],
    },
    {
      type: "input",
      inputType: "text",
      label: "Email ID",
      model: "email",
      required: false,
      validator: ["string", "required"],
    },

    // {
    //   type: "input",
    //   inputType: "text",
    //   label: "Status",
    //   model: "status",
    //   required: true,
    //   validator: ["string"],
    // },
  ],
};

const mixed = mix({}, schema, schemaMixin);

export default mixed;
