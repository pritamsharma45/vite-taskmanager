<template>
  <div>
    <b-button @click="addFormRow"> + Add</b-button>

    <b-form v-for="(form, i) in model" :key="i" inline>
      <input
        v-for="(el, idx) in group"
        :key="idx"
        size="sm"
        class="form-control m-1 py-0"
        v-model="form[el.key]"
        :placeholder="el.label"
        :type="el.type"
        :style="el.style"
      /><b-button variant="danger" size="sm" class="py-0" @click="removeRow(i)">
        <b-icon size="sm" icon="x-circle" variant="danger"></b-icon>
      </b-button>
    </b-form>

    <pre>
        {{ model }}
    </pre>
  </div>
</template>

<script>
export default {
  name: "SmartForm",
  data() {
    return {
      group: [
        {
          type: "text",
          key: "description",
          label: "Description",
          style: "width: 600px",
        },
        { type: "number", key: "rate", label: "Rate", style: "width: 60px" },
        {
          type: "number",
          key: "amount",
          label: "Amount",
          style: "width: 60px",
        },
      ],
      model: [],
    };
  },
  computed: {},
  mounted() {
    let o = {};
    this.group.forEach((el) => {
      o[el.key] = "";
    });
    this.model.push(o);
  },
  methods: {
    addFormRow() {
      let clonedRow = { ...this.model[0] };
      for (const [k, v] of Object.entries(clonedRow)) {
        clonedRow[k] = "";
      }
      this.model.push(clonedRow);
    },
    removeRow(i) {
      this.model.splice(i, 1);
    },
  },
};
</script>

<style>
</style>