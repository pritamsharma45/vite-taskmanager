<template>
  <div>
    <b-row>
      <b-col cols="3" class="p-0"
        ><b-button
          size="sm"
          class="m-2 font-weight-bold"
          variant="warning"
          @click="showingForm = !showingForm"
        >
          Add new task in Google Calendar
          <b-icon
            :icon="showingForm ? 'chevron-up' : 'chevron-down'"
            aria-hidden="true"
            class="text-success font-weight-bold"
          ></b-icon> </b-button
      ></b-col>
    </b-row>
    <!--    Task Form  -->
    <div v-if="showingForm">
      <h5>Task Details</h5>
      <b-form inline>
        <label class="sr-only sm" for="inline-form-input-meetingdate"
          >Date & Time</label
        >
        <b-input-group prepend="Date & Time" class="mb-2 mr-sm-2 mb-sm-0 sm">
          <input
            id="meetingdate"
            type="datetime-local"
            name="meeting"
            v-model="meetings.date_time"
            :min="new Date()"
            class="form-control"
          />
        </b-input-group>
        <label class="sr-only sm" for="inline-form-input-duration"
          >Duration</label
        >
        <b-input-group prepend="Duration" class="mb-2 mr-sm-2 mb-sm-0">
          <input
            id="duration"
            type="number"
            v-model="meetings.duration"
            class="form-control"
          />
        </b-input-group>
        <label class="sr-only" for="inline-form-input-Description">Title</label>
        <b-input-group prepend="Title" class="mb-2 mr-sm-2 mb-sm-0 col-5">
          <input
            id="Description"
            type="text"
            v-model="meetings.summary"
            class="form-control"
          />
        </b-input-group>
      </b-form>
      <b-form class="mt-2" inline>
        <label class="sr-only" for="inline-form-input-Description"
          >Description</label
        >
        <b-input-group
          prepend="Description"
          class="mb-2 mr-sm-2 mb-sm-0"
          style="width: 700px"
        >
          <input
            id="Description"
            type="text"
            v-model="meetings.description"
            class="form-control"
          />
        </b-input-group>
      </b-form>

      <b-form-row>
        <b-col cols="4">
          <b-form-group
            id="fieldset-1"
            label="Select Attendees from Clients:"
            label-for="attendees"
          >
            <b-form-select
              id="attendees"
              v-model="meetings.attendees_clients"
              text-field="client_name"
              value-field="email"
              :options="configStore.state.tables['tbl_client']"
              multiple
              :select-size="6"
            ></b-form-select>
          </b-form-group>
        </b-col>
        <b-col cols="4">
          <b-form-group
            id="fieldset-1"
            label="Select Attendees from Users:"
            label-for="attendeesusers"
          >
            <b-form-select
              id="attendeesusers"
              v-model="meetings.attendees_users"
              text-field="user"
              value-field="email"
              :options="configStore.state.tables['tbl_user']"
              multiple
              :select-size="6"
            ></b-form-select>
          </b-form-group>
        </b-col>
      </b-form-row>
      <b-button
        small
        variant="success"
        @click="createGoogleMeeting"
        class="my-2"
        >Create Task in Google Calendar</b-button
      >
    </div>
    <hr />
    <b-row>
      <b-col>
        <h5>Upcoming Tasks</h5>
      </b-col>
      <b-col>
        <b-form-group v-slot="{ ariaDescribedby }">
          <b-form-radio-group
            v-model="viewType"
            :options="[
              { text: 'Calendar View', value: true },
              { text: 'Table View', value: false },
            ]"
            :aria-describedby="ariaDescribedby"
            name="radio-inline"
          ></b-form-radio-group>
        </b-form-group>
      </b-col>
    </b-row>

    <div v-if="viewType" v-html="calendarSrc">

    </div>

    <!-- <pre>
      {{ meetings }}
    </pre> -->
    <div v-if="!viewType">
      <b-table
        striped
        hover
        :items="upcomingItems"
        :fields="fields"
        small
        :style="[
          configStore.state.tableFont === 'small'
            ? 'font-size: 0.8em'
            : 'font-size: 2.2em',
        ]"
        :sticky-header="windowHeight"
      >
        <template #cell(hangoutLink)="data">
          <b-link :href="data.value" target="_blank">Meet Link</b-link>
        </template>
        <template #cell(htmlLink)="data">
          <b-link :href="data.value ? data.value : ''" target="_blank"
            >Open in calendar</b-link
          >
        </template>
      </b-table>
    </div>
  </div>
</template>

<script>
import configStore from "../store/configuration";
export default {
  data() {
    return {
      configStore,
      showingForm: false,
      viewType: true,
      calendarSrc: "",
      meetings: {
        attendees_clients: [],
        attendees_users: [],
        date_time: new Date(),
        duration: "",
        summary: "",
        description: "",
      },
      fields: [
        {
          key: "created",
          label: "Task Date",
          formatter: (value) => {
            try {
              const date = new Date(value);
              return date.toLocaleString();
            } catch (error) {
              return "";
            }
          },
        },
        {
          key: "summary",
          label: "Task Title",
        },
        {
          key: "hangoutLink",
          label: "Task Link ",
        },
        {
          key: "htmlLink",
          label: "Calendar Link",
        },
      ],
      upcomingItems: [],
      configStore: configStore,
      disabled: false,
      isSaving: false,
      model: {},
      showSpinner: false,
      iData: {},
    };
  },
  computed: {
    allAttendees: function () {
      let arr = [
        ...this.meetings.attendees_clients,
        ...this.meetings.attendees_users,
      ];
      arr = arr.map((a) => {
        return { email: a };
      });
      return arr;
    },
  },
  mounted() {
    //  Get All Upcoming Tasks
    // this.model = this.schema.model();
    this.calendarSrc = configStore.state.prefs.embed_code_calendar || "";
    this.getUpcomingEvents();
    this.iData = JSON.parse(JSON.stringify(this.meetings));
  },
  methods: {
    createGoogleMeeting() {
      this.meetings.attendees = this.allAttendees;
      this.meetings.summary = "Task Manager : " + this.meetings.summary;
      google.script.run
        .withSuccessHandler((res) => {
          console.log(res);
          const { created, summary, htmlLink, hangoutLink } = res;

          this.upcomingItems.unshift({
            created: created,
            summary: summary,
            htmlLink: htmlLink,
            hangoutLink: hangoutLink,
          });
          this.meetings = this.iData;
        })
        .withFailureHandler((error) => {
          console.log(error);
        })
        .createGoogleMeeting(this.meetings);
    },
    getUpcomingEvents() {
      google.script.run
        .withSuccessHandler((res) => {
          console.log(res);

          this.upcomingItems = res;
        })
        .withFailureHandler((error) => {
          console.log(error);
        })
        .listNext10Events();
    },

    getPassedEvents() {},
  },
};
</script>

<style>
</style>