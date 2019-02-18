import { createSelector } from "reselect";
import Modular from "modular-redux";
import { selectors as selectorUtils } from "shared-resource";

const name = module =>
  createSelector(
    module,
    ({ data }) => data.name
  );

const selectors = { name };

export default Modular.selectors(moduleState =>
  selectorUtils.getSelectors(moduleState, selectors)
);
