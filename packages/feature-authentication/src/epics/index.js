import { epics as epicsUtils } from "shared-resource";
import { PersistentRepo } from "shared-repo";

const epics = ({ actions, api }) => {
  const { asyncAction } = epicsUtils.async;
  const { types } = actions;

  const challenge = asyncAction({
    api: api.challenge,
    type: actions.types.CHALLENGE,
    onSuccess: [
      action =>
        actions.login({ ...action.requestPayload, accessToken: action.payload.token })
    ]
  });

  const login = asyncAction({
    api: api.login,
    type: actions.types.LOGIN,
    onSuccess: [action => actions.auth({ token: action.payload.sessionName })]
  });

  const auth = action$ =>
    action$
      .ofType(types.AUTH)
      .do(action => PersistentRepo.set("token", action.payload.token))
      .ignoreElements();

  const unauth = action$ =>
    action$
      .ofType(types.UNAUTH)
      .do(() => PersistentRepo.delete("token"))
      .ignoreElements();

  return { auth, unauth, ...challenge, ...login };
};

export default epics;
