const db = require("./connection");
module.exports = class Department {
  constructor() {}
  viewDept() {
    return db.execute("SELECT * from department ");
  }
};
