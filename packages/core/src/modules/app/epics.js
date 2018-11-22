import { epics as epicsUtils } from "shared-resource";
import { PersistentRepo } from "shared-repo";

const epics = ({ actions, api }) => {
  const { authentication } = actions;
  const { asyncAction } = epicsUtils.async;

  const onAuth = action$ =>
    action$
      .ofType(authentication.types.AUTH)
      .mergeMap(action => Observable.of(actions.getModules()));

  const getModules = asyncAction({
    api: api.getModules,
    type: actions.types.GET_MODULES,
    onSuccess: [
      action => {
        PersistentRepo.set("modules", action.payload);
        return actions.setData("modules", action.payload);
      }
    ]
  });

  return { onAuth, ...getModules };
};

export default epics;
