const db = require("./connection");
module.exports = class Role {
  constructor(rolename, salary, department) {
    (this.rolename = rolename),
      (this.salary = salary),
      (this.department = department);
  }
  viewRole() {
    return db.execute(
      "select r.id ,  r.title as role, r.salary , d.name as department   from role r join department d on  r.department_id=d.id  "
    );
    //return db.execute("SELECT * from role ");
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
