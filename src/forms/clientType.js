import schemaMixin from "../mixins/schemaMixin";
import mix from "../mixins/mix";
var schema = {
  table_name: "tbl_client_type",
  formTitle: "",
  listTitle: "All Client Types",
  doSecurityCheck: false,
  defaultModelData: {},

  fields: [
    {
      type: "input",
      inputType: "text",
      label: "Client Type",
      model: "client_type",
      required: true,
      validator: ["string", "required"],
    },
  ],
};

const mixed = mix({}, schema, schemaMixin);

export default mixed;
