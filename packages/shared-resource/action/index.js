import { snakeToCamelCase } from "shared-utils";

const statefulTypes = (
  types = [],
  states = ["CANCEL", "SUCCESS", "FAILURE"],
  separator = "_"
) => {
  const stateful = [...types];
  types.forEach(type => {
    states.forEach(state => {
      stateful.push(type + separator + state);
    });
  });
  return stateful;
};

const generateActions = types => {
  const actions = Object.keys(types).reduce(
    (obj, key) => ({
      ...obj,
      [snakeToCamelCase(key.toLowerCase())]: payload => ({ type: types[key], payload })
    }),
    {}
  );

  return {
    ...actions,
    setData: (key, val = {}) => ({ type: types.SET_DATA, payload: { key, val } }),
    pushData: (key, val = {}) => ({ type: types.PUSH_DATA, payload: { key, val } }),
    setShown: (key, val = true) => ({ type: types.SET_SHOWN, payload: { key, val } }),
    setBusy: (key, val = true) => ({ type: types.SET_BUSY, payload: { key, val } })
  };
};

export default { generateActions, statefulTypes };
