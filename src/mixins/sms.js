export default {
  data() {
    return {
      message: "", // SMS
      nameState: null, //SMS
    };
  },
  methods: {
    //  SMS Modal related messages
    sendSMS() {
      google.script.run
        .withSuccessHandler((res) => {
          console.log(res);
          this.$bvToast.toast("Message sent successfully", {
            title: `Success`,
            variant: "success",
            solid: true,
          });
        })
        .withFailureHandler((error) => {
          console.log(error);
        })
        .sendElksSMS(this.message, [this.selectedClientPhone]);
    },
    sendSMSClicked(item) {
      this.selectedClientName = this.config["tbl_client"][item.client_id][
        "client_name"
      ];
      this.selectedClientPhone =
        "+" + this.config["tbl_client"][item.client_id]["phone"];
      this.message = `Dear ${this.selectedClientName},`;
      this.$root.$emit("bv::show::modal", "modal-sms-form");
    },
    checkFormValidity() {
      const valid = this.$refs.form.checkValidity();
      this.nameState = valid;
      return valid;
    },
    resetModal() {
      this.name = "";
      this.nameState = null;
    },
    handleOk(bvModalEvent) {
      bvModalEvent.preventDefault();
      this.handleSubmit();
    },
    handleSubmit() {
      if (!this.checkFormValidity()) {
        return;
      }
      this.sendSMS();
      this.$nextTick(() => {
        this.$bvModal.hide("modal-sms-form");
      });
    },
  },
};
