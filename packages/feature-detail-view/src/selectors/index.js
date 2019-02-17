import { createSelector } from "reselect";
import Modular from "modular-redux";
import { selectors as selectorUtils } from "shared-resource";

const item = module =>
  createSelector(
    module,
    ({ data }) => data.item
  );

const relatedRecords = module =>
  createSelector(
    module,
    ({ data }) => data.relatedRecords
  );

const widgets = module =>
  createSelector(
    module,
    ({ data }) => data.widgets || {}
  );

const selectors = { item, relatedRecords, widgets };

export default Modular.selectors(moduleState =>
  selectorUtils.getSelectors(moduleState, selectors)
);
