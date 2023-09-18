<template>
  <div class="container">
    <div class="d-flex justify-content-between align-items-center">
      <div class="d-flex flex-column align-items-start">
        <h6 class="mt-2">{{ schema.formTitle }}</h6>
      </div>
    </div>
    <b-overlay :show="showSpinner" rounded="sm">
      <div :class="cardView ? schema.styleObject : ''">
        <!--  @submit.prevent="onSubmit -->
        <form id="createEntityForm" action="" @submit.prevent="createEntity">
          <div class="form-row">
            <vue-form-generator
              tag="div"
              ref="form"
              :schema="schema"
              :options="formOptions"
              :model="model"
              @model-updated="modelUpdated"
              @validated="onValidated"
            />
          </div>

          <div class="mt-0 pr-1">
            <button
              type="submit"
              class="btn btn-success btn-sm btn-align-left font-weight-bold mx-4 px-2"
              @click="formSubmitted"
              :disabled="!isDisabled"
            >
              {{ isSaving ? "Saving..." : "Submit" }}
            </button>
            <button
              v-if="showBackButton"
              class="btn btn-warning btn-sm btn-align-left text-primary font-weight-bold px-2"
              @click="backButtonClicked"
            >
              Back
            </button>
          </div>
        </form>
      </div>
    </b-overlay>
  </div>
</template>

<script>
import GASBackEnd from "../services/GASBackEnd";
import configStore from "../store/configuration";
import admin from "../mixins/admin.js";
import moment from "moment";

export default {
  mixins: [admin],
  props: {
    routerPath: { type: String, required: false },
    schema: {
      type: Object,
      required: true,
    },
    id: {
      type: Number,
      required: false,
    },
    formData: {
      type: Object,
      required: false,
    },
    initialData: {
      type: Object,
      required: false,
    },
    editId: {
      type: String,
      required: false,
    },
    cardView: { type: Boolean, required: false, default: true },
    showBackButton: { type: Boolean, required: false, default: true },
    redirectRoute: { type: String, required: false },
  },
  name: "CreateEntity",
  data() {
    return {
      bw: new GASBackEnd(),
      model: {},
      formValidated: false,
      dropdownReady: false,
      defaultData: this.schema.defaultModelData,
      showSpinner: false,
      formOptions: {
        validateAfterChanged: true,
        validationErrorClass: "",
        validationSuccessClass: "",
        validateAfterLoad: true,
        // validateAsync: true,
      },
      files: [],
      blobs: [],
      isSaving: false,
      isDisabled: true,
      autohideDelay: 7000,
      uploadToastVariant: "warning",
    };
  },
  mounted() {
    this.model = this.schema.model({
      currency: configStore.state.prefs["currency"],
    });
    if (this.initialData) {
      this.model = { ...this.model, ...this.initialData };
    }

    if (this.schema.addToGoogleCalendar) {
      this.model["addToGoogleCalendar"] =
        configStore.state.prefs["addToGoogleCalendar"];
    }
    if (this.formData) {
      console.log("Form data:", this.formData);
      this.model = this.formData;
      this.schema.formTitle = this.schema.formTitle.replace(
        "Create New",
        "Edit"
      );
    } else {
      this.schema.formTitle = this.schema.formTitle.replace(
        "Edit",
        "Create New"
      );
    }
    console.log("Dropdown ready ", configStore.state.indexedDropdowns); //this.showError();
    this.schema._populateSelectOptions(
      configStore.state.tables,
      configStore.state.indexedDropdowns
    );

    console.log("Form Loaded");
  },
  methods: {
    createEntity() {
      // console.log(this.model);
      var that = this;
      if (!this.formValidated) {
        this.$bvModal
          .msgBoxOk("Kindly fill all the mandatory fields!", {
            title: "",
            size: "sm",
            buttonSize: "sm",
            okVariant: "danger",
            headerClass: "p-2 border-bottom-0",
            footerClass: "p-2 border-top-0",
            centered: true,
          })
          .then((value) => {
            return;
          })
          .catch((err) => {
            // An error occurred
          });
      }
      const createItem = { ...this.model, ...this.defaultData };
      console.log("Create Item after merging with default data", createItem);
      this.isSaving = true;
      this.showSpinner = true;
      this.bw.createEntity(createItem, this.schema.table_name).then(
        function (res) {
          console.log("Added or Updated Item", res);
          this.$bvToast.toast("Success", {
            title: `Form submitted successfully. `,
            variant: "success",
            solid: true,
          });
          configStore.updateOrAddItem(createItem, this.schema.table_name);
          if (this.model["addToGoogleCalendar"]) {
            this.addToCalendar(createItem);
          }
          this.getFiles(res);
        }.bind(this),
        function (err) {
          console.log("Item Creation Failed", res); //this.showError();
        }.bind(this)
      );
    },

    getFiles(newItem) {
      var that = this;
      const fileFields = this.schema.getFileFields();

      let count = 0;
      if (fileFields.length > 0) {
        fileFields.forEach((fld) => {
          let files = document.getElementById(fld).files;
          if (files) {
            console.log("File Model", files);
            if (files.length > 0) {
              count = count + files.length;
            }
          }
        });
      } else {
        console.log("No File Fields.");
        this.$router.push(this.schema.goBackTo);
        this.resetForm();
        return;
      }
      if (count == 0) {
        // this.closeIndefinite();
        console.log("No files in File Fields.");
        //  No files in  file fields. Hence send mail and then return
        // this.sendMail();
        if (this.schema.goBackTo) {
          this.$router.push(this.schema.goBackTo);
        } else {
          this.resetForm();
        }
        return;
      }
      // console.log("File Count:", count);
      console.log("Files found in File Fields.File Length :");
      let uploadedFileCount = 0;
      // this.indefinite();
      this.makeToast("Uploading ...");
      fileFields.forEach((fld) => {
        if (this.model[fld] === "") return;
        let files = document.getElementById(fld).files;
        console.log("Files :", files);
        for (let i = 0; i < files.length; i++) {
          const file = files[i];
          // console.log("File :", file);
          const fr = new FileReader();
          fr.onload = (e) => {
            const data = e.target.result.split(",");
            const obj = {
              fileName: file.name,
              mimeType: data[0].match(/:(\w.+);/)[1],
              data: data[1],
            };
            that.blobs.push(obj);
            const updateId =
              that?.formData?.id || newItem["fields"]["id"].value;

            if (that.blobs.length === files.length) {
              google.script.run
                .withSuccessHandler((res) => {
                  console.log("Uploaded Files", res);
                  configStore.updateStoreTable_(
                    [updateId],
                    this.schema.table_name,
                    res
                  );

                  if (this.schema.goBackTo) {
                    this.$router.push(this.schema.goBackTo);
                  } else {
                    this.resetForm();
                  }
                  // this.files.push({ url: res, name: obj.fileName });
                })
                .saveFile2(that.blobs, {
                  id: updateId,
                  tblName: this.schema.table_name,
                });
            }
          };
          fr.readAsDataURL(file);
        }
      });
    },
    onValidated(res, errors) {
      this.formValidated = res;
      this.isDisabled = res;
      console.log("Model Validated", res);
    },
    formSubmitted() {
      let item = Object.assign({}, this.model);

      this.$emit("formSubmitted", item);
    },
    backButtonClicked() {
      this.$router.push(this.schema.goBackTo);
    },
    resetForm() {
      this.isSaving = false;
      this.isDisabled = true;
      this.showSpinner = false;
      this.model = {};
      if (this.initialData) {
        this.model = { ...this.model, ...this.initialData };
      }
      document.getElementById("createEntityForm").reset();
    },
    modelUpdated(val, schema) {
      // console.log(`${val} in ${schema}`);
      if (this.schema.compute) {
        this.handleCalculte(
          this.schema.compute.methodName,
          this.schema.compute.els
        );
      }
    },
    handleCalculte(functionName, event) {
      this[functionName](event);
    },
    getCharge(els) {
      els = els.map((el) => {
        return this.model[el] === "" ? 0 : this.model[el];
      });
      const minutes = els[0] * 60 + els[1];
      const hours = minutes > 0 ? minutes / 60 : 0;
      const charge = hours * els[2];
      this.model["charge"] = charge.toFixed(2);
      console.log(charge);
    },
    makeToast(msg) {
      this.$bvToast.toast(msg, {
        title: `File upload`,
        variant: this.uploadToastVariant,
        solid: true,
        autoHideDelay: 8000,
      });
    },
    addToCalendar(obj) {
      console.log("Adding to calendar");
      this.$router.push("/AllTasks");
      const config = configStore.state.indexedDropdowns;
      const clientName =
        config["tbl_client"][obj.client_id]["client_name"] || "";
      const task = config["tbl_task_type"][obj.task_type_id]["task_type"] || "";
      const dtString = moment(obj.deadline_date).format("YYYY-MM-DD") || "";
      console.log(`${clientName}| ${task}|${dtString}`);
      google.script.run
        .withSuccessHandler((res) => {
          console.log("Added to google Calendar", res);
          this.$bvToast.toast("Success", {
            title: `Task Added to Google Calendar `,
            variant: "success",
            solid: true,
          });
        })
        .withFailureHandler((error) => {
          console.log(error);
          this.$bvToast.toast("Failed", {
            title: `Failed to add Task to Google Calendar `,
            variant: "warning",
            solid: true,
          });
        })
        .createEventInCalendar(clientName, task, dtString);
    },
  },
};
</script>

<style></style>
