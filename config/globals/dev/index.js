const BASE = require("../base");

const DEV = {
  ...BASE,
  MODE: "DEV",
  BASE_API: "http://63.251.233.101/corebos/webservice.php",
  COREBOS_API: "http://63.251.233.101/corebos",
  COREBOS_TOKEN: "cdYTBpiMR9RfGgO",
  COREBOS_USERNAME: "admin",
  MODULES: [
    "Accounts",
    "Contacts",
    "Potentials",
    "Documents",
    "Quotes",
    "CobroPago",
    "Users"
  ]
};

module.exports = JSON.stringify(DEV);
