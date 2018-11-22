import base from "shared-api";

const api = {
  getModules: () =>
    base.get("", {
      operation: "describe",
      elementType: GLOBALS.MODULES.join(",")
    })
};

export default api;
