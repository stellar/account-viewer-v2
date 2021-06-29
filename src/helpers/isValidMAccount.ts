export const isValidMAccount = (value: string) =>
  value.startsWith("M") && value.length === 69;
