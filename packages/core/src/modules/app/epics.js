import { epics as epicsUtils } from "shared-resource";
import { PersistentRepo } from "shared-repo";

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

    data.filterFields.fields = data.filterFields.fields.map(field => ({
      key: field,
      label: data.fields[field].label
    }));

    return { ...acc, [moduleName]: data };
  }, {});
};

const epics = ({ actions, api }) => {
  const { authentication } = actions;
  const { asyncAction } = epicsUtils.async;

  const onAuth = action$ =>
    action$.ofType(authentication.types.AUTH).mergeMap(action => {
      PersistentRepo.set("token", action.payload.token);
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

  return { onAuth, ...getModules };
};

export default epics;
