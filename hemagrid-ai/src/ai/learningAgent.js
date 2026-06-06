export const updateReliability = (
  current,
  responded
) => {
  return responded
    ? current + 1
    : current - 1;
};