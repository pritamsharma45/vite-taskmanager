import configStore from "../store/configuration";
// import moment from "moment";
export default {
  data() {
    return {
      configStore,
      showSpinner: false,
      files: [],
      emailDraft: null, //Mail
      mailState: null, //Mail
      htmlBody: "",
      newSubject: "",
      showEditor: false,
      helpText1: "",
      // mailObjects: null, //Mail
    };
  },
  mounted() {
    if (this.from === "Task Manager") {
      this.helpText1 =
        " The available variable names are :- Client Name, Task, Deadline Date.";
    } else {
      this.helpText1 = " The available variable name is :- Client Name";
    }
    // this.$root.$emit("bv::show::modal", "modal-Mails-form");
  },
  computed: {
    // config() {
    //   return configStore.state.indexedDropdowns;
    // },
  },

  methods: {
    sendMails() {
      console.log("Step 3");
      this.showSpinner = true;
      if (this.files.length > 0) {
        this.sendMailWithAttachments();
      } else {
        const obj = [];
        google.script.run
          .withSuccessHandler((res) => {
            console.log(res);
            this.showSpinner = false;
            this.$bvToast.toast("Mails sent successfully", {
              title: `Success`,
              variant: "success",
              solid: true,
            });
          })
          .withFailureHandler((error) => {
            console.log(error);
          })
          .sendEmails(
            this.emailDraft.subject,
            this.mailObjects,
            this.htmlBody,
            this.newSubject,
            obj
          );
      }
    },
    checkFormValidity() {},
    resetMailModal() {
      this.emailDraft = null;
      this.mailState = null;
    },
    sendMailWithAttachments() {
      // const f = document.getElementById("files");
      // this.showSpinner = true;
      Promise.all(
        this.files.map((file, i) => {
          const fr = new FileReader();
          console.log("Files", file.name);
          return new Promise((r) => {
            fr.onload = (e) => {
              const data = e.target.result.split(",");
              r({
                fileName: file.name,
                mimeType: data[0].match(/:(\w.+);/)[1],
                data: data[1],
              });
            };
            fr.readAsDataURL(file);
          });
        })
      ).then((obj) => {
        google.script.run
          .withSuccessHandler(this.mailSent)
          .sendEmails(
            this.emailDraft.subject,
            this.mailObjects,
            this.htmlBody,
            this.newSubject,
            obj
          );
      });
    },
    handleOkInMailModal(bvModalEvent) {
      console.log("Step 1");
      bvModalEvent.preventDefault();

      this.handleSubmitInMailModal();
    },
    handleSubmitInMailModal() {
      console.log("Step 2");
      this.sendMails();
      this.$nextTick(() => {
        this.$bvModal.hide("modal-Mails-form");
      });
    },
    mailSent() {
      this.showSpinner = false;
      this.$bvToast.toast("Mails sent successfully", {
        title: `Success`,
        variant: "success",
        solid: true,
      });
    },
  },
};
