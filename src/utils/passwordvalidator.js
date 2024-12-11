export const isPasswordValid = (password, confirmPassword) => {
  const length = password.length >= 8;
  const alphaNumeric = /^(?=.*[a-zA-Z])(?=.*\d).+$/.test(password);
  const specialCharacter = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  const match = password === confirmPassword;

  return length && alphaNumeric && specialCharacter && match;
};
