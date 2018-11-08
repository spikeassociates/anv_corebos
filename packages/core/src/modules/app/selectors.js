import Modular from "modular-redux";
import { selectors as selectorUtils } from "shared-resource";
import { createSelector } from "reselect";

const test = module =>
  createSelector(module, module => {
    return "test";
  });

const selectors = { test };

export default Modular.selectors(moduleState =>
  selectorUtils.getSelectors(moduleState, selectors)
);
