const BASE = require("../base");

const PROD = {
  ...BASE,
  MODE: "PROD",
  BASE_API: "http://63.251.233.101/subitoclient/webservice.php",
  COREBOS_API: "http://63.251.233.101/subitoclient",
  COREBOS_TOKEN: "yFEo0SYIN2wO1UJt",
  COREBOS_USERNAME: "admin",
  MODULES: [
    "MasterAccount",
    "Accounts",
    "SalesOrderMaster",
    "Cases",
    "AccountDetails",
    "Task"
  ]
};

module.exports = JSON.stringify(PROD);
