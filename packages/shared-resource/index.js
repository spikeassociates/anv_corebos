import { snakeToCamelCase, camelToSnakeCase, capitalize } from "shared-utils";
import { PersistentRepo } from "shared-repo";

import actionUtils from "./action";
import reducerUtils from "./reducer";
import epicUtils from "./epic";
import selectorUtils from "./selector";

class Resource {
  constructor(resources) {
    this.resources = resources;
    this.reducer = reducerUtils;
    this.getActions = actionUtils.generateActions;
    this.types = this.types();
  }

  types = () => {
    const actions = this.resources
      .map(resource => [
        `get_${resource}`,
        `create_${resource}`,
        `update_${resource}`,
        `delete_${resource}`
      ])
      .reduce((acc, elem) => acc.concat(elem), [])
      .map(action => camelToSnakeCase(action).toUpperCase());

    return [
      ...actionUtils.statefulTypes(actions),
      "SET_DATA",
      "PUSH_DATA",
      "SET_SHOWN",
      "SET_BUSY"
    ];
  };

  epics = (actions, api) => {
    this.actions = actions;
    this.api = api;

    return this.resources.reduce(
      (obj, resource) => ({
        ...obj,
        [resource]: this.resource(resource)
      }),
      {}
    );
  };

  request(resourceName, reqType, { onRequest = [], onSuccess = [], onFailure = [] }) {
    const type = this.actions.types[
      `${reqType.toUpperCase()}_${camelToSnakeCase(resourceName).toUpperCase()}`
    ];
    const ccType = snakeToCamelCase(type.split("/").pop());

    return epicUtils.async.asyncAction({
      api: this.api[ccType],
      type,
      onRequest: [...onRequest, action => this.actions.setBusy(ccType)],
      onSuccess: [
        ...onSuccess,
        action => this.actions.setBusy(ccType, false),
        action => this.actions.setShown(ccType, false)
      ],
      onFailure: [
        ...onFailure,
        action => this.actions.setBusy(ccType, false),
        action => this.actions.setShown(ccType, false),
        ...(this.actions.authentication && this.actions.notifications
          ? [
              action => {
                switch (action.payload.status) {
                  case 1337:
                    PersistentRepo.delete("token");
                    return this.actions.authentication.unauth(action.payload);
                  default:
                    return this.actions.notifications.add(action.payload);
                }
              }
            ]
          : [])
      ]
    });
  }

  resource(name) {
    return {
      get: (handlers = {}) => this.request(name, "get", handlers),
      update: (handlers = {}) => this.request(name, "update", handlers),
      create: (handlers = {}) => this.request(name, "create", handlers),
      delete: (handlers = {}) =>
        this.request(name, "delete", {
          ...handlers,
          onSuccess: [
            action => this.actions.setShown(`update${capitalize(name)}`, false),
            ...(handlers.onSuccess || [])
          ]
        })
    };
  }
}

export {
  actionUtils as actions,
  reducerUtils as reducer,
  epicUtils as epics,
  selectorUtils as selectors
};
export default Resource;
