<template>
  <generic-list :schema="schema">
  </generic-list>
   

</template>

<script>
import clientSchema from "../forms/client";
import GenericList from "../components/GenericList3.vue";
export default {
  components: { GenericList },
  name: "AllClients",
  data() {
    return {
   
      schema: clientSchema,
    };
  },
  mounted() {
    // const fields = this.schema._mappedFldsFromSchema();
    // console.log("Display Fields In List All clients",fields);
  },
  methods: {},
};
</script>
