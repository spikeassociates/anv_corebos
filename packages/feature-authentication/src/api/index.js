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
    })
};

export default api;
