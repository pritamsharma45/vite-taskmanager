import schemaMixin from "../mixins/schemaMixin";
import mix from "../mixins/mix";

var schema = {
  title: "Projects Overview",
  recordName: "ProjectOverview",
  addRouterName: "ProjectOverViewCreate",
  goBackTo: "ProjectOverview",
  fields: [
    {
      label: "Date",
      inputType: "date",
      name: "date",
      required: true,
    },
    {
      label: "Customer Name",
      inputType: "select",
      name: "customer_name",
      isForeignKey: true,
      keyRenderFld: "name",
      optionSource: "tbl_Customers",
      optionDisplayField: ["short_name", "country"],
    },
    {
      label: "Program Name",
      inputType: "text",
      name: "program_name",
    },
    {
      label: "Project Name",
      inputType: "text",
      name: "project_name",
    },
    {
      label: "Suppliers",
      inputType: "select_multiple",
      isForeignKey: true,
      keyRenderFld: "name",
      name: "supplier_name",
      optionSource: "tbl_Suppliers",
      optionDisplayField: ["short_name", "country"],
    },
    {
      label: "Jobs Awarded",
      inputType: "number",
      min: 1,
      max: 50,
      name: "rowCount",
      linkedGroup: "etcs_tool_entries",
    },

    {
      inputType: "group",
      name: "etcs_tool_entries",
      label: "ETCS Tools :",
      rowCount: 1,
      linkedRowCountFld: "rowCount",
      validation: "min:2,length",
      repeatable: true,
      "add-label": "+ Add platform",
      value: [{}],
      fields: [
        {
          inputType: "text",
          name: "year",
          label: "",
          placeholder: "Year+XX",
          validation: "required",
        },
        {
          inputType: "text",
          name: "customer_+_project_name",
          label: "",
          placeholder: "Customer + Project Name",
          validation: "required",
        },
        {
          inputType: "text",
          name: "part_no",
          label: "",
          placeholder: "Part No",
          validation: "required",
        },
      ],
    },
    {
      label: "Project Checklist",
      inputType: "showSectionButton",
      name: "showProjectCheclist",
      linkedSection: "projectChecklist",
      fields: [
        {
          label: "Folder Structure",
          placeholder: "",
          inputType: "instant_select",
          name: "folder_structure",
          options: ["Yes", "No"],
        },
        {
          label: "PM SHEET",
          placeholder: "",
          inputType: "instant_select",
          name: "pm_sheet",
          options: ["Yes", "No"],
        },
        {
          label: "CUSTOMER PO",
          placeholder: "",
          inputType: "instant_select",
          name: "customer_po",
          options: ["Yes", "No"],
          linkedFieldSet: {
            name: "po_details",
            label: "PO Details",
            showCriteria: "Yes",
          },
          fields: [
            {
              label: "Customer PO Date",
              inputType: "date",
              name: "customer_po_date",
            },
            {
              label: "Notes",
              inputType: "textArea",
              name: "customer_po_notes",
            },
          ],
        },

        {
          label: "SUPPLIER PO",
          placeholder: "",
          inputType: "instant_select",
          name: "supplierer_po",
          options: ["Yes", "No"],
          linkedFieldSet: {
            label: "Supplier PO Details",
            name: "supplier_po_details",
            showCriteria: "Yes",
          },
          fields: [
            {
              label: "Supplier PO Date",
              inputType: "date",
              name: "supplierer_po_date",
            },
            {
              label: "Notes",
              inputType: "textArea",
              name: "supplierer_po_notes",
            },
          ],
        },

        {
          label: "STANDARDS",
          placeholder: "",
          inputType: "instant_select",
          name: "supplier_po",
          options: ["Yes", "No"],
        },
        {
          label: "OIM/TBS",
          placeholder: "",
          inputType: "instant_select",
          name: "oim",
          options: ["Yes", "No", "NA"],
        },
      ],
    },
  ],
};

const mixed = mix({}, schema, schemaMixin);

export default mixed;
