<template>
  <div class="box mx-4 my-4">
    <div id="smartDetail">
      <h1 class="title is-underlined">Details</h1>
      <div v-for="[key, value] of Object.entries(this.detail)">
        <!-- If Object -->
        <div v-if="typeof value === 'object'">
          <div v-if="Array.isArray(value)">
            <div v-if="typeof value[0] === 'object'">
              <pre> <b-table :data="value" :columns="extractHeader(value[0])"></b-table></pre>
            </div>
            <div v-else>
              <pre>{{ value }}</pre>
            </div>
            <!-- Table :{{ key | capitalize }} -->
          </div>

          <div v-else-if="key === 'files'">
            <div v-for="[key, value] of Object.entries(value)">
              <strong>{{ key | capitalize }} : </strong>
              <ul>
                <li v-for="(item, index) in value" :key="index">
                  <a :href="item" target="_blank">{{ item }}</a>
                </li>
              </ul>
            </div>
          </div>
          <div v-else>
            <div v-for="[key, value] of Object.entries(value)">
              <div v-if="typeof value === 'object'">
                <div v-if="Array.isArray(value)">
                  Array : {{ key | capitalize }}
                </div>
                <div v-else v-for="[key, value] of Object.entries(value)">
                  <div class="columns">
                    <div class="column is-3 label">{{ key | capitalize }}</div>
                    <div class="column is-1">:</div>
                    <div class="column">{{ value }}</div>
                  </div>
                </div>
              </div>
              <div v-else>
                <div class="columns">
                  <div class="column is-3 label">{{ key | capitalize }}</div>
                  <div class="column is-1">:</div>
                  <div class="column">{{ value }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- If String or number -->
        <div v-else>
          <div class="columns">
            <div class="column is-3 label">{{ key | capitalize }}</div>

            <div class="column is-1">:</div>

            <div
              v-if="typeof value === 'string' ? value.includes('www') : false"
            >
              <a :href="value" target="_blank">{{ value }}</a>
            </div>
            <div v-else class="column">{{ value }}</div>
          </div>
        </div>
      </div>
    </div>

    <!--  Submit Button -->
    <div v-if="showApproveButton" class="panel-block">
      <button
        class="button is-success is-fullwidth my-4 mx-2"
        @click="approve('Approved By - ')"
        :disabled="isApproving"
      >
        Approve
      </button>

      <button
        class="button is-danger is-fullwidth my-4 mx-2"
        @click="approve('Rejected By - ')"
        :disabled="isApproving"
      >
        Reject
      </button>
    </div>

    <div>
      <h4>Status :</h4>
      <ul>
        <li v-for="(item, index) in approvers" :key="index">
          <strong>{{ item.status }}</strong>
          <p>{{ item.user }}</p>
        </li>
      </ul>
    </div>
    <!-- <pre>

      {{ approvers }}
    </pre> -->

    <!-- Reminder Mail Modal  -->
    <b-button
      v-if="schema.mailOptions"
      label="Send Reminder"
      type="is-warning"
      size="is-small"
      @click="isCardModalActive = true"
    />
    <b-modal v-model="isCardModalActive" :width="640" scroll="keep">
      <form action="">
        <div class="modal-card" style="width: auto">
          <header class="modal-card-head">
            <p class="modal-card-title">Send Reminder</p>
          </header>
          <section class="modal-card-body">
            <b-field label="To">
              <b-select
                multiple
                native-size="8"
                v-model="reminderModal['to']"
                expanded
              >
                <option
                  v-for="(option, index) in store.state.tables['tbl_Users']"
                  :value="
                    typeof option === 'object' ? option['email_id'] : option
                  "
                  :key="index"
                >
                  {{ option.name }}
                </option>
              </b-select>
            </b-field>
            <b-field label="CC">
              <b-select
                multiple
                native-size="8"
                v-model="reminderModal['cc']"
                expanded
              >
                <option
                  v-for="(option, index) in store.state.tables['tbl_Users']"
                  :value="
                    typeof option === 'object' ? option['email_id'] : option
                  "
                  :key="index"
                >
                  {{ option.name }}
                </option>
              </b-select>
            </b-field>
            <b-field label="Comments">
              <b-input type="textArea" v-model="reminderModal['comments']">
              </b-input>
            </b-field>
          </section>
          <footer class="modal-card-foot">
            <b-button
              label="Send"
              @click="sendReminderMail()"
              type="is-primary"
            />
          </footer>
        </div>
      </form>
    </b-modal>
    <!-- <pre>
   {{ reminderModal }}
 </pre -->
  </div>
</template>

<script>
import store from "../store/store.js";
export default {
  props: {
    detail: {
      type: Object,
      required: true,
    },
    schema: {
      type: Object,
      required: false,
    },
    id: {
      type: Number,
      required: false,
    },
  },

  data() {
    return {
      columns: {},
      store: store,
      isApproving: false,
      showApproveButton: false,
      approvers: [],
      user: "",
      isCardModalActive: false,
      reminderModal: {
        id: "reminderModal",
        to: [],
        cc: [],
        comments: "",
      },
      fKeyFields: {},
    };
  },
  mounted() {
    this._getHeader();
    this.user = store.state.loggedUserId;
    console.log("user", this.user);
    this.fKeyFields = this.schema.fKeyFields();
    if (this.schema) {
      if (this.schema.approveOptions) {
        const options = this.schema.approveOptions;
        this.showApproveButton = options.showTo.includes(this.user);
        this.getApprovers();
      }
    }
    let html = document.getElementById("smartDetail").innerHTML;
    console.log("HTML", html);
  },
  methods: {
    _getHeader() {
      // console.log("All tables", this.allTables);
      var arr = [];
      for (const [k, v] of Object.entries(this.detail)) {
        if (typeof v === "object") {
          if (Array.isArray(v)) {
            this.columns[k] = this.extractHeader(v[0]);
            // arr = Object.keys(v[0]);
            // console.log(arr);
            // return arr;
          }
        }
      }

      return arr;
    },
    extractHeader(firstRow) {
      let header = [];
      for (const [k, v] of Object.entries(firstRow)) {
        if (typeof v !== "object") {
          let o = {};
          o.field = k;
          let value = k.toString().replace(/_/g, " ");
          o.label =
            value.toString().replace(/_/g, " ").charAt(0).toUpperCase() +
            value.slice(1);

          header.push(o);
        }
      }
      console.log("Header in detail - Array", header);
      return header;
    },
    getApprovers() {
      google.script.run
        .withSuccessHandler((res) => {
          this.approvers = res.approvers ? JSON.parse(res.approvers) : [];
        })
        .withFailureHandler((error) => {
          console.log(error);
        })
        .GetRecordById(1, this.schema.recordName);
    },
    approve(status) {
      let o = this.approvers.find((p) => p.user == this.user);
      if (o === undefined) {
        this.approvers.push({ user: this.user, status: status });
      } else {
        o.status = status;
      }

      google.script.run
        .withSuccessHandler((res) => {
          console.log(res);
        })
        .withFailureHandler((error) => {
          console.log(error);
        })
        .UpdateAttributes(this.schema.recordName, this.id, {
          approvers: JSON.stringify(this.approvers),
        });
    },
    sendReminderMail() {
      if (this.schema.mailOptions) {
        const user = store.state.loggedUserObj;
        const mailOptions = this.schema.mailOptions;
        const dateReg = /^\d{4}[./-]\d{2}[./-]\d{2}$/;
        // const dateReg = /^\d{4}[./-]\d{2}[./-]\d{2}$/;

        var dt = this.detail[mailOptions.reqDateField].split("-");
        dt = String(dt[1]) + "-" + String(dt[0]) + "-" + String(dt[2]);
        const subject = mailOptions.subject + " - " + dt;
        mailOptions.cc = this.reminderModal.cc;
        mailOptions.to = this.reminderModal.to;
        mailOptions["requestee"] = user.name;
        console.log("Mail Options", mailOptions);
        // console.log("Mail Options", mailOptions);
        const model = { ...this.detail };
        mailOptions.ignoreModelFields.forEach((fld) => {
          delete model[fld];
        });

        mailOptions.line1 = mailOptions.reminderLine1;
        console.log("Passed Model", model);

        console.log("Passed Model after rendering", model);
        //  Generate Html
        let message = "";
        for (const [k, v] of Object.entries(model)) {
          if (typeof v === "string") {
            if (v.includes("http")) {
              message +=
                "<p><b>" +
                this.humanize(k) +
                " : " +
                "</b>" +
                "<a href=" +
                v +
                ">" +
                v +
                "</a></p>";
            } else if (dateReg.test(v)) {
              var dt = v.split("-");
              dt = String(dt[1]) + "-" + String(dt[2]) + "-" + String(dt[0]);
              message +=
                "<p><b>" + this.humanize(k) + " : " + "</b>" + dt + "</p>";
            } else {
              message +=
                "<p><b>" + this.humanize(k) + " : " + "</b>" + v + "</p>";
            }
          } else if (typeof v === "object" && !Array.isArray(v)) {
            //  do something with the object
          } else if (Array.isArray(v)) {
            if (typeof v[0] === "string") {
              message +=
                "<p><b>" +
                this.humanize(k) +
                " : " +
                "</b>" +
                v.join("  |  ") +
                "</p>";
            } else {
              message += "<p><b>" + this.humanize(k) + " : " + "</b></p>";

              // Build HTML Table, with inline styling for each cell
              var tableFormat =
                'style="font-size: 14px; border:1px solid black;border-collapse:collapse;text-align:center" border = 1 cellpadding = 4';
              var tblHtml = ["<table " + tableFormat + ">"];

              var data = v;
              // tblHtml.push('<table>');
              tblHtml.push("<tr>");
              for (var i in data[0]) {
                tblHtml.push("<th>" + this.humanize(i) + "</th>");
              }

              tblHtml.push("</tr>");

              for (let row = 0; row < data.length; row++) {
                tblHtml.push("<tr>");
                for (var c in data[row]) {
                  tblHtml.push("<td>" + data[row][c] + "</td>");
                }
                tblHtml.push("</tr>");
              }

              tblHtml.push("</table>");
              message += tblHtml.join("");
            }
          } else if (typeof v === "number") {
            message +=
              "<p><b>" + this.humanize(k) + " : " + "</b>" + v + "</p>";
          }
        }
        google.script.run
          .withSuccessHandler((res) => {
            console.log("Mail sent", res);
          })
          .withFailureHandler((error) => {
            console.log(error);
          })
          .sendMail(
            this.schema.recordName,
            model,
            this.id,
            mailOptions,
            subject,
            message
          );
      }

      //  sendMail(tableName, model, id, mailOptions, subject)
    },
    sendHTMMail() {
      let message = `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Hello Bulma!</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bulma@0.9.3/css/bulma.min.css">
  </head>
  <body>
  <section class="section">
    <div class="container">
      <h1 class="title">
        Hello World
      </h1>
      <p class="subtitle">
        My first website with <strong>Bulma</strong>!
      </p>
    </div>
  </section>
  </body>
</html>`;
      google.script.run
        .withSuccessHandler((res) => {
          console.log("Mail sent", res);
        })
        .withFailureHandler((error) => {
          console.log(error);
        })
        .sendHtmlMail(message);
    },
    humanize(str) {
      var i,
        frags = str.split("_");
      for (i = 0; i < frags.length; i++) {
        frags[i] = frags[i].charAt(0).toUpperCase() + frags[i].slice(1);
      }
      return frags.join(" ");
    },
  },
};
</script>

<style>
</style>