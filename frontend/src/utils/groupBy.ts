type GetKey<T> = (item: T) => string;

export const groupBy = <T>(items: T[], getKey: GetKey<T>) => {
  const groupedItems = items.reduce((previous, currentItem) => {
    const group = getKey(currentItem);
    if (!previous[group]) {
      return { ...previous, [group]: [currentItem] };
    }
    return { ...previous, [group]: [...previous[group], currentItem] };
  }, {} as Record<string, T[]>);

  return groupedItems;
};
