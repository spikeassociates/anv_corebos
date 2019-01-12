import { epics as epicsUtils } from "shared-resource";
import { PersistentRepo } from "shared-repo";
import { changeRoute } from "shared-utils";

const transformModules = modules => {
  return Object.entries(modules).reduce((acc, [moduleName, data]) => {
    data.titleFields = data.fields
      .filter(field => field.summary === "T")
      .map(field => field.name);

    data.bodyFields = data.fields
      .filter(field => field.summary === "B")
      .map(field => field.name);

    data.headerFields = data.fields
      .filter(field => field.summary === "H")
      .map(field => field.name);

    data.fields = data.fields.reduce((acc, field) => {
      return { ...acc, [field.name]: field };
    }, {});

    data.filterFields.fields = (data.filterFields.fields || []).map(field => ({
      key: field,
      label: data.fields[field].label
    }));

    return { ...acc, [moduleName]: data };
  }, {});
};

const epics = ({ actions, api }) => {
  const { authentication, modal } = actions;
  const { asyncAction } = epicsUtils.async;

  const onAuth = action$ =>
    action$.ofType(authentication.types.AUTH).mergeMap(action => {
      PersistentRepo.set("token", action.payload.token);
      PersistentRepo.set("userId", action.payload.userId);

      return Observable.of(actions.getModules());
    });

  const getModules = asyncAction({
    api: api.getModules,
    type: actions.types.GET_MODULES,
    onSuccess: [
      action => {
        const modules = transformModules(action.payload);
        PersistentRepo.set("modules", modules);

        return actions.setData("modules", modules);
      }
    ]
  });

  const onItemSaved = action$ => {
    return action$.ofType(modal.types.SAVE_ITEM_SUCCESS).mergeMap(action => {
      changeRoute({ view: "list" });

      return action$.ignoreElements();
    });
  };

  const onSessionExpire = action$ => {
    return action$.ofType("REFRESH_LOGIN").mergeMap(action => {
      PersistentRepo.clear();

      return Observable.of(actions.setData("modules", {}));
    });
  };

  return { onAuth, onItemSaved, onSessionExpire, ...getModules };
};

export default epics;
