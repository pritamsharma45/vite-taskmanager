function clearAll() {
  var tableNames = [
    "tbl_client",
    "tbl_task",
    "tbl_client_info",
    "tbl_client_notes",
    "tbl_user",
    "tbl_timesheet",
    "tbl_invoice",
    "tbl_custom_invoice",
    "tbl_manager",
    // "tbl_activity_type",
    // "tbl_task_type",
    // "tbl_client_type",
  ];
  ClearInitialData(tableNames);
}

function ClearInitialData(tableNames) {
  var namedRanges = SpreadsheetApp.getActiveSpreadsheet().getNamedRanges();
  namedRanges.forEach((nr) => {
    Logger.log(nr.getName());
    if (tableNames.includes(nr.getName())) {
      nr.getRange().offset(1, 0).clearContent();
    }
  });
  return true;
}
function SaveDataToScriptProperties() {
  var namedRanges = SpreadsheetApp.getActiveSpreadsheet().getNamedRanges();
  var Direction = SpreadsheetApp.Direction;
  /// Save Current Data to Script Properties before clearing it ///
  var tables = {};
  namedRanges.forEach((nr) => {
    var rng = nr.getRange();
    var lRow = rng.getCell(1, 1).getNextDataCell(Direction.DOWN).getRow();
    var tableName = nr.getName();
    var dataRng = rng.offset(1, 0, lRow - 1);
    var vals = dataRng.getValues();
    tables[tableName] = vals;
  });
  var data = JSON.stringify(tables);
  var scriptProperties = PropertiesService.getScriptProperties();
  scriptProperties.setProperties({
    allRecords: data,
  });
}

function DeleteAllProperties() {
  PropertiesService.getScriptProperties().deleteAllProperties();
  PropertiesService.getUserProperties().deleteAllProperties();
}

function ReloadDefaultData(tableNames) {
  var namedRanges = SpreadsheetApp.getActiveSpreadsheet().getNamedRanges();
  var scriptProperties = PropertiesService.getScriptProperties();
  //  Logger.log(scriptProperties.getProperties()['allRecords']);
  var allTables = JSON.parse(scriptProperties.getProperties()["allRecords"]);
  // Logger.log(allTables);
  var Direction = SpreadsheetApp.Direction;
  namedRanges.forEach((nr) => {
    if (tableNames.includes(nr.getName())) {
      var rng = nr.getRange();
      // var lRow = rng
      //   .getCell(1, 1)
      //   .getNextDataCell(Direction.DOWN)
      //   .getRow();

      var data = allTables[nr.getName()];
      // Logger.log(data);

      var dataRng = rng.offset(1, 0, data.length, rng.getNumColumns());
      // Logger.log(dataRng.getA1Notation());
      dataRng.setValues(data);
    }
  });
  return true;
}
function getPreference() {
  var scriptProperties = PropertiesService.getScriptProperties();
  if (scriptProperties.getProperty("preference") == null) {
    Logger.log("Null");
    return false;
  } else {
    return scriptProperties.getProperty("preference");
  }
}

function setPreference(prefs) {
  var scriptProperties = PropertiesService.getScriptProperties();
  scriptProperties.setProperty("preference", prefs);
}

function getLicenseKey(id) {
  let key = id.split("@")[0];
  let str = key.replace(/[^a-zA-Z]/gm, "");
  const str1 = str.slice(2).split("").reverse().join("");
  const str2 = str.slice(-2).split("").reverse().join("");
  const str3 = str.slice(2, 5).split("").reverse().join("");
  str = str2 + str3 + str1;

  let result = "";
  let charcode = 0;
  for (let i = 0; i < str.length; i++) {
    charcode = str[i].charCodeAt() + 6;
    result += String.fromCharCode(charcode);
  }
  return result;
}

function getAboutApp() {
  let scriptProperties = PropertiesService.getScriptProperties();
  let about = scriptProperties.getProperty("about");
  if (about == null) {
    about = {};
    about.trial_start_date = new Date();
    about.owner = GetOwner();
    about.app_mode = "Under Trial";
    setAboutApp(about);
  } else {
    about = JSON.parse(about);
  }
  return about;
}

function setAboutApp(obj) {
  let scriptProperties = PropertiesService.getScriptProperties();
  return scriptProperties.setProperty("about", JSON.stringify(obj));
}
// function CheckAppStatus() {

//   let scriptProperties = PropertiesService.getScriptProperties();
//   let o = scriptProperties.getProperty("app_status");
//   if (o !== null) {
//     o = JSON.parse(o);
//     const { aap_mode, trial_start_date, owner } = o;
//     var today = new Date();
//     today = moment(today);
//     var dayDiff = today.diff(moment(trial_start_date), "days");
//     if (dayDiff > 30) {
//       scriptProperties.setProperty("app_mode", "Trial Expired");
//     }
//     o.app_mode = "Trial Expired";
//     o.owner = GetOwner();
//   } else {
//     const appStatus = {};
//     appStatus.app_mode = "Under Trial";
//     appStatus.owner = '',
//   }

//   if (scriptProperties.getProperty("app_mode") == null) {
//     scriptProperties.setProperty("app_mode", "Under Trial");
//     var trial_start_date = new Date();
//     scriptProperties.setProperty("trial_start_date", trial_start_date);
//     o.app_mode = scriptProperties.getProperty("app_mode");
//     o.trial_start_date = trial_start_date;
//   } else {
//     var today = new Date();
//     today = moment(today);
//     o.trial_start_date = scriptProperties.getProperty("trial_start_date");
//     var dayDiff = today.diff(moment(o.trial_start_date), "days"); // 1
//     Logger.log(dayDiff);
//     if (dayDiff > 20) {
//       scriptProperties.setProperty("app_mode", "Trial Expired");
//     }
//     o.app_mode = scriptProperties.getProperty("app_mode");
//   }

//   if (scriptProperties.getProperty("owner") == null) {
//     const owner = GetOwner();
//     scriptProperties.setProperty("owner", owner);
//     o.owner = owner;
//   } else {
//     o.owner = scriptProperties.getProperty("owner");
//   }

//   o.secret = getAppSecretKey("license-key");
//   o.loggedUserId = Session.getActiveUser().getEmail();
//   Logger.log(o);
//   return o;
// }

function DELETEPROPERTIES() {
  let scriptProperties = PropertiesService.getScriptProperties();
  const keys = ["app_mode", "trial_start_date", "owner"];
  keys.forEach((key) => {
    scriptProperties.deleteProperty(key);
  });
}
// function getAppSecretKey(id) {
//   return new Lux("nr_app_data", "key").init().findById(id);
// }
// function setAppSecretAtId(secret) {
//   return new Lux("nr_app_data", "key")
//     .init()
//     .updateAttributes({ key: "license-key", value: secret });
// }

function MakeItLicensed() {
  let scriptProperties = PropertiesService.getScriptProperties();
  const about = {};
  about.trial_start_date = "NA";
  about.owner = GetOwner();
  about.app_mode = "Licensed";
  scriptProperties.setProperty("about", JSON.stringify(about));
  return about;
}
function GetOwner() {
  let scriptProperties = PropertiesService.getScriptProperties();
  let owner = scriptProperties.getProperty("owner");
  if (owner != null) return owner;

  try {
    const file = DriveApp.getFileById(
      SpreadsheetApp.getActiveSpreadsheet().getId()
    );
    scriptProperties.setProperty("owner");
    return file.getOwner().getEmail();
  } catch (e) {
    Logger.log("Could not get owner");
    return null;
  }
}
