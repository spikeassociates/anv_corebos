const formatValue = (field, moduleMeta, data) => {
  const { fields } = moduleMeta;

  if (!fields[field]) {
    return data[field];
  }

  const type = fields[field].type.name;
  const isReference = type === "reference" || type === "owner";

  if (isReference && data[field]) {
    return data[`${field}ename`].reference;
  } else if (type === "boolean" && data[field] !== "") {
    return data[field] == 0 ? "No" : "Yes";
  } else if (fields[field].uitype == 69 && data[field]) {
    return data[`${field}imageinfo`].fullpath;
  }

  return data[field];
};

const transformItem = (moduleMeta, data) => {
  const { fields, titleFields, headerFields, bodyFields } = moduleMeta;

  return {
    id: data.id,
    data: [...titleFields, ...headerFields, ...bodyFields].reduce(
      (acc, field) => ({ ...acc, [field]: formatValue(field, moduleMeta, data) }),
      {}
    ),
    title: titleFields.map(field => data[field]).join(" "),
    headerData: headerFields.map(field => ({
      ...fields[field],
      value: formatValue(field, moduleMeta, data)
    })),
    bodyData: bodyFields.map(field => ({
      ...fields[field],
      value: formatValue(field, moduleMeta, data)
    }))
  };
};

const getFieldsGroupedBySection = fields =>
  Object.values(fields)
    .filter(field => field.block)
    .reduce((acc, field) => {
      const blockId = field.block.blockid;
      const blockFields = acc[blockId] || [];
      return { ...acc, [blockId]: [...blockFields, field] };
    }, {});

const getSections = fields => {
  const groupedFields = getFieldsGroupedBySection(fields);

  return Object.values(groupedFields)
    .map(items => items[0].block)
    .sort((a, b) => (a.blocksequence > b.blocksequence ? 1 : -1));
};

const getExpandedSections = fields =>
  Object.keys(getFieldsGroupedBySection(fields)).reduce(
    (acc, id) => ({
      ...acc,
      [id]: true
    }),
    {}
  );

export {
  transformItem,
  getFieldsGroupedBySection,
  getSections,
  getExpandedSections,
  formatValue
};
