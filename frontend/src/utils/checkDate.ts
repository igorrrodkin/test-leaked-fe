export default (date: string, returnString = false) => {
  const [day, month, year] = date.split('/');

  if (typeof +day === 'number'
    && typeof +month === 'number'
    && typeof +year === 'number'
    && +month <= 12 && +month >= 1
    && Date.parse(`${month}/${day}/${year}`)
  ) return !returnString ? new Date(`${month}/${day}/${year}`) : `${day}/${month}/${year}`;

  return '';
};
