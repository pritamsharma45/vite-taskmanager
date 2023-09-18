import schemaMixin from "../mixins/schemaMixin";
import mix from "../mixins/mix";

var schema = {
  table_name: "tbl_activity_type",
  formTitle: "Add Activity Type",
  listTitle: "Activity Types",
  doSecurityCheck: false,
  defaultModelData: {},
  fields: [
    {
      type: "input",
      inputType: "text",
      label: "Activity Type",
      model: "activity_type",
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
    // },
  ],
};
const mixed = mix({}, schema, schemaMixin);
export default mixed;
