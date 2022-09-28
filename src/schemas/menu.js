export default {
  menus: [
    {
      name: "Project Overview",
      icon: "list-task",
      routerLink: "/ProjectOverviewCreate",
      active: true,
    },
    {
      name: "Profit Sheet",
      icon: "list-task",
      routerLink: "/Profits",
      active: false,
    },
    {
      name: "Job Costing Sheet",
      icon: "list-task",
      routerLink: "/JobCosting",
      active: false,
    },
    {
      name: "Time Log",
      icon: "list-task",
      menus: [
        {
          name: "Daily Log",
          icon: "list-task",
          routerLink: "/Timelog",
          active: false,
        },
        {
          name: "Report View",
          icon: "list-task",
          routerLink: "/TimelogReportView",
          active: false,
        },
      ],
    },
    {
      name: "Accounts",
      icon: "list-task",
      menus: [
        {
          name: "Customer Payments",
          icon: "list-task",
          routerLink: "/Accounts/CustomerPayments",
          active: false,
        },
        {
          name: "Supplier Payments",
          icon: "list-task",
          routerLink: "/Accounts/SupplierPayments",
          active: false,
        },
        {
          name: "Homeline Expenses",
          icon: "list-task",
          routerLink: "/Accounts/HomelineExpenses",
          active: false,
        },
      ],
    },
    {
      name: "PO Request",
      icon: "list-task",
      menus: [
        {
          name: "ETCS PO Request",
          icon: "list-task",
          routerLink: "/PORequest/ETCS",
          active: false,
        },
        {
          name: "Customer PO Request",
          icon: "list-task",
          routerLink: "/PORequest/Customer",
          active: false,
        },
      ],
    },
    {
      name: "Reimbursement",
      icon: "list-task",
      menus: [
        {
          name: "Reimbursement USA",
          icon: "list-task",
          routerLink: "/Reimbursement/USA",
          active: false,
        },
        {
          name: "Reimbursement India",
          icon: "list-task",
          routerLink: "/Reimbursement/India",
          active: false,
        },
        {
          name: "Reimbursement Fuel",
          icon: "list-task",
          routerLink: "/Reimbursement/Fuel",
          active: false,
        },
      ],
    },
    {
      name: "Shipments",
      icon: "list-task",
      menus: [
        {
          name: "Parts Shipments Records",
          icon: "list-task",
          routerLink: "/Shipments/parts",
          active: false,
        },
        {
          name: "Material Shipments Records",
          icon: "list-task",
          routerLink: "/Shipments/material",
          active: false,
        },
        {
          name: "Container Shipments Records",
          icon: "list-task",
          routerLink: "/Shipments/die",
          active: false,
        },
        {
          name: "Miscellaneous Shipments Records",
          icon: "list-task",
          routerLink: "/Shipments/misc",
          active: false,
        },
      ],
    },

    {
      name: "Dropdowns",
      icon: "list-task",
      menus: [
        {
          name: "Customers",
          icon: "list-task",
          routerLink: "/DropdownsCustomer",
          active: false,
        },
        {
          name: "Suppliers",
          icon: "list-task",
          routerLink: "/DropdownsSupplier",
          active: false,
        },
        {
          name: "Works",
          icon: "list-task",
          routerLink: "/DropdownsWorks",
          active: false,
        },
        {
          name: "Users",
          icon: "list-task",
          routerLink: "/DropdownsUser",
          active: false,
        },
        {
          name: "Items",
          icon: "list-task",
          routerLink: "/DropdownsItems",
          active: false,
        },
        {
          name: "Vehicles",
          icon: "list-task",
          routerLink: "/DropdownsVehicles",
          active: false,
        },
      ],
    },
  ],
};
