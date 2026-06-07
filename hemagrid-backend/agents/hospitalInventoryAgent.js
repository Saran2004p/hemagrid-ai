const {
  getInventory
} = require(
  "../services/inventoryService"
);

async function hospitalInventoryAgent(
  request
) {

  const inventory =
    await getInventory();

  const matching =
    inventory.filter(
      item =>
        item.city === request.city &&
        item.bloodGroup === request.bloodGroup
    );

  if (matching.length === 0) {

    return {
      stockFound: false
    };
  }

  return {
    stockFound: true,
    hospitals: matching
  };
}

module.exports = {
  hospitalInventoryAgent
};