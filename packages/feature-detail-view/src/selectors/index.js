import { createSelector } from "reselect";
import Modular from "modular-redux";
import { selectors as selectorUtils } from "shared-resource";

const item = module =>
  createSelector(
    module,
    ({ data }) => data.item
  );

const original = module =>
  createSelector(
    module,
    ({ data }) => data.original
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

const selectors = { item, relatedRecords, widgets, original };

export default Modular.selectors(moduleState =>
  selectorUtils.getSelectors(moduleState, selectors)
);
