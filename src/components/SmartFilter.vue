<template>
  <div>
    <h5 class="title is-5 undelined">{{ schema.title }}</h5>
    <b-form-group grouped group-multiline>
      <div
        class="control"
        v-for="(filter, index) in schema.filters"
        :key="index"
      >
        <section>
          <div v-if="filter.type === 'text'">
            <b-form-group :label="filter.label" label-position="on-border">
              <b-form-input
                v-model="filter.value"
                value="Kevin Garvey"
                size="sm"
              ></b-form-input>
            </b-form-group>
          </div>

          <div v-if="filter.type === 'select'">
            <b-form-group :label="filter.label" label-position="on-border">
              <b-form-select v-model="filter.value" size="sm" expanded>
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
              </b-form-select>
            </b-form-group>
          </div>
          <div v-if="filter.type === 'select_2'">
            <b-form-group
              :label="filter.label"
              label-position="on-border"
              expanded
            >
              <b-form-select v-model="filter.value" size="sm" expanded>
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
              </b-form-select>
            </b-form-group>
          </div>
          <div v-if="filter.type === 'instant_select'">
            <b-form-group :label="filter.label">
              <b-form-select
                v-model="filter.value"
                :required="filter.required"
                :placeholder="filter.placeholder"
                expanded
              >
                <option
                  v-for="option in filter.options"
                  :value="option"
                  :key="option.id"
                >
                  {{ option }}
                </option>
              </b-form-select>
            </b-form-group>
          </div>

          <div v-if="filter.type === 'date_from_to'">
            <fieldset class="box mt-1 mb-1">
              <legend class="label is-small">
                {{ filter.label }}
              </legend>
              <b-form-group grouped>
                <b-form-group label="From" label-position="on-border" expanded>
                  <b-datepicker
                    v-model="filter.from"
                    locale="en-US"
                    placeholder="Click to select..."
                    icon="calendar-today"
                    size="sm"
                    trap-focus
                  >
                  </b-datepicker>
                </b-form-group>
                <b-form-group label="To" label-position="on-border" expanded>
                  <b-datepicker
                    v-model="filter.to"
                    locale="en-US"
                    placeholder="Click to select..."
                    icon="calendar-today"
                    size="sm"
                    trap-focus
                  >
                  </b-datepicker>
                </b-form-group>
              </b-form-group>
            </fieldset>
          </div>
        </section>
        <!-- If Object -->
      </div>
    </b-form-group>
    <div>
      <b-button variant="success" size="sm" @click="filtersSubmitted">
        Filter
      </b-button>
      <b-button variant="warning" size="sm" @click="filtersCleared">
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
    // this.fltrSchema = this.filterSchema;
    // console.log("Filter Schema", this.fltrSchema);
    // this.resetFilterSchema = JSON.parse(JSON.stringify(this.fltrSchema));
    // console.log("Reset Filter Schema ", this.resetFilterSchema);
    this.dropdowns = store.state.tables;
    this.dropdowns["tbl_Jobs"] = store.state.jobs;
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
  },
};
</script>
