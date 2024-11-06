export const generatePassword = (
  isUppercaseOn,
  isLowercaseOn,
  isNumbersOn,
  isSymbolsOn,
  passwordLength
) => {
  const uppercases = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const lowercases = 'abcdefghijklmnopqrstuvwxyz';
  const numbers = '0123456789';
  const symbols = '!@#$%^&*()_+{}[]|:;<>,.?/~';

  let charset = '';
  if (isUppercaseOn) charset += uppercases;
  if (isLowercaseOn) charset += lowercases;
  if (isNumbersOn) charset += numbers;
  if (isSymbolsOn) charset += symbols;

  let newPassword = '';
  for (let i = 0; i < passwordLength; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    newPassword += charset.charAt(randomIndex);
  }

  return newPassword;
};
