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

const totalRowsCount = module =>
  createSelector(
    module,
    ({ data }) => data.totalRowsCount
  );

const filters = module =>
  createSelector(
    module,
    ({ data }) => Object.entries(data.filters).map(item => ({label:item[1].name, value:item[0]}) )
  );

const selectors = { listviewData, preview, totalRowsCount, filters };

export default Modular.selectors(moduleState =>
  selectorUtils.getSelectors(moduleState, selectors)
);
