const BASE = require("../base");

const DEV = {
  ...BASE,
  BASE_API: "http://localhost/",
  COREBOS_API: "http://test.coreboscrm.com/corebos",
  COREBOS_TOKEN: "cdYTBpiMR9RfGgO",
  COREBOS_USERNAME: "admin"
};

module.exports = JSON.stringify(DEV);
