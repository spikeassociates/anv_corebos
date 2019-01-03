import Module from "modular-redux";
import { epics as epicUtils } from "shared-resource";

import actions from "./actions";
import epics from "./epics";
import reducer from "./reducer";
import selectors from "./selectors";
import view from "./view";
import api from "./api";

const App = (AuthenticationView, ListView, DetailView, ModalView) =>
  Module(
    {
      name: "app",
      actions: {
        module: actions,
        modal: ModalView.actions,
        authentication: AuthenticationView.actions
      },
      reducers: {
        module: reducer,
        authentication: AuthenticationView.reducer,
        listview: ListView.reducer,
        detailview: DetailView.reducer,
        modalview: ModalView.reducer
      },
      views: {
        module: view,
        authentication: AuthenticationView.view,
        listview: ListView.view,
        detailview: DetailView.view,
        modal: ModalView.view
      },
      api: {
        module: api,
        listview: ListView.api,
        modalview: ModalView.api
      },
      epics: {
        module: epics,
        authentication: AuthenticationView.epic,
        listview: ListView.epic,
        detailview: DetailView.epic,
        modalview: ModalView.epic
      },
      selectors: {
        module: selectors,
        authentication: AuthenticationView.selectors
      }
    },
    [{ feature: "api" }, epicUtils.modulist.feature]
  );

export default App;
