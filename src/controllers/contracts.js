const contractsService = require('../services/contracts');

const getById = async (req, res) => {
  const profileId = req.profile.id;
  const { id } = req.params;
  const contract = await contractsService.getById(id, profileId);

  if (!contract) {
    return res.status(404).end('Contract not found');
  }

  res.json(contract);
};

const getByUser = async (req, res) => {
  const profileId = req.profile.id;
  const contracts = await contractsService.getByProfileId(profileId);

  res.json(contracts);
};

module.exports = {
  getById,
  getByUser,
};
