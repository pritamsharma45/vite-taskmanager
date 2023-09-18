/**
 * Method to get item in a table by it's id.
 * @param {Integer} id: id in a table.
 * @param {String} tableName: Name of Named Range or Table Name.
 * @returns {Result} Result  with Item object and Header Array
 */

function GetItemById(id, tableName) {
  const table = getTableByName(tableName, "id");
  try {
    var item = table.getItemById(id).fields;
    //  Logger.log(table.header);
    var result = {};
    result.header = table.header;
    const obj = {};
    for (const [key, value] of Object.entries(item)) {
      obj[key] = value["value"];
    }
    result.item = obj;
    return result;
  } catch (error) {
    return null;
  }
}

/**
 * Method to get all the items in a table by provided criteria as object.
 * @param {Object} criteriaObjectArray: Array of Criterias as object. Like :- [{ client_id:3}].
 * @param {String} tableName: Name of Named Range or Table Name.
 */

function GetItemsWhere(tableName, criteriaObjectArray) {
  var tbl = getTableByName(tableName, "id");
  var queryItems = tbl.select(criteriaObjectArray);
  var result = {};
  result.header = tbl.header;
  result.items = queryItems.all();
  return result;
}

/**
 * Function to get filtered rows from table with single criteria.
 * @param {String} tblName:Table name
 * @param {Object} criteriaObject: Criteria object with Key & value as properties
 * @returns {Table in form of JSON}
 */

function GetItemsWhere2(tblName, criteriaObject) {
  let tbl = [];
  tbl = _convertNamedRangeToJSON(tblName);
  if (criteriaObject) {
    tbl = tbl.filter((row) => {
      return row[criteriaObject.key] === criteriaObject.value;
    });
  }
  return tbl;
}

function _convertNamedRangeToJSON(tableName) {
  var rng = SpreadsheetApp.getActiveSpreadsheet().getRangeByName(tableName);
  var vals = trimRangeRows(rng).getValues();
  const jsons = ArrayToJSON(vals);
  return jsons;
}

// function GetTables(tblNames) {
//   // const tblNames = ['tbl_task_type','tbl_company_type'];
//   const tables = {};
//   tblNames.forEach((tblName) => {
//     tables[tblName] = _getTableByNameWithidColumn(tblName, "normal");
//   });
//   // Logger.log(tables);
//   return tables;
// }

// function GetTable(tblName) {
//   return _getTableByNameWithidColumn(tblName, "normal");
// }

/**
 * Function to create a Table Object from a Named Range. The range should contain a header in the first row.
 * Named ranges are ranges that have associated string aliases.
 * They can be viewed and edited via the Sheets UI under the Data > Named ranges... menu.
 * @param {string} namedRange: Name of the range to create a Table from
 * @param {String} type: Allowed Value : "indexed","normal","only-name"
 * @returns {Table}
 */
function _getTableByNameWithidColumn(namedRange, type) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var tableRange = ss.getRangeByName(namedRange);
  if (tableRange == null) {
    throw "Oops! Error creating a table with the named range " +
      namedRange +
      ". It might not exist or it is misspelled.";
  }
  var gridRange = trimRangeRows(tableRange);
  var header = gridRange.getValues()[0];

  var rawValues = gridRange.getValues().slice(1); // we disregard first row because it is header.

  if (type === "indexed") {
    var indexedTable = {};
    for (var row = 0; row < rawValues.length; row++) {
      var index = rawValues[row][0];
      var obj = {};
      for (var column = 0; column < header.length; column++) {
        var label = header[column];
        obj[label] = rawValues[row][column];
      }
      indexedTable[index] = obj;
    }
    return indexedTable;
  }

  if (type === "normal") {
    var items = [];
    for (var row = 0; row < rawValues.length; row++) {
      var index = rawValues[row][0];
      var obj = {};
      for (var column = 0; column < header.length; column++) {
        var label = header[column];
        obj[label] = rawValues[row][column];
      }
      items.push(obj);
    }
    return items;
  }

  if (type === "only-name") {
    var indexedTable = {};
    for (var row = 0; row < rawValues.length; row++) {
      var index = rawValues[row][0];
      var obj = {};
      obj["name"] = rawValues[row][1];
      indexedTable[index] = obj;
    }
    return indexedTable;
  }
}

function getIndexedDropdowns(arrayOfTableNames) {
  let o = {};
  arrayOfTableNames.forEach((name) => {
    o[name] = _getTableByNameWithidColumn(name, "indexed");
  });
  return o;
}

function GetPopulatedMainTable(table_name) {
  return GetPopulatedTable(table_name).mainTable;
}
function GetFilteredTasks(clientId) {
  var table_name = "tbl_task";
  var sheet = SpreadsheetApp.getActiveSpreadsheet();
  var header = sheet
    .getRangeByName(table_name)
    .offset(0, 0, 1)
    .getValues()
    .flat();
  var TableLoadinggObject = {};
  var related_tables = {};
  var relatedTables_normal = {};
  header.forEach((hdr_field) => {
    if (hdr_field.endsWith("_id")) {
      hdr_field = "tbl_" + hdr_field.replace("_id", "");
      var obj = _getTableByNameWithidColumn(hdr_field, "only-name");
      related_tables[hdr_field] = obj;
      relatedTables_normal[hdr_field] = _getTableByNameWithidColumn(
        hdr_field,
        "indexed"
      );
    }
  });
  const keyedTable = getRelatedTasks(clientId).items;
  let mainTable = JSON.parse(JSON.stringify(keyedTable));
  TableLoadinggObject.keyedTable = keyedTable;

  mainTable = mainTable.map((tblItem) => {
    var keys = Object.keys(tblItem);
    var tblItems = keys.map((key) => {
      if (key.endsWith("_id")) {
        var relatedTableName = "tbl_" + key.replace("_id", "");
        var foreignKey = String(tblItem[key]);
        // Logger.log(foreignKey);
        tblItem[key] = related_tables[relatedTableName][foreignKey]["name"];
      }
    });
    return tblItem;
  });
  TableLoadinggObject.mainTable = mainTable;
  TableLoadinggObject.relatedTables = related_tables;
  TableLoadinggObject.relatedTables_normal = relatedTables_normal;
  Logger.log(TableLoadinggObject);
  return TableLoadinggObject;
}

function GetPopulatedTable(table_name) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet();
  var header = sheet
    .getRangeByName(table_name)
    .offset(0, 0, 1)
    .getValues()
    .flat();
  var TableLoadinggObject = {};
  var related_tables = {};
  var relatedTables_normal = {};
  header.forEach((hdr_field) => {
    if (hdr_field.endsWith("_id")) {
      hdr_field = "tbl_" + hdr_field.replace("_id", "");
      var obj = _getTableByNameWithidColumn(hdr_field, "only-name");
      related_tables[hdr_field] = obj;
      relatedTables_normal[hdr_field] = _getTableByNameWithidColumn(
        hdr_field,
        "indexed"
      );
    }
  });
  const keyedTable = _getTableByNameWithidColumn(table_name, "normal");
  let mainTable = JSON.parse(JSON.stringify(keyedTable));
  TableLoadinggObject.keyedTable = keyedTable;

  mainTable = mainTable.map((tblItem) => {
    var keys = Object.keys(tblItem);
    var tblItems = keys.map((key) => {
      if (key.endsWith("_id")) {
        var relatedTableName = "tbl_" + key.replace("_id", "");
        var foreignKey = String(tblItem[key]);
        // Logger.log(foreignKey);
        tblItem[key] = related_tables[relatedTableName][foreignKey]["name"];
      }
    });
    return tblItem;
  });
  TableLoadinggObject.mainTable = mainTable;
  TableLoadinggObject.relatedTables = related_tables;
  TableLoadinggObject.relatedTables_normal = relatedTables_normal;
  return TableLoadinggObject;
  // Logger.log(TableLoadinggObject);
}

function _checkIfForeignKeyExistInOtherTables(fieldName, foreignKey) {
  var tables = SpreadsheetApp.getActiveSpreadsheet().getNamedRanges();
  var found = false;
  tables.forEach((table) => {
    var header = table.getRange().getValues()[0];
    if (header.includes(fieldName)) {
      var tableName = table.getName();
      Logger.log(tableName);
      if (_PluckColumnData(tableName, fieldName).includes(foreignKey)) {
        Logger.log("Foreign key found in " + tableName);
        found = true;
      } else {
        // msgObj.found = false ;
        //  return false ;
      }
    }
  });
  return found;
}

function _PluckColumnData(tableName, fieldName) {
  var table = SpreadsheetApp.getActiveSpreadsheet().getRangeByName(tableName);
  table = trimRangeRows(table);
  const vals = table.getValues();
  var fieldIndex = vals[0].indexOf(fieldName);
  var arr2 = vals[0].map((_, colIndex) => vals.map((row) => row[colIndex]));
  return arr2[fieldIndex].splice(1);
}

function hgh() {
  var h = _checkIfForeignKeyExistInOtherTables("client_id", 2);
  Logger.log(h);
}

function stringifiedTable(tableName) {
  var rng = SpreadsheetApp.getActiveSpreadsheet().getRangeByName(tableName);
  var vals = trimRangeRows(rng).getValues();
  return JSON.stringify(vals);
}
