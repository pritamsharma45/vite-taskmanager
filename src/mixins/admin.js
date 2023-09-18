import configStore from "../store/configuration";
// import moment from "moment";
export default {
  data() {
    return {
      configStore,
    };
  },
  mounted() {},
  computed: {
    // config() {
    //   return configStore.state.indexedDropdowns;
    // },
  },

  methods: {
    securityCheckPassed() {
      const doCheck = this.schema.doSecurityCheck
        ? this.schema.doSecurityCheck
        : false;
      if (doCheck) {
        console.log("Performing Security check");
        const loggedUser = configStore.state.app_status.loggedUserId || "";
        const owner = configStore.state.app_status.owner;

        if (owner !== loggedUser) {
          console.log("Permission denied");
          this.$bvToast.toast(
            "You are not allowed to perform this action. Only admin can perform this action.",
            {
              title: `Permission Denied`,
              variant: "danger",
              solid: true,
            }
          );
          return false;
        } else {
          console.log("Check Passed");
          return true;
        }
      } else {
        return true;
      }
    },
  },
};
