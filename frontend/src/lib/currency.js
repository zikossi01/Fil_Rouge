export const formatMAD = (value) => {
  const number = Number(value) || 0;
  return new Intl.NumberFormat('fr-MA', { style: 'currency', currency: 'MAD' }).format(number);
};

export default formatMAD;






