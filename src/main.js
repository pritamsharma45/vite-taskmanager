import Vue from "vue";
import "./plugins/bootstrap-vue";
import { BootstrapVue, IconsPlugin } from "bootstrap-vue";

// Import Bootstrap and BootstrapVue CSS files (order is important)
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue/dist/bootstrap-vue.css";

// Make BootstrapVue available throughout your project
Vue.use(BootstrapVue);
// Optionally install the BootstrapVue icon components plugin
Vue.use(IconsPlugin);
import "./scss/app.scss";
import VueFormGenerator from "vue-form-generator/dist/vfg";
import JsonExcel from "vue-json-excel";
import VueFab from "vue-float-action-button";
import "vue-form-generator/dist/vfg.css";
import VueHtmlToPaper from "vue-html-to-paper";
import { VueEditor } from "vue2-editor";

const options = {
  name: "_blank",
  specs: ["fullscreen=no", "titlebar=yes", "scrollbars=yes"],
  styles: [
    "https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css",
    "https://unpkg.com/kidlat-css/css/kidlat.css",
    "./scss/app.scss",
  ],
  timeout: 5000, // default timeout before the print window appears
  autoClose: true, // if false, the window will not close after printing
  windowTitle: "", // override the window title
};

// import { BootstrapVue, BootstrapVueIcons } from "bootstrap-vue";

import App from "./App.vue";
import moment from "moment";

// import searchSelect from "./components/searchSelect";
// Vue.use(BootstrapVue);
// Vue.use(BootstrapVueIcons);
Vue.use(VueFab);
Vue.use(VueHtmlToPaper, options);
Vue.use(VueEditor);

Vue.component("downloadExcel", JsonExcel);
Vue.use(VueFormGenerator);
Vue.filter("capitalize", function (value) {
  if (!value) return "";
  value = value.toString().replace(/_/g, " ");

  return value.charAt(0).toUpperCase() + value.slice(1);
});

Vue.filter("formatAsDate", function (value) {
  if (!value) return "";
  return moment(value).format("DD/MM/YYYY");
});
Vue.filter("formatAs", function (value, type, options) {
  options = options || {};
  const locale = options.locale || "en-gb";
  const currency = options.currency || "GBP";
  if (!value) return "";
  switch (type) {
    case "currency":
      const formatter = new Intl.NumberFormat(locale, {
        style: "currency",
        currency: currency,
        minimumFractionDigits: 2,
      });
      value = formatter.format(value);
      break;
    case "percent":
      value = value + " %";
      break;
    case "date":
      value = moment(value).format("DD/MM/YYYY");
      break;
    case "time":
      value = moment(value).format("h:mm");
      break;
    case "capitalize":
      value = value = value.toString().replace(/_/g, " ");
      value = value.charAt(0).toUpperCase() + value.slice(1);
      break;
    default:
      break;
  }
  return value;
});
Vue.filter("formatAspercent", function (value) {
  if (!value) return "";
  return value + " %";
});
Vue.filter("pad", function (value, length, prefix) {
  if (!value) return "";
  var str = "" + value;
  while (str.length < length) {
    str = "0" + str;
  }
  return prefix + str;
});
Vue.filter("formatAsTime", function (value) {
  if (!value) return "";
  return moment(value).format("h:mm");
});
Vue.prototype.$hasLocalStorage = function () {
  try {
    localStorage.setItem(test, "t");
    localStorage.removeItem(test);
    return true;
  } catch (e) {
    return false;
  }
};
Vue.prototype.$getJumbledKey = function (value) {
  if (value === "") return;
  let key = value.split("@")[0] || "";
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
};

new Vue({
  components: { App },
  render: (h) => h(App),
}).$mount("#app");
