const inquirer = require("inquirer");
const dept = require("../db/dept");
const role = require("../db/role");
const employee = require("../db/employee");
const mytable = require("console.table");

const budget = async () => {
  await new role()
    .runQuery(
      "select  department.name  department  , sum(role.salary)  Budged  from role    join department on role.department_id=department.id    group by role.department_id  ;"
    )
    .then(([result]) => {
      console.clear();
      console.log("\n\n\n");
      console.table(result);

      main();
      // result.forEach((obj) => {
      //   console.log("OBJECT IS ", obj);
      //   // const { department, Budget } = obj;
      //   // fullList.push(first_name);
      // });
    })
    .catch((e) => {
      console.log("failed  db operataion", e);
    });
};

const updateManager = async () => {
  let newManager;
  let newManagerList = [];
  let employee;
  let newManagerid;
  let fullList = [];
  await new role()
    .runQuery("select first_name, last_name from employee")
    .then(([result]) => {
      result.forEach((obj) => {
        const { first_name, last_name } = obj;
        fullList.push(first_name);
      });
    })
    .catch((e) => {
      console.log("failed  db operataion", e);
    });

  inquirer
    .prompt([
      {
        name: "employee",
        type: "list",
        message: "choose the Employee to update",
        choices: fullList,
      },
    ])
    .then(async (ans) => {
      console.log("INQUIRER answers", ans.employee);
      employee = ans.employee;
      //Choose new Manager

      await new role()
        .runQuery("select first_name from employee where role_id = 1")
        .then(([result]) => {
          console.log("DEBUG", result);
          result.forEach((obj) => {
            const { first_name } = obj;
            newManagerList.push(first_name);
          });
        });

      inquirer
        .prompt([
          {
            name: "updateManager",
            type: "list",
            message: "choose New Manager",
            choices: newManagerList,
          },
        ])
        .then(async (res) => {
          console.log("NEW RPOLE ANS ", res.updateManager);
          // get id for the role to add to db
          newManager = res.updateManager;
          // get id of new manager
          await new role()
            .runQuery(
              `SELECT id from employee where first_name="${newManager}" `
            )
            .then(([result]) => {
              const { id } = result[0];
              newManagerid = id;
            })
            .catch((e) => {
              console.log("failed to get data", e);
            });

          await new role()
            .runQuery(
              `update  employee set  manager_id=${newManagerid}  where first_name ="${employee}"`
            )
            .then((res) => {
              console.log("Sucessfully Updated the employee's Manager ");
              main();
            })
            .catch((e) => {
              console.log("Failed DB action", e);
            });
        });
    })
    .catch((e) => {
      console.log("inquirer Error ", e);
    });
};

const updateEmployee = async () => {
  let currentRole;
  let fullList = [];
  await new role()
    .runQuery("select first_name,last_name from employee")
    .then(([result]) => {
      result.forEach((obj) => {
        const { first_name, last_name } = obj;
        fullList.push(first_name);
      });
    })
    .catch((e) => {
      console.log("failed  db operataion", e);
    });

  inquirer
    .prompt([
      {
        name: "employee",
        type: "list",
        message: "choose the Employee to update",
        choices: fullList,
      },
    ])
    .then(async (ans) => {
      console.log("INQUIRER answers", ans.employee);
      //Choose new role

      let NewRoleList = [];

      await new role()
        .runQuery("select id, title from role")
        .then(([result]) => {
          result.forEach((obj) => {
            const { id, title } = obj;
            NewRoleList.push(title);
          });
        });

      inquirer
        .prompt([
          {
            name: "updateRole",
            type: "list",
            message: "choose Employees new Role",
            choices: NewRoleList,
          },
        ])
        .then(async (res) => {
          console.log("NEW RPOLE ANS ", res.updateRole);
          // get id for the role to add to db
          let newRole;
          await new role()
            .runQuery(`SELECT id from role where title="${res.updateRole}" `)
            .then(([result]) => {
              const { id } = result[0];
              newRole = id;
            })
            .catch((e) => {
              console.log("failed to get data", e);
            });
          console.log(
            `update  employee set new role to ${newRole}  where f_name ="${ans.employee}"  `
          );
          await new role()
            .runQuery(
              `UPDATE employee SET role_id= ${newRole} WHERE first_name="${ans.employee}"`
            )
            .then((res) => {
              console.log("Sucessfully Updated the employee role ");
              main();
            })
            .catch((e) => {
              console.log("Failed DB action", e);
            });
        });
    })
    .catch((e) => {
      console.log("inquirer Error ", e);
    });
};

const addEmployee = async () => {
  let roleList = [];
  let managerList = [];
  await new role().runQuery("select id, title from role").then(([result]) => {
    result.forEach((obj) => {
      const { id, title } = obj;
      roleList.push(title);
    });
  });

  await new role()
    .runQuery("select first_name from employee where role_id=1  ")
    .then(([result]) => {
      result.forEach((obj) => {
        const { first_name } = obj;
        managerList.push(first_name);
      });
    });

  console.log("MANAGER LIST IS ", managerList);

  inquirer
    .prompt([
      {
        name: "firstName",
        message: "Employee's First Name ? ",
      },
      {
        name: "lastName",
        message: "Employee's Last Name ? ",
      },
      {
        name: "role",
        type: "list",
        message: "choose the Designation ",
        choices: roleList,
      },
      {
        name: "manager",
        type: "list",
        message: "choose the Manager",
        choices: ["none", ...managerList],
      },
    ])
    .then(async (ans) => {
      let myrole;
      let managerid;

      await new role()
        .runQuery(`SELECT id from role where title="${ans.role}" `)
        .then(([result]) => {
          const { id } = result[0];
          myrole = id;
        })
        .catch((e) => {
          console.log("failed to get data", e);
        });
      if (ans.manager === "none") {
        managerid = null;
      } else {
        await new role()

          .runQuery(
            `SELECT id from employee where first_name="${ans.manager}" `
          )
          .then(([result]) => {
            const { id } = result[0];
            managerid = id;
          })
          .catch((e) => {
            console.log("failed to get data", e);
          });
      }

      await new employee(ans.firstName, ans.lastName, myrole, managerid)
        .addEmployee()
        .then(() => {
          console.log("Added the Employee");
          main();
        })
        .catch((e) => {
          console.log(e);
        });
    })
    .catch((err) => {
      console.log("failed to get employee details ", err);
    });
};

const addRole = async () => {
  let deptList = [];
  await new dept().selectList().then((result) => {
    for (const list in result[0]) {
      const { name } = result[0][list];
      deptList.push(name);
    }
  });

  inquirer
    .prompt([
      {
        name: "rolename",
        message: "which new role you want to add",
      },
      {
        name: "salary",
        message: "whats the salary for this role",
      },
      {
        name: "department",
        type: "list",
        message: "choose the department",
        choices: deptList,
      },
    ])
    .then(async (ans) => {
      const myid = await new dept()
        .getid(ans.department)
        .then(([id]) => {
          return id[0];
        })
        .catch((err) => {
          console.log("error", err);
        });

      new role(ans.rolename, ans.salary, myid.id)
        .addRole()
        .then((suc) => {
          console.log("sucessfully added");
          main();
        })
        .catch((err) => {
          console.log("failed to add", err);
        });
    })
    .catch((error) => {
      console.log("failed to get department", error);
    });
};
const addDept = async () => {
  inquirer
    .prompt([
      {
        name: "deptName",
        message: "Name of Department to add  ? ",
      },
    ])
    .then((ans) => {
      new dept(ans.deptName)
        .addDept()
        .then(() => {
          console.log("Sucessfully Added to department ", ans.deptName);
          main();
        })
        .catch(() => {
          console.log("Failed to add to DB");
        });
    })
    .catch((error) => {
      console.log("failed to get department", error);
    });
};
const main = () => {
  inquirer
    .prompt([
      {
        type: "list",
        name: "initQ",
        message: "What Would you like to do",
        choices: [
          "view all departments",
          "view all roles",
          "view all employees",
          "add a department",
          "add a role",
          "add an employee",
          "update an employee role",
          "Update Employees manager",
          "Department Budget",
        ],
      },
    ])
    .then((answers) => {
      console.log("You choose", answers.initQ);
      switch (answers.initQ) {
        case "view all departments":
          new dept().viewDept().then((result) => {
            console.clear();
            console.log("\n\n\n");
            console.table(result[0]);
            console.log("\n\n\n");
            main();
          });
          break;
        case "view all roles":
          new role().viewRole().then((result) => {
            console.clear();
            console.log("\n\n\n");
            console.table(result[0]);
            console.log("\n\n\n");
            main();
          });
          break;
        case "view all employees":
          new employee().viewEmployee().then((result) => {
            console.clear();
            console.log("\n\n\n");
            console.table(result[0]);
            console.log("\n\n\n");

            main();
          });
          break;
        case "add a department":
          addDept();

          break;
        case "add a role":
          addRole();
          break;
        case "add an employee":
          addEmployee();
          break;
        case "update an employee role":
          updateEmployee();
          break;

        case "Update Employees manager":
          updateManager();
          break;

        case "Department Budget":
          budget();
        default:
          console.log("you choose ", answers.initQ);
      }
    })
    .catch((error) => {
      console.log("SOmething Went Wrong", error);
    });
};

module.exports.main = main;
