<template>
  <div>
    <b-navbar>
      <template #start>
        <div v-for="menu in menus" :key="menu.id">
          <b-navbar-item
            v-if="menu.menus == null"
            tag="router-link"
            :to="{ path: menu.routerLink }"
          >
            {{ menu.name }}
          </b-navbar-item>

          <b-navbar-dropdown v-else :label="menu.name">
            <b-navbar-item
              v-for="menu in menu.menus"
              :key="menu.id"
              tag="router-link"
              :to="{ path: menu.routerLink }"
            >
              {{ menu.name }}
            </b-navbar-item>
          </b-navbar-dropdown>
        </div>
      </template>
      <template #end>
        <b-navbar-item>
          {{ user }}
        </b-navbar-item>
      </template>
    </b-navbar>
    <b-container fluid>
      <div v-if="showSpinner">
        <b-button type="is-danger is-light" disabled expanded>
          Loading application ...
        </b-button>
      </div>
      <router-view :key="$route.fullPath"></router-view>
    </b-container>
  </div>
</template>


<script>
import router from "./routes";
import menuSchema from "./schemas/menu";
import store from "./store/store";

export default {
  name: "App",

  router,
  data() {
    return {
      menus: menuSchema.menus,
      user: "",
      showSpinner: true,
      store,
    };
  },
  mounted() {
    this.store
      .getStringifiedTables()
      .then((result) => {
        console.log("All tables loaded successfully");
        this.showSpinner = false;
        store.state.loggedUserObj = store.state.tables["tbl_Users"].find(
          (user) => {
            return user.email_id === store.state.loggedUserId;
          }
        );
        console.log("Requestee Object", store.state.loggedUserObj);
      })
      .catch((err) => {});

    this.store
      .getLoggedInUser()
      .then((res) => {
        console.log("User", res);
        this.user = res;
      })
      .catch((err) => {});
  },
};
</script>
