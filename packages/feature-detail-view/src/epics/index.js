import { epics as epicsUtils } from "shared-resource";
import { transformItem } from "shared-utils";

const epics = ({ actions, api }) => {
  const { asyncAction } = epicsUtils.async;
  const { types } = actions;

  const doRetrieve = asyncAction({
    api: api.doRetrieve,
    type: types.DO_RETRIEVE,
    onSuccess: [
      action => {
        const item = transformItem(action.requestPayload.moduleMeta, action.payload);
        return actions.setData("item", item);
      }
    ]
  });

  const getRelatedRecords = asyncAction({
    api: api.getRelatedRecords,
    type: types.GET_RELATED_RECORDS,
    onSuccess: [
      action => actions.setData("relatedRecords", action.payload.records),
      action => actions.setShown("relatedRecords")
    ]
  });

  const getWidgets = asyncAction({
    api: api.getWidgets,
    type: types.GET_WIDGETS,
    onSuccess: [
      action => {
        let blocks = JSON.parse(action.payload).DETAILVIEWWIDGET;

        blocks = blocks
          .map(({ linkid }) => linkid)
          .filter(id => id === "44698")
          .map(id => `41x${id}`);

        return blocks.map(id => actions.excecuteBusinessAction(id));
      }
    ]
  });

  const excecuteBusinessAction = asyncAction({
    api: api.excecuteBusinessAction,
    type: types.EXCECUTE_BUSINESS_ACTION,
    onSuccess: [
      action => {
        const id = action.requestPayload;
        const html = action.payload.replace(/include/g, `${GLOBALS.COREBOS_API}/include`);

        return actions.setData(`widgets.${id}`, html);
      }
    ]
  });

  return {
    ...doRetrieve,
    ...getRelatedRecords,
    ...getWidgets,
    ...excecuteBusinessAction
  };
};

export default epics;
