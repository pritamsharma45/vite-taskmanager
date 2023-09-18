<template>
  <div>
    <b-button class="py-0 mx-2" variant="success" v-b-modal.guide-getstarted>
      Please read this User Guide before using this Application
    </b-button>
    <b-modal id="guide-getstarted" scrollable title="Get Started">
      <p>
        After you have successfully deployed the app you will need to clear out
        all the demo records. Clearing old records will delete all the existing
        Clients, Tasks, Timesheets, Invoice records, Users & Managers.
      </p>
      <p>Then you need to navigate to Configuration > Manage Dropdowns.</p>
      <p>
        Edit all the existing Task Types and Activity types if needed. Add few
        clients.
      </p>
      <p>Then you need to navigate to Configuration > Manage Dropdowns.</p>
      <p class="text-danger">
        You must add first a manager(s) and then a user(s) before you will be
        able to create any client task.
      </p>
    </b-modal>
  </div>
</template>