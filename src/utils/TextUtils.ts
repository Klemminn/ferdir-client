export const capitalize = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const thousandSeparator = (str: number | string) => {
  return str.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
};

export const dotToComma = (str: number | string) => {
  return str.toString().replace('.', ',');
};
