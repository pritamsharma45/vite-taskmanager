/**
 * Constructor which creates a Selector object to query Items in a Table.
 * @param {Table} table: The Table object where to evaluate the criteria.
 * @param {Array} criteria: an array used as filter as an AND of ORs (see CNF). Examples:
 * >>> [{date: today}, [{tag: 1},{tag: 2}]] // (date === today && (tags === 1 || tags === 2))
 * >>> [[{assigneeId: 'GO'}, {assigneeId: 'AM'}]] // (assigneeId === 'GO' || assigneeId === 'AM')
 * >>> [{name: 'Guillem'}, {surname: 'Orpinell'}] // (name === 'Guillem' && surname === 'Orpinell')
 * >>> {name: 'Guillem', surname: 'Orpinell'} // (name === 'Guillem' && surname === 'Orpinell')
 * @constructor
 */
function Selector(table, criteria) {
  this.table = table;
  this.criteria = criteria;
  this.queryItems = new GridArray();
}
/**
 * Method to get the query items in a Selector object.
 */
Selector.prototype.getQueryItems = function() {
  return this.queryItems;
};

/**
 * Method to evaluate a criteria within a Table object.
 */
Selector.prototype.evaluate = function() {
  var andsArray = [this.criteria];
  for (var i = 0; i < this.table.items.length; i++) {
    var item = this.table.items[i];
    if (isMatching(item, andsArray)) {
      this.queryItems.push(item);
    }
  }
  return this;
};

/**
 * Function to evaluate a criteria within an Item object.
 * @param {Item} item: The Item object where to evaluate the criteria.
 * @param {Array} criteria: an array used as filter as an AND of ORs (see CNF).
 @return {Boolean}
 */
function isMatching(item, andsArray) {
  for (var i = 0; i < andsArray.length; i++) {
    var clause = andsArray[i];
    if (isObject(clause) && someUnmatch(item, clause)) {
      //AND logic
      return false;
    } else if (Array.isArray(clause) && noneMatches(item, clause)) {
      //OR logic
      return false;
    }
  }
  return true;
}

/**
 * Function
 */
function someUnmatch(item, object) {
  for (var field in object) {
    if (!valuesMatch(object[field], item.getFieldValue(field))) {
      return true;
    }
  }
  return false;
}

/**
 * Function
 */
function noneMatches(item, orsArray) {
  for (var i = 0; i < orsArray.length; i++) {
    var object = orsArray[i];
    if (!isObject(object)) {
      throw "Oops! The ORs array must be an array of Objects. Fix it and try again.";
    }
    for (var field in object) {
      if (valuesMatch(object[field], item.getFieldValue(field))) {
        return false;
      }
    }
  }
  return true;
}

/**
 * Function to check a matching between two values, considering also value as a Date.
 */
function valuesMatch(value1, value2) {
  return (
    (value1 instanceof Date && value1.getTime() === value2.getTime()) ||
    value1 === value2
  );
}

/**
 * Returns if a value is an object
 */
function isObject(value) {
  return value && typeof value === "object" && value.constructor === Object;
}
/**
 * Constructor for an item in a Table object.
 * @param {Number} i: id/order of the item in the Table frame. Start at 0 (first item in grid).
 * @param {Range} range: the grid range the item is from.
 * @param {Array} header: The header array.
 * @constructor
 */

function Item(i, header, row, column, sheet) {
  this.fields = {};

  this.table = {};
  this.table.header = header;
  this.table.row = row;
  this.table.column = column;
  this.table.sheet = sheet;

  this.i = i;
  this.authorizedToCommit = true;
}

/**
 * Method to add a new field to the item, given a value, note, background, formula and font color.
 * @param {String} label: The name of the field.
 * @param {String|Number|Date} value: The value from a cell.
 * @param {String} note: The note from a cell.
 * @param {String} background: The background color of a cell (can be string for basic colors or hex code string).
 * @param {String} formula: The R1C1 format formula.
 * @param {String} font: The font color.
 */
Item.prototype.addField = function(
  label,
  value,
  note,
  background,
  formula,
  font
) {
  this.fields[label] = {
    value: value,
    note: note,
    background: background,
    formula: formula,
    font: font,
  };
  for (var param in this.fields[label]) {
    if (this.fields[label][param] === undefined) {
      this.fields[label][param] = "";
    }
  }
};

/**
 * Method to convert the item into a JS object, with its attributes being the header fields of the item.
 * @return {Object} itemObject: The object with each of the header/fieldValue pairs of the item.
 */
Item.prototype.toObject = function() {
  var self = this;
  return this.table.header.reduce(function(acc, headerField) {
    var fieldValue = self.getFieldValue(headerField);
    acc[headerField] = fieldValue;
    return acc;
  }, {});
};

/**
 * Commit a single item line in spreadsheet if the items order has not been changed since instantiating the grid.
 */
Item.prototype.commit = function() {
  if (!this.authorizedToCommit) {
    throw "Forbidden to commit this item. The order of the grid it is associated to has changed or it has been deleted.";
  }

  var rowValues = [];
  var rowNotes = [];
  var rowBackgrounds = [];
  var rowWraps = [];
  var rowFontColors = [];

  for (var j = 0; j < this.table.header.length; j++) {
    var field = this.table.header[j];
    var value = this.getFieldValue(field);
    var formula = this.getFieldFormula(field);

    formula ? rowValues.push(formula) : rowValues.push(value);
    rowNotes.push(this.getFieldNote(field));
    rowBackgrounds.push(this.getFieldBackground(field));
    rowWraps.push(false);
    rowFontColors.push(this.getFieldFontColor(field));
  }

  var lineRange = this.getLineRange();
  lineRange.setValues([rowValues]);
  lineRange.setNotes([rowNotes]);
  lineRange.setBackgrounds([rowBackgrounds]);
  lineRange.setWraps([rowWraps]);
  lineRange.setFontColors([rowFontColors]);
};

/**
 * Commit a whole item values. Disregarded other dimensions.
 */
Item.prototype.commitValues = function() {
  if (!this.authorizedToCommit) {
    throw "Forbidden to commit this item. The order of the grid it is associated to has changed or it has been deleted.";
  }

  var rowValues = [];

  for (var j = 0; j < this.table.header.length; j++) {
    var field = this.table.header[j];
    var value = this.getFieldValue(field);
    var formula = this.getFieldFormula(field);

    formula ? rowValues.push(formula) : rowValues.push(value);
  }

  var lineRange = this.getLineRange();
  lineRange.setValues([rowValues]);
};

/**
 * Commit a whole item backgrounds. Disregarded other dimensions.
 */
Item.prototype.commitBackgrounds = function() {
  if (!this.authorizedToCommit) {
    throw "Forbidden to commit this item. The order of the grid it is associated to has changed.";
  }
  var rowBackgrounds = [];
  for (var j = 0; j < this.table.header.length; j++) {
    var field = this.table.header[j];
    var background = this.getFieldBackground(field);
    rowBackgrounds.push(background);
  }
  var lineRange = this.getLineRange();
  lineRange.setBackgrounds([rowBackgrounds]);
};

/**
 * Commit a single item field in spreadsheet if the items order has not been changed since instantiating the grid.
 * @param {String} field: the field of the item to commit in spreadsheet.
 */
Item.prototype.commitField = function(field) {
  if (!this.authorizedToCommit) {
    throw "Forbidden to commit this item field. The order of the grid it is associated to has changed or it has been deleted.";
  }
  var cellRange = this.getFieldRange(field);
  if (this.getFieldFormula(field)) {
    cellRange.setValue(this.getFieldFormula(field));
  } else {
    cellRange.setValue(this.getFieldValue(field));
  }

  cellRange.setNote(this.getFieldNote(field));
  cellRange.setBackground(this.getFieldBackground(field));
  cellRange.setWrap(false);
  cellRange.setFontColor(this.getFieldFontColor(field));
};

/**
 * Commit a single item field value in spreadsheet if the items order has not been changed since instantiating the grid.
 * @param {String} field: the field of the item to commit the value from, in spreadsheet.
 */
Item.prototype.commitFieldValue = function(field) {
  if (!this.authorizedToCommit) {
    throw "Forbidden to commit this item field. The order of the grid it is associated to has changed or it has been deleted.";
  }
  var cellRange = this.getFieldRange(field);
  if (this.getFieldFormula(field)) {
    cellRange.setValue(this.getFieldFormula(field));
  } else {
    cellRange.setValue(this.getFieldValue(field));
  }
};

/**
 * Get the line range of the item in the spreadsheet it is from.
 * @return {Range} line: The line range.
 */
Item.prototype.getLineRange = function() {
  var headerOffset = 1;
  var rangePositionOffset = this.table.row;
  var row = this.i + headerOffset + rangePositionOffset;
  var column = this.table.column;
  var sheet = this.table.sheet;
  return sheet.getRange(row, column, 1, this.table.header.length);
};

/**
 * Get the cell range of a given field of the item.
 * @param {string} field: A field string.
 * @return {Number} line: The line number.
 */
Item.prototype.getFieldRange = function(field) {
  var columnIndexOffset = 1; // columns starts at 1.
  var columnField = this.table.header.indexOf(field) + columnIndexOffset;
  return this.getLineRange().getCell(1, columnField);
};

/**
 * Method to get the value of a given field.
 * @param {String} field: The name of the field.
 */
Item.prototype.getFieldValue = function(field) {
  var fieldParams = this.fields[field];
  if (!fieldParams) {
    var error =
      "The field '" +
      field +
      "' cannot be found in the Table located in '" +
      this.table.sheet.getSheetName() +
      "' sheet.\nCheck if the field exists, it's properly written and it's included in the Table range.";
    throw error;
  }
  return fieldParams["value"];
};

/**
 * Method to set a value for a given field.
 * @param {String} field: The name of the field.
 * @param {String|Number|Date} value: The value to set.
 */
Item.prototype.setFieldValue = function(field, value) {
  if (!this.fields[field]) {
    var error =
      "The field '" +
      field +
      "' cannot be found in the Table located in '" +
      this.table.sheet.getSheetName() +
      "' sheet.\nCheck if the field exists, it's properly written and it's included in the Table range.";
    throw error;
  }
  this.fields[field]["value"] = value;
  this.fields[field]["formula"] = "";
  return this;
};

/**
 * Method to get note for a given field.
 * @param {String} field: The name of the field.
 */
Item.prototype.getFieldNote = function(field) {
  return this.fields[field]["note"];
};

/**
 * Method to set note for a given field.
 * @param {String} field: The name of the field.
 * @param {String} note: The note to set.
 */
Item.prototype.setFieldNote = function(field, note) {
  this.fields[field]["note"] = note;
  return this;
};

/**
 * Method to get background for a given field.
 * @param {String} field: The name of the field.
 */
Item.prototype.getFieldBackground = function(field) {
  return this.fields[field]["background"];
};

/**
 * Method to set background for a given field.
 * @param {String} field: The name of the field.
 * @param {String} background: The background to set (color string or hex code string).
 */
Item.prototype.setFieldBackground = function(field, background) {
  this.fields[field]["background"] = background;
  return this;
};

/**
 * Method to set background on the whole item.
 * @param {String} color: The name or hex of the color.
 */
Item.prototype.setBackground = function(color) {
  for (var i = 0; i < this.table.header.length; i++) {
    var field = this.table.header[i];
    this.fields[field]["background"] = color;
  }
  return this;
};

/**
 * Method to set font color on the whole item.
 * @param {String} color: The name or hex of the color.
 */
Item.prototype.setFontColor = function(color) {
  for (var i = 0; i < this.table.header.length; i++) {
    var field = this.table.header[i];
    this.fields[field]["font"] = color;
  }
  return this;
};

/**
 * Method to get formula for a given field.
 * @param {String} field: The name of the field.
 */
Item.prototype.getFieldFormula = function(field) {
  return this.fields[field]["formula"];
};

/**
 * Method to set formula for a given field.
 * @param {String} field: The name of the field.
 * @param {String} formula: The formula to set (must start with "=").
 */
Item.prototype.setFieldFormula = function(field, formula) {
  this.fields[field]["formula"] = formula;
  return this;
};

/**
 * Method to get font color for a given field.
 * @param {String} field: The name of the field.
 */
Item.prototype.getFieldFontColor = function(field) {
  return this.fields[field]["font"];
};

/**
 * Method to set font color for a given field.
 * @param {String} field: The name of the field.
 * @param {String} fontColor: The font color to set.
 */

Item.prototype.setFieldFontColor = function(field, fontColor) {
  this.fields[field]["font"] = fontColor;
  return this;
};

/**
 * Method to get the cell range for a specific field.
 * @param {String} field: The name of the field.
 * @return {Range} the cell range of the field.
 */
Item.prototype.getFieldRange = function(field) {
  var fieldIndex = this.table.header.indexOf(field);
  return this.getLineRange().getCell(1, fieldIndex + 1);
};

/**
 * Function to create a Table Object for a whole sheet
 * @param {string} sheetName: Name of the sheet to create a Table from
 * @param {number} headerRow: Row number where the header is.
 * @param {String} indexField: Field name you want to create an index with (commonly for ID field for fast lookup).
 * @returns {Table}
 */
function getTable(sheetName, headerRow, indexField) {
  if (!headerRow) {
    headerRow = 1;
  }
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);
  var numberOfRows = sheet.getLastRow() - headerRow + 1;
  var tableRange = sheet.getRange(
    headerRow,
    1,
    numberOfRows,
    sheet.getLastColumn()
  );
  return new Table(tableRange, indexField);
}

/**
 * Function to create a Table Object from a Named Range. The range should contain a header in the first row.
 * Named ranges are ranges that have associated string aliases.
 * They can be viewed and edited via the Sheets UI under the Data > Named ranges... menu.
 * @param {string} namedRange: Name of the range to create a Table from
 * @param {String} indexField: Field name you want to create an index with (commonly for ID field for fast lookup).
 * @returns {Table}
 */
function getTableByName(namedRange, indexField) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var tableRange = ss.getRangeByName(namedRange);
  if (tableRange == null) {
    throw "Oops! Error creating a table with the named range " +
      namedRange +
      ". It might not exist or it is misspelled.";
  }
  return new Table(tableRange, indexField);
}

/**
 * Function to get all the related tables in a table with key being table name and value being Sheetfu Table.
 * @param {String} table name.
 * @constructor
 */
function getRelatedTablesByTableName(table_name) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet();
  var header = sheet
    .getRangeByName(table_name)
    .offset(0, 0, 1)
    .getValues()
    .flat();
  var related_tables = {};

  header.forEach((hdr_field) => {
    if (hdr_field.endsWith("_id")) {
      hdr_field = "tbl_" + hdr_field.replace("_id", "");
      var arr = getTableByName(hdr_field, "id").getGridValues();
      var arr = arr.map((subArray) => {
        var selectItem = {};
        selectItem["id"] = subArray[0];
        selectItem["name"] = subArray[1];
        return selectItem;
      });
      related_tables[hdr_field] = arr;
    }
  });
  return related_tables;
}

function getRelatedTablesByModel(model) {
  var header = Object.keys(model);
  var related_tables = {};
  header.forEach((hdr_field) => {
    if (hdr_field.endsWith("_id")) {
      const tbl_name = "tbl_" + hdr_field.replace("_id", "");
      try {
        var arr = getTableByName(tbl_name, "id").getGridValues();
        var arr = arr.map((subArray) => {
          var selectItem = {};
          selectItem["id"] = subArray[0];
          selectItem["name"] = subArray[1];
          return selectItem;
        });
      } catch (err) {
        Logger.log(err.message);
        return false;
      }

      related_tables[hdr_field] = arr;
    }
  });
  return related_tables;
}

/** Constructor which create a Table object to query data, get and post. Object to use when rows in sheet are not uniquely
 * identifiable (no id). Use Table Class for DB-like queries instead (when unique id exist for each row).
 * @param {Range} gridRange: a range object from Google spreadsheet. First row of range must be the headers.
 * @param {String} indexField: Field name you want to create an index with (commonly for ID field for fast lookup).
 * @constructor
 */
function Table(gridRange, indexField) {
  this.gridRange = trimRangeRows(gridRange);
  this.initialGridRange = this.gridRange;
  this.header = this.getHeader();
  this.items = this.initiateItems();

  this.indexField = indexField;
  if (this.indexField !== undefined) {
    this.index = this.getIndex(indexField);
  }
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
 * Method to extract headers of a grid.
 * @return {Array} The list of labels.
 */
Table.prototype.getHeader = function() {
  return this.gridRange.getValues()[0];
};

/**
 * Method to create an index as a hash table for a given field. Make sure the field guarantees unique values. Perfect for IDs.
 * @return {Object} Hash table in the format {fieldIndex : TableItem}
 */
Table.prototype.getIndex = function(indexField) {
  var index = {};
  for (var i = 0; i < this.items.length; i++) {
    var key = this.items[i].getFieldValue(indexField);
    index[key] = this.items[i];
  }
  return index;
};
/**
 * Method to get next id based on maximum of all ids in id column.
 * @return {Integer} maximum index.
 * The i attribute is the index of the object in the list of Table.items (starting at 0) (not the line in spreadsheet).
 */

Table.prototype.getNextId = function() {
  var items = this.items;
  var arr = items.map((row) => {
    return row["fields"]["id"].value;
  });
  if (arr.length == 0) {
    return 1;
  } else {
    Logger.log(Math.max(...arr));
    return Math.max(...arr) + 1;
  }
};

/**
 * Method to extract data from the grid range as Item objects (using header labels).
 * @return {Item[]} List of Item objects.
 * The i attribute is the index of the object in the list of Table.items (starting at 0) (not the line in spreadsheet).
 */
Table.prototype.initiateItems = function() {
  var rawValues = this.gridRange.getValues().slice(1); // we disregard first row because it is header.
  var rawNotes = this.gridRange.getNotes().slice(1);
  var rawBackgrounds = this.gridRange.getBackgrounds().slice(1);
  var rawFormulas = this.gridRange.getFormulasR1C1().slice(1);
  var rawFontColors = this.gridRange.getFontColors().slice(1);

  var items = new GridArray();

  for (var row = 0; row < rawValues.length; row++) {
    var parseItem = new Item(
      row,
      this.header,
      this.gridRange.getRow(),
      this.gridRange.getColumn(),
      this.gridRange.getSheet()
    );
    for (var column = 0; column < this.header.length; column++) {
      var label = this.header[column];
      parseItem.addField(
        (label = label),
        (value = rawValues[row][column]),
        (note = rawNotes[row][column]),
        (background = rawBackgrounds[row][column]),
        (formula = rawFormulas[row][column]),
        (font = rawFontColors[row][column])
      );
    }
    items.push(parseItem);
  }
  return items;
};

/**
 * Method to commit the items into the associated sheet (regardless if number of items have changed).
 */
Table.prototype.commit = function() {
  var dataToSend = this.getGridData();
  var itemsRange = this.getItemsRange();
  this.cleanInitialGrid();
  this.initialGridRange = this.gridRange;
  if (itemsRange !== undefined) {
    itemsRange.setValues(dataToSend["values"]);
    itemsRange.setNotes(dataToSend["notes"]);
    itemsRange.setBackgrounds(dataToSend["backgrounds"]);
    itemsRange.setWraps(dataToSend["wraps"]);
    itemsRange.setFontColors(dataToSend["fonts"]);
  }
};

/**
 * Method to commit the items values into the associated sheet (regardless if number of items have changed).
 */
Table.prototype.commitValues = function() {
  var values = this.getGridValues();
  var itemsRange = this.getItemsRange();
  this.cleanInitialGrid();
  this.initialGridRange = this.gridRange;
  if (itemsRange !== undefined) {
    itemsRange.setValues(values);
  }
};

/**
 * Method to get the new Range for the items, based on lenght of Table.items.
 * @return {Range} object of the items range. {Undefined} if the items range is empty.
 */
Table.prototype.getItemsRange = function() {
  // We need to check that items is not empty, since Sheet.getRange() throws an exception if numRows or numColumns are 0.
  if (this.items.length === 0) {
    return undefined;
  }
  var row = this.gridRange.getRow() + 1; // +1 to disregard header row
  var column = this.gridRange.getColumn();
  var sheet = this.gridRange.getSheet();
  return sheet.getRange(row, column, this.items.length, this.header.length);
};

/**
 * Method to create both values and notes 2D arrays from grid items.
 * @return {object} with attributes "values" and "notes".
 */
Table.prototype.getGridData = function() {
  var values = [];
  var notes = [];
  var backgrounds = [];
  var wraps = [];
  var fontColors = [];

  for (var i = 0; i < this.items.length; i++) {
    var rowValues = [];
    var rowNotes = [];
    var rowBackgrounds = [];
    var rowWraps = [];
    var rowFontColors = [];
    var item = this.items[i];

    for (var j = 0; j < this.header.length; j++) {
      var field = this.header[j];
      var value = item.getFieldValue(field);
      var formula = item.getFieldFormula(field);

      formula ? rowValues.push(formula) : rowValues.push(value);
      rowNotes.push(item.getFieldNote(field));
      rowBackgrounds.push(item.getFieldBackground(field));
      rowWraps.push(false);
      rowFontColors.push(item.getFieldFontColor(field));
    }
    values.push(rowValues);
    notes.push(rowNotes);
    backgrounds.push(rowBackgrounds);
    wraps.push(rowWraps);
    fontColors.push(rowFontColors);
  }
  return {
    values: values,
    notes: notes,
    backgrounds: backgrounds,
    wraps: wraps,
    fonts: fontColors,
  };
};

/**
 * Method to create 2D array of the values of every grid items.
 * @return {Array[]} The values 2D array.
 */
Table.prototype.getGridValues = function() {
  var values = [];

  for (var i = 0; i < this.items.length; i++) {
    var rowValues = [];
    var item = this.items[i];

    for (var j = 0; j < this.header.length; j++) {
      var field = this.header[j];
      var value = item.getFieldValue(field);
      var formula = item.getFieldFormula(field);

      formula ? rowValues.push(formula) : rowValues.push(value);
    }
    values.push(rowValues);
  }
  return values;
};

/**
 * Method to query rows from a Table, given exact match attributes.
 * @param {Array} criteria: an array used as filter as an AND of ORs (see CNF).
 * @return {Item[]} List of Item objects matching the given criteria.
 */
Table.prototype.select = function(criteria) {
  var queryItems = new Selector(this, criteria).evaluate().getQueryItems();

  return queryItems;
};

/**
 * Method to update one item within items grid.
 * @param {object} item: an item from items.
 * The index value is the value where the item is in the Table.items array. Needed to be able to change the value in Table.
 */
Table.prototype.update = function(item) {
  this.items[item["_i"]] = item;
};

/**
 * Method to Update table by it's id. Id to be set as integer.
 * @param {object} item to update. Must contain id attribue agains which table needs to be updated.
 * Warning: 'id' to be provided in index field in getTableByName Method.
 */
Table.prototype.updateById = function(model) {
  // var tableItems = this.items ;
  // var tableItem = tableItems.filter(item => item['fields']['id'].value == model.id)[0];
  var item = this.getItemById(model.id);
  Object.keys(model).forEach((key) => {
    item.setFieldValue(key, model[key]);
  });
  item.commit();
};

/**
 * Method to Bulk Update table by it's ids. Id to be set as integer.
 * @param {object[]} ids to update. Array of IDs of integer type.
 * @param {object} attributes to update.
 */
Table.prototype.bulkUpdateByIds = function(ids, atrributes) {
  ids.forEach((id) => {
    var item = this.getItemById(id);
    Object.keys(atrributes).forEach((key) => {
      item.setFieldValue(key, atrributes[key]);
    });
    item.commit();
  });
};

/**
 * Method to Bulk Update table by it's ids. Id to be set as integer.
 * @param {object[]} items to update. Array of items containing id field.
 */
Table.prototype.bulkUpdate = function(items) {
  items.forEach((model) => {
    var item = this.getItemById(item.id);
    Object.keys(model).forEach((key) => {
      item.setFieldValue(key, model[key]);
    });
    item.commit();
  });
};

/**
 * Method to update many items within items grid.
 * @param {object[]} manyItems: list of objects to update.
 */
Table.prototype.updateMany = function(manyItems) {
  for (var i = 0; i < this.items.length; i++) {
    var index = manyItems[i]["_i"];
    this.items[index] = manyItems[i];
  }
};

/**
 * Method to delete items from the items grid based on a selection criteria.
 * @param {object} filteredObject: Criteria to select the items to delete. See documentation of the "select" method.
 */
Table.prototype.deleteSelection = function(filterObject) {
  var selectionToDelete = this.select(filterObject);
  return this.deleteMany(selectionToDelete);
};

/**
 * Method to delete several items from the items grid.
 * @param {list} itemList: A list of items that you wish to delete
 * Take into account that deleting items re-calculates the indices of all items with higher index inside Table.items.
 */
Table.prototype.deleteMany = function(itemList) {
  if (itemList.length === this.items.length) {
    return this.deleteAll();
  }

  // First we sort the list of items to delete by index
  itemList.sort(function(firstItem, secondItem) {
    // Compare the i attribute of both items
    if (firstItem.i < secondItem.i) return -1;
    if (firstItem.i > secondItem.i) return 1;
    return 0;
  });

  // Now we iterate the sorted list in inverse order and delete the items
  var indexReduction = itemList.length;
  var lastDeletedIndex = this.items.length - 1;
  for (var i = itemList.length - 1; i >= 0; i--) {
    var itemToDelete = itemList[i];
    itemToDelete.authorizedToCommit = false; // To prevent the user from commiting deleted items.
    var indexToDelete = itemToDelete.i;
    // if (indexToDelete >= this.items.length) {
    //   throw "One of the items specified to delete has an out of bounds index.";
    // }
    this.items.splice(indexToDelete, 1);

    // For every item to delete, we will recalculate the indexes from the item that was deleted
    // to the last item before the previously deleted index.
    for (var k = indexToDelete; k < lastDeletedIndex - 1; k++) {
      var itemToUpdateIndex = this.items[k];
      // We reduce the index by as many items are left to delete
      itemToUpdateIndex.i = itemToUpdateIndex.i - indexReduction;
    }
    lastDeletedIndex = indexToDelete;
    indexReduction--;
  }

  // Reduce the gridRange by as many rows as were deleted
  this.gridRange = this.gridRange.offset(
    0,
    0,
    this.gridRange.getHeight() - itemList.length,
    this.gridRange.getWidth()
  );
};

/**
 * Method to delete one item from the items grid.
 * @param {item} item: An item from this.items that you wish to delete
 * Take into account that deleting an item re-calculates the indices of all items with higher index inside Table.items.
 */
Table.prototype.deleteOne = function(item) {
  return this.deleteMany([item]);
};

/**
 * Method to delete all items withing the items grid.
 */
Table.prototype.deleteAll = function() {
  this.items = new GridArray();
  this.gridRange = this.getHeaderRange();
};

/**
 * Method to delete all rows inside the initial grid.
 */
Table.prototype.cleanInitialGrid = function() {
  this.initialGridRange.clear({ contentsOnly: true, skipFilteredRows: true });
  var header = this.getHeaderRange();
  header.setValues([this.header]);
};

/**
 * Method to get the range of the header.
 * @return {Range} headerRange: the range of the header only (basically top row).
 */
Table.prototype.getHeaderRange = function() {
  var row = this.gridRange.getRow();
  var column = this.gridRange.getColumn();
  var sheet = this.gridRange.getSheet();
  return sheet.getRange(row, column, 1, this.header.length);
};
Table.prototype.getIdColumn = function() {
  var row = this.gridRange.getRow();
  var lrow = this.gridRange.getLastRow();
  var column = this.gridRange.getColumn();
  var sheet = this.gridRange.getSheet();
  return sheet.getRange(row, column, lrow);
};

/**
 * Method to add a new item into the Table. Add the item also to index if there is an index.
 * @param {object} input_item: an object item containing only values, or an instance of Item. Field must be matching header values.
 */
Table.prototype.add = function(input_item) {
  var raw_item = input_item;
  if (input_item instanceof Item) {
    raw_item = {};
    for (var field in input_item.fields) {
      raw_item[field] = input_item.getFieldValue(field);
    }
  }

  var newItem = new Item(
    this.items.length,
    this.header,
    this.gridRange.getRow(),
    this.gridRange.getColumn(),
    this.gridRange.getSheet()
  );

  for (var i = 0; i < this.header.length; i++) {
    var label = this.header[i];
    if (raw_item[label] === undefined) {
      raw_item[label] = "";
    }
    newItem.addField((field = label), (value = raw_item[label]));
  }
  newItem["fields"]["id"].value = this.getNextId();
  this.items.push(newItem);

  // Increase the gridRange by one row
  this.gridRange = this.gridRange.offset(
    0,
    0,
    this.gridRange.getHeight() + 1,
    this.gridRange.getWidth()
  );

  if (this.index !== undefined) {
    var indexId = newItem.getFieldValue(this.indexField);
    this.index[indexId] = newItem;
  }
  return newItem;
};

/**
 * Method to sort Table.items for a given field/key/label value.
 * Only works for numbers and date fields.
 * @param {string} key: the key label that we need to sort items from.
 * @param {boolean} ascending: If True it sorts ascending, if false, it sort descending.
 * @return {object[]} items: Table.items attribute.
 */
Table.prototype.sortBy = function(key, ascending) {
  this.items.sort(function(a, b) {
    var timeStampA = Date.parse(a.getFieldValue(key));
    var timeStampB = Date.parse(b.getFieldValue(key));
    if (!isNaN(timeStampA) && !isNaN(timeStampB)) {
      var dateA = new Date(a.getFieldValue(key));
      var keyA = dateA.getTime();
      var dateB = new Date(b.getFieldValue(key));
      var keyB = dateB.getTime();
    } else {
      var keyA = a.getFieldValue(key);
      var keyB = b.getFieldValue(key);
    }

    // Compare the 2 keys
    if (keyA < keyB) return -1;
    if (keyA > keyB) return 1;
    return 0;
  });

  if (ascending === false) {
    this.items.reverse();
  }

  // updating '_i'
  for (var i = 0; i < this.items.length; i++) {
    this.items[i].i = i;
    this.items[i].authorizedToCommit = false; // to prevent committing lines when order has changed.
  }
  return this.items;
};

/**
 * Method to clear background colors on every items.
 * @return {Range}: The range of items which had their background cleaned. {Undefined} if the items range is empty.
 */
Table.prototype.clearBackgrounds = function() {
  var itemRange = this.getItemsRange();
  if (itemRange !== undefined) {
    return itemRange.clearFormat();
  } else {
    return undefined;
  }
};

/**
 * Get an item from the table by its ID (assuming an index field was given when creating the table).
 * @param {Integer} id: Id in Integer form
 * @return {Item} items: Sheetfu Table Item
 */
Table.prototype.getItemById = function(valueId) {
  return this.index[valueId];
};

/**
 * Vertical lookup. Searches down the index field of a table (assuming an index field was given when creating the table)
 * for a criteria and returns the value of a specified field in the item found.
 */
Table.prototype.getFieldValueById = function(field, valueId) {
  var itemById = this.getItemById(valueId);
  if (itemById) {
    return itemById.getFieldValue(field);
  } else {
    return undefined;
  }
};

/**
 * Method to return only distinct different values in a field.
 */
Table.prototype.distinct = function(field) {
  var list = [];
  for (var i = 0; i < this.items.length; i++) {
    list.push(this.items[i].getFieldValue(field));
  }
  // It filters the list to return an array with the unique values
  var unique = list.filter(function(value, index, self) {
    return self.indexOf(value) === index;
  });
  return unique;
};

/**
 * Function to clone an object and simulate inheritance.
 */
function cloneObj(obj) {
  function F() {}
  F.prototype = obj;
  return new F();
}

/**
 * SubArray class constructor to have more ORM like methods to the arrays used in the Table class.
 */
function GridArray() {}
GridArray.prototype = cloneObj(Array.prototype);

/**
 * Method to return only the first result of an array. Useful when result of selection.
 */
GridArray.prototype.first = function() {
  if (this.length === 0) {
    return undefined;
  }
  return this[0];
};
/**
 * Method to return all result of an array. Useful when result of selection.
 */
GridArray.prototype.all = function() {
  if (this.length === 0) {
    return undefined;
  }

  var arr = [];
  for (var row = 0; row < this.length; row++) {
    const fields = this[row].fields;
    const obj = {};
    for (const [key, value] of Object.entries(fields)) {
      obj[key] = value.value;
    }
    arr.push(obj);
  }
  return arr;
};
/**
 * Method to return the first x results of an array. Useful when result of selection.
 */
GridArray.prototype.limit = function(x) {
  if (this.length > x) {
    return this.slice(0, x);
  } else {
    return this;
  }
};
const jsonTableFromNamedRange = (rangeName) => {
  const [header, ...rows] = SpreadsheetApp.getActiveSpreadsheet()
    .getRangeByName(rangeName)
    .getDisplayValues();
  const data = [];
  for (let i = 0; i < rows.length; i++) {
    const o = {};
    if (rows[i][0] === "") {
      break;
    }
    header.forEach((title, column) => {
      o[title] = rows[i][column];
    });
    data.push(o);
  }
  return data;
};

class Lux {
  constructor(rangeName, idCol) {
    this.data = [];
    this.ss = SpreadsheetApp.getActiveSpreadsheet();
    this.header = [];
    this.rng = null;
    this.idCol = idCol;
    this.rangeName = rangeName;
    this.nexRowIndex = "";
    this.headerToColumns = {};
    this.idsToRows = {};
    this.init();
  }

  init() {
    this.rng = this.ss.getRangeByName(this.rangeName);
    const topRowNum = this.rng.getRow();
    const topColNum = this.rng.getColumn();

    const [header, ...rows] = this.rng.getDisplayValues();
    this.header = header;
    const ids = this.transpose(rows)[0];
    const idsToRows = {};
    for (let row = 0; row < ids.length; row++) {
      if (ids[row] === "") {
        break;
      }
      idsToRows[ids[row]] = row + topRowNum;
    }
    this.idsToRows = idsToRows;

    const o = {};
    for (let col = 0; col < header.length; col++) {
      const colLbl = this.numToColLabel(col + topColNum - 1);
      o[header[col]] = colLbl;
    }
    this.headerToColumns = o;
    for (let i = 0; i < rows.length; i++) {
      const o = {};
      if (rows[i][0] === "") {
        this.nexRowIndex = i;
        break;
      }
      header.forEach((title, column) => {
        o[title] = rows[i][column];
      });
      this.data.push(o);
    }

    return this;
  }

  updateAttributes(obj) {
    for (const [k, v] of Object.entries(obj)) {
      Logger.log(this.headerToColumns);
      const rngAddress =
        this.headerToColumns[k] + (this.idsToRows[obj[this.idCol]] + 1);
      Logger.log(rngAddress);
      this.ss.getRange(rngAddress).setValue(v);
    }
  }
  bulkUpdate(arrayOfObjects) {
    arrayOfObjects.forEach((obj) => {
      this.updateAttributes(obj);
    });
  }
  findById(value) {
    return this.data.find((el) => {
      return el[this.idCol] === value;
    });
  }

  addRows(array2d) {
    const topRowNum = this.rng.getRow();
    const topColNum = this.rng.getColumn();

    const h = array2d.length;
    const rngAdress =
      this.numToColLabel(topColNum - 1) +
      (this.nexRowIndex + 2) +
      ":" +
      this.numToColLabel(this.header.length + topColNum - 2) +
      (this.nexRowIndex + h + 1);
    Logger.log(rngAdress);
    if (array2d[0].length != this.header.length) {
      throw "Array size mismatch";
    }
    try {
      SpreadsheetApp.getActiveSpreadsheet()
        .getRange(rngAdress)
        .setValues(array2d);
      return true;
    } catch (error) {
      return false;
    }
  }

  numToColLabel(num) {
    let letters = "";
    while (num >= 0) {
      letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"[num % 26] + letters;
      num = Math.floor(num / 26) - 1;
    }
    return letters;
  }

  transpose(a) {
    return a[0].map((_, c) => a.map((r) => r[c]));
  }
}
