import schemaMixin from "../mixins/schemaMixin";
import mix from "../mixins/mix";

var schema = {
  table_name: "tbl_user",
  formTitle: "",
  listTitle: "Users",
  defaultModelData: {},
  doSecurityCheck: false,
  permission: {
    crud: "ADMIN",
  },
  fields: [
    {
      type: "input",
      inputType: "text",
      label: "User",
      model: "user",
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
    {
      type: "select",
      label: "Manager",
      model: "manager_id",
      fieldOptions: {
        noneSelectedText: "Select manager",
      },
      selectOptions: {
        noneSelectedText: "Reports to",
        name: "manager",
      },
      values: [],
      required: true,
      validator: ["required"],
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
