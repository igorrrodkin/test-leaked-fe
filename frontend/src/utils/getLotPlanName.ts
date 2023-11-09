export const getLotPlanName = (value: string) => {
  let splitLotPlanNumber;

  if (/\//.test(value)) {
    const [left, right] = value.split('/');
    const splitRight = right.split(/(\D{2})/);
    splitLotPlanNumber = [
      left,
      splitRight[1],
      splitRight[2],
    ];
  } else {
    splitLotPlanNumber = value.replace(/\//g, '').split(/(\D{2})/);
  }

  return `${splitLotPlanNumber[0] ? `${splitLotPlanNumber[0]}/` : ''}${splitLotPlanNumber[1]}${splitLotPlanNumber[2]}`;
};
