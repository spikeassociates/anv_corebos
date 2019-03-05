import { epics as epicsUtils } from "shared-resource";

import { transformDependencies } from "./transform";

const epics = ({ actions, api }) => {
  const { asyncAction } = epicsUtils.async;
  const { types } = actions;

  const doRetrieve = asyncAction({
    api: api.doRetrieve,
    type: types.DO_RETRIEVE,
    onSuccess: [
      action => actions.setData("initial", action.payload),
      action => actions.setShown("form")
    ]
  });

  const getFieldDependencies = asyncAction({
    api: api.getFieldDependencies,
    type: types.GET_FIELD_DEPENDENCIES,
    onSuccess: [
      action => {
        let dependencies;
        const data = action.payload;

        if (data.length) {
          dependencies = JSON.parse(data[0].contentjson).dependencies;
          dependencies = transformDependencies(dependencies);
        }

        return actions.setData("fieldDependencies", dependencies);
      }
    ]
  });

  return { ...doRetrieve, ...getFieldDependencies };
};

export default epics;
