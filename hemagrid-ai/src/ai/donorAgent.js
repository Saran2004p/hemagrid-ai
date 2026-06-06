import mockDonors from "../data/mockDonors";

export const rankDonors = () => {
  return [...mockDonors].sort(
    (a, b) => b.reliability - a.reliability
  );
};