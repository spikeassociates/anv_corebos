import Modular from "modular-redux";
import Resources from "../resources";
import { actions as actionsUtils } from "shared-resource";

const syncTypes = [];
const asyncTypes = ["SAVE_ITEM"];
const types = [
  ...syncTypes,
  ...actionsUtils.statefulTypes(asyncTypes),
  ...Resources.types
];

export default Modular.actions(types, Resources.getActions);
