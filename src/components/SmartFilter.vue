<template>
  <div class="box mx-1 my-1">
    <h6>{{ schema.title }}</h6>
    <b-field grouped group-multiline>
      <div
        class="control"
        v-for="(filter, index) in schema.filters"
        :key="index"
      >
        <section>
          <div v-if="filter.type === 'text'">
            <b-field :label="filter.label" label-position="on-border">
              <b-input
                v-model="filter.value"
                value=""
                size="is-small"
              ></b-input>
            </b-field>
          </div>

          <!-- <div v-if="filter.type === 'select'">
            <b-field :label="filter.label" label-position="on-border">
              <b-input
                v-model="filter.value"
                value="Kevin Garvey"
                size="is-small"
              ></b-input>
            </b-field>
          </div> -->

          <div v-if="filter.type === 'select'">
            <b-field :label="filter.label" label-position="on-border">
              <b-select v-model="filter.value" size="is-small" expanded>
                <option
                  v-for="(option, index) in dropdowns[filter.optionSource]"
                  :value="typeof option === 'object' ? option['id'] : option"
                  :key="index"
                >
                  {{
                    filter.optionDisplayField
                      ? Array.isArray(filter.optionDisplayField)
                        ? filter.optionDisplayField
                            .map((o) => {
                              return option[o];
                            })
                            .join(" | ")
                        : option[filter.optionDisplayField]
                      : option
                  }}
                </option>
              </b-select>
            </b-field>
          </div>
          <div v-if="filter.type === 'select_2'">
            <b-field :label="filter.label" label-position="on-border" expanded>
              <b-select v-model="filter.value" size="is-small" expanded>
                <option
                  v-for="(option, index) in dropdowns[filter.optionSource]"
                  :value="
                    filter.selectOptions
                      ? option[filter.selectOptions.value]
                      : option
                  "
                  :key="index"
                >
                  {{
                    filter.selectOptions
                      ? option[filter.selectOptions.name]
                      : option
                  }}
                </option>
              </b-select>
            </b-field>
          </div>
          <div v-if="filter.type === 'instant_select'">
            <b-field :label="filter.label" label-position="on-border" expanded>
              <b-select
                v-model="filter.value"
                :required="filter.required"
                :placeholder="filter.placeholder"
                size="is-small"
                expanded
              >
                <option
                  v-for="option in filter.options"
                  :value="option"
                  :key="option.id"
                >
                  {{ option }}
                </option>
              </b-select>
            </b-field>
          </div>
          <div v-if="filter.type === 'dependentSelect'">
            <b-field :label="filter.label" label-position="on-border">
              <b-input
                v-model="filter.value"
                value=""
                size="is-small"
              ></b-input>
            </b-field>
          </div>
          <div v-if="filter.type === 'select_multilevel'">
            <b-field :label="filter.label" label-position="on-border">
              <b-select
                size="is-small"
                :required="filter.required"
                :placeholder="filter.placeholder"
                v-model="filter.value"
                @input="
                  () => {
                    if (filter.filterOptions) {
                      filterDD({
                        filterTable: filter.filterOptions.tblToFilter,
                        filterBy: filter.filterOptions.filterOn,
                        filterValue: filter.value,
                      });
                    }
                  }
                "
                expanded
              >
                <option
                  v-for="(option, index) in dropdowns[filter.optionSource]"
                  :value="
                    filter.selectOptions
                      ? option[filter.selectOptions.value]
                      : option
                  "
                  :key="index"
                >
                  {{
                    filter.selectOptions
                      ? option[filter.selectOptions.name]
                      : option
                  }}
                </option>
              </b-select>
            </b-field>
          </div>

          <div v-if="filter.type === 'date_from_to'">
            <fieldset class="box mt-0 mb-0 pb-1 px-1">
              <legend
                class="label is-small on-border"
                label-position="on-border"
              >
                {{ filter.label }}
              </legend>
              <b-field grouped>
                <b-field
                  label="From"
                  label-position="on-border"
                  class="mt-0 mb-0"
                  expanded
                >
                  <b-datepicker
                    v-model="filter.from"
                    locale="en-US"
                    placeholder="Click to select..."
                    icon="calendar-today"
                    size="is-small"
                    trap-focus
                  >
                  </b-datepicker>
                </b-field>
                <b-field label="To" label-position="on-border" expanded>
                  <b-datepicker
                    v-model="filter.to"
                    locale="en-US"
                    class="mt-0 mb-0"
                    placeholder="Click to select..."
                    icon="calendar-today"
                    size="is-small"
                    trap-focus
                  >
                  </b-datepicker>
                </b-field>
              </b-field>
            </fieldset>
          </div>
          <div v-if="filter.type === 'date'">
            <b-field :label="filter.label" label-position="on-border" expanded>
              <b-datepicker
                v-model="filter.value"
                locale="en-US"
                placeholder="Click to select..."
                icon="calendar-today"
                size="is-small"
                trap-focus
              >
              </b-datepicker>
            </b-field>
          </div>
        </section>
        <!-- If Object -->
      </div>
    </b-field>
    <div>
      <b-button
        type="is-success"
        size="is-small"
        icon-left="filter"
        @click="filtersSubmitted"
      >
        Filter
      </b-button>
      <b-button
        type="is-warning"
        size="is-small"
        icon-left="filter-off"
        @click="filtersCleared"
      >
        Clear
      </b-button>
    </div>
  </div>
  <!-- <pre>{{filteredUsers}}</pre> -->
  <!-- <b-table :data="items" :columns="columns"> </b-table>
  <pre>{{ items }}</pre>
  <pre>{{ filterSchema.filters }}</pre>
  <pre>{{ filterModel }}</pre> -->
</template>

<script>
import moment from "moment";
import store from "../store/store.js";

export default {
  name: "smartFilter",
  props: {
    filterSchema: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      items: [],
      dropdowns: {},
      momentDate: null,
      schema: this.filterSchema,
    };
  },
  computed: {
    filtersArray: function () {
      let filters = this.schema.filters;
      let model = filters.filter((item) => {
        if (item.value != null) {
          return item.value !== "" && item.value != null;
        } else {
          return item.from !== null && item.to !== null;
        }
      });
      return model;
    },
  },
  mounted() {
    this.populateDropdown();
  },
  filters: {
    capitalize(value) {
      if (!value) return "";
      value = value.toString().replace(/_/g, " ");

      return value.charAt(0).toUpperCase() + value.slice(1);
    },
  },
  methods: {
    toggle(row) {
      this.$refs.table.toggleDetails(row);
    },
    filtersSubmitted() {
      this.$emit("filtersSubmitted", this.filtersArray);
    },
    filtersCleared() {
      this.schema.filters.forEach((el) => {
        console.log("Before", el);
        if (el.value) {
          el.value = "";
        }
        if (el.type === "date_from_to") {
          el.from = null;
          el.to = null;
        }
        if (el.type === "date") {
          el.value = null;
        }
        console.log("After", el);
      });

      this.$emit("filtersCleared", true);
    },
    populateDropdown() {
      let dd = {};
      dd["tbl_Jobs"] = store.state.jobs;
      dd["tbl_Programs"] = store.state.programs;
      dd["tbl_Projects"] = store.state.projects;
      // console.log("Drop down fetched", dd);
      dd["tbl_Customers"] = store.state.tables["tbl_Customers"];
      dd["tbl_Suppliers"] = store.state.tables["tbl_Suppliers"];
      dd["tbl_Works"] = store.state.tables["tbl_Works"];
      dd["tbl_Users"] = store.state.tables["tbl_Users"];
      dd["tbl_Items"] = store.state.tables["tbl_Items"];
      dd["tbl_Vehicles"] = store.state.tables["tbl_Vehicles"];

      this.dropdowns = JSON.parse(JSON.stringify(dd));
      this.dropdownLoading = false;
      console.log("Smartfilter:-", this.dropdowns);
    },
    filterDD(filterObject) {
      console.log("Filter Object", filterObject);
      let filteredList = Object.values(store.state.jobs);
      filteredList = filteredList.filter((r) => {
        return r[filterObject.filterBy] === filterObject.filterValue;
      });
      this.dropdowns[filterObject.filterTable] = filteredList;
    },
  },
};
</script>
