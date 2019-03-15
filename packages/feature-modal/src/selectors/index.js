import { createSelector } from "reselect";
import Modular from "modular-redux";
import { selectors as selectorUtils } from "shared-resource";

const errors = module =>
  createSelector(
    module,
    ({ data }) => data.errors
  );

const selectors = { errors };

export default Modular.selectors(moduleState =>
  selectorUtils.getSelectors(moduleState, selectors)
);
