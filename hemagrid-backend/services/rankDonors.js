async function rankDonors(
  request,
  donors
) {
  const ranked = donors.map(
    (d) => ({
      ...d,
      score:
        d.lastDonationDays,
    })
  );

  ranked.sort(
    (a, b) => b.score - a.score
  );

  return ranked.slice(0, 5);
}

module.exports = {
  rankDonors,
};