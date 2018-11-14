import Modular from "modular-redux";
import Resources from "../resources";
import { actions as actionsUtils } from "shared-resource";

const syncTypes = [];
const asyncTypes = ["CHALLENGE", "LOGIN"];
const types = [...syncTypes, ...actionsUtils.statefulTypes(asyncTypes)];

export default Modular.actions(types, Resources.getActions);
