import base from "shared-api";

const api = {
  login: ({ username = "" }) =>
    base.get("", {
      operation: "getchallenge",
      username
    })
};

export default api;
