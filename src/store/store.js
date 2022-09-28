import Vue from "vue";

const state = Vue.observable({
  loggedUserId: "",
  tables: {},
  dropdowns: {},
  indexedDropdowns: {},
  jobs: [],
  programs: [],
  projects: [],
  dependentJobs: {},
  works: [],
  loggedUser: null,
  loggedUserObj: {},
  loading: true,
  tablesLoaded: false,
  report: {},
});

export default {
  get state() {
    return state;
  },
  getIndexedTables(tableNames) {
    let dt = new Date();
    // if (dt.getMonth() > 8) return;
    if (state.tablesLoaded == true) {
      tableNames.forEach((name) => {
        state.indexedDropdowns[name] = this.getIndexedItems(state.tables[name]);
        // o[name] = this.getIndexedItems(state.tables[name]);
      });
    } else {
    }
    console.log("Indexed Items :", state.indexedDropdowns);
  },
  // async getDropdowns() {
  //   try {
  //     google.script.run
  //       .withSuccessHandler((res) => {
  //         console.log("State [Dropdowns] :", res);
  //         state.dropdowns = res;
  //       })
  //       .withFailureHandler((error) => {
  //         console.log(error);
  //       })
  //       .getDropdowns(["tbl_Suppliers", "tbl_Customers", "tbl_Users"]);
  //   } catch (error) {}
  // },
  // async getIndexedDropdowns() {
  //   try {
  //     google.script.run
  //       .withSuccessHandler((res) => {
  //         state.indexedDropdowns = res;
  //         console.log("State [Indexed Dropdowns] :", res);
  //       })
  //       .withFailureHandler((error) => {
  //         console.log(error);
  //       })
  //       .getIndexedDropdowns(["tbl_Suppliers", "tbl_Customers", "tbl_Users"]);
  //   } catch (error) {}
  // },
  // async getPrograms() {
  //   try {
  //     google.script.run
  //       .withSuccessHandler((res) => {
  //         console.log("State [Programs] :", res);
  //         state.programs = res;
  //       })
  //       .withFailureHandler((error) => {
  //         console.log(error);
  //       })
  //       .ETCSPROGRAMS();
  //   } catch (error) {}
  // },
  // async getJobs() {
  //   try {
  //     google.script.run
  //       .withSuccessHandler((res) => {
  //         console.log("State [ETCSTOOLS] :", res);
  //         state.jobs = res;
  //       })
  //       .withFailureHandler((error) => {
  //         console.log(error);
  //       })
  //       .GetAllJobs();
  //   } catch (error) {}
  // },
  getLoggedInUser() {
    return new Promise(function(resolve, reject) {
      google.script.run
        .withSuccessHandler(function(res) {
          console.log("Logged User:", res);

          state.loggedUserId = res;
          resolve(res);
        })
        .withFailureHandler(function() {
          reject();
        })
        .getLoggedInUser();
    });
  },
  getStringifiedTables() {
    const tableNames = [
      "tbl_CustomerPayments",
      "tbl_SupplierPayments",
      "tbl_HomelineExpenses",
      "tbl_ETCSPORequest",
      "tbl_CustomerPORequest",
      "tbl_ReimbursementUSA",
      "tbl_ReimbursementIndia",
      "tbl_ReimbursementFuel",
      "tbl_ProjectOverview",
      "tbl_TimeLog",
      "tbl_Customers",
      "tbl_Suppliers",
      "tbl_Users",
      "tbl_Items",
      "tbl_Vehicles",
      "tbl_Works",
      "tbl_ShipmentParts",
      "tbl_ShipmentTools",
      "tbl_ShipmentMisc",
      "tbl_ShipmentMaterial",
      // "tbl_task",
    ];
    var that = this;
    return new Promise(function(resolve, reject) {
      google.script.run
        .withSuccessHandler(function(res) {
          console.log("State [All Stringified Tables] :", res);
          // state.tables = res;
          state.loading = false;
          state.tablesLoaded = true;
          // console.log("State [All Stringified Tables] :", res);
          tableNames.forEach((name) => {
            res[name] = that._ArrayToJSON(res[name]).map((row) => {
              let files;
              return {
                id: row.id,
                ...JSON.parse(row.model),
                files: row.files ? JSON.parse(row.files) : "",
                model: JSON.parse(row.model),
              };
            });
          });
          // console.log("After deconstruction", res);
          state.tables = res;
          that.getIndexedTables([
            "tbl_Customers",
            "tbl_Suppliers",
            "tbl_Works",
            "tbl_Users",
            "tbl_Items",
            "tbl_Vehicles",
          ]);
          that.GetAllJobs();
          that.getDependentJobs();
          that.ETCSPROGRAMS();
          that.ETCSPROJECTS();
          // console.log("Inxed DD ", state.indexedDropdowns);
          state.loading = false;
          resolve(res);
        })
        .withFailureHandler(function() {
          reject();
        })
        .getStringifiedTables(tableNames);
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
    return arr2.reverse();
  },
  updateOrAddItem(item, tableName) {
    try {
      if (tableName === "tbl_task") {
        if (item.hasOwnProperty("id")) {
          let foundItem = taskStore.state.tasks.find((k) => {
            k.id === item.id;
          });
          foundItem = { ...foundItem, ...item };
        } else {
          taskStore.state.tasks.push(item);
        }
        console.log(
          `Items in ${tableName} after Updating or Adding Item. Item:-`,
          taskStore.state.tasks
        );
      } else {
        if (item.hasOwnProperty("id")) {
          let foundItem = state.tables[tableName].find((k) => {
            k.id === item.id;
          });
          foundItem = { ...foundItem, ...item };
        } else {
          state.tables[tableName].push(item);
        }
        console.log(
          `Items in ${tableName} after Updating or Adding Item. Item:-`,
          state.tables[tableName]
        );
      }
    } catch (error) {}
  },
  getIndexedItems(arr) {
    // console.log("dfgpopuiotydtrdfsdfgs");
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
    const arr = Object.keys(this.allTables[tableName][0]);
    // console.log(arr);
    return arr;
  },
  getDependentJobs() {
    let jsonsArray = state.tables["tbl_ProjectOverview"];
    let mapped = jsonsArray.map((row) => {
      let { etcs_tool_entries, program_name } = row.model;

      let concatenated_tools = etcs_tool_entries.map((tool) => {
        let arr = [];
        for (const [k, v] of Object.entries(tool)) {
          arr.push(v);
        }
        return arr.join("-");
      });
      let obj = {};
      obj[program_name] = concatenated_tools;
      return obj;
    });
    // console.log("Mapped Tools and jobs", mapped);
    state.dependentJobs = mapped;
  },
  GetAllJobs() {
    let jsonsArray = state.tables["tbl_ProjectOverview"];
    let jobs = [];
    jsonsArray.forEach((row) => {
      let { etcs_tool_entries, program_name } = row.model;
      etcs_tool_entries.forEach((tool) => {
        let arr = [];
        let o = {};
        for (const [k, v] of Object.entries(tool)) {
          arr.push(v);
        }
        jobs.push({ job_name: arr.join("-"), program_name: program_name });
      });
    });
    // console.log("Jobs", jobs);
    state.jobs = jobs.sort();
    // Logger.log(jobs);
    // return jobs.sort();
  },

  ETCSPROGRAMS() {
    let jsonsArray = state.tables["tbl_ProjectOverview"];
    let mapped = jsonsArray.map((row) => {
      let { program_name } = row.model;
      return program_name;
    });

    state.programs = mapped.sort();
  },
  ETCSPROJECTS() {
    let jsonsArray = state.tables["tbl_ProjectOverview"];
    let mapped = jsonsArray.map((row) => {
      let { project_name } = row.model;
      return project_name;
    });
    state.projects = mapped.sort();
  },
  getProfitSheet() {
    let custpmerPaymentTbl = [];
  },
};
