import clientType from "../forms/clientType";
import activityType from "../forms/activityType";
import client from "../forms/client";
import clientInfo from "../forms/clientInfo";
import periodicity from "../forms/periodicity";
import taskType from "../forms/taskType";
import task from "../forms/task";
import timesheet from "../forms/timesheet";
import GASBackEnd from "../services/GASBackEnd";

export function createEntity(param) {
  var entityType = {};
  switch (param) {
    case "activity-type":
      entityType = activityType;
      break;
    case "task-type":
      entityType = taskType;
      break;
    case "periodicity":
      entityType = periodicity;
      break;
    case "client":
      entityType = client;
      break;
    case "clientInfo":
      entityType = clientInfo;
      break;
    case "company-type":
      entityType = clientType;
      break;
    case "task":
      entityType = task;
      break;
    case "timesheet":
      entityType = timesheet;
      break;
    default:
    // code block
  }

  return {
    data() {
      return {
        bw: new GASBackEnd(),
        model: entityType.model(),
        schema: entityType,
        title: entityType.formTitle,
        subTitle: entityType.formSubTitle,

        formOptions: {
          validateAfterLoad: true,
          validateAfterChanged: true,
          validateAsync: true,
        },
        isSaving: false,
      };
    },
    created() {
      console.log("Schema Model", this.schema.model());
      this.bw.getRelatedTablesByModel(this.model).then(
        function(res) {
          console.log("Related Tables :", res);
          var keys = Object.keys(res);
          keys.forEach((key) => {
            console.log("Counter Key", key);
            if (this.schema.fields) {
              console.log("Schema Fields", this.schema.fields);
              var field = this.schema.fields.find(
                (field) => field.model === key
              );
              console.log("");
              field.values = res[key];
            } else {
              var groups = this.schema.groups;
              console.log("Groups", groups);
              groups.forEach((group) => {
                console.log("Group:", group);
                var field = group.fields.find((field) => field.model === key);
                if (field) {
                  console.log("Field", field);
                  field.values = res[key];
                }
              });
            }
          });
        }.bind(this),
        function(err) {
          console.log("Updated", res); //this.showError();
        }.bind(this)
      );
    },
    methods: {
      createEntity() {
        console.log(this.model);
        this.bw.createEntity(this.model, this.schema.table_name).then(
          function(res) {
            console.log("Updated", res);
          }.bind(this),
          function(err) {
            console.log("Updated", res); //this.showError();
          }.bind(this)
        );
      },
      clickMe() {
        console.log("I am Clicked");
      },
    },
  };
}
