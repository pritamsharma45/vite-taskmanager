import schemaMixin from "../mixins/schemaMixin";
import mix from "../mixins/mix";

var schema = {
  title: "Items",
  recordName: "Items",
  goBackTo: "DropdownsItems",
  fields: [
    {
      label: "Name",
      inputType: "text",
      name: "name",
    },
  ],
};

const mixed = mix({}, schema, schemaMixin);

export default mixed;
