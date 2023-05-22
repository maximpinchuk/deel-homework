const { Profile } = require('../model');

const getById = async (profileId, params) => {
  return Profile.findOne({
    where: {
      id: profileId,
    },
    ...params,
  });
};

const update = async (data, whereClause) => {
  return Profile.update(data, whereClause);
};

module.exports = {
  getById,
  update,
};
