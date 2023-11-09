const exceptions = ['password'];

export default (oldData: Object, newData: Object) => Object.keys(oldData).some((key) => {
  if (oldData.hasOwnProperty.call(newData, key)) {
    return JSON.stringify(oldData[key]) !== JSON.stringify(newData[key]);
  }

  return false;
}) || Object.keys(newData).some((key) => exceptions.includes(key));
