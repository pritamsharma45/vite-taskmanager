import VueFormGenerator from "vue-form-generator/dist/vfg";
import schemaMixin from "../mixins/schemaMixin";
import mix from "../mixins/mix";
const validators = VueFormGenerator.validators;
var schema = {
  table_name: "tbl_preference",
  formTitle: "Edit your preferneces",
  doSecurityCheck: false,
  listTitle: "All Prefernces",
  goBackTo: "/AllTasks",
  defaultModelData: {},
  groups: [
    {
      legend: "General Details",
      fields: [
        {
          type: "input",
          inputType: "text",
          label: "Company Name",
          placeholder: "Your Company Name",
          model: "company_name",
          validator: ["required"],
          styleClasses: "col-md-3",
        },
        {
          type: "input",
          inputType: "text",
          label: "Logo URL",
          placeholder: "",
          info:
            "The logo should be stored in your Google Drive and it must be public. You can get the URL by clicking on Get Link.",
          model: "logo_url",
          validator: ["required"],
          styleClasses: "col-md-4",
        },
        {
          type: "select",
          label: "Locale",
          model: "locale",
          placeholder: "",
          required: true,
          values: function() {
            return ["en-GB", "en-US", "de-DE"];
          },
          default: "en-US",
          validator: ["required"],
          styleClasses: "col-md-2",
        },
        {
          type: "select",
          label: "Currency",
          model: "currency",
          placeholder: "",
          required: true,
          values: function() {
            return ["GBP", "USD", "EUR"];
          },
          default: "GBP",
          validator: ["required"],
          styleClasses: "col-md-3",
        },
      ],
    },
    // Acc details
    {
      legend: "Account Details",
      fields: [
        {
          type: "input",
          inputType: "text",
          label: "Label for Registration No",
          placeholder: "eg. VAT Reg No",
          model: "label_reg_no",
          validator: ["required"],
          styleClasses: "col-md-4",
        },
        {
          type: "input",
          inputType: "text",
          label: "Registration No",
          placeholder: "VAT Reg No",
          model: "reg_no",
          validator: ["required"],
          styleClasses: "col-md-3",
        },

        {
          type: "select",
          label: "Tax Type",
          model: "tax_type",
          required: false,
          values: ["Sales Tax", "VAT"],
          default: "No",
          visible: true,
          styleClasses: "col-md-3",
        },
        {
          type: "input",
          inputType: "number",
          label: "Tax Rate",
          placeholder: "",
          model: "tax_rate",
          validator: ["required"],
          styleClasses: "col-md-2",
        },
      ],
    },
    // Bank details
    {
      legend: "Bank Details",
      fields: [
        {
          type: "input",
          inputType: "text",
          label: "Account Name",
          placeholder: "",
          model: "acc_name",
          validator: ["required"],
          styleClasses: "col-md-4",
        },
        {
          type: "input",
          inputType: "text",
          label: "Account No",
          placeholder: "",
          model: "acc_no",
          validator: ["required"],
          styleClasses: "col-md-4",
        },

        {
          type: "input",
          inputType: "text",
          label: "Bank Details",
          placeholder: "",
          model: "bank_details",
          validator: ["required"],
          styleClasses: "col-md-4",
        },
      ],
    },
    // Terms and condtions
    {
      legend: "Terms & conditions",
      fields: [
        {
          type: "input",
          inputType: "text",
          label: "Line 1",
          placeholder: "Line 1",
          model: "line1",
          validator: ["required"],
          styleClasses: "col-md-12",
        },
        {
          type: "input",
          inputType: "text",
          label: "Line 2",
          placeholder: "Line 2",
          model: "line2",
          validator: ["required"],
          styleClasses: "col-md-12",
        },
        // {
        //   type: "input",
        //   inputType: "text",
        //   label: "Invoice Footer Line 3",
        //   placeholder: "Invoice Footer Line 3",
        //   model: "line3",
        //   validator: ["required"],
        //   styleClasses: "col-md-12",
        // },
      ],
    },
    // Contact us
    {
      legend: "Contact us",
      fields: [
        {
          type: "input",
          inputType: "text",
          label: "Phone",
          placeholder: "Company phone no",
          model: "phone",
          validator: ["required"],
          styleClasses: "col-md-3",
        },
        {
          type: "input",
          inputType: "text",
          label: "Email",
          placeholder: "Company email ID",
          model: "email",
          validator: ["required"],
          styleClasses: "col-md-9",
        },
        {
          type: "input",
          inputType: "textarea",
          label: "Company Address",
          placeholder: "Your Company Address",
          model: "address",
          validator: ["required"],
          styleClasses: "col-md-12",
        },
      ],
    },
    // Terms and condtions
    {
      legend: "Footer End",
      fields: [
        {
          type: "input",
          inputType: "text",
          label: "Line 1",
          placeholder: "Line 1",
          model: "end_line1",
          validator: ["required"],
          styleClasses: "col-md-12",
        },
        {
          type: "input",
          inputType: "text",
          label: "Line 2",
          placeholder: "Line 2",
          model: "end_line2",
          validator: ["required"],
          styleClasses: "col-md-12",
        },
      ],
    },
  ],
};

const mixed = mix({}, schema, schemaMixin);

export default mixed;
