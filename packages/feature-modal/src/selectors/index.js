import { createSelector } from "reselect";
import Modular from "modular-redux";
import { selectors as selectorUtils } from "shared-resource";

const initialValues = module =>
  createSelector(
    module,
    ({ data }) => data.initial
  );

const selectors = { initialValues };

export default Modular.selectors(moduleState =>
  selectorUtils.getSelectors(moduleState, selectors)
);
