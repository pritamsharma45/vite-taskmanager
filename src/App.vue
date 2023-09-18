<template>
  <div>
    <div>
      <b-navbar toggleable="lg">
        <b-navbar-brand href="#">
          <img
            :src="store.state.logoURL"
            style="width: 200px; max-width: 100%; height: auto"
          />
        </b-navbar-brand>
        <!-- <b-navbar-brand active="true" to="/">Evexus</b-navbar-brand> -->

        <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

        <b-collapse id="nav-collapse" is-nav>
          <!--  Inser v-if="permit" -->
          <!-- <b-navbar-nav class="ml-auto"> -->
          <b-navbar-nav class="ml-auto" v-if="permit">
            <b-nav-item
              v-for="menu in menusWithoutDropdowns"
              :to="menu.routerLink"
              :key="menu.id"
              :active="menu.active"
              class="font-weight-bold"
              >{{ menu.name }}</b-nav-item
            >

            <b-nav-item-dropdown
              v-for="menu in menusWithDropdowns"
              :key="menu.id"
              :text="menu.name"
              class="font-weight-bold"
              right
            >
              <b-dropdown-item
                v-for="subMenu in menu.subMenus"
                :key="subMenu.id"
                :to="subMenu.routerLink"
                exact-path-active-class
              >
                <b-icon
                  :icon="subMenu.icon"
                  variant="success"
                  class="mx-2"
                ></b-icon
                >{{ subMenu.name }}</b-dropdown-item
              >
            </b-nav-item-dropdown>
          </b-navbar-nav>
        </b-collapse>
      </b-navbar>
    </div>
    <!-- <div class="container">
      
    </div> -->
    <b-container fluid>
      <div v-if="showSpinner">
        <b-button class="mt-2" variant="warning" disabled>
          <b-spinner small type="grow" variant="primary"></b-spinner>
          Loading application ...
        </b-button>
      </div>
      <router-view :key="$route.fullPath"></router-view>
    </b-container>
  </div>
</template>
<script>
import router from "./routes";
import menuSchema from "./forms/menuSchema";
import store from "./store/configuration";
import moment from "moment";
// import taskstore from "./store/task";
export default {
  name: "App",
  router,
  data() {
    return {
      name: "",
      // permit: false,
       permit: true,
      showSpinner: true,
      store: store,
      menus: menuSchema.menus,
      logoLink:
        "https://drive.google.com/uc?export=view&id=1vOf1sRdudHvgTUEtm3hdth3KORG-eVm5",
    };
  },
  created() {
    // taskstore.getTasks();
    // https://drive.google.com/file/d/1vMscspRL90aLX-OGHg6gRFnAroPzijdi/view?usp=sharing
    // https://drive.google.com/file/d/1vOf1sRdudHvgTUEtm3hdth3KORG-eVm5/view?usp=sharing   White
    // configStore.getIndexedTables();
  },
  mounted() {
    store.getTables().then((val) => {
      console.log("All Tables fetched");
      // const loggedUser = store.state.app_status.loggedUserId;
      // if (loggedUser === "") {
      //   this.showSpinner = false;
      //   this.$router.push("/NoAccess");
      //   return;
      // }
      // console.log("Logged User is valid:", this.validUser(loggedUser));
      // //  Enable User Authentication
      // if (this.validUser(loggedUser)) {
      //   this.permit = true;
      //   this.showSpinner = false;
      //   this.$router.push("/");
      // } else {
      //   this.showSpinner = false;
      //   this.$router.push("/NoAccess");
      // }

      this.showSpinner = false;
      this.$router.push("/");
    });
    // this.fetchAboutInformation();
    store.getPreference();
    // store.getTables();
    // store.CheckAppStatus();
  },
  computed: {
    menusWithDropdowns: function () {
      return this.menus.filter((menu) => {
        return menu.subMenus !== undefined;
      });
    },
    menusWithoutDropdowns: function () {
      return this.menus.filter((menu) => {
        return menu.subMenus === undefined;
      });
    },
  },
  methods: {
    validUser(loggedUser) {
      const owner = store.state.app_status.owner;
      const users = store.state.tables["tbl_user"];
      const managers = store.state.tables["tbl_manager"];
      const found = [...users, ...managers].find(
        ({ email }) => email === loggedUser
      );
      const check1 = found === undefined ? false : true;
      const check2 = loggedUser === owner;
      return check1 || check2; /// Uncomment this one

      // return true;
    },
    fetchAboutInformation() {
      console.log("Fetching About Information from Local Storage");
      if (this.$hasLocalStorage()) {
        const about = localStorage.getItem("about");
        if (about != null) {
          store.state.about = JSON.parse(localStorage.getItem("about"));
          this.checkIfLicenseExpired(store.state.about.trial_start_date);
          return;
        } else {
          this.fetchAboutFromServer();
        }
      } else {
        this.fetchAboutFromServer();
      }
    },
    fetchAboutFromServer() {
      console.log("Fetching About Information from Server");
      google.script.run
        .withSuccessHandler((res) => {
          if (res) {
            localStorage.setItem("about", JSON.stringify(res));
            store.state.about = res;
            this.checkIfLicenseExpired(res.trial_start_date);
          }
        })
        .withFailureHandler((error) => {
          console.log("fetchAboutFromServer:ERROR:-", error.message);
        })
        .getAboutApp();
    },
    checkIfLicenseExpired(trialStartDate) {
      console.log("Checking If License Expired");
      var today = new Date();
      today = moment(today);
      var dayDiff = today.diff(moment(trialStartDate), "days");
      if (dayDiff > 30) {
        store.state.about.app_mode = "Expired";
        this.permit = false;
        this.$router.push("/advanced");
      } else {
        this.permit = true;
      }
      console.log("Permit:", this.permit);
    },
  },
};
</script>

<style lang="scss">
@import "~@/assets/scss/vendors/bootstrap-vue/index";
