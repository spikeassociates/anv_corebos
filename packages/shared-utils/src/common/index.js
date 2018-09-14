import { merge as lodashMerge } from "lodash-es";

const _range = (n, m) => [...Array(m - n).keys()].map(k => k + n);
const range = (...args) => {
  let [from, to] = args;
  if (to) {
    args = from > to ? [to, from] : [from, to];
    return _range(...args);
  }

  return _range(0, from);
};

const mapToDispatch = (dispatch, actions) =>
  Object.keys(actions).reduce(
    (obj, key) => ({ ...obj, [key]: (...args) => dispatch(actions[key](...args)) }),
    {}
  );

const mapToState = (state, selectors, selected) => {
  selected = selected ? selected : Object.keys(selectors);

  return selected.reduce((obj, key) => ({ ...obj, [key]: selectors[key](state) }), {});
};

const merge = (obj1 = {}, obj2 = {}) => lodashMerge(clone(obj1), obj2);

const debounce = (fn, time) => {
  let timeout;
  return function(...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn.apply(this, args), time);
  };
};

const transform = (keyFn, valFn) => item => {
  if (!isObj(item)) {
    return valFn(item);
  }

  let newItem = clone(item);

  if (isArr(newItem)) {
    return map(newItem, objToCamelCase);
  } else {
    newItem = mapKeys(newItem, (value, key) => {
      return keyFn(key);
    });

    return mapValues(newItem, value => {
      if (isPlainObj(value)) {
        return transform(keyFn, valFn)(value);
      } else if (isArr(value)) {
        return map(value, transform(keyFn, valFn));
      } else {
        return valFn(value);
      }
    });
  }
};

const undefineNull = x => (x === null || x === "null" ? undefined : x);

const snakeToCamelCase = key => {
  const isSnake = key.match(/_+(\w)/g);

  if (isSnake) {
    key = key.toLowerCase().replace(/_+(\w)/g, (match, group) => group.toUpperCase());
  }

  return key;
};

const camelToSnakeCase = key =>
  key.replace(/(\B[A-Z])/g, (match, group) => `_${group.toLowerCase()}`);

const objToCamelCase = transform(snakeToCamelCase, undefineNull);
const objToSnakeCase = transform(camelToSnakeCase, undefineNull);

const parseJSON = data => (isDefined(data) ? objToCamelCase(JSON.parse(data)) : data);

const isDefined = val => typeof val !== "undefined";

const capitalize = str => str.charAt(0).toUpperCase() + str.slice(1);

export {
  mapToDispatch,
  mapToState,
  merge,
  debounce,
  objToCamelCase,
  objToSnakeCase,
  snakeToCamelCase,
  camelToSnakeCase,
  parseJSON,
  isDefined,
  capitalize
};
