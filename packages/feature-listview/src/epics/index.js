import { epics as epicsUtils } from "shared-resource";
import { Repo } from "shared-repo";
import { transformItem } from "shared-utils";
import { decodeQs } from "utils";

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

  const getRowsCount = asyncAction({
    api: api.getRowsCount,
    type: types.GET_ROWS_COUNT,
    onSuccess: [action => actions.setData("totalRowsCount", action.payload[0].count)]
  });

  if (name === "modal") {
    return { ...doQuery, ...getRowsCount };
  }

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
    action$.ofType(modal.types.SAVE_ITEM_SUCCESS).mergeMap(
      action => {
      const { operation } = action.requestPayload;
      const item = action.payload;
      const state = Repo.get("store").getState();
      let data = [...state.app.listview._module.data.listview];

      const { moduleName } = decodeQs(window.location.search);

      let item_id = item.id.split('x');
      let replace_url = `/?view=detail&moduleName=${moduleName}&id=${item_id[1]}`;


      console.log( action$.ofType(modal.types.SAVE_ITEM_SUCCESS), item, state.router.location, replace_url );

      /* TODO - remove this if/else and add redirect to new item detail view */
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
    }
  );

    const getDefaultFilter = filters => (
      Object.entries(filters).map(item => {
        item[1].id = (item[0] != undefined) ? item[0] : undefined;
        item[1].label = (item[1] != undefined) ? item[1].name : undefined;
        return item[1];
      }).find( item => item.default )
    );

    const getFilters = asyncAction({
      api: api.getFilters,
      type: types.GET_FILTERS,
      onSuccess: [
        action => {
          //set data.filters
          return actions.setData("filters", action.payload.filters);
        },
        action => {
          let data = Repo.get("store").getState().app.listview._module.data;
          if( !data.currentFilter ){
            let defaultFilter = getDefaultFilter(action.payload.filters);

            //console.log('EPIC RESPONSE - DAFAULT', defaultFilter);
            // set data.currentFilter
            return actions.setData("currentFilter", defaultFilter);
          }

          return {type:''};
        },
        action => {
          let data = Repo.get("store").getState().app.listview._module.data;

          if( !data.currentFilter ){
            let defaultFilter = getDefaultFilter(action.payload.filters);

            // TODO
            // may need improvement to get pagination valirables
            // from reducer but currently I don't know how.
            // But it works! 👍
            return actions.doQuery({
              moduleName: action.requestPayload,
              pageLimit: 30,
              page: 1,
              sort: { property: "id", direction: "asc" },
              currentFilter: defaultFilter
            });
          }

          return {type:''};
        },
        action => {
          let data = Repo.get("store").getState().app.listview._module.data;

          if( !data.currentFilter ){
            let defaultFilter = getDefaultFilter(action.payload.filters);

            return actions.getRowsCount({
              moduleName: action.requestPayload,
              currentFilter: defaultFilter
            });
          }

          return {type:''};
        }
      ]
    });

  return { ...doQuery, ...doDelete, ...doRetrieve, onItemSaved, ...getRowsCount, ...getFilters };
};

export default epics;
