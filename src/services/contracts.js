const { Op } = require('sequelize');
const { Contract } = require('../model');
const { CONTRACT_STATUS } = require('../common/constants');

const getById = async (contractId, profileId) => {
  const contract = await Contract.findOne(
    {
      where: {
        id: contractId,
        [Op.or]: [
          {
            ContractorId: profileId,
          },
          {
            ClientId: profileId,
          },
        ],
      },
    },
    { raw: true }
  );
  return contract;
};

const getByProfileId = async (profileId) => {
  const contracts = await Contract.findAll(
    {
      where: {
        status: { [Op.ne]: CONTRACT_STATUS.TERMINATED },
        [Op.or]: [
          {
            ContractorId: profileId,
          },
          {
            ClientId: profileId,
          },
        ],
      },
    },
    { raw: true }
  );

  return contracts;
};

module.exports = {
  getById,
  getByProfileId,
};
