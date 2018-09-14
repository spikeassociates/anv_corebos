import { combineEpics } from "redux-observable";

const feature = {
  feature: "epics",
  combiner: (moduleFeature, depFeatures, module) => {
    const moduleEpics = Object.values(moduleFeature).filter(x => !!x);
    const depEpics = Object.values(depFeatures).filter(x => !!x);
    const epics = [...moduleEpics, ...depEpics];

    return {
      epic: combineEpics(...epics)
    };
  }
};

export default { feature };
