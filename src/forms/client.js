import VueFormGenerator from "vue-form-generator/dist/vfg";
import schemaMixin from "../mixins/schemaMixin";
import mix from "../mixins/mix";

var schema = {
  table_name: "tbl_client",
  formTitle: "Create New Client",
  listTitle: "All Clients",
  doSecurityCheck: false,
  goBackTo: "/AllClients",
  styleObject: ["card bg-solid-yellow p-2"],
  defaultModelData: {
    status: "A",
  },

  fields: [
    {
      type: "input",
      inputType: "text",
      label: "Client Name",
      model: "client_name",
      required: true,
      validator: ["string"],
      styleClasses: "col-md-6",
    },
    {
      type: "input",
      inputType: "email",
      label: "Email",
      model: "email",
      required: true,
      validator: VueFormGenerator.validators.email,
      styleClasses: "col-md-6",
    },
    {
      type: "select",
      label: "Client Type",
      fieldOptions: {
        noneSelectedText: "Select client type",
      },
      selectOptions: {
        noneSelectedText: "Select client type",
        name: "client_type",
      },
      model: "client_type_id",
      values: [],
      required: true,
      validator: ["required"],
      styleClasses: "col-md-6",
      name: "client_type",
    },
    {
      type: "input",
      inputType: "text",
      label: "Phone(Enter full phone number without 0,+, or -)",
      model: "phone",
      required: false,
      validator: ["string", "required"],
      styleClasses: "col-md-6",
    },

    {
      type: "textArea",
      inputType: "textArea",
      rows: 2,
      label: "Address",
      model: "address",
      required: false,
      validator: ["string"],
      styleClasses: "col-md-12",
    },
    {
      type: "textArea",
      inputType: "textArea",
      rows: 2,
      label: "Key Contact",
      model: "key_contact",
      required: false,
      validator: ["required"],
      styleClasses: "col-md-12",
    },
    {
      type: "textArea",
      inputType: "textArea",
      rows: 3,
      label: "Miscellaneous Info",
      model: "miscellaneous_info",
      required: false,
      validator: ["required"],
      styleClasses: "col-md-12",
    },
    {
      type: "input",
      inputType: "text",
      label: "City",
      model: "city",
      required: false,
      validator: ["string"],
      styleClasses: "col-md-6",
    },
    {
      type: "input",
      inputType: "text",
      label: "Post Code",
      model: "postcode",
      required: false,
      validator: ["string"],
      styleClasses: "col-md-6",
    },
    {
      type: "select",
      label: "Status",
      model: "status",
      required: false,
      values: ["A", "D"],
      default: "A",
      visible: false,
      styleClasses: "col-md-6",
    },

    // {
    //   type: "input",
    //   inputType: "text",
    //   label: "Country",
    //   model: "country",
    //   required: true,
    //   validator: ["string"],
    // },
  ],

  // {
  //   legend: "Profile",
  //   fields: [
  //     // {
  //     //   type: "textArea",
  //     //   inputType: "textArea",
  //     //   rows: 4,
  //     //   label: "About",
  //     //   model: "about",
  //     //   required: true,
  //     //   validator: ["string", "required"],
  //     // },
  //     // {
  //     //   type: "checklist",
  //     //   label: "Type",
  //     //   model: "type",
  //     //   values: ["Self-Assessment", "Limited Co"],
  //     //   multiSelect: false,
  //     //   multi: true,
  //     //   required: true,
  //     //   validator: ["array", "required"],
  //     //   selectOptions: {
  //     //     noneSelectedText: "Choose One",
  //     //   },
  //     // },
  //   ],
  // },
};

const mixed = mix({}, schema, schemaMixin);

export default mixed;
