export const generateRandomAlphanumeric = (length: number): string => {
  const alphanumericCharacters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += alphanumericCharacters.charAt(Math.floor(Math.random() * alphanumericCharacters.length));
  }
  return result;
};
