  <template>
  <div class="box mx-4 my-4">
    <b-button
      @click="addNew"
      type="is-success is-light"
      icon-right="plus"
      class="mx-8 my-4"
      expanded
    >
      Add New
    </b-button>
    <h1 class="title is-underlined">Table</h1>
    <b-table
      :data="data"
      :columns="columns"
      detailed
      hoverable
      detail-key="id"
      @details-open="(row, index) => $buefy.toast.open(`Expanded ${row.id}`)"
      :show-detail-icon="showDetailIcon"
    >

    
      <!-- Row Details -->
      <template #detail="props">
        <div class="buttons">
          <b-button
            @click="delete rops.row.id"
            type="is-danger"
            size="is-small"
            icon-left="delete"
          >
            Delete
          </b-button>
          <b-button
            @click="edit(props.row.model)"
            type="is-success"
            size="is-small"
            icon-right="pencil"
          >
            Edit
          </b-button>
          <b-button
            @click="viewDetail(props.row.model)"
            type="is-success"
            size="is-small"
            icon-right="eye"
          >
            View
          </b-button>
        </div>
      </template>
    </b-table>
    <!-- <pre> {{ tableLite }}</pre> -->
  </div>
</template>

<script>
export default {
  name: "SmartTable",
  props: {
    schema: {
      type: Object,
      required: false,
    },
  },
  data() {
    return {
      data: [],
      columns: [],
      showDetailIcon: true,
    };
  },
  computed: {
    // tableLite: function () {
    //   let tableLite = {};
    //   let header = [{ field: "id", label: "ID" }];
    //   for ([k, v] of Object.entries(JSON.parse(this.data2[0].model))) {
    //     if (typeof v !== "object") {
    //       let o = {};
    //       o.field = k;
    //       let value = k.toString().replace(/_/g, " ");
    //       o.label =
    //         value.toString().replace(/_/g, " ").charAt(0).toUpperCase() +
    //         value.slice(1);
    //       header.push(o);
    //     }
    //   }
    //   tableLite.header = header;
    //   tableLite.data = this.data2.map((o) => {
    //     let row = {};
    //     row.id = o.id;
    //     o = JSON.parse(o.model);
    //     for ([k, v] of Object.entries(o)) {
    //       if (typeof v !== "object") {
    //         row[k] = v;
    //       }
    //     }
    //     return row;
    //   });
    //   return tableLite;
    // },
  },
  mounted() {
    this.fetchRecord();
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
    fetchRecord() {
      google.script.run
        .withSuccessHandler((res) => {
          console.log("Table", res);
          const tableLite = this.parseRecord(res);
          this.columns = tableLite.header;
          this.data = tableLite.data;
        })
        .withFailureHandler((error) => {
          console.log(error);
        })
        .NamedRangeToJSON("tbl_" + this.schema.recordName);
    },
    parseRecord(res) {
      let tableLite = {};
      let header = [{ field: "id", label: "ID" }];
      for (const [k, v] of Object.entries(JSON.parse(res[0].model))) {
        if (typeof v !== "object") {
          let o = {};
          o.field = k;
          let value = k.toString().replace(/_/g, " ");
          o.label =
            value.toString().replace(/_/g, " ").charAt(0).toUpperCase() +
            value.slice(1);
          header.push(o);
        }
      }
      tableLite.header = header;

      tableLite.data = res.map((o) => {
        let row = {};
        row.id = o.id;
        // o = JSON.parse(o.model);
        for (const [k, v] of Object.entries(JSON.parse(o.model))) {
          if (typeof v !== "object") {
            row[k] = v;
          }
        }
        row.model = JSON.parse(o.model);
        return row;
      });

      //   console.log("Table Data", this.data);
      console.log("Table", tableLite);
      return tableLite;
    },
    viewDetail(detail) {
      this.$router.push({
        name: "SmartDetail",
        params: { detail: detail },
      });
    },
    edit(model) {
      console.log("Edit", model);
      this.$router.push({
        name: "SmartForm",
        params: { model: model },
      });
    },
    delete(model) {
      console.log("Delete", model);
      // this.$router.push({
      //   name: "SmartForm",
      //   params: { model: model },
      // });
    },
    addNew() {
      console.log(this.schema);
      this.$router.push({
        name: "Form",
        params: { schema: this.schema },
      });
    },
  },
};
</script>

<style>
</style>