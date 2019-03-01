import base from "shared-api";

const api = {
  doRetrieve: ({ id }) => base.get("", { operation: "retrieve", id }),

  getFieldDependencies: moduleName =>
    base.get("", {
      operation: "query",
      elementType: "",
      query: `select contentjson from cbMap where maptype = 'FieldDependency' and targetname = '${moduleName}';`
    })
};

export default api;
