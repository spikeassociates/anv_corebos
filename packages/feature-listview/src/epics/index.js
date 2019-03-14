import { epics as epicsUtils } from "shared-resource";
import { Repo } from "shared-repo";
import { transformItem } from "shared-utils";

import { transformQueryResult } from "./transform";

const epics = ({ actions, api, name }) => {
  const { asyncAction } = epicsUtils.async;
  const { types, modal } = actions;

  const doQuery = asyncAction({
    api: api.doQuery,
    type: types.DO_QUERY,
    onRequest: [() => actions.setBusy("listview")],
    onSuccess: [
      action => {
        const { moduleName } = action.requestPayload;
        const data = transformQueryResult(action.payload, moduleName);

        return actions.setData("listview", data);
      },
      () => actions.setBusy("listview", false)
    ]
  });

  if (name === "modal") {
    return { ...doQuery };
  }

  const getRowsCount = asyncAction({
    api: api.getRowsCount,
    type: types.GET_ROWS_COUNT,
    onSuccess: [action => actions.setData("totalRowsCount", action.payload[0].count)]
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
        const ids = String(action.requestPayload).split(",");

        ids.forEach(id => {
          const index = data.findIndex(row => row.id === id);
          data.splice(index, 1);
        });

        return actions.setData("listview", data);
      }
    ]
  });

  const onItemSaved = action$ =>
    action$.ofType(modal.types.SAVE_ITEM_SUCCESS).mergeMap(action => {
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

      return Observable.of(
        actions.setData("listview", data),
        actions.setShown("modal", false)
      );
    });

  return { ...doQuery, ...doDelete, ...doRetrieve, onItemSaved, ...getRowsCount };
};

export default epics;
