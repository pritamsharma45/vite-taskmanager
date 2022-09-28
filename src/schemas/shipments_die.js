import schemaMixin from "../mixins/schemaMixin";
import mix from "../mixins/mix";
var schema = {
  title: "Container Shipments",
  recordName: "ShipmentTools",
  fields: [
    // {
    //   label: "Program Name",
    //   inputType: "select_multilevel",
    //   optionSource: "tbl_Programs",
    //   filterOptions: { tblToFilter: "tbl_Jobs", filterOn: "program_name" },
    //   name: "program_name",
    // },
    // {
    //   label: "Project",
    //   inputType: "select",
    //   optionSource: "tbl_Projects",
    //   name: "project",
    // },
    // {
    //   label: "Job No",
    //   inputType: "select_multilevel",
    //   optionSource: "tbl_Jobs",
    //   selectOptions: { value: "job_name", name: "job_name" },
    //   name: "job_#",
    // },
    // {
    //   label: "Item",
    //   inputType: "text",
    //   name: "item",
    // },
    {
      label: "Number of Entries",
      inputType: "number",
      min: 1,
      max: 20,
      name: "total_entries",
      linkedGroup: "job_entries",
    },

    {
      inputType: "group",
      name: "job_entries",
      label: "Entries",
      rowCount: 1,
      linkedRowCountFld: "total_entries",
      validation: "min:2,length",
      repeatable: true,
      "add-label": "+ Add platform",
      value: [{}],
      fields: [
        {
          label: "",
          inputType: "select",
          placeholder: "Select Job",
          optionSource: "tbl_Jobs",
          selectOptions: { value: "job_name", name: "job_name" },
          name: "job",
        },

        {
          inputType: "text",
          name: "item",
          label: "",
          placeholder: "Enter Item",
          validation: "required",
        },
      ],
    },
    {
      label: "Customer",
      inputType: "select_multiple",
      name: "customer",
      isForeignKey: true,
      keyRenderFld: "short_name",
      optionSource: "tbl_Customers",
      optionDisplayField: ["short_name", "country"],
    },
    // {
    //   label: "Customer Contact",
    //   inputType: "text",
    //   name: "customer_contact",
    // },
    {
      label: "Die Shop",
      name: "die_shop",
      inputType: "select_multiple",
      isForeignKey: true,
      keyRenderFld: "short_name",

      optionSource: "tbl_Suppliers",
      optionDisplayField: ["short_name", "country"],
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
      label: "Booking #",
      inputType: "text",
      name: "booking",
    },
    {
      label: "Container #",
      inputType: "text",
      name: "container",
    },

    {
      label: "Pickup Date",
      inputType: "date",
      name: "pickup_date",
    },

    {
      label: "Port of Departure",
      inputType: "text",
      name: "port_of_departure",
    },
    {
      label: "Departure Date",
      inputType: "date",
      name: "departure_date",
    },
    {
      label: "Port of Arrival",
      inputType: "text",
      name: "port_of_arrival",
    },
    {
      label: "Arrival Date(PORT)",
      inputType: "date",
      name: "arrival_date",
    },
    {
      label: "Date of Discharge",
      inputType: "date",
      name: "date_of_discharge",
    },
    {
      label: "Delivery",
      inputType: "date",
      name: "delivery_date",
    },
    // {
    //   label: "Date of Discharge",
    //   inputType: "date_computed",
    //   name: "date_of_discharge",
    //   computeElements: { date: "arrival_date", adder: 6 },
    // },
    // {
    //   label: "Delivery",
    //   inputType: "date_computed",
    //   name: "delivery_date",
    //   computeElements: { date: "arrival_date", adder: 16 },
    // },
    {
      label: "Delivery Location",
      inputType: "text",
      name: "delivery_location",
    },
    {
      label: "Total Lead Time(Days)",
      inputType: "number_computed",
      computeElements: ["substract_date", "delivery_date", "pickup_date"],
      name: "total_lead_time",
      controls: false,
      step: "0.01",
    },
    {
      label: "Tracking Key",
      inputType: "text",
      name: "tracking_number",
    },
    {
      label: "Tracking Web Link",
      inputType: "link",
      name: "tracking_web_link",
    },
    {
      label: "Pickup Location(Local)",
      inputType: "text",
      name: "pickup_location_local",
    },

    {
      label: "Pickup Date(Local)",
      inputType: "date",
      name: "pickup_date_local",
    },
    {
      label: "Delivery Location(Local)",
      inputType: "text",
      name: "delivery_location_local",
    },

    {
      label: "Delivery Date(Local)",
      inputType: "date",
      name: "delivery_date_local",
    },
  ],
  filterSchema: {
    title: "Filter Container Shipments",
    filters: [
      {
        label: "Customer",
        fld: "customer",
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
        label: "Job #",
        fld: "job_no",
        type: "select",
        inputType: "select",
        inputType: "select",
        optionSource: "tbl_Jobs",
        value: "",
      },
      {
        label: "Tracking Number",
        type: "text",
        fld: "tracking_number",
        value: "",
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
        label: "Booking #",
        fld: "booking",
        type: "text",
        value: "",
      },
      {
        label: "Container # ",
        fld: "container",
        type: "text",
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
        label: "Arrival Port",
        fld: "port_of_arrival",
        type: "text",
        value: "",
      },
      {
        label: "Departure Port",
        fld: "port_of_departure",
        type: "text",
        value: "",
      },

      // Dates Filter
      {
        fld: "pickup_date",
        label: "Pickup Date",
        type: "date_from_to",
        from: null,
        to: null,
      },
      {
        fld: "departure_date",
        label: "Departure Date",
        type: "date_from_to",
        from: null,
        to: null,
      },
      {
        fld: "date_of_discharge",
        label: "Discharge Date",
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
