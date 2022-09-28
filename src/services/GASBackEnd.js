"use strict";

class GASBackEnd {
    constructor() {}
    sayHello() {
        return new Promise(function(resolve, reject) {
            google.script.run
                .withSuccessHandler(function(res) {
                    resolve(res);
                })
                .withFailureHandler(function() {
                    reject();
                })
                .sayHello();
        });
    }

    addEntry(formDataObject, formName) {
        return new Promise(function(resolve, reject) {
            google.script.run
                .withSuccessHandler(function(res) {
                    resolve(res);
                })
                .withFailureHandler(function() {
                    reject();
                })
                .addEntry(formDataObject, formName);
        });
    }
    createPRF(formDataObject) {
        return new Promise(function(resolve, reject) {
            google.script.run
                .withSuccessHandler(function(res) {
                    resolve(res);
                })
                .withFailureHandler(function() {
                    reject();
                })
                .createPRF(formDataObject);
        });
    }
    GetTableDataSource(sheetName) {
        return new Promise(function(resolve, reject) {
            google.script.run
                .withSuccessHandler(function(res) {
                    resolve(res);
                })
                .withFailureHandler(function() {
                    reject();
                })
                .GetTableDataSource(sheetName);
        });
    }
    getFormNumber(formName) {
        return new Promise(function(resolve, reject) {
            google.script.run
                .withSuccessHandler(function(res) {
                    resolve(res);
                })
                .withFailureHandler(function() {
                    reject();
                })
                .getFormNumber(formName);
        });
    }
    GetPRFDetail() {
        return new Promise(function(resolve, reject) {
            google.script.run
                .withSuccessHandler(function(res) {
                    resolve(res);
                })
                .withFailureHandler(function() {
                    reject();
                })
                .GetPRFDetail();
        });
    }
    GetTables() {
        return new Promise(function(resolve, reject) {
            google.script.run
                .withSuccessHandler(function(res) {
                    resolve(res);
                })
                .withFailureHandler(function() {
                    reject();
                })
                .GetTables();
        });
    }
    GetTablesInPRFEntries(id) {
        return new Promise(function(resolve, reject) {
            google.script.run
                .withSuccessHandler(function(res) {
                    resolve(res);
                })
                .withFailureHandler(function() {
                    reject();
                })
                .GetTablesInPRFEntries(id);
        });
    }
    GetPrefilledFormData(form_number, sheetName, stage) {
        return new Promise(function(resolve, reject) {
            google.script.run
                .withSuccessHandler(function(res) {
                    resolve(res);
                })
                .withFailureHandler(function() {
                    reject();
                })
                .GetPrefilledFormData(form_number, sheetName, stage);
        });
    }

    GetTablesInSRFEntries(id) {
        return new Promise(function(resolve, reject) {
            google.script.run
                .withSuccessHandler(function(res) {
                    resolve(res);
                })
                .withFailureHandler(function() {
                    reject();
                })
                .GetTablesInSRFEntries(id);
        });
    }

    sendMailPRF(form_id, mailIds, listName) {
        return new Promise(function(resolve, reject) {
            google.script.run
                .withSuccessHandler(function(res) {
                    resolve(res);
                })
                .withFailureHandler(function() {
                    reject();
                })
                .sendMailPRF(form_id, mailIds, listName);
        });
    }
    sendMail2(obj) {
        return new Promise(function(resolve, reject) {
            google.script.run
                .withSuccessHandler(function(res) {
                    resolve(res);
                })
                .withFailureHandler(function() {
                    reject();
                })
                .sendMail2(obj);
        });
    }


}

export default GASBackEnd;