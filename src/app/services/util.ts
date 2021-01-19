export const isNullOrUndefined = (param) => {
    return param === null || param === undefined;
}
export const quoteWrapper = (doubleQuote, content) => {
  if (doubleQuote) return `"${content}"`;
  return `'${content}'`;
}
