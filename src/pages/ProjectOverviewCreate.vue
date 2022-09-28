<template>
  <smart-form :schema="schema"></smart-form>
</template>
 
<script>
import schema from "../schemas/projectoverview";
import SmartForm from "../components/SmartForm.vue";

export default {
  name: "ProjectOverview",
  components: { SmartForm },
  data() {
    return {
      schema: schema,
    };
  },
};
</script>
