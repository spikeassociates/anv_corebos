import { createSelector } from "reselect";

const busy = module => createSelector(module, module => module.busy);
const shown = module => createSelector(module, module => module.shown);

const getSelectors = (moduleState, dataSelectors) => {
  const selectors = { ...dataSelectors, busy, shown };
  const module = state => moduleState(state);

  return Object.keys(selectors).reduce(
    (obj, selector) => ({
      ...obj,
      [selector]: selectors[selector](module)
    }),
    {}
  );
};

export default { getSelectors };
