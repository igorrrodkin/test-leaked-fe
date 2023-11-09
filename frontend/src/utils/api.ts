export const getQueries = (data: { [key: string]: any }) => Object.entries(data)
  .reduce(
    (acc, [key, value]) => [...acc, `${key}=${String(value)}`],
    [] as string[],
  )
  .join('&');

export const getObjectFromQueries = (query: string) => {
  if (!query) {
    return {};
  }

  return query.split('&').reduce((acc, q) => {
    const [key, value] = q.split('=');
    return { ...acc, [key]: value };
  }, {});
};

export const getObjectFromQueriesForLogs = (query: string) => {
  if (!query) {
    return {};
  }

  return query.split('&').reduce((acc, q) => {
    const [key, value] = q.split('=');
    return {
      ...acc,
      [key]: key === 'searchInput'
        ? value.replaceAll('0x3D', '=')
        : value,
    };
  }, {});
};

export const fakeDelay = async <T>(data: T, delay = 500): Promise<T> => {
  const res = await new Promise<T>((resolve) => {
    setTimeout(() => {
      resolve(data);
    }, delay);
  });

  return res;
};
