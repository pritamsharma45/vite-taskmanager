import schemaMixin from "../mixins/schemaMixin";
import mix from "../mixins/mix";
var schema = {
  table_name: "tbl_client_type",
  formTitle: "",
  listTitle: "All Companies",
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

    // {
    //   type: 'input',
    //   inputType: 'text',
    //   label: 'Status',
    //   model: 'status',
    //   required: true,
    //   validator: ['string']
    // },
  ],
};

const mixed = mix({}, schema, schemaMixin);

export default mixed;
