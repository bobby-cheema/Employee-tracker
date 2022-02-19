const db = require("./connection");
module.exports = class Role {
  constructor() {}
  viewRole() {
    return db.execute("SELECT * from role ");
  }
};
