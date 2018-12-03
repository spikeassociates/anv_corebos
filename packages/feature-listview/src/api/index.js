import base from "shared-api";
import { PersistentRepo } from "shared-repo";

const api = {
  doQuery: ({ moduleName, page = 1, pageLimit = 0, sort }) => {
    const { property, direction } = sort;
    page -= 1;
    const offset = page * pageLimit;

    return base.get("", {
      operation: "query",
      elementType: GLOBALS.MODULES.join(","),
      query: `select * from ${moduleName} order by ${property} ${direction} limit ${offset}, ${pageLimit};`
    });
  },

  doDelete: id => base.post("", { operation: "delete", id }),

  doRetrieve: ({ id }) => base.get("", { operation: "retrieve", id }),

  saveItem: ({ values, name, operation = "create" }) => {
    if (!values["assigned_user_id"]) {
      values["assigned_user_id"] = PersistentRepo.get("userId");
    }

    return base.post("", {
      operation,
      elementType: name,
      element: JSON.stringify(values)
    });
  }
};

export default api;
