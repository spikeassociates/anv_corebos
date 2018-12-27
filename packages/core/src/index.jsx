import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { IconSettings } from "@salesforce/design-system-react";
import standardSprite from "@salesforce-ux/design-system/assets/icons/standard-sprite/svg/symbols.svg";
import utilitySprite from "@salesforce-ux/design-system/assets/icons/utility-sprite/svg/symbols.svg";
import actionSprite from "@salesforce-ux/design-system/assets/icons/action-sprite/svg/symbols.svg";

import corebosStore from "./store";
import Router from "./router";
import Sidebar from "./modules/app/view/Sidebar";
import "@salesforce-ux/design-system/assets/styles/salesforce-lightning-design-system.min.css";

const App = () => {
  const url = window.location.origin;
  const iconSettingsDev = { actionSprite, standardSprite, utilitySprite };
  const iconSettingsProd = {
    iconPath: `${url}/static/plugins/${GLOBALS.MATTERMOST_PLUGIN}/icons`
  };

  return (
    <Provider store={corebosStore}>
      <IconSettings {...(GLOBALS.MODE === "PROD" ? iconSettingsProd : iconSettingsDev)}>
        <Router />
      </IconSettings>
    </Provider>
  );
};

if (GLOBALS.MODE === "PROD") {
  class MattermostApp {
    initialize(registry, store) {
      registry.registerRootComponent(App);
      registry.registerLeftSidebarHeaderComponent(Sidebar);
    }
  }
  window.registerPlugin(`${GLOBALS.MATTERMOST_PLUGIN}`, new MattermostApp());
} else {
  ReactDOM.render(<App />, document.getElementById("app"));
}
