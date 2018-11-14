import base from "shared-api";

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
      accessKey: cbMD5(accessToken + accesskey)
    })
};

export default api;
