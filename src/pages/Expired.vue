<template>
  <div>
    <div v-b-hover="handleHover" class="py-1 px-2">
      <b-overlay :show="showSpinner" rounded="sm">
        <b-form-group>
          <b-form-input
            size="sm"
            class="mr-sm-2"
            v-model="licenseKey"
            placeholder="Enter license key"
            v-if="isHovered"
          ></b-form-input>
          <b-button size="sm" v-if="!isHovered">Trial Expired.!!</b-button>
          <b-button
            size="sm"
            class="my-2 my-sm-0"
            v-if="isHovered"
            @click="licenseKeySubmitted"
            >Submit</b-button
          >
        </b-form-group>
      </b-overlay>
    </div>
    <br />
    <div>
      {{ msg }}
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      name: "",
      licenseKey: "",
      showSpinner: false,
      isHovered: false,
      trialExpired: false,
      appPurchased: false,
      appRenewed: true,
      appInService: true,
      appUnderTrial: false,
      linkDisabled: false,
      isLicensed: true,
      appUser: "",
      msg: "",
    };
  },
  methods: {
    licenseKeySubmitted() {
      if (this.licenseKey === "") {
      } else {
        console.log("License key submitted", this.licenseKey);
        this.matchLicenseKey();
      }
    },
    handleHover(hovered) {
      this.isHovered = hovered;
    },
    matchLicenseKey() {
      this.showSpinner = true;
      console.log("Matching License LicenseKey");
      google.script.run
        .withSuccessHandler((res) => {
          console.log("License Key matched : ", res);
          this.showSpinner = !res;
          this.licenseKey = "";
          if (res) {
            ("Thank you. Refresh the link to use it.");
          } else {
            ("Sorry !. You have entered the wrong key.");
          }
        })
        .withFailureHandler((error) => {
          console.log(error);
        })
        .matchLicenseKey(this.licenseKey);
    },
  },
};
</script>

