<template>
  <div class="us">
    <h5>Manage Dropdowns</h5>
    <ManageDropDownNav />
    <!-- <router-view></router-view> -->
  </div>
</template>

<script>
import ManageDropDownNav from "./ManageDropDownNav.vue";
export default {
  name: "Dropdowns",
  components: { ManageDropDownNav },
};
</script>
