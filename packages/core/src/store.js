import { createStore, applyMiddleware } from "redux";
import { composeWithDevTools } from "redux-devtools-extension/developmentOnly";
import createHistory from "history/createHashHistory";
import { routerMiddleware } from "react-router-redux";
import { createEpicMiddleware } from "redux-observable";
import { Repo } from "shared-repo";

import rootReducer from "./reducer";
import rootEpic from "./epic";

export const history = createHistory();

const middleware = [createEpicMiddleware(rootEpic), routerMiddleware(history)];

const store = createStore(
  rootReducer,
  composeWithDevTools(applyMiddleware(...middleware))
);

Repo.set("store", store);

export default store;
