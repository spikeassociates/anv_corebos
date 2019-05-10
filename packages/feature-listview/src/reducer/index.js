import Modular from "modular-redux";
import Resources from "../resources";

const initialState = {
  shown: {
    preview: false,
    modal: false
  },
  busy: {},
  data: {
    preview: {
      headerData: [],
      bodyData: [],
      title: ""
    },
    listview: [],
    totalRowsCount: 1,
    filters: [],
    currentFilter: null
  }
};

const reducer = (state = initialState, action, Module) => {
  const { actions } = Module;

  const resourceState = Resources.reducer(state, actions, action);

  //console.log('REDUCER', resourceState);

  if (resourceState) {
    return resourceState;
  }

  switch (action.type) {
    default:
      return state;
  }
};

export default Modular.reducer(reducer);
