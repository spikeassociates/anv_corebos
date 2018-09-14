const BASE = require("../base");

const PROD = {
  ...BASE,
  BASE_API: "",
  COREBOS_API: "http://146.148.11.105/subitomasterdemo",
  COREBOS_TOKEN: "v2MHbHX9zxh27CBL",
  COREBOS_USERNAME: "atconsulting"
};

module.exports = JSON.stringify(PROD);
