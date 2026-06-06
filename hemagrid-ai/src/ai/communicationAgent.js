export const createMessage = (donor) => {
  return `
Hello ${donor.name},

A nearby patient urgently needs ${donor.bloodGroup} blood.

Can you help?
`;
};