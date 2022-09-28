import schemaMixin from "../mixins/schemaMixin";
import mix from "../mixins/mix";
var schema = {
  title: "Daily Log",
  recordName: "TimeLog",
  goBackTo: "Timelog",
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
      name: "user",
      isForeignKey: true,
      keyRenderFld: "name",
      optionSource: "tbl_Users",
      optionDisplayField: "name",
    },
    {
      label: "Number of Entries",
      inputType: "number",
      min: 1,
      max: 10,
      name: "total_entries",
      linkedGroup: "job_entries",
    },

    {
      inputType: "group",
      name: "job_entries",
      label: "Job Entries",
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
        // {
        //   inputType: "select",
        //   name: "job",
        //   label: "",
        //   placeholder: "Select Job",
        //   name: "job",
        //   optionSource: "tbl_Jobs",
        //   validation: "required",
        // },
        {
          inputType: "select",
          name: "work",
          label: "",
          placeholder: "Select work done",
          optionSource: "tbl_Works",
          selectOptions: { value: "description", name: "description" },
          validation: "required",
        },
        {
          inputType: "number",
          name: "work_hours",
          label: "",
          placeholder: "Enter Work hours in fraction",
          validation: "required",
          step: "0.01",
          controls: false,
        },
      ],
    },
    {
      label: "Total Work Hours",
      inputType: "number_aggregate",
      computeElements: {
        aggregateOver: "job_entries",
        aggregateBy: "work_hours",
      },
      name: "total_work_hours",
      controls: false,
      step: "0.01",
    },
  ],
  filterSchema: {
    title: "Filter Daily Log",
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
        fld: "date",
        type: "date",
        value: null,
      },
    ],
  },
  approveOptions: {
    showTo: ["sharma.pritam311@gmail.com"],
  },
};

const mixed = mix({}, schema, schemaMixin);

export default mixed;
