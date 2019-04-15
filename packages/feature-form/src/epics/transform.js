const transformDependencies = dependencies => {
  return dependencies.dependency.reduce((acc, { field, condition, actions }) => {
    let conditions = condition ? JSON.parse(condition) : [];

    conditions = conditions.map(({ comparator, value, columncondition, field }) => ({
      name: field,
      value,
      comparator,
      operator: columncondition
    }));
    const dependency = { field, actions, conditions };

    return { ...acc, [field]: [...(acc[field] || []), dependency] };
  }, {});
};

export { transformDependencies };
