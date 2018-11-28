import Modular from "modular-redux";
import { selectors as selectorUtils } from "shared-resource";
import { createSelector } from "reselect";

const modules = module =>
  createSelector(
    module,
    ({ data }) => data.modules
  );

const selectors = { modules };

export default Modular.selectors(moduleState =>
  selectorUtils.getSelectors(moduleState, selectors)
);
