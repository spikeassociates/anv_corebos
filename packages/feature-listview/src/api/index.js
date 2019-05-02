import base from "shared-api";
import { PersistentRepo } from "shared-repo";
import { getModuleReferenceFields } from "shared-utils";

const buildAdvCriteriaQuery = advCriteria => {
  let advCriteriaString = ``;
  switch (advCriteria.comparator) {
    case 'e': //equals
      advCriteriaString += ` (${advCriteria.columname} = '${advCriteria.value}') ${advCriteria.column_condition}`;
      break;
    case 'n': //not equal to
      advCriteriaString += ` (${advCriteria.columname} != '${advCriteria.value}') ${advCriteria.column_condition}`;
      break;
    case 's': //starts with
      advCriteriaString += ` (${advCriteria.columname} like '${advCriteria.value}%') ${advCriteria.column_condition}`;
      break;
    case 'ew': //ends with
      advCriteriaString += ` (${advCriteria.columname} like '%${advCriteria.value}') ${advCriteria.column_condition}`;
      break;
    case 'dnsw': //does not start with
      advCriteriaString += ` (${advCriteria.columname} not like '${advCriteria.value}%') ${advCriteria.column_condition}`;
      break;
    case 'dnew': //does not end with
      advCriteriaString += ` (${advCriteria.columname} not like '%${advCriteria.value}') ${advCriteria.column_condition}`;
      break;
    case 'c': //contains
      advCriteriaString += ` (${advCriteria.columname} like '%${advCriteria.value}%') ${advCriteria.column_condition}`;
      break;
    case 'k': //does not contain
      advCriteriaString += ` (${advCriteria.columname} not like '%${advCriteria.value}%') ${advCriteria.column_condition}`;
      break;
    default:
      advCriteriaString += ``;
  }
  return advCriteriaString;
}

const buildQueryFilter = filterData => {
  let queryFilter = ` where`; //default
  if( Object.keys(filterData).length && Object.keys(filterData.data).length ){
    if( filterData.data.advcriteria != '' ){
      //build the query string and join criteria
      queryFilter += JSON.parse(filterData.data.advcriteria).map(criteria => (buildAdvCriteriaQuery(criteria))).join(' ');
    }

    //add stdcriteria if any
    if( filterData.data.stdcriteria != '' ){
      queryFilter += ` and ${filterData.data.stdcriteria}`;
    }
  }

  //if filter hasn't changed, clear the filter query string
  if( queryFilter == ' where' ){
    queryFilter = ``;
  }

  return queryFilter;
}

const api = {
  doQuery: ({ moduleName, page = 1, pageLimit = 0, sort, filterData }) => {
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

    const queryFilter = buildQueryFilter(filterData);

    return base.get("", {
      operation: "query",
      elementType: GLOBALS.MODULES.join(","),
      query: `select ${fields} from ${moduleName} ${queryFilter} order by ${property} ${direction} limit ${offset}, ${pageLimit};`
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
