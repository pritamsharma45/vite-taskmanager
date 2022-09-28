import Vue from "vue";
import Router from "vue-router";
import SmartForm from "./components/SmartForm.vue";
import SmartTable from "./components/SmartTable.vue";
import SmartDetail from "./components/SmartDetail.vue";

// Schemas

//  Accounts

import accounts_customerPayments from "./schemas/accounts_customerPayments";
import accounts_homelineexpenses from "./schemas/accounts_homelineexpenses";
import accounts_supplierPayments from "./schemas/accounts_supplierPayments";
import etcs_po_request from "./schemas/etcs_po_request";
import customer_po_request from "./schemas/customer_po_request";

//  Reimbursement

import reimbursement_usa from "./schemas/reimbursement_usa";
import reimbursement_india from "./schemas/reimbursement_india";
import reimbursement_fuel from "./schemas/reimbursement_fuel";

//  Shipments

import shipments_parts from "./schemas/shipments_part";
import shipments_material from "./schemas/shipments_material";
import shipments_die from "./schemas/shipments_die";
import shipments_misc from "./schemas/shipments_misc";

// Dropdowns

import dropdowns_customer from "./schemas/dropdowns_customer";
import dropdowns_supplier from "./schemas/dropdowns_supplier";
import dropdowns_user from "./schemas/dropdowns_user";
import dropdowns_works from "./schemas/dropdowns_works";
import dropdowns_items from "./schemas/dropdowns_items";
import dropdowns_vehicles from "./schemas/dropdowns_vehicles";
import timelog from "./schemas/timelog";
import TimelogCreate from "./pages/TimelogCreate.vue";
import TimelogReportView from "./pages/TimelogReportView.vue";
import projectoverview from "./schemas/projectoverview";

// import ProjectOverviewCreate2 from "./pages/ProjectOverviewCreate2.vue";
import Profits from "./pages/Profits.vue";
import JobCosting from "./pages/jobCosting.vue";

Vue.use(Router);

export default new Router({
  routes: [
    { path: "/TimelogCreate", name: "TimelogCreate", component: TimelogCreate },
    {
      path: "/TimelogReportView",
      name: "TimelogReportView",
      component: TimelogReportView,
    },
    { path: "/Form", name: "Form", component: SmartForm, props: true },
    {
      path: "/ProjectOverviewCreate",
      name: "ProjectOverview",
      component: SmartTable,
      props: { schema: projectoverview },
    },
    {
      path: "/Profits",
      name: "Profits",
      component: Profits,
    },
    {
      path: "/JobCosting",
      name: "JobCosting",
      component: JobCosting,
    },

    // Accounts
    {
      path: "/Accounts/CustomerPayments",
      name: "CustomerPayments",
      component: SmartTable,
      props: { schema: accounts_customerPayments },
    },
    {
      path: "/Accounts/SupplierPayments",
      name: "SupplierPayments",
      component: SmartTable,
      props: { schema: accounts_supplierPayments },
    },
    {
      path: "/Accounts/HomelineExpenses",
      name: "HomelineExpense",
      component: SmartTable,
      props: { schema: accounts_homelineexpenses },
    },
    // PO Request
    {
      path: "/PORequest/ETCS",
      name: "POETCS",
      component: SmartTable,
      props: { schema: etcs_po_request },
    },
    {
      path: "/PORequest/Customer",
      name: "POCustomer",
      component: SmartTable,
      props: { schema: customer_po_request },
    },
    //  Reimbursement
    {
      path: "/Reimbursement/USA",
      name: "ReimbursementUSA",
      component: SmartTable,
      props: { schema: reimbursement_usa },
    },
    {
      path: "/Reimbursement/India",
      name: "ReimbursementIndia",
      component: SmartTable,
      props: { schema: reimbursement_india },
    },
    {
      path: "/Reimbursement/Fuel",
      name: "ReimbursementFuel",
      component: SmartTable,
      props: { schema: reimbursement_fuel },
    },
    //  Shipments
    {
      path: "/Shipments/parts",
      name: "Shipments",
      component: SmartTable,
      props: { schema: shipments_parts },
    },
    {
      path: "/Shipments/material",
      name: "Shipments",
      component: SmartTable,
      props: { schema: shipments_material },
    },
    {
      path: "/Shipments/die",
      name: "Shipments",
      component: SmartTable,
      props: { schema: shipments_die },
    },
    {
      path: "/Shipments/misc",
      name: "Shipments",
      component: SmartTable,
      props: { schema: shipments_misc },
    },

    // Dropdowns
    {
      path: "/DropdownsCustomer",
      name: "DropdownsCustomer",
      component: SmartTable,
      props: { schema: dropdowns_customer },
    },
    {
      path: "/DropdownsSupplier",
      name: "DropdownsSupplier",
      component: SmartTable,
      props: { schema: dropdowns_supplier },
    },
    {
      path: "/DropdownsUser",
      name: "DropdownsUser",
      component: SmartTable,
      props: { schema: dropdowns_user },
    },
    {
      path: "/DropdownsWorks",
      name: "DropdownsWorks",
      component: SmartTable,
      props: { schema: dropdowns_works },
    },
    {
      path: "/DropdownsItems",
      name: "DropdownsItems",
      component: SmartTable,
      props: { schema: dropdowns_items },
    },
    {
      path: "/DropdownsVehicles",
      name: "DropdownsVehicles",
      component: SmartTable,
      props: { schema: dropdowns_vehicles },
    },

    // All Records
    {
      path: "/Record/ProjectOverview",
      name: "ProjectOverview",
      component: SmartTable,
      props: { schema: projectoverview },
    },
    {
      path: "/Timelog",
      name: "Timelog",
      component: SmartTable,
      props: { schema: timelog },
    },
    {
      path: "/Record/CustomerPayments",
      name: "CustomerPayments",
      component: SmartTable,
      props: { schema: accounts_customerPayments },
    },
    {
      path: "/Detail",
      name: "SmartDetail",
      component: SmartDetail,
      props: true,
    },
  ],
  linkExactActiveClass: "active",
});
