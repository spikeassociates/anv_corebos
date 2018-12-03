import base from "shared-api";

const api = {
  doRetrieve: ({ id }) => base.get("", { operation: "retrieve", id }),

  getRelatedRecords: ({ id, module, relatedModule, queryParameters }) =>
    base.post("", {
      operation: "getRelatedRecords",
      id,
      module,
      relatedModule,
      queryParameters: JSON.stringify(queryParameters)
    })
};

export default api;
