import Modular from "modular-redux";

const initialState = {};

const reducer = (state = initialState, action, Module) => {
  const { actions } = Module;

  switch (action.type) {
    default:
      return state;
  }
};

export default Modular.reducer(reducer);
