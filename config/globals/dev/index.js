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
  // MODULES: [
  //   "MasterAccount",
  //   "Accounts",
  //   "SalesOrderMaster",
  //   "Cases",
  //   "AccountDetails",
  //   "Task"
  // ],
  // BASE_API: "http://63.251.233.101/subitoclient/webservice.php",
  // COREBOS_API: "http://63.251.233.101/subitoclient",
  // COREBOS_TOKEN: "yFEo0SYIN2wO1UJt",
  // COREBOS_USERNAME: "admin"
};

module.exports = JSON.stringify(DEV);
