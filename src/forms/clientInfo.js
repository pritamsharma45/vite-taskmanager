import VueFormGenerator from "vue-form-generator/dist/vfg";
import schemaMixin from "../mixins/schemaMixin";
import mix from "../mixins/mix";
var schema = {
  table_name: "tbl_client_info",
  formTitle: "Update Client Info",
  listTitle: "Client Details",
  doSecurityCheck: false,
  goBackTo: "/AllClients",
  styleObject: ["card bg-solid-yellow p-2"],
  defaultModelData: {},
  groups: [
    {
      legend: "General Details",
      fields: [
        {
          type: "input",
          inputType: "text",
          label: "HMRC User ID",
          model: "hmrc_user_id",
          required: false,
          validator: ["required"],
          styleClasses: "col-md-4",
        },
        {
          type: "input",
          inputType: "text",
          label: "HMRC User ID",
          model: "hmrc_password",
          required: false,
          validator: ["required"],
          styleClasses: "col-md-4",
        },
        {
          type: "input",
          inputType: "text",
          label: "Companies House No",
          model: "companies_house_no",
          required: false,
          validator: ["required"],
          styleClasses: "col-md-4",
        },
        {
          type: "input",
          inputType: "text",
          label: "Authentication Code",
          model: "authentication_code",
          required: false,
          validator: ["required"],
          styleClasses: "col-md-4",
        },
        {
          type: "input",
          inputType: "text",
          label: "VAT Number ",
          model: "vat_number",
          required: false,
          validator: ["required"],
          styleClasses: "col-md-4",
        },
        {
          type: "input",
          inputType: "text",
          label: "UTR",
          model: "utr",
          required: false,
          validator: ["required"],
          styleClasses: "col-md-4",
        },

        {
          type: "input",
          inputType: "text",
          label: "Payee Reference",
          model: "payee_reference",
          required: false,
          validator: ["required"],
          styleClasses: "col-md-4",
        },

        {
          type: "input",
          inputType: "text",
          label: "Accounts Office Reference",
          model: "accounts_office_reference",
          required: false,
          validator: ["required"],
          styleClasses: "col-md-4",
        },
        {
          type: "input",
          inputType: "text",
          label: "Associated NI Number",
          model: "associated_ni_number",
          required: false,
          validator: ["required"],
          styleClasses: "col-md-4",
        },
        {
          type: "input",
          inputType: "date",
          label: "Associated DOB",
          placeholder: "",
          model: "associated_dob",
          validator: ["required"],
          pikadayOptions: {
            position: "top left",
          },
          styleClasses: "col-md-4",
        },
        {
          type: "textArea",
          inputType: "textArea",
          rows: 3,
          label: "Key Contact",
          model: "key_contact",
          required: false,
          validator: ["required"],
          styleClasses: "col-md-4",
        },
        {
          type: "textArea",
          inputType: "textArea",
          rows: 3,
          label: "Miscellaneous Info",
          model: "miscellaneous_info",
          required: false,
          validator: ["required"],
          styleClasses: "col-md-4",
        },
      ],
    },

    // {
    //   legend: "Profile",
    //   fields: [
    //     {
    //       type: "textArea",
    //       inputType: "textArea",
    //       rows: 2,
    //       label: "Address",
    //       model: "address",
    //       required: true,
    //       validator: ["required"],
    //     },
    //     {
    //       type: "input",
    //       inputType: "text",
    //       label: "City",
    //       model: "city",
    //       required: true,
    //       validator: ["required"],
    //     },
    //     {
    //       type: "input",
    //       inputType: "text",
    //       label: "Post Code",
    //       model: "post_code",
    //       required: true,
    //       validator: ["required"],
    //     },
    //   ],
    // },
  ],
};

const mixed = mix({}, schema, schemaMixin);

export default mixed;
