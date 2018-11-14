import { Observable } from "rxjs";
import { getQs, getUrl } from "./utils";

const { ajax } = Observable;

const defaultHeaders = () => ({
  "Content-type": "application/x-www-form-urlencoded; charset=UTF-8"
});

const api = {
  get: (url, params = {}) =>
    ajax({
      url: getUrl(url) + getQs(params),
      headers: defaultHeaders()
    }).map(e => e.response),

  put: (url, params) =>
    ajax({
      url: getUrl(url),
      body: params,
      method: "PUT",
      headers: defaultHeaders()
    }).map(e => e.response),

  post: (url, params) =>
    ajax({
      url: getUrl(url),
      body: params,
      method: "POST",
      headers: defaultHeaders()
    }).map(e => e.response),

  delete: (url, params) =>
    ajax({
      url: getUrl(url),
      body: params,
      method: "DELETE",
      headers: defaultHeaders()
    }).map(e => e.response)
};

export default api;
