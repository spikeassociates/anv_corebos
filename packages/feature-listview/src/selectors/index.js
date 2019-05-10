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

// format data.filters from reducer and return filters
const filters = module =>
  createSelector(
    module,
    ({ data }) => (
      Object.entries(data.filters).map(item => {
        //filter data for Dropdown filter selector
        item[1].id = (item[0] != undefined) ? item[0] : undefined;
        item[1].label = (item[1] != undefined) ? item[1].name : undefined;
        return item[1];
      })
    )
  );

const currentFilter = module =>
  createSelector(
    module,
    ({ data }) => {
      //console.log('SELECTOR', data);
      return data.currentFilter;
    }
  );

const selectors = { listviewData, preview, totalRowsCount, filters, currentFilter };

export default Modular.selectors(moduleState =>
  selectorUtils.getSelectors(moduleState, selectors)
);
