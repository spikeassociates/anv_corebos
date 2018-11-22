import Module from "modular-redux";
import { epics as epicsUtils } from "shared-resource";

import api from "./api";
import actions from "./actions";
import reducer from "./reducer";
import selectors from "./selectors";
import epics from "./epics";
import view from "./view";

const Main = () =>
  Module(
    {
      name: "main",
      actions: {
        module: actions
      },
      reducers: {
        module: reducer
      },
      selectors: {
        module: selectors
      },
      views: {
        module: view
      },
      api: {
        module: api
      },
      epics: {
        module: epics
      }
    },
    [{ feature: "api" }, epicsUtils.modulist.feature]
  );

export default Main;
