import base from "shared-api";
import { PersistentRepo } from "shared-repo";
import { getModuleReferenceFields } from "shared-utils";

const buildCriteriaQuery = criteria => {
  let criteriaString = ``;
  switch (criteria.comparator) {
    case 'e': //equals
      criteriaString += ` (${criteria.columnname} = '${criteria.value}') ${criteria.column_condition}`;
      break;
    case 'n': //not equal to
      criteriaString += ` (${criteria.columnname} != '${criteria.value}') ${criteria.column_condition}`;
      break;
    case 's': //starts with
      criteriaString += ` (${criteria.columnname} like '${criteria.value}%') ${criteria.column_condition}`;
      break;
    case 'ew': //ends with
      criteriaString += ` (${criteria.columnname} like '%${criteria.value}') ${criteria.column_condition}`;
      break;
    case 'dnsw': //does not start with
      criteriaString += ` (${criteria.columnname} not like '${criteria.value}%') ${criteria.column_condition}`;
      break;
    case 'dnew': //does not end with
      criteriaString += ` (${criteria.columnname} not like '%${criteria.value}') ${criteria.column_condition}`;
      break;
    case 'c': //contains
      criteriaString += ` (${criteria.columnname} like '%${criteria.value}%') ${criteria.column_condition}`;
      break;
    case 'k': //does not contain
      criteriaString += ` (${criteria.columnname} not like '%${criteria.value}%') ${criteria.column_condition}`;
      break;
    case 'bw': //between (used in stdConditions)
      let bwCriteria = criteria.value.split(',');
      let dStart = new Date(bwCriteria[0]).toJSON().slice(0, 19).replace('T', ' ');
      let dEnd   = new Date(bwCriteria[1]).toJSON().slice(0, 19).replace('T', ' ');
      criteriaString += ` (${criteria.columnname} >= '${dStart}' and ${criteria.columnname} <= '${dEnd}') ${criteria.column_condition}`;
      break;
    default:
      criteriaString += ``;
  }
  return criteriaString;
}

const buildQueryFilter = currentFilter => {
  let queryFilter = ` where`; //default
  if( currentFilter && Object.keys(currentFilter).length ){

    //build the query string and join criteria
    let advCriteria = JSON.parse(currentFilter.advcriteria);
    (advCriteria.length)
      ? queryFilter += advCriteria.map(criteria => (buildCriteriaQuery(criteria))).join(' ')
      : '';

    //add stdcriteria if any
    let stdCriteria = JSON.parse(currentFilter.stdcriteria);
    (stdCriteria.length)
      ? queryFilter += ` and` + stdCriteria.map(criteria => (buildCriteriaQuery(criteria))).join(' ')
      : '';
  }

  //if filter hasn't changed, clear the filter query string
  (queryFilter == ' where') ? queryFilter = '' : null;

  return queryFilter;
}

const api = {
  doQuery: ({ moduleName, page = 1, pageLimit = 0, sort, currentFilter }) => {
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

    const queryFilter = buildQueryFilter(currentFilter);
    //console.log(queryFilter); 

    return base.get("", {
      operation: "query",
      elementType: GLOBALS.MODULES.join(","),
      query: `select ${fields} from ${moduleName} ${queryFilter} order by ${property} ${direction} limit ${offset}, ${pageLimit};`
    });
  },

  doDelete: id => base.post("", { operation: "delete", id }),

  doRetrieve: ({ id }) => base.get("", { operation: "retrieve", id }),

  getRowsCount: ({moduleName, currentFilter}) => {
    const queryFilter = currentFilter ? buildQueryFilter(currentFilter) : '';

    return base.get("", {
      operation: "query",
      elementType: moduleName,
      query: `select count(*) from ${moduleName} ${queryFilter};`
    })
  },

  getFilters: moduleName => {

    console.log('API');

    return base.get("", {
      operation: "getViewsByModule",
      module: moduleName,
  })
  }
};

export default api;
