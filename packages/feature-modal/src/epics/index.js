import { epics as epicsUtils } from "shared-resource";

const epics = ({ actions, api }) => {
  const { asyncAction } = epicsUtils.async;
  const { types } = actions;

  return {};
};

export default epics;
