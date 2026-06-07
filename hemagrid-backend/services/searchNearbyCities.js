const cityMap = {

  Hyderabad: [
    "Secunderabad",
    "Warangal",
    "Nizamabad"
  ],

  Chennai: [
    "Tambaram",
    "Vellore",
    "Kanchipuram"
  ],

  Bangalore: [
    "Mysore",
    "Tumkur",
    "Hosur"
  ]
};

async function searchNearbyCities(
  city
) {
  return cityMap[city] || [];
}

module.exports = {
  searchNearbyCities
};