import Modular from "modular-redux";
import Resources from "../resources";

const initialState = {
  shown: {
    form: false
  },
  busy: {
    form: true
  },
  data: {
    initial: {}
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
