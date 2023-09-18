<template>
  <b-modal
    scrollable
    size="xl"
    id="modal-Mails-form"
    ref="mail-modal"
    title="Mail Merge"
    :header-bg-variant="'dark'"
    :header-text-variant="'warning'"
    :body-bg-variant="'light'"
    :body-text-variant="'dark'"
    :footer-bg-variant="'dark'"
    :footer-text-variant="'dark'"
    @hidden="resetMailModal"
    @ok="handleOkInMailModal"
  >
    <form ref="mailForm" @submit.stop.prevent="handleSubmitInMailModal">
      <p>Select Email Template:</p>
      <b-form-select v-model="emailDraft">
        <b-form-select-option
          v-for="(option, index) in configStore.state.mailDrafts"
          :key="index"
          :value="{
            plainMessage: option.messagePlain,
            messageHTML: option.messageHTML,
            subject: option.subject,
          }"
          aria-describedby="help-block"
          >{{ option.subject }}</b-form-select-option
        >
      </b-form-select>
      <b-form-text id="help-block">
        The options are subject lines in your saved drafts linked to your Gmail
        account. The variable within the double curly braces,if any, would be
        replaced by their corresponding values.
      </b-form-text>
    </form>

    <b-button
      class="mt-2 mb-1 py-1"
      variant="success"
      @click="showEditor = !showEditor"
    >
      Modify Subject and Body
      <b-icon
        :icon="showEditor ? 'chevron-up' : 'chevron-down'"
        aria-hidden="true"
        class="text-success font-weight-bold"
      ></b-icon
    ></b-button>
    <div v-if="showEditor">
      <hr />
      <label for="text-password" class="text-danger">Subject</label>
      <b-form-input
        type="text"
        v-model="newSubject"
        id="text-password"
        aria-describedby="subject-help-block"
      ></b-form-input>
      <b-form-text id="subject-help-block">
        The subject line in the selected template will be replaced with this
        one.You may use variable name inside double curly braces that will be
        replaced by the corresponding values when the mail is sent.{{
          helpText1
        }}
      </b-form-text>

      <p class="mt-2 text-danger">Body</p>
      <vue-editor v-model="htmlBody"></vue-editor>
      <b-form-text id="subject-help-block">
        The content added in the above rich text editor will be added to the top
        of the content of the selected template. You can see the preview of the
        mail body below.You may use variable name inside double curly braces
        that will be replaced by the corresponding values when the mail is
        sent.{{ helpText1 }}
      </b-form-text>
      <b-form-file
        v-model="files"
        placeholder="Upload attachments"
        drop-placeholder="Drop files here..."
        multiple
      ></b-form-file>
    </div>
    <hr />
    <p class="text-success font-weight-bold">Preview of the Email</p>
    <hr />
    <b-col sm="12">
      <p>
        Subject:
        {{
          newSubject !== "" ? newSubject : emailDraft ? emailDraft.subject : ""
        }}
      </p>
      <div
        v-html="emailDraft ? htmlBody + emailDraft.messageHTML : htmlBody"
      ></div>
    </b-col>

    <!-- <div>
      {{ htmlBody }}
    </div> -->

    <template #modal-footer="{ cancel }">
      <b-button variant="danger" @click="cancel()"> Cancel </b-button>
      <b-button
        style="
          display: inline-flex;
          align-items: center;
          padding: 5px 10px font-weight-bold;
        "
        size="sm"
        variant="light"
        @click="handleOkInMailModal"
      >
        <span class="material-icons red90 mr-2 ml-1"> send </span>Send
      </b-button>
    </template>
  </b-modal>
</template>

<script>
import mails from "../mixins/mail.js";
import configStore from "../store/configuration";
import { VueEditor } from "vue2-editor";
export default {
  // mixins: [mails],
  components: {
    VueEditor,
  },
  props: {
    mailObjects: {
      type: Object,
      required: true,
    },
    from: {
      type: String,
      required: false,
    },
  },
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
</script>

<style></style>
