import { Observable } from "rxjs";
import { getQs, getUrl } from "./utils";
import { PersistentRepo } from "shared-repo";
import { objToSnakeCase } from "shared-utils";

const { ajax } = Observable;

const defaultHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${PersistentRepo.get("token")}`
});

const api = {
  get: (url, params = {}) =>
    ajax({
      url: getUrl(url) + getQs(objToSnakeCase(params)),
      headers: defaultHeaders()
    }).map(e => e.response),

  put: (url, params) =>
    ajax({
      url: getUrl(url),
      body: objToSnakeCase(params),
      method: "PUT",
      headers: defaultHeaders()
    }).map(e => e.response),

  post: (url, params) =>
    ajax({
      url: getUrl(url),
      body: objToSnakeCase(params),
      method: "POST",
      headers: defaultHeaders()
    }).map(e => e.response),

  delete: (url, params) =>
    ajax({
      url: getUrl(url),
      body: objToSnakeCase(params),
      method: "DELETE",
      headers: defaultHeaders()
    }).map(e => e.response)
};

export default api;
