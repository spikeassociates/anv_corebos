import Module from "modular-redux";
import { epics as epicsUtils } from "shared-resource";

import api from "./api";
import actions from "./actions";
import reducer from "./reducer";
import selectors from "./selectors";
import epics from "./epics";
import view from "./view";

const PlainListView = () =>
  Module(
    {
      name: "modal",
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

const Main = ModalView =>
  Module(
    {
      name: "main",
      actions: {
        module: actions,
        modal: ModalView.actions
      },
      reducers: {
        module: reducer,
        modal: ModalView.reducer
      },
      selectors: {
        module: selectors,
        modal: ModalView.selectors
      },
      views: {
        module: view,
        modal: ModalView.view
      },
      api: {
        module: api,
        modal: ModalView.api
      },
      epics: {
        module: epics,
        modal: ModalView.epic
      }
    },
    [{ feature: "api" }, epicsUtils.modulist.feature]
  );

export { Main, PlainListView };
export default Main;
