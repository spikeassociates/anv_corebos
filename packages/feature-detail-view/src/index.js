import Module from "modular-redux";
import { epics as epicsUtils } from "shared-resource";

import api from "./api";
import actions from "./actions";
import reducer from "./reducer";
import selectors from "./selectors";
import epics from "./epics";
import view from "./view";

const Main = (ListView, ModalView) =>
  Module(
    {
      name: "main",
      actions: { module: actions, listview: ListView.actions, modal: ModalView.actions },
      reducers: { module: reducer, listview: ListView.reducer, modal: ModalView.reducer },
      selectors: {
        module: selectors,
        listview: ListView.selectors,
        modal: ModalView.selectors
      },
      views: { module: view, listview: ListView.view, modal: ModalView.view },
      api: { module: api, listview: ListView.api, modal: ModalView.api },
      epics: { module: epics, listview: ListView.epic, modal: ModalView.epic }
    },
    [{ feature: "api" }, epicsUtils.modulist.feature]
  );

export default Main;
