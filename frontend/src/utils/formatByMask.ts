type Values = {
  [p in string]: string
};

export default (mask: string, values: Values) => {
  let formattedMask = mask;

  const entries = Object.entries(values);

  entries.forEach(([key, value]) => {
    const placeholder = `{{${key}}}`;
    formattedMask = formattedMask.replace(placeholder, value);
  });

  return formattedMask;
};
