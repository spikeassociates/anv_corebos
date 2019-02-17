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
    }),

  getWidgets: ({ module }) =>
    base.get("", {
      operation: "getBusinessActions",
      view: "DetailView",
      module,
      linktype: "DETAILVIEWWIDGET"
    }),

  excecuteBusinessAction: id =>
    base.get("", {
      operation: "executeBusinessAction",
      businessactionid: id
    })
};

export default api;
