import React from "react";
import {
  GlobalNavigationBar,
  GlobalNavigationBarRegion,
  AppLauncher,
  GlobalNavigationBarLink
} from "@salesforce/design-system-react";
import { range } from "utils";

import routes from "../routes";
import { Link, WaffleContainer } from "./styles";

const links = routes.filter(route => route.sidebar).map(route => route.name);

const Sidebar = () => (
  <div className="slds-context-bar">
    <div className="slds-context-bar__item--divider-right slds-context-bar__icon-action">
      <WaffleContainer className="slds-button slds-icon-waffle_container slds-context-bar__button">
        <span className="slds-icon-waffle">
          {range(1, 10).map(i => (
            <span key={i} className={`slds-r${i}`} />
          ))}
        </span>
      </WaffleContainer>
    </div>

    <div className="slds-context-bar__secondary slds-grid">
      {links.map(route => (
        <div className="slds-context-bar__item">
          <Link to={`/${route}`} className="slds-context-bar__label-action">
            {route}
          </Link>
        </div>
      ))}
    </div>
  </div>
);

export default Sidebar;
