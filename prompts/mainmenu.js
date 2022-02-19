const inquirer = require("inquirer");
const dept = require("../db/dept");
const role = require("../db/role");
const employee = require("../db/employee");
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
        default:
          console.log("you choose ", answers.initQ);
      }

      //   new query()
      //     .viewDept()
      //     .then((result) => {
      //       console.clear();
      //       console.table(result[0]);
      //       main();
      //     })
      //     .catch((error) => {
      //       console.log("error is ", error);
      //     });
    })
    .catch((error) => {
      console.log("SOmething Went Wrong", error);
    });
};

module.exports.main = main;
