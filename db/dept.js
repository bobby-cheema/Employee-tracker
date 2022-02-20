const db = require("./connection");
module.exports = class Department {
  constructor(name) {
    this.name = name;
  }
  viewDept() {
    return db.execute("SELECT * from department ");
  }
  addDept() {
    return db.execute("insert into department (name) VALUES (?) ", [this.name]);
  }
  selectList() {
    return db.execute("SELECT name from department ");
  }
  getid(findme) {
    return db.execute(`select id from department where name="${findme}"`);
  }
};
