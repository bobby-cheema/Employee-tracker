const db = require("./connection");
module.exports = class employee {
  constructor(firstName, lastName, myrole, managerid) {
    (this.firstName = firstName),
      (this.lastName = lastName),
      (this.myrole = myrole),
      (this.managerid = managerid);
  }
  viewEmployee() {
    return db.execute(
      " SELECT  e.first_name as 'first name'  , e.last_name as 'last name'  , m.first_name    as 'Manager Name' , role.salary , role.title as 'Employee role' , department.name as Department  from employee e LEFT  JOIN  employee m ON e.manager_id= m.id  LEFT join role  on e.role_id=role.id    JOIN department on role.department_id=department.id   "
    );
    //return db.execute("SELECT * FROM employee");
  }
  addEmployee() {
    return db.execute(
      "insert into employee(first_name,last_name,role_id,manager_id) VALUES (?,?,?,?)",
      [this.firstName, this.lastName, this.myrole, this.managerid]
    );
  }
};
