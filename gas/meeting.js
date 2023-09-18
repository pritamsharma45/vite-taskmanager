/**
 * Creates an event in the user's default calendar.
 */
function createEvent() {
  var calendarId = "primary";
  var start = getRelativeDate(1, 12);
  var end = getRelativeDate(1, 13);
  var event = {
    summary: "Lunch Meeting",
    location: "The Deli",
    description: "To discuss our plans for the presentation next week.",
    start: {
      dateTime: start.toISOString(),
    },
    end: {
      dateTime: end.toISOString(),
    },
    attendees: [{ email: "alice@example.com" }, { email: "bob@example.com" }],
    // Red background. Use Calendar.Colors.get() for the full list.
    colorId: 11,
  };
  event = Calendar.Events.insert(event, calendarId);
  Logger.log("Event ID: " + event.id);
}
function createEvent(dateISO, duration) {
  var calendarId = "primary";
  var start = dateISO;
  var end = getRelativeDateTime(start, duration);
  var event = {
    summary: "Lunch Meeting",
    location: "The Deli",
    description: "To discuss our plans for the presentation next week.",
    start: {
      dateTime: start.toISOString(),
    },
    end: {
      dateTime: end.toISOString(),
    },
    attendees: [{ email: "alice@example.com" }, { email: "bob@example.com" }],
    // Red background. Use Calendar.Colors.get() for the full list.
    colorId: 11,
  };
  event = Calendar.Events.insert(event, calendarId);
  Logger.log("Event ID: " + event.id);
}

/**
 * Helper function to get a new Date object relative to the current date.
 * @param {number} daysOffset The number of days in the future for the new date.
 * @param {number} hour The hour of the day for the new date, in the time zone
 *     of the script.
 * @return {Date} The new date.
 */
function getRelativeDate(daysOffset, hour) {
  var date = new Date();
  date.setDate(date.getDate() + daysOffset);
  date.setHours(hour);
  date.setMinutes(0);
  date.setSeconds(0);
  date.setMilliseconds(0);
  return date;
}
/**
 * Helper function to get a new Date object relative to the current date.
 * @param {number} daysOffset The number of days in the future for the new date.
 * @param {number} hour The hour of the day for the new date, in the time zone
 *     of the script.
 * @return {string} The date string in ISO format.
 */
function getRelativeDateTime(date, duration) {
  const minutes = (duration % 1) * 60;
  const hrs = Math.floor(duration);
  var date = new Date();

  date.setHours(date.getHours() + hrs);
  date.setMinutes(date.getMinutes() + minutes);
  date.setSeconds(0);
  date.setMilliseconds(0);
  return date.toISOString();
}

const createGoogleMeeting = (meetingObj) => {
  // The default calendar where this meeting should be created
  const calendarId = "primary";
  const duration = meetingObj.duration * 60;
  const eventStartDate = new Date(meetingObj.date_time);

  // Set the meeting duration to 45 minutes
  const eventEndDate = new Date(eventStartDate.getTime());
  eventEndDate.setMinutes(eventEndDate.getMinutes() + duration);

  const getEventDate = (eventDate) => {
    // Dates are computed as per the script's default timezone
    const timeZone = Session.getScriptTimeZone();

    // Format the datetime in `full-date T full-time` format
    return {
      timeZone,
      dateTime: Utilities.formatDate(
        eventDate,
        timeZone,
        "yyyy-MM-dd'T'HH:mm:ss"
      ),
    };
  };

  // Email addresses and names (optional) of meeting attendees
  // const meetingAttendees = [
  //   {
  //     displayName: "Pritam Sharma",
  //     email: "sharma.pritam311@gmail.com",
  //     responseStatus: "accepted",
  //   },
  //   { email: "pritamiitian@gmail.com", responseStatus: "needsAction" },
  //   // { email: 'student2@school.edu', responseStatus: 'needsAction' },
  //   // {
  //   //   displayName: 'Angus McDonald',
  //   //   email: 'assistant@school.edu',
  //   //   responseStatus: 'tentative',
  //   // },
  // ];

  const meetingAttendees = meetingObj.attendees;

  // Generate a random id
  const meetingRequestId = Utilities.getUuid();

  // Send an email reminder a day prior to the meeting and also
  // browser notifications15 minutes before the event start time
  const meetingReminders = [
    {
      method: "email",
      minutes: 24 * 60,
    },
    {
      method: "popup",
      minutes: 15,
    },
  ];

  let evt = {
    summary: meetingObj.summary,
    description: meetingObj.description,
    location: "",
    attendees: meetingAttendees,
    conferenceData: {
      createRequest: {
        requestId: meetingRequestId,
        conferenceSolutionKey: {
          type: "hangoutsMeet",
        },
      },
    },
    start: getEventDate(eventStartDate),
    end: getEventDate(eventEndDate),
    guestsCanInviteOthers: false,
    guestsCanModify: false,
    status: "confirmed",
    reminders: {
      useDefault: false,
      overrides: meetingReminders,
    },
  };
  const event = Calendar.Events.insert(evt, calendarId, {
    conferenceDataVersion: 1,
  });
  return event;
  // const { hangoutLink, htmlLink } = Calendar.Events.insert(evt, calendarId, {
  //   conferenceDataVersion: 1,
  // });

  // Logger.log("Launch meeting in Google Meet: %s", hangoutLink);
  // Logger.log("Open event inside Google Calendar: %s", htmlLink);
};

function createEventInCalendar(client, task, dtString) {
  var description = `Task: ${task} | ${client} `;

  try {
    var event = CalendarApp.getDefaultCalendar().createAllDayEvent(
      description,
      new Date(dtString)
    );

    return true;
  } catch (error) {
    return false;
  }
  // Logger.log("Event ID: " + event.getId());
}
//  Get Upcoming Events
/**
 * Lists the next 10 upcoming events in the user's default calendar.
 */
function listNext10Events() {
  var calendarId = "primary";
  var arr = [];
  var now = new Date();
  var events = Calendar.Events.list(calendarId, {
    timeMin: now.toISOString(),
    singleEvents: true,
    orderBy: "startTime",
    maxResults: 30,
  });
  if (events.items && events.items.length > 0) {
    for (var i = 0; i < events.items.length; i++) {
      var event = events.items[i];
      arr.push({
        created: event.created,
        summary: event.summary,
        htmlLink: event.htmlLink,
        hangoutLink: event.hangoutLink,
      });
      if (event.start.date) {
        // All-day event.
        var start = new Date(event.start.date);
        Logger.log("%s (%s)", event.summary, start.toLocaleDateString());
      } else {
        var start = new Date(event.start.dateTime);
        Logger.log("%s (%s)", event.summary, start.toLocaleString());
      }
    }
  } else {
    Logger.log("No events found.");
  }
  return arr;
}
