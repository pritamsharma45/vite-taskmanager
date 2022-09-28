<template>
  <div>
    <nav class="panel is-success mx-1" style="background-color: #fff9c4">
      <p class="panel-heading">{{ schema.title }}</p>
      <div class="columns">
        <div class="column is-half"></div>
      </div>
      <!-- <div>{{ numberOfRowsInFormGroups }}</div> -->

      <div class="columns is-multiline">
        <div
          :class="
            el.inputType === 'group'
              ? 'mx-1 my-1 column column is-11'
              : 'mx-1 my-0 column is-one-fifth'
          "
          v-for="el in schema.fields"
          v-bind:key="el.id"
        >
          <!-- Form Starts -->
          <div v-if="el.inputType === 'date'">
            <b-field :label="el.label" expanded>
              <b-input
                size="is-small"
                type="date"
                :required="el.required"
                :placeholder="el.placeholder"
                v-model="model[el.name]"
                icon-right="close-circle"
                icon-right-clickable
                @icon-right-click="model[el.name] = ''"
              ></b-input>
            </b-field>
          </div>
          <div v-if="el.inputType === 'date_computed'">
            <b-field :label="el.label" expanded>
              <b-input
                size="is-small"
                type="date"
                :required="el.required"
                :placeholder="el.placeholder"
                disabled
                v-model="computedProps[el.name]"
              ></b-input>
            </b-field>
          </div>

          <div v-if="el.inputType === 'text'">
            <b-field :label="el.label">
              <b-input
                size="is-small"
                v-model="model[el.name]"
                :required="el.required"
                :placeholder="el.placeholder"
              ></b-input>
            </b-field>
          </div>
          <div v-if="el.inputType === 'link'">
            <b-field :label="el.label">
              <b-input
                size="is-small"
                v-model="model[el.name]"
                :required="el.required"
                :placeholder="el.placeholder"
              ></b-input>
            </b-field>
          </div>

          <div v-if="el.inputType === 'number'">
            <b-field :label="el.label">
              <p v-if="el.prefix" class="control">
                <span class="button is-static is-small">{{ el.prefix }}</span>
              </p>
              <b-select
                v-if="el.currencyOptions"
                @input="
                  () => {
                    $set(item, '_showDetails', !item._showDetails);
                  }
                "
                placeholder="Currency"
              >
                <option>$</option>
                <option>$</option>
                <option>¥</option>
              </b-select>
              <p v-if="el.currencyOptions" class="control">
                <span class="button is-static is-small"></span>
              </p>

              <b-numberinput
                size="is-small"
                v-model="model[el.name]"
                :required="el.required"
                :placeholder="el.placeholder"
                :min="el.min"
                :max="el.max"
                :controls="el.controls"
                :step="el.step"
                expanded
                @input="
                  () => {
                    if (el.hasOwnProperty('linkedGroup')) {
                      handleFormRows(el.linkedGroup);
                    }
                  }
                "
              ></b-numberinput>
            </b-field>
          </div>
          <div v-if="el.inputType === 'amount'">
            <b-field>
              <p class="control">
                <span class="button is-static is-small">{{ el.prefix }}</span>
              </p>
              <b-input
                size="is-small"
                v-model="model[el.name]"
                :required="el.required"
                :placeholder="el.placeholder"
                :min="el.min"
                :max="el.max"
                :controls="el.controls"
                :step="el.step"
                expanded
              ></b-input>
            </b-field>
          </div>

          <div v-if="el.inputType === 'number_computed'">
            <b-field :label="el.label">
              <p v-if="el.prefix" class="control">
                <span class="button is-static is-small">{{ el.prefix }}</span>
              </p>
              <b-numberinput
                size="is-small"
                v-model="computedProps[el.name]"
                :required="el.required"
                :placeholder="el.placeholder"
                :min="el.min"
                :max="el.max"
                :controls="el.controls"
                :step="el.step"
                disabled
                expanded
              ></b-numberinput>
            </b-field>
          </div>
          <div v-if="el.inputType === 'number_aggregate'">
            <b-field :label="el.label">
              <p v-if="el.prefix" class="control">
                <span class="button is-static is-small">{{ el.prefix }}</span>
              </p>
              <b-numberinput
                size="is-small"
                v-model="computedProps[el.name]"
                :required="el.required"
                :placeholder="el.placeholder"
                :min="el.min"
                :max="el.max"
                :controls="el.controls"
                :step="el.step"
                disabled
                expanded
              ></b-numberinput>
            </b-field>
          </div>

          <div v-if="el.inputType === 'email'">
            <b-field :label="el.label" type="is-danger">
              <b-input
                size="is-small"
                v-model="model[el.name]"
                type="email"
                maxlength="30"
              >
              </b-input>
            </b-field>
          </div>
          <div v-if="el.inputType === 'password'">
            <b-field :label="el.label">
              <b-input
                size="is-small"
                type="password"
                v-model="model[el.name]"
                :required="el.required"
                :placeholder="el.placeholder"
                password-reveal
              >
              </b-input>
            </b-field>
          </div>
          <div v-if="el.inputType === 'textArea'">
            <b-field :label="el.label">
              <b-input size="is-small" type="textArea" v-model="model[el.name]">
              </b-input>
            </b-field>
          </div>
          <div v-if="el.inputType === 'select'">
            <b-field :label="el.label">
              <b-select
                size="is-small"
                :required="el.required"
                :placeholder="el.placeholder"
                v-model="model[el.name]"
                expanded
              >
                <option value="">Select Option</option>
                <option
                  v-for="(option, index) in dropdowns[el.optionSource]"
                  :value="typeof option === 'object' ? option['id'] : option"
                  :key="index"
                >
                  {{
                    el.optionDisplayField
                      ? Array.isArray(el.optionDisplayField)
                        ? el.optionDisplayField
                            .map((o) => {
                              return option[o];
                            })
                            .join(" | ")
                        : option[el.optionDisplayField]
                      : option
                  }}
                </option>
              </b-select>
            </b-field>
          </div>
          <div v-if="el.inputType === 'select_multiple'">
            <b-field :label="el.label">
              <b-select
                size="is-small"
                multiple
                native-size="8"
                :required="el.required"
                :placeholder="el.placeholder"
                v-model="model[el.name]"
                expanded
              >
                <option
                  v-for="(option, index) in dropdowns[el.optionSource]"
                  :value="typeof option === 'object' ? option['id'] : option"
                  :key="index"
                >
                  {{
                    el.optionDisplayField
                      ? Array.isArray(el.optionDisplayField)
                        ? el.optionDisplayField
                            .map((o) => {
                              return option[o];
                            })
                            .join(" | ")
                        : option[el.optionDisplayField]
                      : option
                  }}
                </option>
              </b-select>
            </b-field>
          </div>
          <div v-if="el.inputType === 'select_multilevel'">
            <b-field :label="el.label">
              <b-select
                size="is-small"
                :required="el.required"
                :placeholder="el.placeholder"
                v-model="model[el.name]"
                @input="
                  () => {
                    if (el.filterOptions) {
                      filterDD({
                        filterTable: el.filterOptions.tblToFilter,
                        filterBy: el.filterOptions.filterOn,
                        filterValue: model[el.name],
                      });
                    }
                  }
                "
                expanded
              >
                <option
                  v-for="(option, index) in dropdowns[el.optionSource]"
                  :value="
                    el.selectOptions ? option[el.selectOptions.value] : option
                  "
                  :key="index"
                >
                  {{
                    el.selectOptions ? option[el.selectOptions.name] : option
                  }}
                </option>
              </b-select>
            </b-field>
          </div>
          <!-- @input="selectChange(val, el.name)" -->
          <div v-if="el.inputType === 'instant_select'">
            <b-field :label="el.label">
              <b-select
                size="is-small"
                v-model="model[el.name]"
                :required="el.required"
                :placeholder="el.placeholder"
                expanded
              >
                <option
                  v-for="option in el.options"
                  :value="option"
                  :key="option.id"
                >
                  {{ option }}
                </option>
              </b-select>
            </b-field>
          </div>
          <div v-if="el.inputType === 'file'">
            <b-field>
              <b-upload
                size="is-small"
                v-model="model[el.name]"
                multiple
                drag-drop
              >
                <section class="section">
                  <div class="content has-text-centered">
                    <p>
                      <b-icon icon="upload" size="is-large"> </b-icon>
                    </p>
                    <p>{{ el.label }}</p>
                  </div>
                </section>
              </b-upload>
            </b-field>
            <div class="tags">
              <span
                v-for="(file, index) in model[el.name]"
                :key="index"
                class="tag is-primary"
              >
                {{ file.name }}
                <button
                  class="delete is-small"
                  type="button"
                  @click="model[el.name].splice(index, 1)"
                ></button>
              </span>
            </div>
            <div class="tags">
              <span
                v-for="(file, index) in files[el.name]"
                :key="index"
                class="tag is-primary"
              >
                {{ file }}
                <button
                  class="delete is-small"
                  type="button"
                  @click="files[el.name].splice(index, 1)"
                ></button>
              </span>
            </div>
          </div>
          <!-- Dependent Section  -->
          <div v-if="el.inputType === 'showSectionButton'">
            <b-button
              class="mt-4 mb-4"
              type="is-primary is-light"
              @click="toggleSections[el.name] = !toggleSections[el.name]"
              expanded
              >{{ el.label }}
            </b-button>

            <section v-if="!toggleSections[el.name]">
              <!-- <h1>Showing Linked Section</h1> -->
              <div></div>
              <div
                :class="'mx-4 my-4'"
                v-for="fld in el.fields"
                v-bind:key="fld.id"
              >
                <div v-if="fld.inputType === 'text'">
                  <b-field :label="fld.label">
                    <b-input
                      size="is-small"
                      v-model="model[el.name][fld.name]"
                      :required="fld.required"
                      :placeholder="fld.placeholder"
                    >
                    </b-input>
                  </b-field>
                </div>

                <div v-if="fld.inputType === 'number'">
                  <b-field :label="fld.label">
                    <b-numberinput
                      size="is-small"
                      v-model="model[el.name][fld.name]"
                      :required="fld.required"
                      :placeholder="fld.placeholder"
                      :min="fld.min"
                      :max="fld.max"
                    ></b-numberinput>
                  </b-field>
                </div>
                <div v-if="fld.inputType === 'instant_select'">
                  <b-field horizontal :label="fld.label">
                    <b-select
                      size="is-small"
                      v-model="model[el.name][fld.name]"
                      :required="fld.required"
                      :placeholder="fld.placeholder"
                      expanded
                    >
                      <option
                        v-for="option in fld.options"
                        :value="option"
                        :key="option.id"
                      >
                        {{ option }}
                      </option>
                    </b-select>
                  </b-field>
                </div>

                <div v-if="fld.linkedFieldSet != null">
                  <!-- Linked Field sets -->

                  <fieldset
                    class="box mt-4 mb-4"
                    v-if="
                      model[el.name][fld.name] ==
                      fld.linkedFieldSet.showCriteria
                    "
                  >
                    <legend class="label">
                      {{ fld.linkedFieldSet.label }}
                    </legend>
                    <div v-for="child in fld.fields" v-bind:key="child.id">
                      <div v-if="child.inputType === 'text'">
                        <b-field :label="child.label">
                          <b-input
                            size="is-small"
                            v-model="
                              model[el.name][fld.linkedFieldSet.name][
                                child.name
                              ]
                            "
                            :required="child.required"
                            :placeholder="child.placeholder"
                          >
                          </b-input>
                        </b-field>
                      </div>
                      <div v-if="child.inputType === 'textArea'">
                        <b-field :label="child.label">
                          <b-input
                            size="is-small"
                            type="textArea"
                            v-model="
                              model[el.name][fld.linkedFieldSet.name][
                                child.name
                              ]
                            "
                          >
                          </b-input>
                        </b-field>
                      </div>
                      <div v-if="child.inputType === 'date'">
                        <b-field :label="child.label" expanded>
                          <b-input
                            size="is-small"
                            type="date"
                            :required="child.required"
                            :placeholder="child.placeholder"
                            v-model="
                              model[el.name][fld.linkedFieldSet.name][
                                child.name
                              ]
                            "
                          ></b-input>
                          <!-- <b-datepicker
                              v-model="
                                model[el.name][fld.linkedFieldSet.name][
                                  child.name
                                ]
                              "
                              :show-week-number="showWeekNumber"
                              locale="en-US"
                              :required="child.required"
                              :placeholder="child.placeholder"
                              icon="calendar-today"
                              :icon-right="selected ? 'close-circle' : ''"
                              icon-right-clickable
                              @icon-right-click="clearDate"
                              trap-focus
                            >
                            </b-datepicker> -->
                        </b-field>
                      </div>
                    </div>
                  </fieldset>
                </div>
              </div>
            </section>
          </div>
          <!--  Form Groups Start -->
          <div
            class="box my-1"
            style="background-color: #b9f6ca"
            v-if="el.inputType === 'group'"
          >
            <label class="label mb-2 mt-1" v-if="el.inputType === 'group'">{{
              el.label
            }}</label>
            <div v-if="el.inputType === 'group'">
              <b-field
                class="my-4"
                v-for="i in model[el.name].length"
                v-bind:key="i"
                grouped
                group-multiline
              >
                <div class="field" v-for="fld in el.fields" v-bind:key="fld.id">
                  <b-field
                    v-if="fld.inputType === 'text'"
                    :label="fld.label"
                    expanded
                  >
                    <b-input
                      size="is-small"
                      v-model="model[el.name][i - 1][fld.name]"
                      :placeholder="fld.placeholder"
                      :required="fld.required"
                    ></b-input>
                  </b-field>

                  <b-field v-if="fld.inputType === 'number'" :label="fld.label">
                    <p v-if="fld.prefix" class="control is-small">
                      <span class="button is-static is-small">{{
                        fld.prefix
                      }}</span>
                    </p>
                    <b-numberinput
                      v-model="model[el.name][i - 1][fld.name]"
                      size="is-small"
                      :required="fld.required"
                      :placeholder="fld.placeholder"
                      :min="fld.min"
                      :max="fld.max"
                      :step="fld.step"
                      :controls="fld.controls"
                      controls-position="compact"
                    ></b-numberinput>
                  </b-field>

                  <b-field v-if="fld.inputType === 'time'" :label="fld.label">
                    <b-timepicker
                      v-model="model[el.name][i - 1][fld.name]"
                      :required="fld.required"
                      :placeholder="fld.placeholder"
                    ></b-timepicker>
                  </b-field>

                  <b-field
                    v-if="fld.inputType === 'email'"
                    :label="fld.label"
                    type="is-danger"
                    message="This email is invalid"
                    expanded
                  >
                    <b-input
                      type="email"
                      size="is-small"
                      :placeholder="fld.placeholder"
                      :required="fld.required"
                      v-model="model[el.name][i - 1][fld.name]"
                      maxlength="30"
                    >
                    </b-input>
                  </b-field>

                  <b-field
                    v-if="fld.inputType === 'password'"
                    :label="fld.label"
                    expanded
                  >
                    <b-input
                      size="is-small"
                      type="password"
                      value="iwantmytreasure"
                      v-model="model[el.name][i - 1][fld.name]"
                      :placeholder="fld.placeholder"
                      :required="fld.required"
                      password-reveal
                    >
                    </b-input>
                  </b-field>

                  <b-field
                    v-if="fld.inputType === 'textArea'"
                    :label="fld.label"
                    expanded
                  >
                    <b-input
                      type="textArea"
                      size="is-small"
                      :placeholder="fld.placeholder"
                      :required="fld.required"
                      v-model="model[el.name][i - 1][fld.name]"
                    >
                    </b-input>
                  </b-field>
                  <div v-if="fld.inputType === 'instant_select'">
                    <b-field :label="fld.label">
                      <b-select
                        v-model="model[el.name][i - 1][fld.name]"
                        size="is-small"
                        :required="fld.required"
                        :placeholder="fld.placeholder"
                        expanded
                      >
                        <option
                          v-for="option in fld.options"
                          :value="option"
                          :key="option.id"
                        >
                          {{ option }}
                        </option>
                      </b-select>
                    </b-field>
                  </div>
                  <div v-if="fld.inputType === 'select_multilevel'">
                    <b-field :label="fld.label">
                      <b-select
                        :required="fld.required"
                        size="is-small"
                        :placeholder="fld.placeholder"
                        v-model="model[el.name][i - 1][fld.name]"
                        @input="
                          () => {
                            if (fld.filterOptions) {
                              filterDD({
                                filterTable: fld.filterOptions.tblToFilter,
                                filterBy: fld.filterOptions.filterOn,
                                filterValue: model[el.name][i - 1][fld.name],
                              });
                            }
                          }
                        "
                        expanded
                      >
                        <option
                          v-for="(option, index) in dropdowns[fld.optionSource]"
                          :value="
                            fld.selectOptions
                              ? option[fld.selectOptions.value]
                              : option
                          "
                          :key="index"
                        >
                          {{
                            fld.selectOptions
                              ? option[fld.selectOptions.name]
                              : option
                          }}
                        </option>
                      </b-select>
                    </b-field>
                  </div>
                  <div v-if="fld.inputType === 'select'">
                    <b-field :label="fld.label" expanded>
                      <b-select
                        size="is-small"
                        :placeholder="fld.placeholder"
                        :required="fld.required"
                        v-model="model[el.name][i - 1][fld.name]"
                        expanded
                      >
                        <!-- <option
                            v-for="(option, index) in dropdowns[
                              fld.optionSource
                            ]"
                            :value="
                              typeof option === 'object' ? option['id'] : option
                            "
                            :key="index"
                          >
                            {{
                              fld.optionDisplayField
                                ? Array.isArray(fld.optionDisplayField)
                                  ? fld.optionDisplayField
                                      .map((o) => {
                                        return option[o];
                                      })
                                      .join(" | ")
                                  : fld.optionDisplayField
                                : option
                            }}
                          </option> -->

                        <option
                          v-for="(option, index) in dropdowns[fld.optionSource]"
                          :value="
                            fld.selectOptions
                              ? option[fld.selectOptions.value]
                              : option
                          "
                          :key="index"
                        >
                          {{
                            fld.selectOptions
                              ? option[fld.selectOptions.name]
                              : option
                          }}
                        </option>
                      </b-select>
                    </b-field>
                  </div>

                  <!-- <b-field
                      v-if="fld.inputType === 'select'"
                      :label="fld.label"
                      expanded
                      :loading="dropdownLoading"
                    >
                      <b-select
                        :placeholder="fld.placeholder"
                        :required="fld.required"
                        v-model="model[el.name][i - 1][fld.name]"
                      >
                        <option
                          v-for="option in dropdowns[fld.optionSource]"
                          :value="option.id"
                          :key="option.id"
                        >
                          {{ option }}
                        </option>
                      </b-select>
                    </b-field> -->
                </div>
                <b-button
                  size="is-small"
                  label=""
                  type="is-danger is-light"
                  icon-left="close"
                  @click="removeRow(el.linkedRowCountFld, el.name, i - 1)"
                />
              </b-field>
            </div>
          </div>
        </div>
      </div>
      <!--  Submit Button -->
      <div class="panel-block">
        <button
          class="button is-success is-fullwidth mb-8"
          @click="submitHandler"
          :disabled="isSubmitting"
        >
          Submit
        </button>
      </div>
    </nav>
  </div>
</template>

<script>
import store from "../store/store.js";
import moment from "moment";
export default {
  name: "SmartForm",
  props: {
    schema: {
      type: Object,
      required: true,
    },
    row: {
      type: Object,
      required: false,
    },
  },
  data() {
    return {
      dropFiles: [],
      modelId: "",
      files: {},
      model: {},
      resetModel: {},
      isSubmitting: false,
      updateOrCreateObj: {},
      dropdowns: {},
      optionSources: [],
      toggleSections: {},
      dropdownLoading: true,
      store,
      calculatedProps: {},
      indefinteToast: null,
      fKeyFields: {},
    };
  },
  computed: {
    numberOfRowsInFormGroups: function () {
      let modelRowCount = Number(this.model.rowCount);
      console.log("Row Count", this.model.rowCount);
      this.schema.fields.forEach((fld) => {
        if (fld.inputType === "group") {
          if (modelRowCount > fld.rowCount) {
            console.log("Group", this.model[fld.name]);
            const diff = modelRowCount - fld.rowCount;
            const obj = this.model[fld.name][0];
            console.log("Row in group", obj);
            for (let i = 0; i < diff; i++) {
              let clonedObj = { ...obj };
              console.log("Cloned Obj", clonedObj);
              this.model[fld.name].push(clonedObj);
            }
            fld.rowCount = Number(this.model.rowCount);
          }
        }
      });
      return this.model.rowCount;
    },
    computedProps: function () {
      const computeFields = this.schema.fields.filter((fld) => {
        return fld.inputType === "number_computed";
      });
      const aggregateFields = this.schema.fields.filter((fld) => {
        return fld.inputType === "number_aggregate";
      });
      const computeDateFields = this.schema.fields.filter((fld) => {
        return fld.inputType === "date_computed";
      });
      // console.log(computeFields);
      let o = {};
      if (computeFields.length > 0) {
        computeFields.forEach((fld) => {
          o[fld.name] = this.calculate(fld.computeElements);
        });
      }
      if (aggregateFields.length > 0) {
        aggregateFields.forEach((fld) => {
          o[fld.name] = this.aggregate(fld.computeElements);
        });
      }
      if (computeDateFields.length > 0) {
        computeDateFields.forEach((fld) => {
          o[fld.name] = this.addToDate(fld.computeElements);
        });
      }
      return o;
    },
  },
  created() {
    this.schema.getFileFields();
    this.schema.model();
    console.log("Schema Files ::", this.schema.files);
    if (this.row) {
      console.log("Edit model provided");
      console.log("edit", this.row);
      this.updateOrCreateObj.id = this.row.id;
      this.modelId = this.row.id;
      this.model = this.row.model;
      this.files =
        typeof this.row.files === "object" ? this.row.files : this.schema.files;
      this.resetModel = JSON.parse(JSON.stringify(this.model));
      console.log("Files ::", this.files);
      // this.model = this.editmodel;
    } else {
      console.log("Edit model NOT provided");
      this.model = this.schema.model();

      this.files = this.schema.files;
      // this.model = this.schema.model();
    }

    this.toggleSections = this.schema.toggleSections();
    console.log(this.model);
    this.calculatedProps = "Prop 3";
  },
  mounted() {
    this.optionSources = this.schema.selectFields();
    this.populateDropdown();
    this.fKeyFields = this.schema.fKeyFields();
    const fileFields = this.schema.getFileFields();
    if (fileFields.length > 0) {
      fileFields.forEach((fld) => {
        if (this.model[fld]) {
          this.model[fld] = "";
        }
      });
    }
  },
  methods: {
    deleteHandler(item) {
      console.log("DeletedItem", item.age);
    },
    edit(item) {
      console.log("Edited", item.age);
    },
    submitHandler() {
      console.log("Populated Model", this.model);
      this.isSubmitting = true;

      const updateOrCreateObj = {
        ...this.updateOrCreateObj,

        model: JSON.stringify({ ...this.model, ...this.computedProps }),
        files: JSON.stringify(this.files),
      };
      console.log("Form Object", updateOrCreateObj);
      // this.updateOrCreateObj = updateOrCreateObj;

      google.script.run
        .withSuccessHandler((res) => {
          console.log(
            "Record created successfully.Now will update stores and run getFiles()"
          );

          if (!this.row) {
            this.modelId = res.id;
          }
          this.updateStore(res);
          this.showSuccesToast();

          this.clearForm();
          this.getFiles();
        })
        .withFailureHandler((error) => {
          console.log(error);
        })
        .addEntry(updateOrCreateObj, this.schema.recordName);
    },
    addFormRow() {
      const initialRowCount = 2;

      const diff = 3;
      const obj = this.model["etcs_tool_entries"][0];
      console.log("First Row in Group", obj);
      for (let i = 0; i < diff; i++) {
        let clonedObj = { ...obj };
        this.model[etcs_tool_entries].push(clonedObj);
      }
    },
    removeRow(rowCountFldName, fldName, i) {
      console.log("Form Row Removed");
      if (i > 0) {
        this.model[fldName].splice(i, 1);
        this.model[rowCountFldName] = this.model[fldName].length;
      }
    },
    populateDropdown() {
      let dd = {};
      dd["tbl_Customers"] = store.state.tables["tbl_Customers"];
      dd["tbl_Suppliers"] = store.state.tables["tbl_Suppliers"];
      dd["tbl_Works"] = store.state.tables["tbl_Works"];
      dd["tbl_Users"] = store.state.tables["tbl_Users"];
      dd["tbl_Items"] = store.state.tables["tbl_Items"];
      dd["tbl_Vehicles"] = store.state.tables["tbl_Vehicles"];
      dd["tbl_Jobs"] = store.state.jobs;
      dd["tbl_Programs"] = store.state.programs;
      dd["tbl_Projects"] = store.state.projects;

      console.log("Drop down fetched", dd);
      this.dropdowns = JSON.parse(JSON.stringify(dd));
      this.dropdownLoading = false;
      // this.dropdowns["tbl_Jobs"] = store.state.jobs;
      // this.dropdowns["tbl_Works"] = store.state.jobs;
      // this.dropdowns["tbl_Customers"] = store.state.tables["tbl_Customers"];
      // this.dropdowns["tbl_Suppliers"] = store.state.tables["tbl_Suppliers"];
      // this.dropdowns["tbl_Users"] = store.state.tables["tbl_Users"];
      // google.script.run
      //   .withSuccessHandler((res) => {
      //     console.log("Drop down fetched", res);
      //     this.dropdowns = res;
      //     this.dropdowns["tbl_Jobs"] = store.state.jobs;
      //     this.dropdowns["tbl_Works"] = store.state.jobs;
      //     this.dropdownLoading = false;
      //   })
      //   .withFailureHandler((error) => {
      //     console.log(error);
      //   })
      //   .getDropdowns(this.optionSources);
    },
    // populateDropdown() {
    //   google.script.run
    //     .withSuccessHandler((res) => {
    //       console.log("Drop down fetched", res);
    //       this.dropdowns = res;
    //       this.dropdowns["tbl_Jobs"] = store.state.jobs;
    //       this.dropdowns["tbl_Works"] = store.state.jobs;
    //       this.dropdownLoading = false;
    //     })
    //     .withFailureHandler((error) => {
    //       console.log(error);
    //     })
    //     .getDropdowns(this.optionSources);
    // },
    getFiles() {
      // const f = document.getElementById("files");
      // [...f.files].forEach((file, i) => {
      const fileFields = this.schema.getFileFields();
      // console.log("File fields", fileFields);
      let count = 0;
      if (fileFields.length > 0) {
        fileFields.forEach((fld) => {
          if (this.model[fld]) {
            console.log("File Model", this.model[fld]);
            if (this.model[fld].length > 0) {
              count = count + this.model[fld].length;
            }
          }
        });
      } else {
        // No file fields found . Hence send mail and return
        console.log(
          "No File Fields. Sending mail and then return and go back."
        );
        this.sendMail();
        this.$router.push({ name: this.schema.goBackTo });
        return;
      }
      if (count == 0) {
        this.closeIndefinite();
        console.log(
          "No files in File Fields. Sending mail and then return and go back."
        );
        //  No files in  file fields. Hence send mail and then return
        this.sendMail();
        this.$router.push({ name: this.schema.goBackTo });
        return;
      }
      // console.log("File Count:", count);
      console.log(
        "Files found in File Fields. Will call CommitingFilesToDB and then send mail."
      );
      let uploadedFileCount = 0;
      this.indefinite();
      fileFields.forEach((fld) => {
        if (this.model[fld] === "") return;
        this.model[fld].forEach((file, i) => {
          const fr = new FileReader();
          fr.onload = (e) => {
            const data = e.target.result.split(",");
            const obj = {
              fileName: this.model[fld][i].name,
              mimeType: data[0].match(/:(\w.+);/)[1],
              data: data[1],
            };

            google.script.run
              .withSuccessHandler((res) => {
                console.log("Uploaded File Id", res);
                this.files[fld].push(res);
                uploadedFileCount = uploadedFileCount + 1;
                if (uploadedFileCount == count) {
                  console.log(
                    "All Files Uploaded successfully. Now Commiting Files to DB. Then send Mail.",
                    this.files
                  );
                  this.commitFilesToDB();
                  this.closeIndefinite();
                }
              })
              .saveFile2(obj);
          };
          fr.readAsDataURL(file);
          // oLinks[fld] = fileLonks;
        });
        // this.model[fld].fileLinks = fileLinks;
      });

      // this.dropFiles.forEach((file, i) => {
      //   const fr = new FileReader();
      //   fr.onload = (e) => {
      //     const data = e.target.result.split(",");
      //     const obj = {
      //       fileName: this.dropFiles[i].name,
      //       mimeType: data[0].match(/:(\w.+);/)[1],
      //       data: data[1],
      //     };
      //     google.script.run
      //       .withSuccessHandler((id) => {
      //         console.log("Uploaded File Id",id);
      //       })
      //       .saveFile(obj);
      //   };
      //   fr.readAsDataURL(file);
      // });
    },
    clearForm() {
      // this.model = this.resetModel;
      this.isSubmitting = true;
      this.$buefy.toast.open({
        message: "Saved successfully.!",
        type: "is-warning",
      });
    },
    updateStore(res) {
      console.log(
        `Method : updateStores(res) , EXPECTED log : Files Object with arrays in it if files have been uploaded. 
        OUTPUT : `,
        this.files
      );
      const updatedItem = {
        model: { ...this.model, ...this.computedProps },
        ...this.model,
        ...this.computedProps,
        files: this.files,
      };
      console.log(
        `Method : updateStores(res) , EXPECTED log : Pushed Row to Table : ${this.schema.recordName}. 
        OUTPUT : `,
        updatedItem
      );
      if (this.row) {
        updatedItem.id = this.row.id;
        let row = store.state.tables["tbl_" + this.schema.recordName].find(
          (o, i) => {
            if (o.id === this.row.id) {
              store.state.tables["tbl_" + this.schema.recordName][i] =
                updatedItem;
              return true;
            }
          }
        );
        console.log(row);
        // row = updatedItem;
        console.log(
          "Updated Table",
          store.state.tables["tbl_" + this.schema.recordName]
        );
        console.log("Updated Stores. Now Sending Mail", res);
      } else {
        updatedItem.id = res.id;
        // store.state.tables["tbl_" + this.schema.recordName].push(updatedItem);
        store.state.tables["tbl_" + this.schema.recordName].unshift(
          updatedItem
        );
      }
      // console.log(
      //   `Method : updateStores(res) , EXPECTED log : Table in store after appending to table   ${this.schema.recordName}.
      //   OUTPUT : `,
      //   store.state.tables["tbl_" + this.schema.recordName]
      // );
      console.log(`Store updated success fully.`);
      //  Send Mail
      // this.sendMail();
    },
    showSuccesToast() {},
    filterDD(filterObject) {
      console.log("Filter Object", filterObject);
      let filteredList = Object.values(store.state.jobs);
      filteredList = filteredList.filter((r) => {
        return r[filterObject.filterBy] === filterObject.filterValue;
      });

      this.dropdowns[filterObject.filterTable] = filteredList;
    },
    uploadToGDrive(fileObjects) {
      google.script.run
        .withSuccessHandler((res) => {
          console.log("Uploaded File Id", res);
        })
        .saveFile(fileObjects);
    },
    commitFilesToDB() {
      let formDataObject = {};

      formDataObject.files = JSON.stringify(this.files);
      // console.log(
      //   `Method : commitFilesToDB , EXPECTED : Files Object with arrays in it. OUTPUT : ${this.files}`
      // );
      google.script.run
        .withSuccessHandler((res) => {
          console.log("Commited Files in DB. Now Sending Mail", res);
          //  Send Mail
          this.sendMail();
        })
        .withFailureHandler((error) => {
          console.log(error);
        })
        .commitFilesToDB(this.schema.recordName, this.modelId, formDataObject);
    },
    handleFormRows(linkedGroup) {
      // console.log("Row Count", this.model.rowCount);
      // console.log("Linked Group", linkedGroup);
      this.schema.fields.forEach((fld) => {
        if (fld.inputType === "group") {
          let modelRowCount = Number(this.model[fld.linkedRowCountFld]);
          if (modelRowCount > this.model[fld.name].length) {
            // console.log("Group", this.model[fld.name]);
            const diff = modelRowCount - this.model[fld.name].length;
            const obj = this.model[fld.name][0];
            // console.log("Row in group", obj);
            for (let i = 0; i < diff; i++) {
              let clonedObj = { ...obj };

              for (const [k, v] of Object.entries(clonedObj)) {
                clonedObj[k] = "";
              }

              console.log("Cloned Obj", clonedObj);
              this.model[fld.name].push(clonedObj);
            }
            fld.rowCount = this.model[fld.name].length;
          }
        }
      });
      // return this.model.rowCount;
    },
    // handleFormRows() {
    //   let modelRowCount = Number(this.model.rowCount);
    //   console.log("Row Count", this.model.rowCount);
    //   this.schema.fields.forEach((fld) => {
    //     if (fld.inputType === "group") {
    //       if (modelRowCount > fld.rowCount) {
    //         console.log("Group", this.model[fld.name]);
    //         const diff = modelRowCount - fld.rowCount;
    //         const obj = this.model[fld.name][0];
    //         console.log("Row in group", obj);
    //         for (let i = 0; i < diff; i++) {
    //           let clonedObj = { ...obj };
    //           console.log("Cloned Obj", clonedObj);
    //           this.model[fld.name].push(clonedObj);
    //         }
    //         fld.rowCount = Number(this.model.rowCount);
    //       }
    //     }
    //   });
    //   return this.model.rowCount;
    // },
    calculate(calculateElements) {
      let [operation, ...els] = calculateElements;
      els = els.map((el) => {
        return this.model[el];
      });
      // console.log(operation);
      // console.log(els);
      switch (operation) {
        case "add":
          return els.reduce((s, v) => {
            return s + Number(v);
          }, 0);
          break;
        case "substract":
          if (els[0] > els[1]) {
            return els[0] - els[1];
          } else {
            return 0;
          }

          break;
        case "add-substract":
          if (els[0] + els[1] > els[2]) {
            return els[0] + els[1] - els[2];
          } else {
            return 0;
          }

          break;
        case "substract_date":
          return this.dateDifference(els);
          break;

        default:
          break;
      }
    },
    aggregate(calculateElements) {
      let arr = this.model[calculateElements.aggregateOver];
      if (arr.length > 0) {
        arr = arr.map((row) => {
          return row[calculateElements.aggregateBy];
        });
      }

      return arr.reduce((s, v) => {
        return s + Number(v);
      }, 0);
    },
    addToDate(calculateElements) {
      let dt = moment(this.model[calculateElements.date]);
      dt.add(calculateElements.adder, "d");
      console.log(dt);
      return dt.format("YYYY-MM-DD");
    },
    dateDifference(els) {
      // let [operation, ...els] = calculateElements;
      // els.forEach((el) => {
      //   // console.log(this.model[el] || this.computedProps[el]);
      // });
      var MILLIS_PER_DAY = 1000 * 60 * 60 * 24;
      console.log("Compute elements", els);
      // els = els.map((el) => {
      //   return moment(this.model[el]) || moment(this.computedProps[el]);
      // });
      var diff = new Date(els[1]).getTime() - new Date(els[0]).getTime();
      console.log("Datediff", diff / MILLIS_PER_DAY);

      return diff / MILLIS_PER_DAY;
    },
    indefinite() {
      this.indefinteToast = this.$buefy.toast.open({
        indefinite: true,
        message: `Uploading files ...`,
        type: "is-warning",
      });
    },
    closeIndefinite() {
      if (this.indefinteToast) {
        this.indefinteToast.close();
        this.indefinteToast = null;
      }
      this.$router.push({ name: this.schema.goBackTo });
    },
    sendMail() {
      let model = { ...this.model, ...this.computedProps };
      // this.detail = model;
      // this.sendingMail = true;
      const dropdowns = store.state.indexedDropdowns;
      const dateReg = /^\d{4}[./-]\d{2}[./-]\d{2}$/;

      if (this.schema.mailOptions) {
        const user = store.state.loggedUserObj;
        const mailOptions = this.schema.mailOptions;
        // const dateReg = /^\d{4}[./-]\d{2}[./-]\d{2}$/;

        var dt = this.model[mailOptions.reqDateField].split("-");
        dt = String(dt[1]) + "-" + String(dt[2]) + "-" + String(dt[0]);
        var subject = mailOptions.subject + " - " + dt;

        if (this.row) {
          subject = subject + " - [edited] ";
          mailOptions.line1 = mailOptions.editLine1;
          mailOptions.to = mailOptions.editTo;
          mailOptions.cc = [];
        }
        mailOptions.cc.push(user.email_id);
        mailOptions["requestee"] = user.name;

        // console.log("Mail Options", mailOptions);

        mailOptions.ignoreModelFields.forEach((fld) => {
          delete model[fld];
        });

        // Render Prefix
        this.schema.fields.forEach((fld) => {
          if (fld.prefix) {
            if (model[fld.name]) {
              switch (fld.prefix) {
                case "lbs":
                  model[fld.name] = model[fld.name] + " lbs";
                  break;

                default:
                  model[fld.name] = fld.prefix + "  " + model[fld.name];
                  break;
              }
            }
          }
        });

        console.log("Passed Model", model);
        // this.sendHTMMail_();

        for (let [k, v] of Object.entries(model)) {
          if (v === "") {
            model[k] = "";
          } else if (dateReg.test(v)) {
            var dt = v.split("-");
            dt = String(dt[1]) + "-" + String(dt[2]) + "-" + String(dt[0]);
            model[k] = dt;
          } else {
            if (this.fKeyFields[k]) {
              console.log(`${k}:${v}`);

              console.log(`Found in fKeyFields: ${k}:${v}`);
              const tbl_Name = this.fKeyFields[k]["tblName"];
              const renderFldName = this.fKeyFields[k]["keyRenderFld"];
              if (Array.isArray(v)) {
                if (typeof v[0] === "number") {
                  v = v.map((n) => {
                    return dropdowns[tbl_Name][n][renderFldName];
                  });
                  model[k] = v.join("  |  ");
                  console.log("Array", v);
                }
              } else {
                console.log(
                  "redered Val",
                  dropdowns[tbl_Name][v][renderFldName]
                );
                model[k] = dropdowns[tbl_Name][v][renderFldName];
              }
            }
          }
        }
        console.log("Passed Model after rendering", model);
        //  Generate Html
        let message = "";
        for (const [k, v] of Object.entries(model)) {
          if (typeof v === "string") {
            if (v.includes("http")) {
              message +=
                "<p><b>" +
                this.humanize(k) +
                " : " +
                "</b>" +
                "<a href=" +
                v +
                ">" +
                v +
                "</a></p>";
            } else if (dateReg.test(v)) {
              var dt = v.split("-");
              dt = String(dt[1]) + "-" + String(dt[2]) + "-" + String(dt[0]);
              message +=
                "<p><b>" + this.humanize(k) + " : " + "</b>" + dt + "</p>";
            } else {
              message +=
                "<p><b>" + this.humanize(k) + " : " + "</b>" + v + "</p>";
            }
          } else if (typeof v === "object" && !Array.isArray(v)) {
            //  do something with the object
          } else if (Array.isArray(v)) {
            if (typeof v[0] === "string") {
              message +=
                "<p><b>" +
                this.humanize(k) +
                " : " +
                "</b>" +
                v.join("  |  ") +
                "</p>";
            } else {
              message += "<p><b>" + this.humanize(k) + " : " + "</b></p>";

              // Build HTML Table, with inline styling for each cell
              var tableFormat =
                'style="font-size: 14px; border:1px solid black;border-collapse:collapse;text-align:center" border = 1 cellpadding = 4';
              var tblHtml = ["<table " + tableFormat + ">"];

              var data = v;
              // tblHtml.push('<table>');
              tblHtml.push("<tr>");
              for (var i in data[0]) {
                tblHtml.push("<th>" + this.humanize(i) + "</th>");
              }

              tblHtml.push("</tr>");

              for (let row = 0; row < data.length; row++) {
                tblHtml.push("<tr>");
                for (var c in data[row]) {
                  tblHtml.push("<td>" + data[row][c] + "</td>");
                }
                tblHtml.push("</tr>");
              }

              tblHtml.push("</table>");
              message += tblHtml.join("");
            }
          } else if (typeof v === "number") {
            message +=
              "<p><b>" + this.humanize(k) + " : " + "</b>" + v + "</p>";
          }
        }

        google.script.run
          .withSuccessHandler((res) => {
            console.log("Mail sent", res);
            if (res) {
              this.$buefy.toast.open({
                message: "Mail sent  successfully.!",
                type: "is-success",
              });
            }
          })
          .withFailureHandler((error) => {
            console.log(error);
          })
          .sendMail(
            this.schema.recordName,
            model,
            this.modelId,
            mailOptions,
            subject,
            message
          );
      }

      //  sendMail(tableName, model, id, mailOptions, subject)
    },
    sendHTMMail_() {
      let html = document.getElementById("smartDetailInForm").innerHTML;
      console.log("html body", html);
      let message = `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Hello Bulma!</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bulma@0.9.3/css/bulma.min.css">
  </head>
  <body>
  <section class="section">
    <div class="container">
      <h1 class="title">
        Hello World
      </h1>
      <p class="subtitle">
        My first website with <strong>Bulma</strong>!
      </p>
    </div>
    <div>${html}</div>
  </section>
  </body>
</html>`;
      google.script.run
        .withSuccessHandler((res) => {
          console.log("Mail sent", res);
        })
        .withFailureHandler((error) => {
          console.log(error);
        })
        .sendHtmlMail(message);
    },
    sendMailAfterEdit() {},
    humanize(str) {
      var i,
        frags = str.split("_");
      for (i = 0; i < frags.length; i++) {
        frags[i] = frags[i].charAt(0).toUpperCase() + frags[i].slice(1);
      }
      return frags.join(" ");
    },
  },
};
</script>
