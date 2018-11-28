const transformItem = (moduleMeta, data) => {
  const { fields, titleFields, headerFields, bodyFields } = moduleMeta;

  const formatValue = field => {
    const type = moduleMeta.fields[field].type.name;
    const isReference = type === "reference" || type === "owner";

    if (isReference && data[field]) {
      return data[`${field}ename`].reference;
    } else if (type === "boolean" && data[field] !== "") {
      return data[field] == 0 ? "No" : "Yes";
    } else if (fields[field].uitype == 69) {
      return data[`${field}imageinfo`].fullpath;
    }

    return data[field];
  };

  return {
    id: data.id,
    title: titleFields.map(field => data[field]).join(" "),
    headerData: headerFields.map(field => ({
      ...fields[field],
      label: fields[field].label,
      value: formatValue(field)
    })),
    bodyData: bodyFields.map(field => ({
      ...fields[field],
      label: fields[field].label,
      value: formatValue(field)
    }))
  };
};

export { transformItem };
