import { clone, setPath, getPath } from "utils";

let data = {};

const reducer = (state, actions, action) => {
  switch (action.type) {
    case actions.types.SET_DATA:
      data = clone(state.data);
      setPath(data, action.payload.key, action.payload.val);
      return { ...state, data };

    case actions.types.PUSH_DATA:
      data = clone(state.data);
      const resourceName = action.payload.key;
      const currentPayload = getPath(data, action.payload.key) || {};
      const current = currentPayload[resourceName] || [];
      const newData = action.payload.val[resourceName] || [];

      setPath(data, `${action.payload.key}.${resourceName}`, [...current, ...newData]);
      return { ...state, data };

    case actions.types.SET_SHOWN:
      return {
        ...state,
        shown: { ...state.shown, [action.payload.key]: action.payload.val }
      };

    case actions.types.SET_BUSY:
      return {
        ...state,
        busy: { ...state.busy, [action.payload.key]: action.payload.val }
      };
  }
};

export default reducer;
