import { createSelector } from "reselect";
import Modular from "modular-redux";
import { selectors as selectorUtils } from "shared-resource";

const listviewData = module =>
  createSelector(
    module,
    ({ data }) => data.listview.map(row => ({ ...row, actions: "" }))
  );

const preview = module =>
  createSelector(
    module,
    ({ data }) => data.preview
  );

const selectors = { listviewData, preview };

export default Modular.selectors(moduleState =>
  selectorUtils.getSelectors(moduleState, selectors)
);
