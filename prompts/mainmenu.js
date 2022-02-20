const inquirer = require("inquirer");
const dept = require("../db/dept");
const role = require("../db/role");
const employee = require("../db/employee");
const mytable = require("console.table");

const addEmployee = async () => {
  let roleList = [];
  let managerList = [];
  await new role().runQuery("select id, title from role").then(([result]) => {
    // for (const list in result[0]) {
    //   const { name } = result[0][list];
    //   deptList.push(name);
    // }
    console.log("ADATA ", result);

    result.forEach((obj) => {
      const { id, title } = obj;
      roleList.push(title);
    });
  });

  await new role()
    .runQuery("select first_name from employee where id=1  ")
    .then(([result]) => {
      // for (const list in result[0]) {
      //   const { name } = result[0][list];
      //   deptList.push(name);
      // }
      console.log("ADATA ", result);

      result.forEach((obj) => {
        const { first_name } = obj;
        managerList.push(first_name);
      });
    });

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
      console.log("I HAVE MANAGER AS ", ans.manager);
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
            console.log(result[0]);
            const { id } = result[0];
            managerid = id;
          })
          .catch((e) => {
            console.log("failed to get data", e);
          });
      }

      console.log(
        "Adding ",
        ans.firstName,
        ans.lastName,
        ans.role,
        myrole,
        managerid
      );
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
  console.log("my array is ", deptList);
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

      console.log("found the id ", myid.id);
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
        ],
      },
    ])
    .then((answers) => {
      console.log("You choose", answers.initQ);
      switch (answers.initQ) {
        case "view all departments":
          new dept().viewDept().then((result) => {
            console.table(result[0]);

            main();
          });
          break;
        case "view all roles":
          new role().viewRole().then((result) => {
            console.table(result[0]);

            main();
          });
          break;
        case "view all employees":
          new employee().viewEmployee().then((result) => {
            console.table(result[0]);

            main();
          });
          break;
        case "add a department":
          addDept();
          //new dept().addDept(7, mydept);
          break;
        case "add a role":
          addRole();
          break;
        case "add an employee":
          addEmployee();
          break;
        default:
          console.log("you choose ", answers.initQ);
      }
    })
    .catch((error) => {
      console.log("SOmething Went Wrong", error);
    });
};

module.exports.main = main;
