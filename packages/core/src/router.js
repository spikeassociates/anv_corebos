import React from "react";
import { ConnectedRouter } from "react-router-redux";

import { history } from "./store";
import App from "./modules";

const router = (
  <ConnectedRouter history={history}>
    <App.view />
  </ConnectedRouter>
);

export default router;
