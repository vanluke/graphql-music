export const removeUndefinedFields = (obj: { [key: string]: any }) =>
  Object.keys(obj).reduce((acc, curr) => {
    if (typeof obj[curr] === 'undefined') {
      return acc;
    }
    acc[curr] = obj[curr];
    return acc;
  }, <{ [key: string]: any }>{});

export const removeWhiteSpaces = (value: string) =>
  value && value.replace(/\s/g, '');
