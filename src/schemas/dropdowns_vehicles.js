import schemaMixin from "../mixins/schemaMixin";
import mix from "../mixins/mix";

var schema = {
  title: "Vehicles",
  recordName: "Vehicles",
  goBackTo: "DropdownsVehicles",
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
