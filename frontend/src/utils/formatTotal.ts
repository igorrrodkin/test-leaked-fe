const formatTotal = (totalItem?: string | null) => (totalItem ? `$${(+totalItem / 100).toFixed(2)}` : '-');

export default formatTotal;
