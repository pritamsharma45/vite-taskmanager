import schemaMixin from "../mixins/schemaMixin";
import mix from "../mixins/mix";

var schema = {
  title: "Reimbursement India",
  recordName: "ReimbursementIndia",
  goBackTo: "ReimbursementIndia",
  fields: [
    {
      label: "Date",
      inputType: "date",
      name: "date",
      required: true,
    },
    {
      label: "User",
      inputType: "select",
      isForeignKey: true,
      keyRenderFld: "name",
      name: "user",
      optionSource: "tbl_Users",
      optionDisplayField: ["name", "other_details"],
    },
    {
      label: "Item",
      inputType: "select",
      isForeignKey: true,
      keyRenderFld: "name",
      name: "item",
      optionSource: "tbl_Items",
      optionDisplayField: "name",
    },
    {
      label: "quantity",
      inputType: "text",
      name: "qty",
    },
    {
      label: "Curr.",
      inputType: "instant_select",
      name: "currency",
      options: ["$", "₹"],
      name: "curr",
    },
    {
      label: "Total Amount",
      inputType: "text",
      name: "amount",
    },
    // {
    //   label: "Total Amount",
    //   inputType: "amount",
    //   name: "amount",
    // },

    {
      label: "Payment Mode",
      inputType: "instant_select",
      name: "paymentMode",
      options: ["Card", "Cash", "Net Banking"],
      required: true,
    },

    {
      label: "Remarks",
      inputType: "textArea",
      name: "remarks",
    },
    {
      label: "Attach Bill",
      inputType: "file",
      name: "receipts",
    },
  ],
  filterSchema: {
    title: "Filter",
    filters: [
      {
        label: "User",
        fld: "user",
        type: "select",
        value: "",
        isForeignKey: true,
        keyRenderFld: "name",
        optionSource: "tbl_Users",
        optionDisplayField: "name",
      },
      // {
      //   label: "Approval status",
      //   fld: "approval_status",
      //   type: "instant_select",
      //   options: ["Approved", "Not Approved", "In-Process"],
      //   value: "",
      // },
      {
        fld: "date",
        type: "date_from_to",
        from: null,
        to: null,
      },
    ],
  },
};

const mixed = mix({}, schema, schemaMixin);

export default mixed;
