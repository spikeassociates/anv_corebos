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

  return { ...doRetrieve, ...getRelatedRecords };
};

export default epics;
