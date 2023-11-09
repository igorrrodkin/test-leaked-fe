export const ID_FOR_DROPDOWN_SELECT = 'idForDropdownSELECT=';

const dropdownSelectHelper = (str: string) => str.split(ID_FOR_DROPDOWN_SELECT)[0];

export default dropdownSelectHelper;
