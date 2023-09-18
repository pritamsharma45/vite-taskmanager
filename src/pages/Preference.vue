<template>
  <div>
    <h6 class="mt-2">Edit your preferences</h6>
    <b-overlay :show="showSpinner" rounded="sm">
      <div class="gradient-aqua mb-4" style="width: 75%">
        <div class="float-right">
          <button
            type="submit"
            class="btn btn-warning btn-sm m-2 py-0"
            @click="savePreference"
            :disabled="disabled"
          >
            {{ isSaving ? "Saving..." : "Save Preferences" }}
          </button>
        </div>
        <form id="createEntityForm" action="" @submit.prevent="savePreference">
          <div class="form-row">
            <vue-form-generator
              tag="div"
              ref="form"
              :schema="schema"
              :model="model"
              @model-updated="modelUpdated"
            />
          </div>
        </form>
      </div>
    </b-overlay>
  </div>
</template>

<script>
import schema from "../forms/preference.js";
import configStore from "../store/configuration";
export default {
  data() {
    return {
      schema: schema,
      configStore: configStore,
      disabled: false,
      isSaving: false,
      model: {},
      showSpinner: false,
    };
  },
  mounted() {
    this.model = this.schema.model();
    this.getPreference();
  },
  methods: {
    savePreference() {
      this.isSaving = true;
      this.showSpinner = true;
      this.disabled = true;
      let prefs = JSON.stringify(this.model);
      google.script.run
        .withSuccessHandler((res) => {
          console.log(res);
          this.configStore.state.prefs = this.model;
          this.isSaving = false;
          this.disabled = false;
          this.showSpinner = false;
        })
        .withFailureHandler((error) => {
          console.log(error);
        })
        .setPreference(prefs);
    },
    getPreference() {
      google.script.run
        .withSuccessHandler((res) => {
          if (!res) {
            console.log("Get Prefs", res);
            this.configStore.state.prefs = this.model;
          } else {
            console.log("Get Prefs", res);
            this.model = JSON.parse(res);
            this.configStore.state.prefs = this.model;
          }
        })
        .withFailureHandler((error) => {
          console.log(error);
        })
        .getPreference();
    },
    formSubmitted() {},
    modelUpdated() {},
  },
};
</script>

<style>
</style>