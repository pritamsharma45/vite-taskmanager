var _ = LodashGS.load();

function doGet() {
  return HtmlService.createTemplateFromFile("index")
    .evaluate()
    .setFaviconUrl("https://heartstchr.github.io/img/borl.png")
    .setTitle("ETCS App")
    .addMetaTag("viewport", "width=device-width, initial-scale=1");
}

function includes(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}

function getLoggedInUser() {
  return Session.getActiveUser().getEmail();
}

function saveInDrive(f) {
  const blob = Utilities.newBlob(f, "image/jpeg", "some-name");
  const file = DriveApp.getFolderById("root").createFile(blob);
  return file.getUrl();
}
function saveFile(fileObjects) {
  fileObjects.forEach((o) => {
    var blob = Utilities.newBlob(
      Utilities.base64Decode(o.data),
      o.mimeType,
      o.fileName
    );
    DriveApp.createFile(blob).getId();
  });

  // for (const [k, v] of Object.entries(fileObjects)) {
  //   let arr = [];
  //   v.forEach((o) => {
  //     var blob = Utilities.newBlob(
  //       Utilities.base64Decode(o.data),
  //       o.mimeType,
  //       o.fileName
  //     );
  //     DriveApp.createFile(blob).getId();
  //     arr.push(DriveApp.createFile(blob).getId());
  //   });
  //   o[k] = arr;
  // }

  // var blob = Utilities.newBlob(
  //   Utilities.base64Decode(obj.data),
  //   obj.mimeType,
  //   obj.fileName
  // );
  // return o;
}

function saveFile2(obj) {
  // const FOLDER_ID = "138xQI8p87KZk0vDe2qz_ExBiVJe1Dzfp";
  const FOLDER_ID = "1-1NjFcvFik87CiXnkv-M3_sV3ncxAYeE"; //Gurneet ID
  var blob = Utilities.newBlob(
    Utilities.base64Decode(obj.data),
    obj.mimeType,
    obj.fileName
  );
  var folder = DriveApp.getFolderById(FOLDER_ID);
  return folder.createFile(blob).getUrl();
  // return DriveApp.createFile(blob).getUrl();
}

function getStringifiedTables(tableNames) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var o = {};
  tableNames.forEach((name) => {
    var rng = ss.getRangeByName(name);
    var vals = trimRangeRows(rng).getValues();
    o[name] = vals;
  });

  return o;
}

function GetTableDataSource(sheetName) {
  Tamotsu.initialize();
  var Agent;
  var tableDataSource = {};
  Agent = Tamotsu.Table.define({ sheetName: sheetName, idColumn: "id" });
  var dataTable = Agent.all();
  var fields = Object.keys(Agent.first());
  fields.splice(0, 1);

  cols = _.map(fields, function (el) {
    var obj = {};
    obj.field = el;
    obj.label = _.startCase(el);
    return obj;
  });
  tableDataSource.columns = cols;
  tableDataSource.items = dataTable.reverse();
  return tableDataSource;
}

function LogData() {
  Tamotsu.initialize();
  var Agent;
  Agent = Tamotsu.Table.define({ sheetName: "PRF_Active" });
  Logger.log(Agent.first());
}

// function createPRF(formDataObject) {
//   var Agent;
//   Tamotsu.initialize();
//   Agent = Tamotsu.Table.define({ sheetName: "PRF_Active", idColumn: "id" });
//   var srfEntry = new Agent(formDataObject);
//   Agent.create(srfEntry);
//   return true;
// }

function addEntry(formDataObject, formName) {
  var now = JSON.stringify(new Date());
  var Agent;
  Tamotsu.initialize();
  if (formDataObject.ID) {
    formDataObject.ID = Number(formDataObject.ID);
  }
  try {
    Agent = Tamotsu.Table.define({ sheetName: formName, idColumn: "id" });
    formDataObject.created_date = now;
    var srfEntry = new Agent(formDataObject);
    // Agent.createOrUpdate(srfEntry);
    return Agent.createOrUpdate(srfEntry);
  } catch (error) {
    console.log(error);
    return false;
  }
}

function commitFilesToDB(sheetName, id, formDataObject) {
  var Agent;
  Tamotsu.initialize();
  Agent = Tamotsu.Table.define({ sheetName: sheetName, idColumn: "id" });
  var row = Agent.find(id);
  return row.updateAttributes(formDataObject);
}

function deleteEntryByID(id, tableName) {
  var Agent;
  Tamotsu.initialize();

  try {
    Agent = Tamotsu.Table.define({ sheetName: tableName, idColumn: "id" });
    Agent.find(id).destroy();
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
}

function GetRecordById(id, tableName) {
  Tamotsu.initialize();
  var Agent;
  Agent = Tamotsu.Table.define({ sheetName: tableName, idColumn: "id" });
  return Agent.find(id);
}
function UpdateAttributes(sheetName, id, updateObject) {
  var Agent;
  Tamotsu.initialize();
  Agent = Tamotsu.Table.define({ sheetName: sheetName, idColumn: "id" });
  var row = Agent.find(id);
  return row.updateAttributes(updateObject);
}
// function getPRFRecords(sheetName) {
//   Tamotsu.initialize();
//   try {
//     var tbl = Tamotsu.Table.define({
//       sheetName: sheetName,
//       idColumn: "id",
//     }).all();
//     return tbl;
//   } catch (error) {
//     return false;
//   }
// }

function getFormNumber(formName) {
  var Agent;
  Tamotsu.initialize();
  Agent = Tamotsu.Table.define({ sheetName: formName, idColumn: "id" });
  var formNumber = Agent.max("Form_Number");
  Logger.log(formNumber); //=> 300
  return formNumber;
}

function LogData() {
  Tamotsu.initialize();
  var Agent1;
  Agent1 = Tamotsu.Table.define({ sheetName: "PRF_Active", idColumn: "id" });
  Logger.log(Agent1.first());
}

function SendWeeklyTimeLogs() {
  // const FOLDER_ID = "1dY0AWO9KcZzfh76RS8A9ZRVy-7flse_2";
  const FOLDER_ID = "1-6NOVJOTgy9rVgVvL_wsjiKPVWsi54z2"; // Gurneet ID
  // const TO_RECEPIENTS = "notifications.borl@gmail.com";
  const TO_RECEPIENTS = "priya@etcsinc.com";
  const TITLE = "ETCS Web App";

  let jsonArray = NamedRangeToJSON("tbl_TimeLog");
  var arr = [];
  jsonArray = jsonArray.filter((row) => {
    return (
      dateDiff(new Date().getTime(), new Date(row.created_date).getTime()) < 10
    );
  });
  // Logger.log(jsonArray);
  const userTable = indexedTable("tbl_Users", "id", "model");
  // Logger.log(userTable);
  jsonArray.forEach((row) => {
    const { job_entries, date, user } = JSON.parse(row.model);
    job_entries.forEach((entry) => {
      entry.date = date;
      entry.user = JSON.parse(userTable[Number(user)])["name"];
      arr.push(entry);
    });
  });
  // Logger.log(arr[0]);
  // Logger.log(Object.keys(arr[0]));
  var header = [];
  for (const [k, v] of Object.entries(arr[0])) {
    header.push(humanize(k));
  }

  arr = JSONToArray(arr);
  arr.unshift(header);
  //  Create New File
  var dt = new Date().toLocaleString("en-US");
  var folder = DriveApp.getFolderById(FOLDER_ID);
  var ss = SpreadsheetApp.create("DailyLogsOverWeek - " + dt);
  var sht = ss.getSheetByName("Sheet1");
  var rng = sht.getRange(2, 2, arr.length, arr[0].length);
  rng.setValues(arr);

  //  Move File
  DriveApp.getFileById(ss.getId()).moveTo(folder);
  //  Send Mail
  var attachment = DriveApp.getFileById(ss.getId());

  GmailApp.sendEmail(
    TO_RECEPIENTS,
    "DailyLogsOverWeek - " + dt,
    "drive.google.com/open?id=" + ss.getId(),
    { attachments: [attachment], name: TITLE }
  );
}
function sendMail_(model, files = {}, mailOptions = {}, subject, message) {
  if (!_.isEmpty(mailOptions)) {
    message = mailOptions.line1 + message;
  }
  if (_.isEmpty(files)) {
    // Logger.log("No Files");
  } else {
    message += "<p><b>" + "Files" + " : " + "</b></p>";

    for (k in files) {
      message += "<p>" + " " + humanize(k) + "</p>";
      const filesArray = files[k];
      filesArray.forEach((file, index) => {
        message +=
          "<p><b>" +
          "   " +
          (index + 1) +
          " : " +
          "</b>" +
          "<a href=" +
          file +
          ">" +
          file +
          "</a></p>";
      });
    }
  }

  if (!_.isEmpty(mailOptions)) {
    let text = `
    
    Thanks & Regards,\n
    ${mailOptions.requestee}`;
    message += text;
    // message += mailOptions.line2;
  }
  Logger.log(message);
  MailApp.sendEmail({
    to: mailOptions.to.join(","),
    cc: mailOptions.cc.join(","),
    subject: subject,
    htmlBody: message,
  });
}

function sendMail(tableName, model, id, mailOptions, subject, message) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sht = ss.getSheetByName(tableName);
  // var model = JSON.parse(sht.getRange('B5').getValue());
  var files = GetRecordById(id, tableName).files;
  files = files != "" ? JSON.parse(files) : {};
  // var files = JSON.parse(sht.getRange('D5').getValue());
  Logger.log(model);
  sendMail_(model, files, mailOptions, subject, message);

  return true;
}

function sendHtmlMail(htmlBody) {
  MailApp.sendEmail({
    to: "notifications.borl@gmail.com",
    cc: "pritamiitian@gmail.com",
    subject: "HTML Body Mail",
    htmlBody: htmlBody,
  });
}

// function GetTablesInPRFEntries(form_number) {
//   Tamotsu.initialize();
//   var Agent;
//   Agent = Tamotsu.Table.define({
//     sheetName: "PRF_All_Records",
//     idColumn: "id",
//   });
//   var row = Agent.where({ Form_Number: form_number }).all()[0];
//   var obj = {};
//   var tbls = {};
//   obj.goods_description = JSON.parse(row.goods_description);
//   obj.works_description = JSON.parse(row.works_description);
//   obj.packing_description = JSON.parse(row.packing_description);

//   var tbl_columns = {};
//   const array_of_tbl_name = Object.keys(obj);
//   array_of_tbl_name.forEach((tbl_name) => {
//     // Logger.log("tbaleName:", tbl_name);
//     // var columns_array = Object.keys(obj[tbl_name][0]);
//     var columns_array = [];

//     for (var i in obj[tbl_name][0]) {
//       columns_array.push(i);
//     }

//     // Logger.log(columns_array);
//     columns_array = columns_array.map((n) => {
//       var o = {};
//       o.label = _.startCase(n.toString());
//       o.field = n;
//       return o;
//     });
//     // Logger.log(columns_array);

//     tbl_columns[tbl_name] = columns_array;
//   });

//   // Logger.log(tbl_columns);

//   tbls.data = obj;
//   tbls.columns = tbl_columns;

//   return tbls;
// }

// function GetTablesInSRFEntries(form_number) {
//   Tamotsu.initialize();
//   var Agent;
//   Agent = Tamotsu.Table.define({
//     sheetName: "SRF_All_Records",
//     idColumn: "id",
//   });
//   var row = Agent.where({ Form_Number: form_number }).all()[0];
//   // Logger.log(row);
//   var obj = {};
//   var tbls = {};
//   obj.Slitting_Details = JSON.parse(row.Slitting_Details);
//   obj.Packing_Details = JSON.parse(row.Packing_Details);
//   var tbl_columns = {};
//   const array_of_tbl_name = Object.keys(obj);
//   array_of_tbl_name.forEach((tbl_name) => {
//     // Logger.log("tbaleName:", tbl_name);
//     // var columns_array = Object.keys(obj[tbl_name][0]);
//     var columns_array = [];

//     for (var i in obj[tbl_name][0]) {
//       columns_array.push(i);
//     }

//     // Logger.log(columns_array);
//     columns_array = columns_array.map((n) => {
//       var o = {};
//       o.label = _.startCase(n.toString());
//       o.field = n;
//       return o;
//     });
//     // Logger.log(columns_array);

//     tbl_columns[tbl_name] = columns_array;
//   });

//   // Logger.log(tbl_columns);

//   tbls.data = obj;
//   tbls.columns = tbl_columns;

//   return tbls;
// }

// function sendMailPRF(form_id, mailIds, listName) {
//   var message = "Please update further";
//   Tamotsu.initialize();
//   var Agent;
//   Agent = Tamotsu.Table.define({ sheetName: listName, idColumn: "id" });

//   try {
//     var body = JSON.stringify(
//       Agent.where({
//         Form_Number: Number(form_id),
//       }).all()[0],
//       null,
//       4
//     );

//     message += "<pre>" + body + "</pre><br>";

//     Logger.log(message);
//     GmailApp.sendEmail(
//       // mailIds[1],
//       "sharma.pritam311@gmail.com",
//       "Please Update Further ",
//       message,
//       {
//         htmlBody: message,
//         cc: mailIds.join(),
//       }
//     );

//     return true;
//   } catch (error) {
//     return false;
//   }
// }

// function sendMail2(obj) {
//   var message = "PRF/SRF detail as entered :";
//   // var mailIds = ["sharma.pritam311@gmail.com", "notifications.borl@gmail.com", "jamesfd4cast@gmail.com", "james@fd4cast.com", "hempel.metals.data@gmail.com"];
//   var mailIds = ["sharma.pritam311@gmail.com", "notifications.borl@gmail.com"];

//   for (var k in obj) {
//     message += "<p><b>" + _.startCase(k) + " : " + "</b>" + obj[k] + "</p>";
//   }
//   Logger.log(message);

//   try {
//     GmailApp.sendEmail(
//       mailIds[1],

//       message,
//       {
//         htmlBody: message,
//         cc: mailIds.join(),
//       }
//     );
//     return true;
//   } catch (error) {
//     return false;
//   }
// }
