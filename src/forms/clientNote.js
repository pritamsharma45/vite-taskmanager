import VueFormGenerator from "vue-form-generator/dist/vfg";
import schemaMixin from "../mixins/schemaMixin";
import mix from "../mixins/mix";
const validators = VueFormGenerator.validators;

var schema = {
  table_name: "tbl_client_notes",
  formTitle: "Update Client Notes",
  listTitle: "Client Notes",
  goBackTo: "/AllClients",
  doSecurityCheck: false,
  styleObject: ["card gradient-PaleBlue p-2"],

  defaultModelData: {},

  groups: [
    {
      legend: "Client Notes",
      fields: [
        {
          type: "select",
          label: "Client",
          model: "client_id",
          fieldOptions: {
            noneSelectedText: "Select client",
          },
          selectOptions: {
            noneSelectedText: "Select client",
            name: "client_name",
            filterOption: { fld: "status", value: "A" },
          },
          values: [],
          required: true,
          validator: validators.required,
          disabled: true,
          styleClasses: "col-md-4",
        },
        {
          type: "input",
          inputType: "date",
          label: "Date",
          placeholder: "",
          model: "note_date",
          default: function () {
            return new Date().valueOf();
          },
          validator: ["required"],
          styleClasses: "col-md-4",
          pikadayOptions: {
            position: "top left",
          },
        },
        {
          type: "textArea",
          inputType: "textArea",
          rows: 4,
          label: "Notes",
          model: "notes",
          required: true,
          validator: ["string", "required"],
          styleClasses: "col-md-12",
        },
        {
          type: "input",
          inputType: "file",
          label: "Client Attachments",
          id: "client_attachments",
          placeholder: "Choose client attachments",
          multiple: true,
          model: "attachments",
          required: false,
          validator: ["string", "required"],
          styleClasses: "col-md-6",
        },
      ],
    },
  ],
};

const mixed = mix({}, schema, schemaMixin);

export default mixed;
