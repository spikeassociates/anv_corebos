import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { IconSettings } from "@salesforce/design-system-react";

import standardSprite from "@salesforce-ux/design-system/assets/icons/standard-sprite/svg/symbols.svg";
import utilitySprite from "@salesforce-ux/design-system/assets/icons/utility-sprite/svg/symbols.svg";
import actionSprite from "@salesforce-ux/design-system/assets/icons/action-sprite/svg/symbols.svg";

import store from "./store";
import router from "./router";
import "@salesforce-ux/design-system/assets/styles/salesforce-lightning-design-system.min.css";

const render = Component => {
  ReactDOM.render(
    <Provider store={store}>
      <IconSettings
        actionSprite={actionSprite}
        standardSprite={standardSprite}
        utilitySprite={utilitySprite}
      >
        {Component}
      </IconSettings>
    </Provider>,
    document.getElementById("app")
  );
};

render(router);
