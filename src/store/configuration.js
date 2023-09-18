import Vue from "vue";
// import taskStore from "./task";
// import clientStore from "./client";

const state = Vue.observable({
  country: "uk",
  dropdowns: {},
  indexedDropdowns: {},
  licensed: false,
  tables: {},
  prefs: {},
  tablesLoaded: false,
  loading: false,
  loggedUser: null,
  owner: null,
  logoURL: "",
  tableFont: "big",
  about: {
    trial_start_date: "",
    app_mode: "Under Trial",
    owner: "null",
  },
  app_status: {},
  mailDrafts: [],
});

export default {
  get state() {
    return state;
  },
  get allTables() {
    return {
      ...state.tables,
    };
  },
  getIndexedTables() {
    const tableNames = [
      "tbl_task_type",
      "tbl_activity_type",
      "tbl_client_type",
      "tbl_periodicity",
      "tbl_user",
      "tbl_manager",
      "tbl_timesheet",
      "tbl_client",
      "tbl_task",
    ];
    let o = {};
    if (state.tablesLoaded == true) {
      tableNames.forEach((name) => {
        state.indexedDropdowns[name] = this.getIndexedItems(state.tables[name]);
        // o[name] = this.getIndexedItems(state.tables[name]);
      });
    } else {
    }
    console.log("Indexed Items :", state.indexedDropdowns);
  },
  //  Preferences
  async getPreference() {
    try {
      google.script.run
        .withSuccessHandler((res) => {
          if (!res) {
            console.log("Get Prefs", res);
          } else {
            console.log("Get Prefs", res);
            state.prefs = JSON.parse(res);
            let logoURL = state.prefs.logo_url;
            logoURL = logoURL.replace("file/d/", "uc?export=view&id=");
            logoURL = logoURL.replace("/view?usp=sharing", "");
            state.logoURL = logoURL;
          }
        })
        .withFailureHandler((error) => {
          console.log(error);
        })
        .getPreference();
    } catch (error) {}
  },
  async savePreference(model) {
    let prefs = JSON.stringify(model);

    try {
      google.script.run
        .withSuccessHandler((res) => {
          console.log(res);
          state.prefs = model;
          // this.isSaving = false;
          // this.disabled = false;
        })
        .withFailureHandler((error) => {
          console.log(error);
        })
        .setPreference(prefs);
    } catch (error) {}
  },
  getTables() {
    var that = this;
    return new Promise(function (resolve, reject) {
      google.script.run
        .withSuccessHandler(function (res) {
          state.tables = res;
          state.loading = false;
          state.tablesLoaded = true;
          console.log("State [All Tables] :", res);
          // sort by name
          res["tbl_client"].sort(function (a, b) {
            const nameA = a.client_name.toUpperCase(); // ignore upper and lowercase
            const nameB = b.client_name.toUpperCase(); // ignore upper and lowercase
            if (nameA < nameB) {
              return -1;
            }
            if (nameA > nameB) {
              return 1;
            }

            // names must be equal
            return 0;
          });
          that.getIndexedTables();
          resolve(res);
        })
        .withFailureHandler(function () {
          reject();
        })
        .GetTables([
          "tbl_task_type",
          "tbl_activity_type",
          "tbl_client_type",
          "tbl_periodicity",
          "tbl_user",
          "tbl_manager",
          "tbl_client",
          "tbl_timesheet",
          "tbl_task",
          "tbl_invoice",
          "tbl_custom_invoice",
        ]);
    });
  },
  loadTables(tblNames) {
    var that = this;
    return new Promise(function (resolve, reject) {
      google.script.run
        .withSuccessHandler(function (res) {
          Object.keys(res).forEach((key) => {
            state.tables[key] = res[key];
          });
          state.loading = false;
          state.tablesLoaded = true;
          console.log("State [All Tables] :", state.tables);
          resolve(res);
        })
        .withFailureHandler(function () {
          reject();
        })
        .GetTables(tblNames);
    });
  },

  getCompletedTaskS() {
    const tasks = state.tasks;
    tasks = state.tables["tbl_task"].filter((task) => {
      return task.status === "Completed";
    });

    return tasks;
  },
  getClientsByStatus(status) {
    if (status === "All") return state.tables["tbl_client"];
    const clients = state.tables["tbl_client"].filter((client) => {
      return client.status === status;
    });
    return clients;
  },
  getClientListBasedOnCriteria(status, taskType = "") {
    // const tasks = state.tables['tbl_task'];
    var tasks;
    if (status === "All") {
      tasks = state.tables["tbl_task"].filter((task) => {
        return taskType === "" ? true : task.task_type_id === Number(taskType);
      });
    } else {
      tasks = state.tables["tbl_task"].filter((task) => {
        return taskType === ""
          ? task.status === status
          : task.status === status && task.task_type_id === Number(taskType);
      });
    }

    console.log("Filtered Tasks", tasks);

    const filteredClients = tasks.map((task) => {
      const client = state.indexedDropdowns["tbl_client"][task.client_id];
      return client;
    });
    return filteredClients;
  },
  updateOrAddItem(item, tableName) {
    try {
      if (item.hasOwnProperty("id")) {
        let foundItem = state.tables[tableName].find((k) => {
          k.id === item.id;
        });
        foundItem = { ...foundItem, ...item };
      } else {
        let id = Math.max.apply(
          Math,
          state.tables[tableName].map(function (o) {
            return o.id;
          })
        );
        if (!isFinite(id)) {
          id = 0;
        }
        item.id = id + 1;
        state.tables[tableName].push(item);
      }

      this.getIndexedTables();

      // console.log(
      //   `Items in ${tableName} after Updating or Adding Item. Item:-`,
      //   this.state.tables[tableName]
      // );
    } catch (error) {
      console.log("Error in Updateor Add item", error);
    }
  },
  getIndexedItems(arr) {
    console.log("dfgpopuiotydtrdfsdfgs");
    if (arr.length > 0) {
      let o = {};
      arr.forEach((el) => {
        o[el.id] = el;
      });
      return o;
    } else {
      console.log("Indexing Not possible. Due to empty array provided");
      return {};
    }
  },
  /**
   * Function to check if item in a given table is deletable or not.
   * @param {Object} item: Item to be deleted
   * @param {String} fromTable:Table from which item to be deleted.
   * @param {String} inTables: Array of table names to look for
   * @returns {Boolean}
   */
  isDeletable(item, fromTable, inTables) {
    const fld = fromTable.replace("tbl_", "") + "_id";
    const keys = this._getFkeys(fld, inTables);
    // console.log(keys);
    var bool = true;
    Object.keys(keys).forEach((k) => {
      if (keys[k].length > 0) {
        if (keys[k].includes(item.id)) {
          bool = false;
        }
      }
    });

    return bool;
  },
  _getFkeys(forField, inTables) {
    let o = {};
    var that = this;
    inTables.forEach((tbl) => {
      console.log("GetFeys: table name:-", tbl);
      if (that._getHeader(tbl).includes(forField)) {
        if (that.allTables[tbl].length > 0) {
          const arr = that.allTables[tbl].map((el) => {
            return el[forField];
          });
          o[tbl] = arr;
        } else {
          o[tbl] = [];
        }
      }
    });
    return o;
  },
  _getHeader(tableName) {
    // console.log("All tables", this.allTables);
    if (this.allTables[tableName].length < 1) {
      return [];
    }
    const arr = Object.keys(this.allTables[tableName][0]);
    return arr;
  },
  getStringifiedTables() {
    var that = this;
    return new Promise(function (resolve, reject) {
      google.script.run
        .withSuccessHandler(function (res) {
          console.log("State [All Tables] :", res);
          that.getIndexedTables();
          resolve(res);
        })
        .withFailureHandler(function () {
          reject();
        })
        .GetTables([
          "tbl_task_type",
          "tbl_activity_type",
          "tbl_client_type",
          "tbl_periodicity",
          "tbl_user",
          "tbl_client",
          // "tbl_task",
        ]);
    });
  },
  _ArrayToJSON(array2D) {
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
  },
  async deleteItems(selectedItems, tableName) {
    state.loading = true;
    var that = this;
    let res = {};
    res["selected"] = selectedItems.length;
    selectedItems = selectedItems.filter((item) => {
      return this.isDeletable(item, "tbl_client", ["tbl_task"]);
    });

    if (selectedItems.length == 0) {
      res["deleted"] = selectedItems.length;
      res["message"] = "Item found in other tables.";
      return res;
    }
    selectedItems = selectedItems.map((item) => {
      if (item._showDetails) {
        delete item["_showDetails"];
      }
      return item;
    });

    console.log("Passed items for deletion", selectedItems);
    try {
      google.script.run
        .withSuccessHandler((result) => {
          state.loading = false;
          console.log("Bulk Delete", result);
          if (result) {
            res["deleted"] = selectedItems.length;
            console.log("Delete Status", res);
            that.updateStoreAfterDelete_(selectedItems, tableName);
            return res;
          }
        })
        .withFailureHandler((error) => {
          console.log(error);
        })
        .BulkDelete(selectedItems, tableName);
    } catch (error) {}
  },
  async updateItems(ids, tableName, updateAttribute) {
    state.loading = true;
    var that = this;
    console.log("Passed items for updation", ids);
    try {
      google.script.run
        .withSuccessHandler((res) => {
          state.loading = false;
          console.log("Items Updated", res);
          that.updateStoreTable_(ids, tableName, updateAttribute);
        })
        .withFailureHandler((error) => {
          console.log(error);
        })
        .BulkUpdateByIds(ids, tableName, updateAttribute);
    } catch (error) {
      console.log("Error in bulk delete", error);
    }
  },
  updateStoreTable_(ids, tableName, updateAttribute) {
    var table = this.state.tables[tableName];

    ids.forEach((id) => {
      let item = table.find((item) => item.id === id);
      Object.keys(updateAttribute).forEach((key) => {
        item[key] = updateAttribute[key];
      });
    });
    // console.log(table);
  },
  updateStoreAfterDelete_(selectedItems, tableName) {
    var table = this.state.tables[tableName];

    selectedItems.forEach((item) => {
      table.splice(
        table.findIndex((a) => a.id === item.id),
        1
      );
    });
  },
  isEmpty(tableName) {
    return this.state.tables[tableName].length < 1;
  },
  CheckAppStatus() {
    var that = this;
    return new Promise(function (resolve, reject) {
      google.script.run
        .withSuccessHandler(function (res) {
          state.owner = res;
          const key = that.getKey_(res);
          const fetchedKey = that.fetchKey();
          state.licensed = key === fetchedKey;
          resolve(res);
        })
        .withFailureHandler(function () {
          reject();
        })
        .GetOwner();
    });
  },
  fetchKey() {},
  matchLicenseKey_() {
    this.keySubmitting = true;
    console.log("Matching License LicenseKey");
    const matchKey = this.getLicenseKey();
    if (this.key === matchKey) {
      google.script.run
        .withSuccessHandler((res) => {
          console.log("License Key matched : ", res);
          this.keySubmitting = !res;
          this.key = "";
          this.msg = "Thank you. Refresh the link to use it.";
          this.msgClass = "text-success";
          this.setAppScecret();
        })
        .withFailureHandler((error) => {
          console.log(error);
        })
        .MakeItLicensed();
    } else {
      this.key = "";
      this.keySubmitting = false;
      this.msg = "Sorry !. You have entered the wrong key.";
      this.msgClass = "text-warning";
    }
  },
  getKey_(email) {
    let str = email;
    str = str.split("@")[0].replace(/[^a-zA-Z]/gm, "");
    const str1 = str.slice(3).split("").reverse().join("");
    const str2 = str.slice(-4, 2).split("").reverse().join("");
    const str3 = str.slice(3, 3).split("").reverse().join("");
    str = str2 + str3 + str1;
    let result = "";
    let charcode = 0;
    for (let i = 0; i < str.length; i++) {
      charcode = str[i].charCodeAt() + 3;
      result += String.fromCharCode(charcode);
    }
    console.log("LKey", result);
    return result.toLowerCase();
  },

  getDrafts() {
    var that = this;
    return new Promise(function (resolve, reject) {
      google.script.run
        .withSuccessHandler(function (res) {
          that.state.mailDrafts = res;
          console.log("Mail Drafts loaded", res);
          resolve(res);
        })
        .withFailureHandler(function () {
          reject();
        })
        .getDrafts();
    });
    // ----------
  },
  isLocalStorageAvailable_() {
    var test = "test";
    try {
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch (e) {
      return false;
    }
  },

  getTaskNotes(task_id) {
    let notes = state.tables.tbl_task_notes;
    console.log("Task Notes", notes);

    // state.clientNoteHeader = notes[0];

    notes = notes.filter((note) => {
      return note.task_id === task_id;
    });
    if (notes.length > 0) {
      return notes;
    } else {
      return null;
    }
  },
};
