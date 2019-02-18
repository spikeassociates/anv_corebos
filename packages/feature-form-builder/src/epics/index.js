import { epics as epicsUtils } from "shared-resource";

const epics = ({ actions, api }) => {
  const { asyncAction } = epicsUtils.async;
  const { types } = actions;

  const rename = action$ =>
    action$.ofType(types.RENAME).mergeMap(action => {
      return Observable.of(actions.setData(`name`, action.payload));
    });

  return { rename };
};

export default epics;
