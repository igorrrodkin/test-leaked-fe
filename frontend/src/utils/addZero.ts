export default (value: string | number) => {
  const stringValue = String(value);

  if (+value < 10) return `0${stringValue}`;
  return stringValue;
};
