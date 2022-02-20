const inquirer = require("inquirer");
const banner = require("node-banner");
const { main } = require("./prompts/mainmenu");
console.clear();
(async () => {
  await banner("Employee Manager", "By Bobby ");
  console.log("\n\n\n");
  main();
})();
