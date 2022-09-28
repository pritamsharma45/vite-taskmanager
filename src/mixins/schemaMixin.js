export default {
  files: {},
  model: function() {
    const obj = this.generateModelRecursively(this.fields, {});
    return obj;
  },
  fKeyFields: function() {
    const o = this.generateFKeySourceRecursively(this.fields, {});
    return o;
  },

  generateModelRecursively: function(fields, obj) {
    fields.forEach((fld) => {
      if (fld.fields != null) {
        obj[fld.name] = {};
        if (fld.inputType === "group") {
          obj[fld.name] = [{}];
          this.generateModelRecursively(fld.fields, obj[fld.name][0]);
        } else if (fld.linkedFieldSet != null) {
          obj[fld.name] = "";
          if (!fld.isFkey == false) {
            this.fKeySource[fld.name] = fld.optionSource;
          }
          obj[fld.linkedFieldSet.name] = {};
          this.generateModelRecursively(
            fld.fields,
            obj[fld.linkedFieldSet.name]
          );
        } else {
          this.generateModelRecursively(fld.fields, obj[fld.name]);
        }
      } else {
        // console.log(fld.name);

        obj[fld.name] = "";
        if (!fld.isFkey == false) {
          this.fKeySource[fld.name] = fld.optionSource;
        }
        switch (fld.inputType) {
          // case "amount":
          //   obj[fld.name] = "";
          //   break;
          // case "number":
          //   obj[fld.name] = "";
          //   break;

          // case "date":
          //   obj[fld.name] = "";
          //   break;
          case "file":
            obj[fld.name] = "";
            this.files[fld.name] = [];
            break;
          default:
            obj[fld.name] = "";
            break;
        }
      }
    });
    return obj;
  },
  generateFKeySourceRecursively: function(fields, obj) {
    fields.forEach((fld) => {
      if (fld.fields != null) {
        this.generateFKeySourceRecursively(fld.fields, obj);
      } else {
        if (!fld.isForeignKey == false) {
          obj[fld.name] = {
            tblName: fld.optionSource,
            keyRenderFld: fld.keyRenderFld,
          };
        }
      }
    });
    return obj;
  },
  selectFields: function() {
    const arr = this.getSelectFields(this.fields, []);
    return arr;
  },
  foreignKeyFields: function() {
    const arr = this.getFkeyFields(this.fields, []);
    return arr;
  },
  toggleSections: function() {
    const obj = this.getToggleSections(this.fields, {});
    return obj;
  },
  getFkeyFields: function(fields, arr) {
    try {
      fields.forEach((fld) => {
        if (fld.inputType === "select" && !fld.isFkey == false) {
          arr.push({ fldName: fld.name, keyRenderFld: fld.keyRenderFld });
        } else if (fld.inputType === "group") {
          this.getFkeyFields(fld.fields, arr);
        }
      });
      console.log("Fields with Fkeys", arr);
      return arr;
    } catch (error) {
      console.log("Fields with Fkeys not present");
    }
  },
  getSelectFields: function(fields, arr) {
    try {
      fields.forEach((fld) => {
        if (fld.inputType === "select") {
          arr.push(fld.optionSource);
        } else if (fld.inputType === "group") {
          this.getSelectFields(fld.fields, arr);
        }
      });
      console.log("Option Source Array", arr);
      return arr;
    } catch (error) {
      console.log("Option Source may not be defined");
    }
  },
  getFileFields: function() {
    let arr = [];
    try {
      this.fields.forEach((fld) => {
        if (fld.inputType === "file") {
          arr.push(fld.name);
        }
      });
      console.log("File Fields", arr);
      return arr;
    } catch (error) {
      console.log("File Fileds may not be defined");
    }
  },
  getToggleSections: function(fields, obj) {
    try {
      fields.forEach((fld) => {
        if (fld.inputType === "showSectionButton") {
          let o = {};
          o.showSection = false;

          obj[fld.name] = o;
        }
      });
      console.log("Toggle Sectioons : ", obj);
      return obj;
    } catch (error) {
      console.log("Toggle Sections may not be defined");
    }
  },
};
