import { Observable } from "rxjs";

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
      // .debounceTime(500)
      //.takeUntil(action$.ofType(types.cancel))
      .concatMap(action =>
        api(action.payload)
          .map(res => {
            return res.success
              ? {
                  type: types.success,
                  requestPayload: action.payload || {},
                  payload: res.result
                }
              : res.status != 333
              ? {
                  type: types.failure,
                  requestPayload: action.payload || {},
                  payload: { ...res }
                }
              : {
                  type: types.retry,
                  requestPayload: action.payload || {},
                  payload: { ...res }
                };
          })
          .catch(err =>
            Observable.of({
              type: types.failure,
              requestPayload: action.payload || {},
              payload: { ...err }
            })
          )
      );

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
