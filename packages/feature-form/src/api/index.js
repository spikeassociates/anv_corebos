import base from "shared-api";

const api = {
  doRetrieve: ({ id }) => base.get("", { operation: "retrieve", id }),

  getFieldDependencies: moduleName =>
    base.get("", {
      operation: "SearchGlobalVar",
      gvmodule: moduleName,
      gvname: `BusinessMapping_${moduleName}_FieldDependency`
    })
};

export default api;
