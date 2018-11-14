import { epics as epicsUtils } from "shared-resource";

const { asyncAction } = epicsUtils.async;

const epics = ({ actions, api }) => {
  const login = asyncAction({
    api: api.login,
    type: actions.types.LOGIN,
    onRequest: [],
    onSuccess: [],
    onFailure: []
  });

  return { ...login };
};

export default epics;
