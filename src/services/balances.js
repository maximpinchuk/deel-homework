const { sequelize } = require('../model');
const { PROFILE_TYPE } = require('../common/constants');
const profileService = require('../services/profile');
const jobsService = require('../services/jobs');

const depositMoney = async (profileId, amount) => {
  await sequelize.transaction(async (t) => {
    const profile = await profileService.getById(profileId, { transaction: t });
    if (!profile) {
      throw new Error('User not found');
    }
    if (profile.type !== PROFILE_TYPE.CLIENT) {
      throw new Error('Only clients allowed to deposit money');
    }

    const { totalPrice } = await jobsService.getJobsTotalPriceByProfileId(
      profileId,
      { transaction: t }
    );

    if (amount > totalPrice / 4) {
      throw new Error('Only 25% of client debt could be deposit');
    }

    await profileService.update(
      { balance: profile.balance + amount },
      { where: { id: profile.id }, transaction: t }
    );
  });
};

module.exports = {
  depositMoney,
};
