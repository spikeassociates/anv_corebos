import Modular from "modular-redux";
import Resources from "./resources";
import { PersistentRepo } from "shared-repo";

const initialState = {
  data: {
    modules: PersistentRepo.get("modules") || {}
  }
};

const reducer = (state = initialState, action, Module) => {
  const { actions } = Module;

  const resourceState = Resources.reducer(state, actions, action);

  if (resourceState) {
    return resourceState;
  }

  switch (action.type) {
    default:
      return state;
  }
};

export default Modular.reducer(reducer);
