import VueFormGenerator from "vue-form-generator/dist/vfg";
import schemaMixin from "../mixins/schemaMixin";
import mix from "../mixins/mix";
const validators = VueFormGenerator.validators;

var schema = {
  table_name: "tbl_task_notes",
  formTitle: "Update Task Notes",
  listTitle: "Task Notes",
  goBackTo: "/AllTasks",
  doSecurityCheck: false,
  styleObject: ["card gradient-PaleBlue p-2"],

  defaultModelData: {},

  groups: [
    {
      legend: "Task Notes",
      fields: [
        {
          type: "select",
          label: "Task",
          model: "task_id",
          fieldOptions: {
            noneSelectedText: "Select Task",
          },
          selectOptions: {
            noneSelectedText: "Select Task",
            name: "id",
          },
          values: [],
          required: true,
          validator: validators.required,
          disabled: true,
          hidden: true,
          visible: false,
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
          label: "Task Attachments",
          id: "task_attachments",
          placeholder: "Choose Task attachments",
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
