import schemaMixin from "../mixins/schemaMixin";
import mix from "../mixins/mix";

var schema = {
  title: "Users",
  recordName: "Users",
  goBackTo: "DropdownsUser",
  fields: [
    {
      label: "Name",
      inputType: "text",
      name: "name",
    },
    {
      label: "Phone No",
      inputType: "text",
      name: "phone_no",
      required: true,
    },
    {
      label: "Email ID",
      inputType: "email",
      name: "email_id",
    },
    {
      label: "Other Details",
      inputType: "textArea",
      name: "other_details",
    },
  ],
};

const mixed = mix({}, schema, schemaMixin);

export default mixed;
