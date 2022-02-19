const inquirer = require("inquirer");

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
    .then((answers) => {})
    .catch((error) => {
      console.log("SOmething Went Wrong", error);
    });
};

exports.main = main;
