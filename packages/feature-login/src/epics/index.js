import { epics as epicsUtils } from "shared-resource";

const { asyncAction } = epicsUtils.async;

const epics = ({ actions, api }) => {
  const challenge = asyncAction({
    api: api.challenge,
    type: actions.types.CHALLENGE,
    onRequest: [],
    onSuccess: [
      action => {
        console.log(actions, action);

        // return actions.login(action.requestPayload);
      }
    ],
    onFailure: []
  });

  const login = asyncAction({
    api: api.login,
    type: actions.types.LOGIN,
    onRequest: [],
    onSuccess: [],
    onFailure: []
  });

  return { ...challenge, ...login };
};

export default epics;
