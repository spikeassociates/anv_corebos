import { epics as epicsUtils } from "shared-resource";

const epics = ({ actions, api }) => {
  const { asyncAction } = epicsUtils.async;
  const { types } = actions;

  const saveItem = asyncAction({
    api: api.saveItem,
    type: types.SAVE_ITEM,
    onRequest: [() => actions.setBusy("form")],
    onSuccess: [() => actions.setBusy("form", false), () => actions.setBusy("updated")],
    onFailure: [
      () => actions.setBusy("form", false),
      action => actions.setData("errors", action.payload)
    ]
  });

  return { ...saveItem };
};

export default epics;
