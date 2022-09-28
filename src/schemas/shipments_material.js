import schemaMixin from "../mixins/schemaMixin";
import mix from "../mixins/mix";
var schema = {
  title: "Material Shipment Records",
  recordName: "ShipmentMaterial",
  fields: [
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
      label: "Job No",
      inputType: "select_multilevel",
      optionSource: "tbl_Jobs",
      selectOptions: { value: "job_name", name: "job_name" },
      name: "job_no",
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
      label: "Die Shop",
      name: "die_shop",
      inputType: "select",
      isForeignKey: true,
      keyRenderFld: "short_name",

      optionSource: "tbl_Suppliers",
      optionDisplayField: ["short_name", "country"],
    },
    {
      label: "Customer Contact",
      inputType: "text",
      name: "customer_contact",
    },

    {
      label: "ETCS Quote Value(USD)/PO Value",
      inputType: "number",
      name: "ETCS_quote_value",
      prefix: "$",
      controls: false,
      step: "0.01",
      required: true,
    },
    {
      label: "PO To ETCS",
      inputType: "instant_select",
      name: "po_to_ETCS",
      options: ["Awaiting", "Yes", "No", "Email Approved"],
      required: true,
    },
    {
      label: "PO Value(USD)",
      inputType: "number",
      prefix: "$",
      name: "po_value",
      controls: false,
      step: "0.01",
      required: true,
    },

    {
      label: "Material Request Date",
      inputType: "date",
      name: "pickup_date",
    },
    {
      label: "Material Received@Shipper/GLLE",
      inputType: "date",
      name: "material_received_date",
    },
    {
      label: "Days Taken by Customer",
      inputType: "number_computed",
      computeElements: [
        "substract_date",
        "material_received_date",
        "pickup_date",
      ],
      name: "days_taken",
      controls: false,
      step: "0.01",
    },

    {
      label: "Material Requested",
      inputType: "number",
      prefix: "lbs",
      controls: false,
      step: "0.01",
      name: "material_requested",
    },
    {
      label: "Material Received(lbs)",
      inputType: "number",
      prefix: "lbs",
      controls: false,
      step: "0.01",
      name: "material_received",
    },
    {
      label: "Extra material received(lbs)",
      inputType: "number_computed",
      prefix: "lbs",
      computeElements: ["substract", "material_received", "material_requested"],
      name: "extra_material_received",
      controls: false,
      step: "0.01",
    },
    {
      label: "Packaging company",
      inputType: "select",
      isForeignKey: true,
      keyRenderFld: "short_name",

      optionSource: "tbl_Suppliers",
      optionDisplayField: ["short_name", "country"],
      name: "packaging_company",
    },

    {
      label: "Packaging cost(USD)",
      inputType: "number",
      prefix: "$",
      name: "packaging_cost",
      controls: false,
      step: "0.01",
      required: true,
    },
    {
      label: "Shipper",
      inputType: "select",
      isForeignKey: true,
      keyRenderFld: "short_name",
      name: "shipper",
      optionSource: "tbl_Suppliers",
      optionDisplayField: ["short_name", "country"],
    },
    {
      label: "Shipment Date",
      inputType: "date",
      name: "shipment_date",
    },

    {
      label: "Delivery Date",
      inputType: "date",
      name: "delivery_date",
    },
    {
      label: "Shipping Lead Days",
      inputType: "number_computed",
      computeElements: ["substract_date", "delivery_date", "shipment_date"],
      name: "shipping_lead_days",
      controls: false,
      step: "0.01",
    },

    // {
    //   label: "Responsible Party To Clear Custom",
    //   inputType: "text",
    //   name: "responsible_party_to_clear_custom",
    // },
    {
      label: "Shipper Cost Approved(USD)",
      inputType: "number",
      name: "shipper_cost_approved",
      prefix: "$",
      controls: false,
      step: "0.01",
    },
    {
      label: "Duties + Taxes (Other Expenses)(USD)",
      inputType: "number_computed",
      prefix: "$",
      computeElements: [
        "substract",
        "shipping_invoice",
        "shipper_cost_approved",
      ],
      name: "duties_taxes",
      controls: false,
      step: "0.01",
    },
    {
      label: "Shipping Invoice(USD)",
      inputType: "number",
      prefix: "$",
      name: "shipping_invoice",
      controls: false,
      step: "0.01",
    },
    {
      label: "Total cost To ETCS(USD)",
      inputType: "number",
      inputType: "number_computed",
      prefix: "$",
      computeElements: ["add", "packaging_cost", "shipping_invoice"],
      name: "total_cost_to_ETCS",
      controls: false,
      step: "0.01",
    },
    // {
    //   label: "Excessive cost To ETCS",
    //   inputType: "number",
    //   name: "excess_cost_to_ETCS",
    //   controls: false,
    //   step: "0.01",
    // },
    {
      label: "Excessive cost To ETCS(USD)",
      inputType: "number_computed",
      computeElements: [
        "add-substract",
        "packaging_cost",
        "shipping_invoice",
        "po_value",
      ],
      prefix: "$",
      name: "excess_cost_to_ETCS",
      controls: false,
      step: "0.01",
    },
  ],
  filterSchema: {
    title: "Filter Shipment Records",
    filters: [
      {
        label: "Customer",
        fld: "customer_name",
        type: "select",
        value: "",
        isForeignKey: true,
        keyRenderFld: "short_name",
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
        label: "Project",
        fld: "project",
        type: "text",
        value: "",
      },
      {
        label: "Job #",
        fld: "job_no",
        type: "select",
        inputType: "select",
        inputType: "select",
        optionSource: "tbl_Jobs",
        value: "",
      },
      {
        label: "PO Status",
        fld: "po_to_ETCS",
        type: "instant_select",
        options: ["Awaiting", "Yes", "No", "Email Approved"],
        value: "",
      },

      {
        label: "Die Shop",
        fld: "die_shop",
        type: "select",
        value: "",
        isForeignKey: true,
        keyRenderFld: "name",
        optionSource: "tbl_Suppliers",
        optionDisplayField: ["short_name", "country"],
      },
      {
        label: "Shipper",
        fld: "shipper",
        optionSource: "tbl_Suppliers",
        optionDisplayField: ["short_name", "country"],
        isForeignKey: true,
        keyRenderFld: "short_name",
        type: "select",
        value: "",
      },
      {
        label: "Destination",
        fld: "destination",
        type: "text",
        value: "",
      },
      // Dates Filter
      {
        fld: "shipment_date",
        label: "Delivery Date",
        type: "date_from_to",
        from: null,
        to: null,
      },
      {
        fld: "delivery_date",
        label: "Delivery Date",
        type: "date_from_to",
        from: null,
        to: null,
      },
      // {
      //   fld: "close_date",
      //   label:"Closed Date",
      //   type: "date_from_to",
      //   from: null,
      //   to: null,
      // },
      // {
      //   label: "Responsible Person",
      //   fld: "responsible_person",
      //   type: "select",
      //   value: "",
      //   isForeignKey: true,
      //   keyRenderFld: "name",
      //   optionSource: "tbl_Users",
      //   optionDisplayField: "name",
      // },
    ],
  },
};

const mixed = mix({}, schema, schemaMixin);

export default mixed;