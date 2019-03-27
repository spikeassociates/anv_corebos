import base from "shared-api";
import { PersistentRepo } from "shared-repo";

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
    }),

  updateField: ({ values, moduleMeta }) => {
    if (!values["assigned_user_id"]) {
      values["assigned_user_id"] = PersistentRepo.get("userId");
    }

    return base.post("", {
      operation: "ReviseWithValidation",
      elementType: moduleMeta.name,
      element: JSON.stringify({
        ...values
      })
    });
  }
};

export default api;
