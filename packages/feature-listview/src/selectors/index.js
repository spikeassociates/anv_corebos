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
    ({ data }) => (
      Object.entries(data.filters).map(item => {
        let id = (item[0] != undefined) ? item[0] : undefined;
        let label = (item[1] != undefined) ? item[1].name : undefined;
        let data = item[1];

        //filter data for Dropdown module
        return {id, label, data};
      })
    )
  );

const selectors = { listviewData, preview, totalRowsCount, filters };

export default Modular.selectors(moduleState =>
  selectorUtils.getSelectors(moduleState, selectors)
);
