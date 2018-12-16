const BASE = require("../base");

const PROD = {
  ...BASE,
  MODE: "PROD",
  BASE_API: "http://test.coreboscrm.com/corebos/webservice.php",
  COREBOS_API: "http://test.coreboscrm.com/corebos",
  COREBOS_TOKEN: "cdYTBpiMR9RfGgO",
  COREBOS_USERNAME: "admin",
  MODULES: ["Accounts", "Contacts", "Potentials"]
};

module.exports = JSON.stringify(PROD);
