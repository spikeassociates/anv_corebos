import { createSelector } from "reselect";
import Modular from "modular-redux";
import { selectors as selectorUtils } from "shared-resource";

const selectors = {};

export default Modular.selectors(moduleState =>
  selectorUtils.getSelectors(moduleState, selectors)
);
