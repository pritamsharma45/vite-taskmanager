<template>
  <div>
    <b-container fluid="xl" class="bg-ocean-blue m-2 py-2">
      <h6 class="mt-2">{{ "Edit " + prepend + " Details" }}</h6>
      <!-- Save Button -->
      <div class="float-right">
        <!-- Print Button -->
        <!-- <b-button
          v-if="type === 'custom'"
          variant="warning"
          class="text-primary my-2 mx-2"
          size="sm"
          @click="print"
          >{{ "  Print  " }}</b-button
        > -->
        <b-button
          variant="warning"
          class="text-primary mx-2 my-2 font-weight-bold"
          size="sm"
          @click="createPdf"
          >{{ "Save Invoice" }}</b-button
        >
      </div>
      <b-row>
        <b-col
          cols="3"
          v-for="[k, value, index] of Object.entries(invoiceDetails)"
          :key="index"
          class="m-1 py-0 px-0"
        >
          <b-input-group :prepend="value.label" size="sm" class="py-0 px-1">
            <input
              v-if="value.type !== 'textarea'"
              v-model="value.value"
              :type="value.type"
              :min="value.min"
              class="form-control py-0"
              size="sm"
            />
            <textarea
              v-if="value.type === 'textarea'"
              v-model="value.value"
              class="form-control py-0"
              size="sm"
            ></textarea>
          </b-input-group>
        </b-col>
        <b-col cols="2" class="m-1">
          <b-form-select
            size="sm"
            class="py-0"
            v-model="docType"
            :options="[
              { value: 'INV', text: 'Invoice' },
              { value: 'CN', text: 'Credit Note' },
            ]"
          ></b-form-select>
        </b-col>
      </b-row>
      <!-- Custom Invoice Item Form -->
      <div v-if="type === 'custom'" class="py-2">
        <hr />

        <h6>Items</h6>
        <b-form v-for="(form, i) in custom_invoice.model" :key="i" inline>
          <input
            v-for="(el, idx) in custom_invoice.group"
            :key="idx"
            size="sm"
            class="form-control m-1 py-0"
            v-model="form[el.key]"
            :placeholder="el.label"
            :type="el.type"
            :style="el.thStyle"
            :disabled="el.disabled"
            @input="callback(form)"
          /><b-button
            variant="light"
            size="sm"
            class="py-0"
            @click="removeRow(i)"
          >
            <b-icon size="sm" icon="x-circle" variant="danger"></b-icon>
          </b-button>
        </b-form>
        <b-button
          variant="success"
          class="m-2"
          size="sm"
          @click="addFormRow"
          block
          >Add Entry</b-button
        >
      </div>
    </b-container>
    <!-- Print Preview  -->

    <p class="text align-center m-2">Preview</p>
    <div id="printableInvoice" class="m-2">
      <b-row class="mb-2">
        <b-col cols="5"
          ><img
            :src="configStore.state.logoURL"
            style="width: 250px; max-width: 100%; height: auto"
        /></b-col>

        <b-col
          ><h2 :class="docType === 'INV' ? '' : 'text-danger'">
            {{ docType === "INV" ? "INVOICE" : "CREDIT NOTE" }}
          </h2></b-col
        >
      </b-row>
      <br />
      <br />
      <b-row class="mb-2">
        <b-col cols="7">
          <b-row>
            <b-col cols="3" class="text-right">Invoice To :</b-col>
            <b-col>{{ client_name }}</b-col>
          </b-row>
          <b-row>
            <b-col cols="3" class="text-right">Address :</b-col>
            <b-col>{{ config["tbl_client"][this.clientId]["address"] }}</b-col>
          </b-row>
        </b-col>

        <b-col>
          <b-row>
            <b-col cols="5" class="text-right"
              >{{ docType === "INV" ? "Invoice No:" : "Credit No:" }}
            </b-col>
            <b-col>{{
              invoiceDetails.invoice_no.value | pad(4, invoice_prefix)
            }}</b-col>
          </b-row>
          <b-row>
            <b-col cols="5" class="text-right">{{
              docType === "INV" ? "Invoice Date:" : "Credit Date :"
            }}</b-col>
            <b-col>{{
              invoiceDetails.invoice_date.value | formatAs("date")
            }}</b-col>
          </b-row>

          <!-- <b-row>
              <b-col cols="4" class="text-right">Payment Terms: </b-col>
              <b-col>{{ invoiceDetails.payment_terms.value }}</b-col>
            </b-row>
            <b-row>
              <b-col cols="4" class="text-right">VAT Reg No: </b-col>
              <b-col>{{ invoiceDetails.VAT_reg_no.value }}</b-col>
            </b-row> -->
        </b-col>
      </b-row>
      <br />

      <!-- @@@@@@@@@@@@@@@ Table  -->
      <b-table
        :items="type === 'custom' ? custom_invoice['model'] : items"
        :fields="type === 'custom' ? custom_invoice['group'] : fields"
        head-variant="light"
        borderless
      >
      </b-table>
      <hr />
      <b-row
        class="mt-0 mr-2"
        v-for="(item, idx) in footerFields"
        :key="idx"
        align-h="end"
      >
        <b-col
          cols="2"
          :class="item.cls ? 'text-right font-weight-bold' : 'text-right'"
          >{{ prefs[item.text] ? prefs[item.text] + item.suffix : item.text }}
        </b-col>
        <b-col
          cols="1"
          :class="item.cls ? 'text-right font-weight-bold' : 'text-right'"
          >{{
            invoiceFooter[item.fld] | formatAs(item.formatType, localeOptions)
          }}</b-col
        >
      </b-row>

      <footer>
        <invoice-footer></invoice-footer>
      </footer>
    </div>

    <VueHtml2pdf
      :show-layout="false"
      :float-layout="true"
      :enable-download="true"
      :preview-modal="false"
      :paginate-elements-by-height="1600"
      filename="Invoice"
      :pdf-quality="4"
      pdf-format="letter"
      pdf-orientation="portrait"
      pdf-content-width="800px"
      @hasGenerated="hasGenerated($event)"
      @hasDownloaded="pdfCreated($event)"
      ref="html2Pdf"
    >
      <section slot="pdf-content">
        <!-- PDF Content Here -->
        <div
          style="
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
          "
          id="invoice-pdf"
          class="mx-2 px-4 pt-4"
        >
          <b-row class="mb-2">
            <b-col cols="5"
              ><img
                :src="configStore.state.logoURL"
                style="width: 250px; max-width: 100%; height: auto"
            /></b-col>

            <b-col
              ><h2 :class="docType === 'INV' ? '' : 'text-danger'">
                {{ docType === "INV" ? "INVOICE" : "CREDIT NOTE" }}
              </h2></b-col
            >
          </b-row>
          <br />
          <br />
          <b-row class="mb-2">
            <b-col cols="7">
              <b-row>
                <b-col cols="3" class="text-right">Invoice To :</b-col>
                <b-col>{{ client_name }}</b-col>
              </b-row>
              <b-row>
                <b-col cols="3" class="text-right">Address :</b-col>
                <b-col>{{
                  config["tbl_client"][this.clientId]["address"]
                }}</b-col>
              </b-row>
            </b-col>

            <b-col>
              <b-row>
                <b-col cols="5" class="text-right"
                  >{{ docType === "INV" ? "Invoice No:" : "Credit No:" }}
                </b-col>
                <b-col>{{
                  invoiceDetails.invoice_no.value | pad(4, invoice_prefix)
                }}</b-col>
              </b-row>
              <b-row>
                <b-col cols="5" class="text-right">{{
                  docType === "INV" ? "Invoice Date:" : "Credit Date :"
                }}</b-col>
                <b-col>{{
                  invoiceDetails.invoice_date.value | formatAs("date")
                }}</b-col>
              </b-row>

              <!-- <b-row>
              <b-col cols="4" class="text-right">Payment Terms: </b-col>
              <b-col>{{ invoiceDetails.payment_terms.value }}</b-col>
            </b-row>
            <b-row>
              <b-col cols="4" class="text-right">VAT Reg No: </b-col>
              <b-col>{{ invoiceDetails.VAT_reg_no.value }}</b-col>
            </b-row> -->
            </b-col>
          </b-row>
          <br />

          <!-- @@@@@@@@@@@@@@@ Table  -->
          <b-table
            :items="type === 'custom' ? custom_invoice['model'] : items"
            :fields="type === 'custom' ? custom_invoice['group'] : fields"
            head-variant="light"
            borderless
          >
          </b-table>
          <hr />
          <b-row
            class="mt-0 mr-2"
            v-for="(item, idx) in footerFields"
            :key="idx"
            align-h="end"
          >
            <b-col
              cols="2"
              :class="item.cls ? 'text-right font-weight-bold' : 'text-right'"
              >{{
                prefs[item.text] ? prefs[item.text] + item.suffix : item.text
              }}
            </b-col>
            <b-col
              cols="1"
              :class="item.cls ? 'text-right font-weight-bold' : 'text-right'"
              >{{
                invoiceFooter[item.fld]
                  | formatAs(item.formatType, localeOptions)
              }}</b-col
            >
          </b-row>

          <footer>
            <invoice-footer></invoice-footer>
          </footer>
        </div>
      </section>
    </VueHtml2pdf>
    <!-- <pre>
      {{ prefs }}
    </pre> -->
  </div>
</template>

<script>
import moment from "moment";
import configStore from "../store/configuration";
import InvoiceFooter from "./InvoiceFooter.vue";
import VueHtml2pdf from "vue-html2pdf";

export default {
  name: "invoice",
  components: { InvoiceFooter, VueHtml2pdf },
  props: {
    selected_invoice: { type: Object, required: false },
    items: {
      type: Object,
      required: false,
    },
    clientId: {
      type: Number,
      required: true,
    },
    invoice_items: [],
    inv_no: {
      type: Number,
      required: false,
    },
    inv_date: {
      type: String,
      required: false,
    },
    type: {
      type: String,
      required: false,
    },
    docType: {
      type: String,
      required: false,
    },
  },
  data() {
    return {
      configStore: configStore,
      client_name: "",
      client_address: "",
      docType: this.docType,
      fields: [
        {
          key: "activity_type_id",
          label: "Activity",
          formatter: (value, key, item) => {
            return this.config["tbl_activity_type"][value]["activity_type"];
          },
        },
        {
          key: "task_type_id",
          label: "Task ",
          formatter: (value, key, item) => {
            return this.config["tbl_task_type"][value]["task_type"];
          },
        },
        {
          key: "time",
          label: "Time",
          formatter: (value, key, item) => {
            let str = item["hours"] + " Hrs " + item["minutes"] + " Mins";

            return str;
          },
        },
        {
          key: "rate",
          label: "Rate",
          formatter: (value) => {
            return this.$options.filters.formatAs(
              value,
              "currency",
              this.localeOptions
            );
          },
          class: "text-right",
        },
        {
          key: "charge",
          label: "Charge",
          formatter: (value) => {
            return this.$options.filters.formatAs(
              value,
              "currency",
              this.localeOptions
            );
          },
          class: "text-right",
        },
      ],
      footerFields: [
        { text: "Total", fld: "total", formatType: "currency", suffix: "" },
        {
          text: "tax_type",
          fld: "st_p",
          formatType: "percent",
          suffix: " Rate",
        },
        {
          text: "tax_type",
          fld: "st",
          formatType: "currency",
          suffix: "",
        },
        {
          text: "Total",
          fld: "gt",
          formatType: "currency",
          cls: "font-weight-bold",
          suffix: "",
        },
      ],
      custom_invoice: {
        group: [
          {
            type: "text",
            key: "description",
            label: "Description",
            thStyle: "width: 740px",
          },
          {
            type: "number",
            key: "qty",
            label: "Qty",
            thStyle: "width: 70px",
          },
          {
            type: "number",
            key: "rate",
            label: "Rate",
            thStyle: "width: 90px",
            formatter: (value) => {
              return this.$options.filters.formatAs(
                value,
                "currency",
                this.localeOptions
              );
            },
            class: "text-right",
          },
          {
            type: "number",
            key: "amount",
            label: "Amount",
            thStyle: "width: 100px",
            formatter: (value) => {
              return this.$options.filters.formatAs(
                value,
                "currency",
                this.localeOptions
              );
            },
            disabled: true,
            class: "text-right",
          },
        ],
        model: [{ description: "", qty: "", rate: "", amount: "" }],
      },
      localeOptions: {},
      dropdowns: {},
      momentDate: null,
      schema: this.filterSchema,
      output: null,
    };
  },
  computed: {
    invoice_prefix: function () {
      return this.docType + "-";
    },
    filtersArray: function () {},
    invoiceFooter: function () {
      const o = {};
      let total = 0;
      if (this.type) {
        total = this.custom_invoice["model"].reduce(
          (a, b) => a + (Number(b["amount"]) || 0),
          0
        );
      } else {
        total = this.items.reduce((a, b) => a + (Number(b["charge"]) || 0), 0);
      }

      const st_p = configStore.state.prefs.tax_rate;
      const st = (st_p * total) / 100;
      const gt = st + Number(total);
      o["total"] = total;
      o["st_p"] = st_p;
      o["st"] = st;
      o["gt"] = gt;
      return o;
    },
    config() {
      return configStore.state.indexedDropdowns;
    },
    prefs() {
      return configStore.state.prefs;
    },
    prepend: function () {
      const prepend = this.docType === "INV" ? "Invoice" : "Credit";
      return prepend;
    },
    invoiceDetails: function () {
      let invNo, invDate;
      var dt = new Date();

      dt = dt.toLocaleDateString("en-GB").split("/").reverse().join("-");
      invDate = this.inv_date || dt.toLocaleString("en-GB");
      if (this.selected_invoice) {
        this.custom_invoice.model = JSON.parse(
          this.selected_invoice.invoice_items
        );
        invNo = this.selected_invoice.invoice_no;
        invDate = JSON.parse(this.selected_invoice.invoice_date);
      } else {
        invNo = this.getNextCustomInvNo();
      }

      let prepend = this.docType === "INV" ? "Invoice" : "Credit";
      let o = {
        // client_address: {
        //   value: "",
        //   type: "textarea",
        //   label: "Client Address",
        // },
        invoice_no: {
          value: invNo,
          type: "number",
          label: prepend + " No",
          min: 1,
        },

        invoice_date: {
          value: invDate,
          type: "date",
          label: prepend + " Date",
        },
      };
      return o;
    },
  },
  mounted() {
    this.localeOptions = {
      locale: configStore.state.prefs.locale,
      currency: configStore.state.prefs.currency,
    };

    console.log("Invoice Modal mounting...");
    this.client_name = this.config["tbl_client"][this.clientId]["client_name"];
    this.invoiceDetails["invoice_no"]["value"] = this.inv_no || "";

    var dt = new Date();
    console.log("Date", dt.toLocaleDateString("en-GB"));
    dt = dt.toLocaleDateString("en-GB").split("/").reverse().join("-");
    this.invoiceDetails["invoice_date"]["value"] =
      this.inv_date || dt.toLocaleString("en-GB");
    if (this.type === "custom") {
      this.invoice_prefix = "INV-";

      if (this.selected_invoice) {
        this.custom_invoice.model = JSON.parse(
          this.selected_invoice.invoice_items
        );
        this.invoiceDetails.invoice_no.value = this.selected_invoice.invoice_no;
        this.invoiceDetails.invoice_date.value = JSON.parse(
          this.selected_invoice.invoice_date
        );
      } else {
        this.invoiceDetails.invoice_no.value = this.getNextCustomInvNo();
      }
    } else {
      this.docType = "INV";
    }

    if (this.invoice_details != null) {
      for (const key in this.invoice_details) {
        this.invoiceDetails[key]["value"] = this.invoice_details[key]["value"];
      }
    } else {
      this.invoiceDetails["client_address"]["value"] =
        this.config["tbl_client"][this.clientId]["address"];
    }
    this.generateModelForCustomInvoice();
  },
  filters: {
    capitalize(value) {
      if (!value) return "";
      value = value.toString().replace(/_/g, " ");

      return value.charAt(0).toUpperCase() + value.slice(1);
    },
  },
  methods: {
    capitalize(value) {
      if (!value) return "";
      value = value.toString().replace(/_/g, " ");

      return value.charAt(0).toUpperCase() + value.slice(1);
    },
    reset() {
      Object.assign(this.$data, this.$options.data());
    },
    generateModelForCustomInvoice() {
      let o = {};
      this.custom_invoice.group.forEach((el) => {
        o[el.key] = "";
      });
      this.custom_invoice.model.push(o);
    },
    callback(model) {
      console.log(model);
      model["amount"] = model["rate"] * model["qty"];
    },

    addFormRow() {
      let clonedRow = { ...this.custom_invoice.model[0] };
      for (const [k, v] of Object.entries(clonedRow)) {
        clonedRow[k] = "";
      }
      this.custom_invoice.model.push(clonedRow);
      console.log("Custom Invoice Model :", this.custom_invoice);
    },
    saveCustomInvoice() {
      let o = {};
      o["client_id"] = this.clientId;
      o["type"] = this.docType;
      o["invoice_total"] = this.invoiceFooter["gt"];
      o["invoice_items"] = JSON.stringify(this.custom_invoice.model);
      o["payment_status"] = "Pending";
      o["invoice_date"] = JSON.stringify(
        this.invoiceDetails.invoice_date.value
      );
      o["invoice_no"] = this.invoiceDetails.invoice_no.value;

      console.log("invoice item payload", o);

      google.script.run
        .withSuccessHandler((res) => {
          console.log("Custom Invoice Record Updated", res);
          configStore.updateOrAddItem(o, "tbl_custom_invoice");
          this.$bvToast.toast("Invoice Saved.", {
            title: `Success`,
            variant: "success",
            solid: true,
          });
          // this.$refs.invoiceModal.reset();
        })
        .withFailureHandler((error) => {
          console.log(error);
        })
        .createEntity(o, "tbl_custom_invoice");
    },
    getNextCustomInvNo() {
      let id = Math.max.apply(
        Math,
        configStore.state.tables["tbl_custom_invoice"].map(function (o) {
          let n = o.invoice_no;
          return n;
        })
      );
      if (!isFinite(id)) {
        id = 0;
      }
      return id + 1;
    },
    removeRow(i) {
      if (this.custom_invoice.model.length == 1) return;
      this.custom_invoice.model.splice(i, 1);
    },
    async print() {
      await this.$htmlToPaper("printableInvoice");
    },
    getTimesheetInvoicePayload() {
      const ts_ids = this.items.map((el) => {
        return el.id;
      });
      let o = {};
      o["client_id"] = this.clientId;
      o["invoice_total"] = this.invoiceFooter["gt"];
      o["ts_ids"] = JSON.stringify(ts_ids);
      o["invoice_details"] = JSON.stringify(this.invoiceDetails);
      o["payment_status"] = "Pending";
      console.log("Timesheet invoice payload:", o);
      return o;
    },
    getInvoicePayload() {
      let o = {};
      o["client_id"] = this.clientId;
      o["type"] = this.docType;
      o["invoice_total"] = this.invoiceFooter["gt"];
      o["invoice_items"] = JSON.stringify(this.custom_invoice.model);
      o["payment_status"] = "Pending";
      o["invoice_date"] = JSON.stringify(
        this.invoiceDetails.invoice_date.value
      );
      o["invoice_no"] = this.invoiceDetails.invoice_no.value;
      console.log("invoice item payload", o);
      return o;
    },
    createPdf() {
      this.$bvToast.toast("Saving invoice...", {
        title: `Progress`,
        variant: "info",
        solid: true,
      });
      const pdfOptions = {
        filename: "mypdf.pdf",
        image: { type: "jpeg", quality: 1 },
        margin: 1.5,
        html2canvas: {
          scale: 4,
          letterRendering: true,
          useCORS: true,
        },
        jsPDF: { orientation: "portrait", format: "letter", unit: "in" },
      };
      this.$refs.html2Pdf.generatePdf(pdfOptions);
    },
    // pdfCreated(pdfBlob) {
    //   console.log("pdfCreated", pdfBlob);

    //   const fr = new FileReader();
    //   fr.onload = (e) => {
    //     const data = e.target.result.split(",");
    //     const obj = {
    //       fileName: "mypdf.pdf",
    //       mimeType: data[0].match(/:(\w.+);/)[1],
    //       data: data[1],
    //     };
    //     const payLoad = this.invoiceDetails;
    //     const clientEmail = this.config["tbl_client"][this.clientId]["email"];
    //     let invoiceNumber = this.invoiceDetails.invoice_no.value;
    //     invoiceNumber = this.$options.filters.pad(invoiceNumber, 4, "INV-");
    //     const clientName =
    //       this.config["tbl_client"][this.clientId]["client_name"];
    //     let invoiceDate = this.invoiceDetails.invoice_date.value;
    //     invoiceDate = this.$options.filters.formatAs(invoiceDate, "date");

    //     const paylodForInvoiceRecord = {
    //       client_id: this.clientId,
    //       type: this.docType,
    //       invoice_total: this.invoiceFooter["gt"],
    //       invoice_items: JSON.stringify(this.custom_invoice.model),
    //       payment_status: "Pending",
    //       invoice_date: JSON.stringify(this.invoiceDetails.invoice_date.value),
    //       invoice_no: this.invoiceDetails.invoice_no.value,
    //     };
    //     google.script.run
    //       .withSuccessHandler((res) => {
    //         console.log("Uploaded File Id", res);
    //         this.$bvToast.toast(
    //           "Invoice sent successfully! Invoice record updated.",
    //           {
    //             title: `Success`,
    //             variant: "success",
    //             solid: true,
    //           }
    //         );
    //       })
    //       .sendPdfByEmail(
    //         obj,
    //         clientEmail,
    //         {
    //           clientName,
    //           invoiceNumber,
    //           invoiceDate,
    //         },
    //         paylodForInvoiceRecord
    //       );
    //   };
    //   fr.readAsDataURL(pdfBlob);
    // },
    pdfCreated(pdfBlob) {
      console.log("pdfCreated", pdfBlob);
      let invoicePayload = null;
      let tblName = null;
      let goBackTo = null;
      if (this.type == "custom") {
        invoicePayload = this.getInvoicePayload();
        tblName = "tbl_custom_invoice";
        goBackTo = "/Invoices";
      } else {
        invoicePayload = this.getTimesheetInvoicePayload();
        tblName = "tbl_invoice";
        goBackTo = "/AllTimesheets";
      }

      const fr = new FileReader();
      fr.onload = (e) => {
        const data = e.target.result.split(",");
        const obj = {
          fileName: "mypdf.pdf",
          mimeType: data[0].match(/:(\w.+);/)[1],
          data: data[1],
        };

        google.script.run
          .withSuccessHandler((res) => {
            console.log("Uploaded File url", res);
            invoicePayload.invoice = res;
            if (tblName === "tbl_invoice") {
              configStore.updateItems(
                JSON.parse(invoicePayload.ts_ids),
                "tbl_timesheet",
                {
                  invoiced: "Y",
                }
              );
            }
            configStore.updateOrAddItem(invoicePayload, tblName);
            this.$bvToast.toast(
              "Invoice saved successfully! Go to Invoice Records to send it to the client or take other actions.",
              {
                title: `Success`,
                variant: "success",
                solid: true,
              }
            );
            this.$router.push(goBackTo);
          })
          .saveInvoice(obj, tblName, invoicePayload);
      };
      fr.readAsDataURL(pdfBlob);
    },
  },
};
</script>
