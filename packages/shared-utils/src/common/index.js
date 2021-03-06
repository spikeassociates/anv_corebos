const mapToDispatch = (dispatch, actions) =>
  Object.keys(actions).reduce(
    (obj, key) => ({ ...obj, [key]: (...args) => dispatch(actions[key](...args)) }),
    {}
  );

const mapToState = (state, selectors, selected) => {
  selected = selected ? selected : Object.keys(selectors);

  return selected.reduce((obj, key) => ({ ...obj, [key]: selectors[key](state) }), {});
};

const debounce = (fn, time) => {
  let timeout;
  return function(...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn.apply(this, args), time);
  };
};

const snakeToCamelCase = key => {
  const isSnake = key.match(/_+(\w)/g);

  if (isSnake) {
    key = key.toLowerCase().replace(/_+(\w)/g, (match, group) => group.toUpperCase());
  }

  return key;
};

const camelToSnakeCase = key =>
  key.replace(/(\B[A-Z])/g, (match, group) => `_${group.toLowerCase()}`);

const getUrl = url => (/^(f|ht)tps?:\/\//i.test(url) ? url : GLOBALS.BASE_API + url);

const getElemStyle = (selector, attribute) => {
  const elem = document.querySelector(selector);

  return elem ? window.getComputedStyle(elem)[attribute] : "0px";
};

export {
  mapToDispatch,
  mapToState,
  debounce,
  snakeToCamelCase,
  camelToSnakeCase,
  getUrl,
  getElemStyle
};
