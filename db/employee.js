const db = require("./connection");
module.exports = class employee {
  constructor(firstName, lastName, myrole, managerid) {
    (this.firstName = firstName),
      (this.lastName = lastName),
      (this.myrole = myrole),
      (this.managerid = managerid);
  }
  viewEmployee() {
    return db.execute("SELECT * from employee");
  }
  addEmployee() {
    return db.execute(
      "insert into employee(first_name,last_name,role_id,manager_id) VALUES (?,?,?,?)",
      [this.firstName, this.lastName, this.myrole, this.managerid]
    );
  }
};
