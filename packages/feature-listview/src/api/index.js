import base from "shared-api";
import { PersistentRepo } from "shared-repo";
import { getModuleReferenceFields } from "shared-utils";

const api = {
  doQuery: ({ moduleName, page = 1, pageLimit = 0, sort }) => {
    const modules = PersistentRepo.get("modules");
    const columns = modules[moduleName].filterFields.fields.map(({ key }) => key);

    let fields = getModuleReferenceFields(moduleName);
    fields = Object.values(fields).reduce((acc, { targetModule, targetFields }) => {
      targetFields = targetFields.map(field => `${targetModule}.${field}`);
      return [...acc, ...targetFields];
    }, columns);
    fields = fields.join(", ");

    const { property, direction } = sort;
    page -= 1;
    const offset = page * pageLimit;

    return base.get("", {
      operation: "query",
      elementType: GLOBALS.MODULES.join(","),
      query: `select ${fields} from ${moduleName} order by ${property} ${direction} limit ${offset}, ${pageLimit};`
    });
  },

  doDelete: id => base.post("", { operation: "delete", id }),

  doRetrieve: ({ id }) => base.get("", { operation: "retrieve", id }),

  getRowsCount: moduleName =>
    base.get("", {
      operation: "query",
      elementType: moduleName,
      query: `select count(*) from ${moduleName};`
    }),

  getFilters: moduleName =>
    base.get("", {
      operation: "getViewsByModule",
      module: moduleName,
  })
        
};

export default api;
