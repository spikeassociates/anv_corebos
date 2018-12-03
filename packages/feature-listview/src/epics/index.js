import { epics as epicsUtils } from "shared-resource";
import { Repo } from "shared-repo";

import { transformItem } from "./transform";

const epics = ({ actions, api }) => {
  const { asyncAction } = epicsUtils.async;
  const { types } = actions;

  const doQuery = asyncAction({
    api: api.doQuery,
    type: types.DO_QUERY,
    onRequest: [action => actions.setBusy("listview")],
    onSuccess: [
      action => actions.setData("listview", action.payload),
      action => actions.setBusy("listview", false)
    ]
  });

  const doRetrieve = asyncAction({
    api: api.doRetrieve,
    type: types.DO_RETRIEVE,
    onSuccess: [
      action => {
        const preview = transformItem(action.requestPayload.moduleMeta, action.payload);

        return actions.setData("preview", preview);
      },
      action => {
        document.body.style.overflow = "hidden";
        return actions.setShown("preview");
      }
    ]
  });

  const doDelete = asyncAction({
    api: api.doDelete,
    type: types.DO_DELETE,
    onSuccess: [
      action => {
        const state = Repo.get("store").getState();
        const data = [...state.app.listview._module.data.listview];
        const index = data.findIndex(row => row.id === action.requestPayload);
        data.splice(index, 1);

        return actions.setData("listview", data);
      }
    ]
  });

  const saveItem = asyncAction({
    api: api.saveItem,
    type: types.SAVE_ITEM,
    onSuccess: [
      action => {
        const { operation } = action.requestPayload;
        const item = action.payload;
        const state = Repo.get("store").getState();
        let data = [...state.app.listview._module.data.listview];

        if (operation === "create") {
          data.unshift(item);
        } else {
          const index = data.findIndex(row => row.id === item.id);
          data[index] = item;
        }

        return actions.setData("listview", data);
      },
      action => actions.setShown("modal", false)
    ]
  });

  return { ...doQuery, ...doDelete, ...doRetrieve, ...saveItem };
};

export default epics;
