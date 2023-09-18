<template>
  <div>
    <hr />
    <b-row align-h="between">
      <b-col cols="4">
        <p class="m-0">Terms & Conditions</p>
        <p class="text-muted m-1" style="font-size: 0.7rem">
          {{ footer.line1 }}
        </p>
        <p class="text-muted m-1" style="font-size: 0.6rem">
          {{ footer.line2 }}
        </p>
      </b-col>
      <!-- <b-col
        ><p class="m-0">Account Details</p>
        <b-row class="m-0" v-for="(el, i) in acc_info_fields" :key="i">
          <b-col
            cols="4"
            class="m-0 text-muted px-0"
            style="font-size: 0.7rem"
            >{{ el.label }}</b-col
          >
          <b-col class="m-0 text-muted" style="font-size: 0.7rem">{{
            configStore.state.prefs[el.key]
          }}</b-col>
        </b-row>
      </b-col> -->
      <b-col cols="4"
        ><p class="m-0">Contact Us</p>
        <b-row class="m-0" v-for="(el, i) in company_info_fields" :key="i">
          <b-col
            cols="2"
            class="m-0 text-muted px-0"
            style="font-size: 0.7rem"
            >{{ el.label }}</b-col
          >
          <b-col class="m-0 text-muted" style="font-size: 0.7rem">{{
            configStore.state.prefs[el.key]
          }}</b-col>
        </b-row>
      </b-col>
    </b-row>
    <hr />
    <p class="text-center" style="font-size: 0.7rem">
      <strong> {{ configStore.state.prefs.end_line1 }} </strong>
    </p>
    <p class="text-center" style="font-size: 0.6rem">
      <strong> {{ configStore.state.prefs.end_line2 }} </strong>
    </p>

    <!-- <h6 style="font-size: 0.7rem">
      <strong>Thank you for your business!</strong>
    </h6> -->
  </div>
</template>

<script>
import configStore from "../store/configuration";

export default {
  name: "invoiceFooter",
  data() {
    return {
      configStore: configStore,
      footer: {
        line1: configStore.state.prefs.line1,
        line2: configStore.state.prefs.line2,
      },
      // acc_info_fields: [
      //   { label: "Acc #", key: "acc_no" },
      //   { label: "A/C Name", key: "acc_name" },
      //   { label: "Bank Details", key: "bank_details" },
      // ],
      company_info_fields: [
        { label: "Phone", key: "phone" },
        { label: "Email", key: "email" },
        { label: "Address", key: "address" },
      ],
    };
  },
};
</script>

<style>
</style>