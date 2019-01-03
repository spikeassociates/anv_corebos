import { epics as epicsUtils } from "shared-resource";

const epics = ({ actions, api }) => {
  const { asyncAction } = epicsUtils.async;
  const { types } = actions;

  const saveItem = asyncAction({
    api: api.saveItem,
    type: types.SAVE_ITEM,
    onRequest: [
      action => {
        return actions.setBusy("form");
      }
    ]
  });

  return { ...saveItem };
};

export default epics;
