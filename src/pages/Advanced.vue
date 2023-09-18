<template>
  <div>
    <p>Advanced</p>
    <!--  Licensing  -->
    <!-- <div v-if="store.state.about.app_mode === 'Under Trial'">
      <h6>Your trial ends on {{ expiry_date }}.</h6>
      <b-form inline>
        <label class="py-0 sr-only" for="inline-form-input-username"
          >Username</label
        >
        <b-input-group
          prepend="Enter License Key"
          size="sm"
          class="mb-2 mr-sm-2 py-0 mb-sm-0"
        >
          <b-form-input
            size="sm"
            class="py-0"
            id="inline-form-input-username"
            v-model="key"
            placeholder=""
          ></b-form-input>
        </b-input-group>

        <b-button
          size="sm"
          class="py-0"
          variant="primary"
          @click="matchLicenseKey"
          :disabled="keySubmitting"
        >
          <b-spinner v-if="keySubmitting" small></b-spinner>
          Submit</b-button
        >
      </b-form>
      <p>----------- or ------------</p>
      <div id="paypal-button-container" style="width: 250px"></div>
      <b-button @click="showPaypalButton" v-if="showPurchaseButton"
        >Purchase License</b-button
      >
      <strong :class="msgClass">{{ msg }}</strong>
      <hr />
    </div> -->
    <!-- Application Details -->
    <b-overlay :show="showSpinner" rounded="sm">
      <!-- <p style="font-size: 0.8em" class="m-1">
        Application Owner : {{ store.state.app_status.owner }}
      </p>
      <p style="font-size: 0.8em" class="m-1">
        Logged User : {{ store.state.app_status.loggedUserId }}
      </p> -->
      <!-- <p style="font-size: 0.8em" class="m-1">
        App Status : {{ store.state.app_status.app_mode }}
      </p> -->
      <hr />
      <!-- Guides -->
      <div>
        <div class="content mr-2 px-2">
          <h6 class="has-text-primary">App Usage Guide</h6>
          <!-- Get started -->
          <getstarted></getstarted>

          <!-- Calendar Integration -->

          <!-- Mail Merge -->

          <!-- Whatsapp -->
        </div>
      </div>
      <hr />
      <b-button
        size="sm"
        class="ml-2 py-0"
        variant="danger"
        @click="handleClearAll"
        >Clear All Records</b-button
      >
      <p class="text-danger ml-2 mt-2">
        Warning! All existing records will be deleted.
      </p>
      <hr />
    </b-overlay>
    <!-- Client Upload & Too Tip -->
    <b-overlay>
      <div class="content mr-2 px-2">
        <h6 class="has-text-primary">
          Upload Clients (move cursor over step buttons for further
          instructions)
        </h6>
        <div class="my-3">
          <b-button
            v-for="(tip, id) in tooltips"
            :key="id"
            class="py-0 mx-2"
            size="sm"
            v-b-popover.hover.bottom="tip.tips"
            :title="tip.title"
          >
            Step {{ id + 1 }}
          </b-button>
        </div>

        <download-excel
          class="btn btn-info py-0 m-2"
          :data="[
            {
              id: '',
              client_name: '',
              email: '',
              phone: '',
              address: '',
              key_contact: '',
              miscellaneous_info: '',
              city: '',
              country: '',
              postcode: '',
              // client_type_id: '',
              //  status: '',
            },
          ]"
          :fields="json_fields"
          :header="exportHeader"
          type="xls"
          worksheet="Clients"
          name="Clients.xls"
        >
          Click to download template
        </download-excel>

        <b-form inline>
          <label class="py-0 sr-only" for="inline-form-input-upload"
            >Upload</label
          >
          <b-input-group prepend="Select Client Type" size="sm" class="m-2">
            <b-form-select
              size="sm"
              style="width: 120px"
              class="py-0"
              v-model="client_type_id"
              :options="store.state.tables['tbl_client_type']"
              value-field="id"
              text-field="client_type"
            ></b-form-select>
            <b-form-file
              style="width: 200px"
              size="sm"
              class="py-0"
              :state="Boolean(file)"
              id="inline-form-input-upload"
              v-model="file"
              placeholder="Choose an excel file ...    "
              drop-placeholder="Drop file here..."
            ></b-form-file>
          </b-input-group>

          <b-button
            size="sm"
            class="py-1"
            variant="success"
            @click="fileSubmitted"
            :disabled="uploading"
          >
            <b-spinner v-if="uploading" small></b-spinner>
            Upload Clients</b-button
          >
        </b-form>
        <hr />
        <br />
      </div>
    </b-overlay>
  </div>
</template>

<script>
import moment from "moment";
import store from "../store/configuration";
import readXlsxFile from "read-excel-file";
import Mailmerge from "../guides/Mailmerge.vue";
import Getstarted from "../guides/Getstarted.vue";
import Whatsapp from "../guides/Whatsapp.vue";
import Calendar from "../guides/Calendar.vue";

export default {
  components: {
    Mailmerge,
    Calendar,
    Whatsapp,
    Getstarted,
  },
  data() {
    return {
      name: "",
      store,
      key: "",
      showSpinner: false,
      underTrial: true,
      file: null,
      msg: "",
      keySubmitting: false,
      showPurchaseButton: true,
      uploading: false,
      client_type_id: "",
      tooltips: [
        {
          title: "Clear old records",
          tips: "To clear old records click Clear All Records button.",
        },
        {
          title: "Download blank excel template",
          tips: "After downloading follow next step.",
        },
        {
          title: "Populate mandatory columns",
          tips: "Mandatory columns are as follows :- id & client_name. Important! :- After populating the blank template don't forget to save it as an excel workbook. You may see few warnings. Ignore them.",
        },
        { title: "Upload", tips: "Choose the prepared file and hit Upload." },
      ],
    };
  },
  mounted() {
    let paypalScript = document.createElement("script");
    paypalScript.setAttribute(
      "src",
      "https://www.paypal.com/sdk/js?client-id=test&currency=USD"
    );
    document.head.appendChild(paypalScript);
    // this.fetchAboutInformation();
    // Render the PayPal button into #paypal-button-container
  },
  computed: {
    expiry_date: function () {
      return moment(store.state.about.trial_start_date)
        .add(30, "days")
        .format("DD/MM/YYYY");
    },
  },

  methods: {
    clearAllRecords() {
      this.showSpinner = true;
      google.script.run
        .withSuccessHandler((res) => {
          console.log("Cleared");
          [
            "tbl_task",
            "tbl_client",
            "tbl_user",
            "tbl_manager",
            "tbl_timesheet",
            "tbl_invoice",
            "tbl_custom_invoice",
          ].forEach((tbl) => (this.store.state.tables[tbl] = []));
          this.showSpinner = false;
          this.$bvToast.toast(
            "All records except Task type, Activity type and Client type have been deleted.",
            {
              title: `Success`,
              variant: "success",
              solid: true,
            }
          );
        })
        .withFailureHandler((error) => {
          console.log(error);
        })
        .clearAll();
    },
    handleClearAll() {
      const h = this.$createElement;
      const messageVNode = h("div", [
        h("p", "You are about to delete all the existing records."),
        h("p", "This can't be undone."),
        h("p", "Do you want to go ahead?"),
      ]);
      this.$bvModal
        .msgBoxConfirm([messageVNode], {
          title: "Confirmation",
          size: "sm",
          buttonSize: "sm",
          okVariant: "danger",
          headerClass: "p-2 border-bottom-0",
          footerClass: "p-2 border-top-0",
          centered: true,
        })
        .then((value) => {
          if (value) {
            this.clearAllRecords();
          }
        })
        .catch((err) => {
          // An error occurred
        });
    },
    matchLicenseKey() {
      this.keySubmitting = true;
      console.log("Matching  LicenseKey");
      const matchKey = this.$getJumbledKey(store.state.about.owner);
      console.log(matchKey);
      if (this.key === matchKey) {
        this.makeItLicensed(matchKey);
      } else {
        this.key = "";
        this.keySubmitting = false;
        this.msg = "Sorry !. You have entered the wrong key.";
        this.msgClass = "text-warning";
      }
    },
    makeItLicensed(matchKey) {
      google.script.run
        .withSuccessHandler((res) => {
          console.log("License Key matched : ", res);
          store.state.about = res;
          if (this.$hasLocalStorage()) {
            localStorage.setItem("about", JSON.stringify(res));
          }
          this.keySubmitting = !res;
          this.key = "";
          this.msg = "Thank you. Refresh the link to use it.";
          this.msgClass = "text-success";
        })
        .withFailureHandler((error) => {
          console.log(error);
        })
        .MakeItLicensed(matchKey);
    },
    getJumbledString() {
      let key = store.state.owner;
      const str = key.replace(/[^a-zA-Z]/gm, "");
      const str1 = str.slice(3).split("").reverse().join("");
      const str2 = str.slice(-4, 2).split("").reverse().join("");
      const str3 = str.slice(3, 3).split("").reverse().join("");
      const key2 = str2 + str3 + str1;
      return key2.toLowerCase();
    },
    getLicenseKey_() {
      let key = store.state.owner.split("@")[0];
      let str = key.replace(/[^a-zA-Z]/gm, "");
      const str1 = str.slice(2).split("").reverse().join("");
      const str2 = str.slice(-2).split("").reverse().join("");
      const str3 = str.slice(2, 5).split("").reverse().join("");
      str = str2 + str3 + str1;

      let result = "";
      let charcode = 0;
      for (let i = 0; i < str.length; i++) {
        charcode = str[i].charCodeAt() + 6;
        result += String.fromCharCode(charcode);
      }
      return result;
    },
    setAppScecret() {},
    fileHandler() {
      if (this.file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          /* Parse data */
          const bstr = e.target.result;
          const wb = XLSX.read(bstr, { type: "binary" });
          /* Get first worksheet */
          const wsname = wb.SheetNames[0];
          const ws = wb.Sheets[wsname];
          /* Convert array of arrays */
          const data = XLSX.utils.sheet_to_json(ws, { header: 1 });
          console.log(data);
          this.columns = data[0];
          this.jsonData = this.arrayToJSON(data);

          google.script.run
            .withSuccessHandler((res) => {
              this.$buefy.toast.open(res);
              this.msg = "File uploaded successfully.";
              console.log("Tranfer in progress", res);
            })
            .transferData(data);
        };

        reader.readAsBinaryString(this.file);
      }
    },
    fileSubmitted() {
      if (this.file == null) return;
      let nextId = Math.max.apply(
        Math,
        store.state.tables["tbl_client"].map(function (o) {
          let n = o.id;
          return n;
        })
      );
      if (!isFinite(nextId)) {
        nextId = 0;
      }

      readXlsxFile(this.file).then((rows) => {
        this.uploading = true;
        rows = rows.slice(1);
        console.log("Rows", rows);
        rows = rows.map((r, i) => {
          r[0] = nextId + 1 + i;
          return r;
        });
        console.log("Rows after ID insertion", rows);
        google.script.run
          .withSuccessHandler((res) => {
            this.uploading = false;
            this.file = null;
            console.log(res);
          })
          .withFailureHandler((error) => {
            console.log(error);
          })
          .transferData(rows, this.client_type_id);
      });
    },
    arrayToJSON(array2D) {
      const header = array2D[0];
      const body = array2D.slice(1);
      const arr2 = body.map((el) => {
        let obj = {};
        for (let i = 0; i < el.length; ++i) {
          obj[header[i]] = el[i];
        }
        return obj;
      });
      return arr2;
    },
    fetchAboutInformation() {
      if (this.$hasLocalStorage()) {
        let about = localStorage.getItem(about);
        if (about != null) {
          console.log("About from Local Storage", JSON.parse());
          const { owner, trial_start_date, licensed } = JSON.parse(
            localStorage.getItem(about)
          );
        } else {
          console.log("Local storage empty");
        }
      } else {
        google.script.run
          .withSuccessHandler((res) => {
            console.log("About from server", res);
            if (res) {
              const { owner, trial_start_date, email } = JSON.parse(res);
              store.state.owner = owner;
            }
          })
          .withFailureHandler((error) => {
            console.log(error);
          })
          .getAboutApp();
      }
    },
    showPaypalButton() {
      this.showPurchaseButton = false;
      paypal
        .Buttons({
          // Set up the transaction
          createOrder: function (data, actions) {
            return actions.order.create({
              purchase_units: [
                {
                  amount: {
                    value: "01.44",
                  },
                },
              ],
            });
          },
          // Finalize the transaction
          onApprove: function (data, actions) {
            return actions.order.capture().then(function (orderData) {
              // Successful capture! For demo purposes:
              console.log(
                "Capture result",
                orderData,
                JSON.stringify(orderData, null, 2)
              );
              var transaction =
                orderData.purchase_units[0].payments.captures[0];
              alert(
                "Transaction " +
                  transaction.status +
                  ": " +
                  transaction.id +
                  "\n\nSee console for all available details"
              );

              // Replace the above to show a success message within this page, e.g.
              const element = document.getElementById(
                "paypal-button-container"
              );
              element.innerHTML = "";
              element.innerHTML =
                "<h3>Thank you for your payment!.You will shortly receive email with License code.</h3>";
              const matchKey = this.$getJumbledKey(store.state.about.owner);
              // console.log(matchKey);
              this.makeItLicensed(matchKey);
              // Or go to another URL:  actions.redirect('thank_you.html');
            });
          },
        })
        .render("#paypal-button-container");
    },
  },
};
</script>

