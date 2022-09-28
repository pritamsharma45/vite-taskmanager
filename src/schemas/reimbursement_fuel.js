import schemaMixin from "../mixins/schemaMixin";
import mix from "../mixins/mix";

var schema = {
  title: "Reimbursement Fuel",
  recordName: "ReimbursementFuel",
  goBackTo: "ReimbursementFuel",
  fields: [
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
      label: "Date",
      inputType: "date",
      name: "date",
      required: true,
    },
    {
      label: "Select Vehicle",
      inputType: "select",
      isForeignKey: true,
      keyRenderFld: "name",
      name: "vehicle",
      optionSource: "tbl_Vehicles",
      optionDisplayField: "name",
    },
    // {
    //   label: "Select Vehicle",
    //   inputType: "instant_select",
    //   name: "category",
    //   options: ["GM SILVERADO", "FORD", "Escape", "Jeep", "SUV", "Other"],
    //   required: true,
    // },
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
    // {
    //   label: "Job No",
    //   inputType: "select_multilevel",
    //   optionSource: "tbl_Jobs",
    //   selectOptions: { value: "job_name", name: "job_name" },
    //   name: "job_no",
    // },
    {
      label: "Starting Miles",
      inputType: "text",
      name: "starting_miles",
      controls: false,
      step: "0.01",
    },
    {
      label: "Ending Miles",
      inputType: "text",
      name: "ending_miles",
      controls: false,
      step: "0.01",
    },
    // {
    //   label: "Currency",
    //   inputType: "instant_select",
    //   name: "currency",
    //   options: ["Yes", "No"],
    //   required: true,
    // },
    {
      label: "Purpose",
      inputType: "textArea",
      name: "purpose",
    },
    {
      label: "Remarks",
      inputType: "textArea",
      name: "remarks",
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
        type: "date_from_to",
        from: null,
        to: null,
      },
    ],
  },
};

const mixed = mix({}, schema, schemaMixin);

export default mixed;
