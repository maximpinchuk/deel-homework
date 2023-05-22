const balancesService = require('../services/balances');
const { PROFILE_TYPE } = require('../common/constants');

const depositMoney = async (req, res) => {
  if (req.profile.type !== PROFILE_TYPE.CLIENT) {
    return res.status(422).end('Only clients allowed to deposit money');
  }

  const { userId } = req.params;
  const { amount } = req.body;

  await balancesService.depositMoney(userId, amount);
  res.status(200).end('Successfull deposit');
};

module.exports = {
  depositMoney,
};
