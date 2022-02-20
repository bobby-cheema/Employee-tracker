const db = require("./connection");
module.exports = class Role {
  constructor(rolename, salary, department) {
    (this.rolename = rolename),
      (this.salary = salary),
      (this.department = department);
  }
  viewRole() {
    return db.execute("SELECT * from role ");
  }
  runQuery(query) {
    return db.execute(query);
  }
  addRole() {
    return db.execute(
      "insert into role(title,salary,department_id) VALUES (?,?,?)",
      [this.rolename, this.salary, this.department]
    );
  }
};
