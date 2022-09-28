import schemaMixin from "../mixins/schemaMixin";
import mix from "../mixins/mix";

var schema = {
  title: "Works",
  recordName: "Works",
  goBackTo: "DropdownsWorks",
  fields: [
    {
      label: "Description",
      inputType: "text",
      name: "description",
    },
    {
      label: "Rate(USD/Hr)",
      inputType: "number",
      prefix: "$/Hr",
      name: "rate",
      controls: false,
      step: "0.01",
      required: true,
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
