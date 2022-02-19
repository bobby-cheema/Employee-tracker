const db = require("./connection");
module.exports = class employee {
  constructor() {}
  viewEmployee() {
    return db.execute("SELECT * from employee");
  }
};
