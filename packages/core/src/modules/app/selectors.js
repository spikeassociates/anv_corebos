import Modular from "modular-redux";
import { selectors as selectorUtils } from "shared-resource";
import { createSelector } from "reselect";

const isLoggedIn = module =>
  createSelector(module, ({ data }) => {
    return data.isLoggedIn;
  });

const selectors = { isLoggedIn };

export default Modular.selectors(moduleState =>
  selectorUtils.getSelectors(moduleState, selectors)
);
