import Module from "modular-redux";
import { epics as epicsUtils } from "shared-resource";

import api from "./api";
import actions from "./actions";
import reducer from "./reducer";
import selectors from "./selectors";
import epics from "./epics";
import view from "./view";

const Main = FormView =>
  Module(
    {
      name: "main",
      actions: {
        module: actions,
        formview: FormView.actions
      },
      reducers: {
        module: reducer,
        formview: FormView.reducer
      },
      selectors: {
        module: selectors,
        formview: FormView.reducer
      },
      views: { module: view, formview: FormView.view },
      api: { module: api, formview: FormView.api },
      epics: { module: epics, formview: FormView.epic }
    },
    [{ feature: "api" }, epicsUtils.modulist.feature]
  );

export default Main;
