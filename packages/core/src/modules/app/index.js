import Module from "modular-redux";
import { epics as epicUtils } from "shared-resource";

import actions from "./actions";
import epics from "./epics";
import reducer from "./reducer";
import selectors from "./selectors";
import view from "./view";

const App = (ListView, DetailView) =>
  Module(
    {
      name: "app",
      actions: {
        module: actions
      },
      reducers: {
        module: reducer,
        listview: ListView.reducer,
        detailview: DetailView.reducer
      },
      views: {
        module: view,
        listview: ListView.view,
        detailview: DetailView.view
      },
      epics: {
        module: epics,
        listview: ListView.epic,
        detailview: DetailView.epic
      },
      selectors: {
        module: selectors
      }
    },
    [epicUtils.modulist.feature]
  );

export default App;
