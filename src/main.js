import Vue from "vue";
import Buefy from "buefy";
import App from "./App.vue";
import "buefy/dist/buefy.css";
import moment from "moment";
// import JsonExcel from "vue-json-excel";

// Vue.component("downloadExcel", JsonExcel);

Vue.use(Buefy);

Vue.filter("formatDate", function (value) {
  if (value) {
    return moment(String(value)).format("MM/DD/YYYY hh:mm");
  }
});
Vue.filter("capitalize", function (value) {
  if (!value) return "";
  value = value.toString().replace(/_/g, " ");

  return value.charAt(0).toUpperCase() + value.slice(1);
});

Vue.filter("humanize", function (value) {
  if (!value) return "";
  var i,
    frags = value.split("_");
  for (i = 0; i < frags.length; i++) {
    frags[i] = frags[i].charAt(0).toUpperCase() + frags[i].slice(1);
  }
  return frags.join(" ");
});

Vue.filter("formatAsDate", function (value) {
  if (!value) return "";
  return moment(value).format("DD/MM/YYYY");
});

Vue.filter("formatAsTime", function (value) {
  if (!value) return "";
  return moment(value).format("h:mm");
});
Vue.filter("stringToDate", function (value) {
  if (value) {
    return moment(String(value)).format("dd/mm/yyyy");
  }
});

Vue.prototype.store = {
  debug: true,
  state: {
    dropdowns: {},
  },
  setMessageAction(newValue) {
    if (this.debug) console.log("setMessageAction triggered with", newValue);
    this.state.dropdowns = newValue;
  },
  clearMessageAction() {
    if (this.debug) console.log("clearMessageAction triggered");
    this.state.dropdowns = "";
  },
};

new Vue({
  components: { App },
  render: (h) => h(App),
}).$mount("#app");

// new Vue({
//   el: "#req_app",

//   components: { App },
//   // created() {
//   //   var vm = this;
//   //   google.script.run
//   //     .withSuccessHandler((res) => {
//   //       console.log("Drop down fetched", res);
//   //       this.store.state.dropdowns = res;
//   //     })
//   //     .withFailureHandler((error) => {
//   //       console.log(error);
//   //     })
//   //     .getDropdowns(["tbl_Suppliers", "tbl_Customers"]);
//   // },
// });
