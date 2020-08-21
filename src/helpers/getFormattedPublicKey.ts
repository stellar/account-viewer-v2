export const getFormattedPublicKey = (pk: string) =>
  pk ? `${pk.slice(0, 8)}…${pk.slice(52)}` : "";
