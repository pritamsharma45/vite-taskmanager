import schemaMixin from "../mixins/schemaMixin";
import mix from "../mixins/mix";

var schema = {
  title: "Customer Payments",
  recordName: "CustomerPayments",
  goBackTo: "CustomerPayments",
  fields: [
    {
      label: "Date",
      inputType: "date",
      name: "date",
      required: true,
    },

    {
      label: "Program Name",
      inputType: "select_multilevel",
      optionSource: "tbl_Programs",
      filterOptions: { tblToFilter: "tbl_Jobs", filterOn: "program_name" },
      name: "program_name",
    },
    {
      label: "Project",
      inputType: "select",
      optionSource: "tbl_Projects",
      name: "project",
    },
    {
      label: "ETCS Job No",
      inputType: "select_multilevel",
      optionSource: "tbl_Jobs",
      selectOptions: { value: "job_name", name: "job_name" },
      name: "ETCS_job_no",
    },
    {
      label: "Description",
      inputType: "textArea",
      name: "description",
    },
    {
      label: "Customer Name",
      inputType: "select",
      name: "customer_name",
      isForeignKey: true,
      keyRenderFld: "short_name",
      optionSource: "tbl_Customers",
      optionDisplayField: ["short_name", "country"],
    },
    {
      label: "PO No",
      inputType: "text",
      name: "po_no",
    },
    {
      label: "Invoice No",
      inputType: "text",
      name: "invoice_no",
    },
    {
      label: "Invoice Date",
      inputType: "date",
      name: "invoice_date",
      required: true,
    },
    {
      label: "Due Date",
      inputType: "date",
      name: "due_date",
      required: true,
    },

    {
      label: "Invoice Amount(USD)",
      inputType: "number",
      prefix: "$",
      name: "invoice_amount",
      controls: false,
      step: "0.01",
    },

    {
      label: "Payment status",
      inputType: "instant_select",
      options: ["Open", "Received", "In-Process"],
      slected: "Open",
      name: "payment_status",
    },
    {
      label: "Amount Credited(USD)",
      inputType: "number",
      prefix: "$",
      name: "amount_credited",
      controls: false,
      step: "0.01",
    },
    {
      label: "Payment Date",
      inputType: "date",
      name: "payment_date",
      // required: true,
    },
    {
      label: "Notes/REMARKS",
      inputType: "textArea",
      name: "notes",
    },
    {
      label: "Attach File(against invoice)",
      inputType: "file",
      name: "invoice_attachments",
    },
    {
      label: "Attach File(againts payments)",
      inputType: "file",
      name: "payment_attachments",
    },
  ],
  filterSchema: {
    title: "Filter Customer Payments",
    filters: [
      {
        label: "Customer Name",
        fld: "customer_name",
        type: "select",
        value: "",
        isForeignKey: true,
        keyRenderFld: "name",
        optionSource: "tbl_Customers",
        optionDisplayField: ["short_name", "country"],
      },
      {
        label: "Program Name",
        fld: "program_name",
        inputType: "select",
        optionSource: "tbl_Programs",
        name: "program_name",
        type: "select",
        value: "",
      },
      {
        label: "Project Name",
        fld: "project_name",
        inputType: "select",
        optionSource: "tbl_Projects",
        name: "project",
        type: "select",
        value: "",
      },
      {
        label: "PO #",
        fld: "po_no",
        type: "text",
        value: "",
      },
      {
        label: "Invoice #",
        fld: "invoice_no",
        type: "text",
        value: "",
      },
      {
        label: "Invoice Amount",
        fld: "invoice_amount",
        type: "text",
        value: "",
      },
      {
        label: "Amount Credited",
        fld: "amount_credited",
        type: "text",
        value: "",
      },
      // Dates Filter
      {
        fld: "invoice_date",
        label: "Invoice Date",
        type: "date_from_to",
        from: null,
        to: null,
      },
      {
        fld: "due_date",
        label: "Due Date",
        type: "date_from_to",
        from: null,
        to: null,
      },
      {
        fld: "payment_date",
        label: "Payment Date",
        type: "payment_date",
        from: null,
        to: null,
      },
    ],
  },
  mailOptions: {
    // to: ["notifications.borl@gmail.com"],
    // cc: ["sharma.pritam3111@gmail.com", "pritamiitian@gmail.com"],
    // editTo: ["notifications.borl@gmail.com"],
    to: ["priya@etcsinc.com"],
    cc: [
      "ravi@etcsinc.com",
      "sushant@etcsinc.com",
      "ronald@etcsinc.com",
      "ramprasad@etcsinc.com",
      "gurneet@etcsinc.com",
    ],
    editTo: [
      "sushant@etcsinc.com",
      "ramprasad@etcsinc.com",
      "gurneet@etcsinc.com",
    ],
    ignoreModelFields: ["invoice_attachments", "payment_attachments"],
    subject: "Customer Payments",
    reqDateField: "date",
    line1:
      "Dear Priya,\n Kindly raise the payment request to the customer for the following :",
    editLine1: "Kindly note the changes done in the below mentioned request :",
    reminderLine1:
      "Hi Priya, Please confirm the status on this open request : ",

    end: "Thanks & Regards",
    requestee: "",
  },
};

const mixed = mix({}, schema, schemaMixin);

export default mixed;
