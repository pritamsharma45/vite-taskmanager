import schemaMixin from "../mixins/schemaMixin";
import mix from "../mixins/mix";

var schema = {
  title: "Reimbursement USA",
  recordName: "ReimbursementUSA",
  goBackTo: "ReimbursementUSA",
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
    // {
    //   label: "Select Item",
    //   inputType: "instant_select",
    //   name: "category",
    //   options: [
    //     "Car fuel",
    //     "Dinner",
    //     "Break-fast",
    //     "Lunch",
    //     "Broadband bill",
    //     "System repair",
    //     "Maid salary",
    //     "Electricity bill",
    //     "Office stationery",
    //     "Others",
    //   ],
    //   required: true,
    // },

    {
      label: "Quantity",
      inputType: "text",
      name: "qty",
    },

    {
      label: "Total Amount(USD)",
      inputType: "number",
      prefix: "$",
      name: "amount",
      controls: false,
      step: "0.01",
      required: true,
    },
    {
      label: "Payment Mode",
      inputType: "instant_select",
      name: "payment_mode",
      options: ["Card", "Cash", "Net Banking"],
      required: true,
    },

    {
      label: "Remarks",
      inputType: "textArea",
      name: "remarks",
    },
    {
      label: "Approval Status",
      inputType: "instant_select",
      options: ["Approved", "Not Approved", "In-Process"],
      slected: "",
      name: "approval_status",
    },

    {
      label: "Attach File",
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
      {
        label: "Approval status",
        fld: "approval_status",
        type: "instant_select",
        options: ["Approved", "Not Approved", "In-Process"],
        value: "",
      },
      {
        fld: "date",
        label: "Entry Date",
        type: "date_from_to",
        from: null,
        to: null,
      },
    ],
  },
};

const mixed = mix({}, schema, schemaMixin);

export default mixed;
