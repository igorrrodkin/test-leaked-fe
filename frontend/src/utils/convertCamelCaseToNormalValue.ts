export default (value: string) => {
  const isWithRegionsRegexp = new RegExp(/^WA|QLD|NSW|VIC|SA|ACT|NT|TAS$/).test(value);

  const result = isWithRegionsRegexp
    ? value.replace(/(WA)|(QLD)|(NSW)|(VIC)|(SA)|(ACT)|(NT)|(TAS)|(([a-z])([A-Z])){2}/g, '$1$2 $3')
      .replace(/(LPI)([A-Z])/g, ' $1 $2')
      .replace(/([a-z])([A-Z])/g, '$1 $2')
    : value.replace(/([a-z])([A-Z])/g, '$1 $2');

  return result.replace(/(\w)(\d+)/g, '$1 $2');
};
