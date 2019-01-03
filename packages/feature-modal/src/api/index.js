import base from "shared-api";
import { PersistentRepo } from "shared-repo";

const api = {
  saveItem: ({ values, name, operation = "create" }) => {
    if (!values["assigned_user_id"]) {
      values["assigned_user_id"] = PersistentRepo.get("userId");
    }

    return base.post("", {
      operation,
      elementType: name,
      element: JSON.stringify(values)
    });
  },

  doRetrieve: ({ id }) => base.get("", { operation: "retrieve", id })
};

export default api;
