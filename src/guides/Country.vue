<template>
  <div>
    <b-form inline>
      <label class="mr-sm-2" for="inline-form-custom-select-pref"
        >Select Country :
      </label>
      <b-form-select
        id="inline-form-custom-select-pref"
        size="sm"
        style="width: 30px"
        class="p-1"
        :options="options"
        v-model="store.state.country"
        :value="null"
      ></b-form-select>

      <b-button variant="primary" size="sm" style="width: 30px" class="p-1"
        >Save</b-button
      >
    </b-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      options: [
        { country: "UK", currency: "GBP", ln: "en-GB" },
        { country: "USA", currency: "USD", ln: "en-US" },
        { country: "Europe", currency: "GBP", ln: "en-GB" },
      ],
    };
  },
};
</script>

