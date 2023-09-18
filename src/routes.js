import Vue from "vue";
import Router from "vue-router";
import CreateEntity from "./pages/CreateEntity.vue";
import InvoiceModal from "./components/InvoiceModal.vue";
import Preference from "./pages/Preference.vue";
import Meetings from "./pages/Meetings.vue";
import AllTasks from "./pages/ListAllTasks.vue";
import CustomInvoices from "./components/CustomInvoices.vue";
import AllReports from "./pages/AllReports.vue";
// import AllUsers from "./pages/ListAllUsers.vue";
import AllTimesheets from "./pages/ListAllTimesheets.vue";
import AllClients from "./pages/ListAllClients.vue";
import Admin from "./pages/Admin.vue";
import Expired from "./pages/Expired.vue";
import NoAccess from "./pages/NoAccess.vue";
import Advanced from "./pages/Advanced.vue";
import Dropdowns from "./pages/Dropdowns.vue";
import GenericList from "./components/GenericList.vue";




Vue.use(Router);

export default new Router({
  mode: "history",
  routes: [
    {
      path: "/dropdowns",
      name: "Dropdowns",
      component: Dropdowns,
      children: [
        {
          path: "/dropdowns/:routerPath",
          name: "GenericList",
          component: () => import("./components/GenericList.vue"),
          props: true,
        },
      ],
    },
    {
      path: "/manage/:routerPath",
      name: "managedropdown",
      component: CreateEntity,
      props: true,
    },
    {
      path: "/CreateEntity/:routerPath",
      name: "CreateEntity",
      component: CreateEntity,
      props: true,
    },
    {
      path: "/AllReports",
      name: "AllReports",
      component: AllReports,
    },
    {
      path: "/CustomInvoice",
      name: "CustomInvoice",
      component: InvoiceModal,
      props: true,
    },
    {
      path: "/Invoices",
      name: "Invoices",
      component: CustomInvoices,
    },
    {
      path: "/Preference",
      name: "Preference",
      component: Preference,
    },
    {
      path: "/Meetings",
      name: "Meetings",
      component: Meetings,
    },

    {
      path: "/AllTasks",
      name: "AllTasks",
      component: AllTasks,
    },
    {
      path: "/",
      redirect: "/AllTasks",
    },
    {
      path: "/",
      name: "AllTasks",
      component: AllTasks,
    },
    // {
    //   path: "/AllUsers",
    //   name: "AllUsers",
    //   component: AllUsers,
    // },
    {
      path: "/AllClients",
      name: "AllClients",
      component: AllClients,
    },
    {
      path: "/AllTimesheets",
      name: "AllTimesheets",
      component: AllTimesheets,
    },
    {
      path: "/admin",
      name: "Admin",
      component: Admin,
    },
    {
      path: "/advanced",
      name: "Advanced",
      component: Advanced,
    },
    {
      path: "/expired",
      name: "Expired",
      component: Expired,
    },
    {
      path: "/NoAccess",
      name: "NoAccess",
      component: NoAccess,
    },
    // {
    //   path: "/ManageUsers",
    //   name: "ManageUsers",
    //   component: () => import("./components/GenericList.vue"),
    //   props: true,
    // },
    // {
    //   path: "/EditTask/:task",
    //   name: "EditTask",
    //   component: EditTask,
    //   props: true,
    // },
    // {
    //   path: "/EditTimesheet/:timesheet",
    //   name: "EditTimesheet",
    //   component: EditTimesheet,
    //   props: true,
    // },

    // {
    //   path: "/settings",
    //   name: "Dropdowns",
    //   component: Dropdowns,
    //   children: [
    //     {
    //       path: "/settings/profile",
    //       name: "Profile",
    //       component: UserProfile,
    //       // props: true,
    //     },
    //     {
    //       path: "/settings/emails",
    //       name: "Emails",
    //       component: UserEmails,
    //       // props: true,
    //     },
    //   ],
    // },
    // Drop down Manager ////

    // { path: "/EditTask", name: "EditTask", component: EditTask },
  ],
  linkExactActiveClass: "active",
});
