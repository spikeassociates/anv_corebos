import { Observable } from "rxjs";

import { objToCamelCase, objToSnakeCase } from "shared-utils";
import { httpCode } from "./http";

const handlersToObservable = (handlers = []) => action =>
  Observable.concat(...handlers.map(handler => Observable.of(handler(action))));

const getTypes = type => ({
  request: type,
  retry: type + "_RETRY",
  cancel: type + "_CANCEL",
  failure: type + "_FAILURE",
  success: type + "_SUCCESS"
});

const asyncAction = ({ type, api, onRequest, onFailure, onSuccess }) => {
  const types = getTypes(type);

  const requestEpic = action$ =>
    action$.ofType(types.request).flatMap(handlersToObservable(onRequest));

  const requestEpicApi = action$ =>
    action$
      .ofType(types.request)
      .debounceTime(500)
      //.takeUntil(action$.ofType(types.cancel))
      .concatMap(action =>
        api(action.payload)
          .map(res => {
            console.log(res.success);
            return res.success
              ? {
                  type: types.success,
                  requestPayload: action.payload || {},
                  payload: res.data
                }
              : res.status != 333
              ? {
                  type: types.failure,
                  requestPayload: action.payload || {},
                  payload: { ...res, ...parseErr(res) }
                }
              : {
                  type: types.retry,
                  requestPayload: action.payload || {},
                  payload: { ...res, ...parseErr(res) }
                };
          })
          .catch(err =>
            Observable.of({
              type: types.failure,
              requestPayload: action.payload || {},
              payload: { ...err, ...parseErr(err) }
            })
          )
      );

  const parseErr = err => {
    const fallbacks = { title: "Something went wrong.", data: [[]] };

    if (err.response) {
      const response = err.response;
      const data = Object.values(response.errors || response) || fallbacks.data;

      const title = err.message || response.message || fallbacks.title;
      const text = data
        .reduce(
          (dataParsed, dataItem) =>
            dataItem.reduce(
              (itemParsed, itemError) => itemError + "\n" + itemParsed,
              ""
            ) + dataParsed,
          ""
        )
        .slice(0, -1);
      return { title, text };
    }

    return {
      title: (err.data && err.data.message) || fallbacks.title,
      text: httpCode(err.status)
    };
  };

  const retryEpic = action$ =>
    action$.ofType(types.retry).map(action =>
      action.requestPayload._retry > 0
        ? { type: types.cancel, payload: action.requestPayload }
        : {
            type: "REFRESH_LOGIN",
            payload: {
              originalRequest: { type: types.request, payload: action.requestPayload }
            }
          }
    );

  const failureEpic = action$ =>
    action$.ofType(types.failure).flatMap(handlersToObservable(onFailure));

  const successEpic = action$ =>
    action$.ofType(types.success).flatMap(handlersToObservable(onSuccess));

  return {
    [types.request]: requestEpic,
    [types.retry]: retryEpic,
    [types.request + "_API"]: requestEpicApi,
    [types.failure]: failureEpic,
    [types.success]: successEpic
  };
};

export default { asyncAction };
