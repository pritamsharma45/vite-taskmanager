function ArrayToJSON(array2D) {
  const header = array2D[0];
  const body = array2D.slice(1);
  const arr2 = body.map((el) => {
    let obj = {};
    for (let i = 0; i < el.length; ++i) {
      obj[header[i]] = el[i];
    }
    return obj;
  });
  return arr2;
}
/**
 * Function to trim the rows of a range. The range should contain a header in the first row.
 * @param {Range} range: a range object from Google spreadsheet. First row of range must be the headers.
 * @returns {Range}
 */
function trimRangeRows(range) {
  var values = range.getValues();
  for (var rowIndex = values.length - 1; rowIndex >= 0; rowIndex--) {
    if (values[rowIndex].join("") !== "") {
      break;
    }
  }
  return range.offset(
    (rowOffset = 0),
    (columnOffset = 0),
    (numRows = rowIndex + 1)
  );
}
/**
 * Function to get JSON from named range.
 * @param {Array} optionSources: Array of range name
 * @returns {Object}
 */
function getDropdowns(optionSources) {
  let obj = {};
  try {
    optionSources.forEach((source) => {
      obj[source] = flattenModelInJSON(NamedRangeToJSON(source));
    });
    return obj;
  } catch (error) {}
}

/**
 * Function to get Indexed dropdowns  from named range.
 * @param {Array} optionSources: Array of range name
 * @returns {Object}
 */
function getIndexedDropdowns(optionSources) {
  let obj = {};
  try {
    optionSources.forEach((source) => {
      let o = {};
      const jsons = flattenModelInJSON(NamedRangeToJSON(source));
      jsons.map((row) => {
        o[row["id"]] = row["name"];
      });
      obj[source] = o;
    });
    return obj;
  } catch (error) {}
}

/**
 * Function to get JSON from named range.
 * @param {Array} JSONArray: Array of JSON object with model field
 * @returns {Array}
 */
function flattenModelInJSON(JSONArray) {
  try {
    let arr = JSONArray.map((el) => {
      // Logger.log(el)
      let o = JSON.parse(el.model);
      o.id = el.id;
      Logger.log(o);
      return o;
    });
    return arr;
  } catch (error) {}
}

/**
 * Function to get JSON from named range.
 * @param {Range} rangeName: Range Name
 * @returns {Object}
 */

function NamedRangeToJSON(rangeName) {
  var rng = SpreadsheetApp.getActiveSpreadsheet().getRangeByName(rangeName);
  var vals = trimRangeRows(rng).getValues();
  return ArrayToJSON(vals);
}

function indexedTable(rangeName, index_col_name, value_col_name) {
  var rng = SpreadsheetApp.getActiveSpreadsheet().getRangeByName(rangeName);
  var vals = trimRangeRows(rng).getValues();
  const jsons = ArrayToJSON(vals);
  let o = {};
  jsons.map((row) => {
    o[row[index_col_name]] = row[value_col_name];
  });
  return o;
}

function ReplaceClientTypeWithKey() {
  var rangeWhereToDoReplacement = SpreadsheetApp.getActiveSpreadsheet().getRangeByName(
    "tbl_client"
  );
  let object = indexedTable("tbl_client_type", "type", "id");
  for (const k in object) {
    let textFinder = rangeWhereToDoReplacement
      .createTextFinder(k)
      .matchEntireCell(true)
      .replaceAllWith(object[k]);
  }
}

function ETCSTOOLS() {
  let jsonsArray = NamedRangeToJSON("tbl_ProjectOverview");
  let mapped = jsonsArray.map((row) => {
    let { etcs_tool_entries, program_name } = JSON.parse(row.model);

    let concatenated_tools = etcs_tool_entries.map((tool) => {
      let arr = [];
      for ([k, v] of Object.entries(tool)) {
        arr.push(v);
      }
      return arr.join("-");
    });
    let obj = {};
    obj[program_name] = concatenated_tools;
    return obj;
  });
  return mapped;
  Logger.log(mapped);
}
function GetAllJobs() {
  let jsonsArray = NamedRangeToJSON("tbl_ProjectOverview");
  let jobs = [];
  jsonsArray.forEach((row) => {
    let { etcs_tool_entries, program_name } = JSON.parse(row.model);

    etcs_tool_entries.forEach((tool) => {
      let arr = [];
      for ([k, v] of Object.entries(tool)) {
        arr.push(v);
      }
      jobs.push(arr.join("-"));
    });
  });
  Logger.log(jobs);
  return jobs;
}

function ETCSPROGRAMS() {
  let jsonsArray = NamedRangeToJSON("tbl_ProjectOverview");
  let mapped = jsonsArray.map((row) => {
    let { program_name } = JSON.parse(row.model);
    return program_name;
  });
  Logger.log(mapped);
  return mapped;
}
