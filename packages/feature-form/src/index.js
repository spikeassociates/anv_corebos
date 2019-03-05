import Module from "modular-redux";
import { epics as epicsUtils } from "shared-resource";

import api from "./api";
import actions from "./actions";
import reducer from "./reducer";
import selectors from "./selectors";
import epics from "./epics";
import view from "./view";

const Main = ListView =>
  Module(
    {
      name: "main",
      actions: { module: actions, listview: ListView.actions },
      reducers: { module: reducer, listview: ListView.reducer },
      selectors: { module: selectors, listview: ListView.selectors },
      views: { module: view, listview: ListView.view },
      api: { module: api, listview: ListView.api },
      epics: { module: epics, listview: ListView.epic }
    },
    [{ feature: "api" }, epicsUtils.modulist.feature]
  );

export default Main;
