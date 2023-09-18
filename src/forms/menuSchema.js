export default {
  menus: [
    {
      name: "Task Manager",
      icon: "list-task",
      routerLink: "/AllTasks",
    },
    {
      name: "Client Manager",
      icon: "person-lines-fill",
      routerLink: "/AllClients",
    },
    {
      name: "Timesheet Manager",
      icon: "person-lines-fill",
      routerLink: "/AllTimesheets",
    },
    {
      name: "Invoices",
      icon: "person-lines-fill",
      routerLink: "/Invoices",
    },
    {
      name: "Configuration",
      icon: "alarm-fill",
      subMenus: [
        {
          name: "Manage Dropdowns",
          icon: "gear",
          routerLink: { name: "Dropdowns" },
        },
        {
          name: "Manage Preferences",
          icon: "gear",
          routerLink: { name: "Preference" },
        },
        {
          name: "Advanced",
          icon: "gear",
          routerLink: { name: "Advanced" },
        },
      ],
    },
    {
      name: "Reporting",
      icon: "person-lines-fill",
      routerLink: "/AllReports",
    },
    {
      name: "Meetings",
      icon: "person-lines-fill",
      routerLink: "/Meetings",
    },
  ],
};
