import schemaMixin from "../mixins/schemaMixin";
import mix from "../mixins/mix";

var schema = {
  title: "Suppliers",
  recordName: "Suppliers",
  goBackTo: "DropdownsSupplier",
  fields: [
    {
      label: "Name",
      inputType: "text",
      name: "name",
    },
    {
      label: "Short Name",
      inputType: "text",
      name: "short_name",
    },
    {
      label: "Country",
      inputType: "instant_select",
      name: "country",
      options: ["USA", "India", "China", "Canada", "Mexico"],
      required: true,
    },

    {
      label: "Address",
      inputType: "textArea",
      name: "address",
    },
    {
      label: "Other Details",
      inputType: "textArea",
      name: "details",
    },
  ],
};

const mixed = mix({}, schema, schemaMixin);

export default mixed;
