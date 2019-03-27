import Modular from "modular-redux";
import Resources from "../resources";
import { actions as actionsUtils } from "shared-resource";

const syncTypes = [];
const asyncTypes = [
  "DO_RETRIEVE",
  "GET_RELATED_RECORDS",
  "GET_WIDGETS",
  "EXCECUTE_BUSINESS_ACTION",
  "UPDATE_FIELD"
];
const types = [
  ...syncTypes,
  ...actionsUtils.statefulTypes(asyncTypes),
  ...Resources.types
];

export default Modular.actions(types, Resources.getActions);
