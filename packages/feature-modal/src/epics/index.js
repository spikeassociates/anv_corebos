import { epics as epicsUtils } from "shared-resource";
import { formatValue } from "shared-utils";

const epics = ({ actions, api }) => {
  const { asyncAction } = epicsUtils.async;
  const { types } = actions;

  const saveItem = asyncAction({
    api: api.saveItem,
    type: types.SAVE_ITEM,
    onRequest: [action => actions.setBusy("form")],
    onSuccess: [action => actions.setBusy("form", false)]
  });

  const doRetrieve = asyncAction({
    api: api.doRetrieve,
    type: types.DO_RETRIEVE,
    onSuccess: [
      action => actions.setData("initial", action.payload),
      action => actions.setShown("form")
    ]
  });

  return { ...saveItem, ...doRetrieve };
};

export default epics;
