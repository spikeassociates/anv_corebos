import { Observable } from "rxjs";
import { PersistentRepo } from "shared-repo";

import { getQs, getUrl } from "./utils";

const { ajax } = Observable;

const defaultHeaders = () => ({
  "Content-type": "application/x-www-form-urlencoded; charset=UTF-8"
});

const defaultParams = () => {
  const token = PersistentRepo.get("token");

  return token ? { sessionName: token } : {};
};

const api = {
  get: (url, params = {}) =>
    ajax({
      url: getUrl(url) + getQs({ ...defaultParams(), ...params }),
      headers: defaultHeaders()
    }).map(e => e.response),

  put: (url, params) =>
    ajax({
      url: getUrl(url),
      body: { ...defaultParams(), ...params },
      method: "PUT",
      headers: defaultHeaders()
    }).map(e => e.response),

  post: (url, params) =>
    ajax({
      url: getUrl(url),
      body: { ...defaultParams(), ...params },
      method: "POST",
      headers: defaultHeaders()
    }).map(e => e.response),

  delete: (url, params) =>
    ajax({
      url: getUrl(url),
      body: { ...defaultParams(), ...params },
      method: "DELETE",
      headers: defaultHeaders()
    }).map(e => e.response)
};

export default api;
