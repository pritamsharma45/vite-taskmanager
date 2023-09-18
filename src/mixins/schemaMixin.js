import _ from "lodash";
export default {
  showSpinner: false,
  displayFields: function () {
    const flds = this._mappedFldsFromSchema();
    return new Fields(flds);
  },
  _loopThroughFields: function (fields, dropdownItems, indexedDropDowns) {
    fields.forEach((fld) => {
      if (fld.model.endsWith("_id")) {
        console.log("Fields :", fld.model);
        if (typeof fld.provider === "undefined") {
          console.log("Fields without provider populated", fld.model);
          const tbl_name = "tbl_" + fld.model.replace("_id", "");
          fld.values = dropdownItems[tbl_name];
          if (fld.selectOptions) {
            //  If Filter Options
            if (fld.selectOptions.filterOption) {
              let option = fld.selectOptions.filterOption;
              fld.values.filter((val) => {
                return val[option.fld] === option.value;
              });
            }

            // If Fields to be rendered

            if (fld.selectOptions.name.includes("_id")) {
              const tbl_name =
                "tbl_" + fld.selectOptions.name.replace("_id", "");
              // const table = dropdownItems[tbl_name];
              const renderFld = fld.selectOptions.renderFld.fld;
              const renderWith = fld.selectOptions.renderFld.with;
              fld.values = fld.values.map((val) => {
                const key = val[renderFld];
                val[renderFld] = indexedDropDowns[tbl_name][key][renderWith];
                return val;
              });
            }
          }
        } else {
          console.log("Provider Called for", tbl_name);
          fld.provider();
        }
      }
    });
  },
  getDisplayFields: function () {
    if (this.displayFields.length === 0) {
      this.displayFields = _mappedFldsFromSchem();
    }
  },
  _populateSelectOptions: function (dropdownItems, indexedDropDowns) {
    if (this.groups) {
      var groups = this.groups;
      groups.forEach((group) => {
        var fields = group.fields;
        this._loopThroughFields(fields, dropdownItems, indexedDropDowns);
      });
    } else {
      this._loopThroughFields(this.fields, dropdownItems, indexedDropDowns);
    }
  },

  // populateDropdown: function() {

  //   google.script.run
  //     .withSuccessHandler((res) => {
  //       console.log("Dropdown populated from GS", res);
  //       this._populateSelectOptions(res);
  //       return true;
  //     })
  //     .withFailureHandler((error) => {
  //       console.log(error);
  //       return false;
  //     })
  //     .getRelatedTablesByModel(this.model());
  // },

  populateDropdown: function () {
    return new Promise(function (resolve, reject) {
      google.script.run
        .withSuccessHandler(function (res) {
          console.log("Dropdown populated from GS", res);
          this._populateSelectOptions(res);
          resolve(res);
        })
        .withFailureHandler(function () {
          console.log(error);
          reject();
        })
        .getRelatedTablesByModel(this.model());
    });
  },

  model: function (prefs) {
    var obj = {};
    if (this.fields) {
      this.fields.forEach((fld) => {
        if (fld.default) {
          if (typeof fld.default == "function") {
            obj[fld.model] = fld.default();
          } else {
            obj[fld.model] = fld.default;
          }
        } else {
          obj[fld.model] = "";
        }
      });
    } else {
      var groups = this.groups;
      groups.forEach((group) => {
        group.fields.forEach((fld) => {
          if (fld.default) {
            if (typeof fld.default == "function") {
              obj[fld.model] = fld.default();
            } else {
              obj[fld.model] = fld.default;
            }
          } else {
            obj[fld.model] = "";
          }
          if (fld.getModifiedLabel) {
            fld.label = fld.getModifiedLabel(fld.label, prefs);
          }
        });
      });
    }
    return obj;
  },
  getFileFields: function () {
    let arr = [];
    try {
      if (this.fields) {
        this.fields.forEach((fld) => {
          if (fld.inputType === "file") {
            arr.push(fld.id);
          }
        });
      } else {
        var groups = this.groups;
        groups.forEach((group) => {
          group.fields.forEach((fld) => {
            if (fld.inputType === "file") {
              arr.push(fld.id);
            }
          });
        });
      }
      return arr;
    } catch (error) {
      console.log("File Fileds may not be defined");
    }
  },

  _mappedFldsFromSchema: function () {
    var flds = [];
    if (this.fields) {
      for (let index = 0; index < this.fields.length; index++) {
        flds.push(this.fields[index].model);
      }
      // this.fields.forEach((fld) => {
      //   flds.push(fld.model);
      // });
    } else {
      var groups = this.groups;

      for (let index = 0; index < groups.length; index++) {
        const group = groups[index];
        for (let index = 0; index < group.fields.length; index++) {
          flds.push(group.fields[index].model);
        }
      }
    }
    console.log("Extractedfields", flds);
    return flds;
  },
};

class Fields {
  constructor(fields) {
    this.displayFields = fields;
  }
  addFields(fields) {
    return _.concat(this.displayFields, fields);
  }
  removeFields(fields) {
    return _.difference(this.displayFields, fields);
  }
}
