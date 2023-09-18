import VueFormGenerator from "vue-form-generator/dist/vfg";
import getSymbolFromCurrency from "currency-symbol-map";
import schemaMixin from "../mixins/schemaMixin";
import mix from "../mixins/mix";
const validators = VueFormGenerator.validators;
var schema = {
  table_name: "tbl_timesheet",
  formTitle: "Create New Timesheet Entry",
  doSecurityCheck: false,
  listTitle: "All Timesheets",
  styleObject: ["card gradient-lightalgalgreen p-2"],
  goBackTo: "/AllTimesheets",
  defaultModelData: {
    invoiced: "N",
  },

  compute: {
    fld: "charge",
    els: ["hours", "minutes", "rate"],
    methodName: "getCharge",
  },

  groups: [
    {
      legend: "General Details",
      fields: [
        {
          type: "input",
          inputType: "date",
          label: "Date",
          placeholder: "",
          model: "date",
          default: function() {
            return new Date().valueOf();
          },
          validator: ["required"],
          pikadayOptions: {
            position: "top left",
          },
          styleClasses: "col-md-3",
        },
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
          styleClasses: "col-md-5",
        },
        {
          type: "select",
          label: "Employee",
          model: "user_id",
          fieldOptions: {
            noneSelectedText: "Select employee",
          },
          selectOptions: {
            noneSelectedText: "Select employee",
            name: "user",
          },
          values: [],
          required: true,
          validator: ["required"],
          styleClasses: "col-md-4",
        },
        {
          type: "select",
          values: [],
          label: "Activity ",
          model: "activity_type_id",
          fieldOptions: {
            noneSelectedText: "Select activity",
          },
          selectOptions: {
            noneSelectedText: "Select activity",
            name: "activity_type",
          },
          required: true,
          validator: validators.required,
          styleClasses: "col-md-6",
        },
        {
          type: "select",
          values: [],
          label: "Task Type",
          model: "task_type_id",
          fieldOptions: {
            noneSelectedText: "Select task",
          },
          selectOptions: {
            noneSelectedText: "Select task",
            name: "task_type",
          },
          required: true,
          validator: validators.required,
          styleClasses: "col-md-6",
        },
        {
          type: "input",
          inputType: "text",
          label: "",
          placeholder: "",
          model: "invoiced",
          validator: ["required"],
          styleClasses: "col-md-3",
          visible: false,
        },

        {
          type: "select",
          label: "Invoiced",
          model: "invoiced",
          required: false,
          values: ["Yes", "No"],
          default: "No",
          visible: false,
        },
      ],
    },
    {
      legend: "Job Details",
      fields: [
        {
          type: "input",
          inputType: "number",
          label: "Hours",

          placeholder: "",
          min: "0",
          model: "hours",
          default: 0,
          validator: ["required", "number"],
          styleClasses: "col-md-2",
        },
        {
          type: "input",
          inputType: "number",
          label: "Minutes",
          min: "0",
          max: "59",
          placeholder: "",
          model: "minutes",
          default: 0,
          validator: ["required", "number"],
          styleClasses: "col-md-2",
        },
        {
          type: "input",
          inputType: "number",
          label: "Rate",
          getModifiedLabel: function(label, obj) {
            const currency = getSymbolFromCurrency(obj["currency"]);
            // console.log("This inside field", this);
            return label + " (" + currency + "/Hr)";
          },
          placeholder: "",
          model: "rate",
          validator: ["required"],
          styleClasses: "col-md-2",
        },
        {
          type: "input",
          inputType: "number",
          label: "Charge",
          getModifiedLabel: function(label, obj) {
            const currency = getSymbolFromCurrency(obj["currency"]);
            // console.log("This inside field", this);
            return label + " (" + currency + ")";
          },
          placeholder: "",
          model: "charge",
          validator: ["required"],
          disabled: true,
          styleClasses: "col-md-2",
        },
        {
          type: "textArea",
          inputType: "textArea",
          rows: 1,
          label: "Comments",
          model: "comments",
          required: false,
          validator: ["string", "required"],
        },
      ],
    },
  ],
};

const mixed = mix({}, schema, schemaMixin);

export default mixed;
