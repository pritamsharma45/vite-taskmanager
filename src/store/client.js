import Vue from "vue";

const state = Vue.observable({
  tables: {},
  clientInfoHeader: [],
  clientNoteHeader: [],
});

export default {
  get state() {
    return state;
  },
  async getTables() {
    try {
      google.script.run
        .withSuccessHandler((res) => {
          state.tables = JSON.parse(res);
        })
        .withFailureHandler((error) => {
          console.log(error);
        })
        .getStringifiedTables(["tbl_client_info", "tbl_client_notes"]);
    } catch (error) {}
  },

  getClientNotes(client_id) {
    let notes = state.tables.tbl_client_notes;
    state.clientNoteHeader = notes[0];
    notes = this.ArrayToJSON(notes);
    notes = notes.filter((note) => {
      return note.client_id === client_id;
    });
    if (notes.length > 0) {
      return notes;
    } else {
      return null;
    }
  },
  getClientInfo(client_id) {
    let infos = state.tables.tbl_client_info;
    state.clientInfoHeader = infos[0];
    infos = this.ArrayToJSON(infos);
    infos = infos.filter((info) => {
      return info.client_id === client_id;
    });
    if (infos.length > 0) {
      return infos[0];
    } else {
      return null;
    }
  },
  updateStoreTable_(ids, tableName, updateAttribute) {
    var table = state.tables[tableName];

    ids.forEach((id) => {
      let item = table.find((item) => item.id === id);
      Object.keys(updateAttribute).forEach((key) => {
        item[key] = updateAttribute[key];
      });
    });
    // console.log(table);
  },
  ArrayToJSON(array2D) {
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
};
