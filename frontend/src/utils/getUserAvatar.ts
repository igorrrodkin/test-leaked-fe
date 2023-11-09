export default (name: string, isForInitials: boolean = true) => {
  const splitName = name.split(' ');

  if (splitName.length > 1 && isForInitials) {
    return `${splitName[0][0]}${splitName[splitName.length - 1][0]}`.toUpperCase();
  }

  return name.substring(0, isForInitials ? 2 : 1).toUpperCase();
};
