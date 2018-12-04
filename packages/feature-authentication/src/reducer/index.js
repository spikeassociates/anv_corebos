import Modular from "modular-redux";
import Resources from "../resources";
import { PersistentRepo } from "shared-repo";

const initialState = {
  shown: {},
  busy: {},
  data: {},
  authenticated: !!PersistentRepo.get("token")
};

const reducer = (state = initialState, action, Module) => {
  const { actions } = Module;

  const resourceState = Resources.reducer(state, actions, action);

  if (resourceState) {
    return resourceState;
  }

  switch (action.type) {
    case actions.types.AUTH:
      return { ...state, authenticated: true };

    case actions.types.UNAUTH:
      return { ...state, authenticated: false };

    default:
      return state;
  }
};

export default Modular.reducer(reducer);
