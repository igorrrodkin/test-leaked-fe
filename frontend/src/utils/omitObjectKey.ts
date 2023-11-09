export default (obj: object, key: string): Record<string, any> => {
  const result = { ...obj };
  delete result[key];
  return result;
};
