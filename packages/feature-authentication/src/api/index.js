import base from "shared-api";
import { cbMD5 } from "shared-utils";

const api = {
  challenge: ({ username }) =>
    base.get("", {
      operation: "getchallenge",
      username
    }),

  login: ({ username, accessKey, accessToken }) =>
    base.post("", {
      operation: "login",
      username,
      accessKey: cbMD5(accessToken + accessKey)
    }),

  getModules: () =>
    base.get("", {
      operation: "describe",
      elementType: GLOBALS.MODULES.join(",")
    })
};

export default api;
