import { createSelector } from "reselect";
import Modular from "modular-redux";

const selectors = moduleState => {
  const module = state => moduleState(state);

  const authenticated = createSelector(
    module,
    module => module.authenticated
  );

  return { authenticated };
};

export default Modular.selectors(selectors);
