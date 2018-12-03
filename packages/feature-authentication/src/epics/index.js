import { epics as epicsUtils } from "shared-resource";
import { PersistentRepo } from "shared-repo";

const epics = ({ actions, api }) => {
  const { asyncAction } = epicsUtils.async;
  const { types } = actions;

  const challenge = asyncAction({
    api: api.challenge,
    type: types.CHALLENGE,
    onSuccess: [
      action =>
        actions.login({ ...action.requestPayload, accessToken: action.payload.token })
    ]
  });

  const login = asyncAction({
    api: api.login,
    type: types.LOGIN,
    onSuccess: [
      action => {
        const { sessionName, userId } = action.payload;
        return actions.auth({ token: sessionName, userId });
      }
    ]
  });

  const unauth = action$ =>
    action$
      .ofType(types.UNAUTH)
      .do(() => PersistentRepo.delete("token"))
      .ignoreElements();

  return { unauth, ...challenge, ...login };
};

export default epics;
