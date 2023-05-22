const { Op, fn, col } = require('sequelize');
const { Contract, Job, Profile, sequelize } = require('../model');
const { CONTRACT_STATUS, PROFILE_TYPE } = require('../common/constants');
const profileService = require('../services/profile');

const getActiveJobsByProfileId = async (profileId, isPaid) => {
  const jobs = await Job.findAll(
    {
      where: {
        paid: { [Op.or]: isPaid ? [true] : [false, null] },
      },
      include: {
        model: Contract,
        as: 'Contract',
        attributes: [],
        where: {
          status: CONTRACT_STATUS.IN_PROGRESS,
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
    },
    { raw: true }
  );

  return jobs;
};

const getJobById = async (jobId, profileId) => {
  const job = await Job.findOne(
    {
      where: {
        id: jobId,
      },
      include: {
        model: Contract,
        as: 'Contract',
        where: {
          [Op.or]: [
            {
              ClientId: profileId,
            },
          ],
        },
      },
    },
    { raw: true }
  );

  return job;
};

const getJobsTotalPriceByProfileId = async (profileId, params) => {
  const jobs = await Job.findOne({
    where: {
      paid: {
        [Op.or]: [null, false],
      },
    },
    attributes: [[fn('sum', col('price')), 'totalPrice']],
    include: {
      model: Contract,
      as: 'Contract',
      where: {
        status: {
          [Op.ne]: CONTRACT_STATUS.TERMINATED,
        },
        ClientId: profileId,
      },
    },
    raw: true,
    nest: true,
    ...params,
  });

  return jobs;
};

const payForJob = async (profile, jobId) => {
  await sequelize.transaction(async (t) => {
    const job = await getJobById(jobId, profile.id);
    if (!job) {
      throw new Error('Job is not exists');
    }

    if (job.paid) {
      throw new Error('Job is already paid');
    }
    if (profile.balance < job.price) {
      throw new Error('Insufficient funds on the balance');
    }

    await Promise.all([
      profileService.update(
        { balance: profile.balance - job.price },
        { where: { id: profile.id }, transaction: t }
      ),
      profileService.update(
        { balance: profile.balance + job.price },
        { where: { id: job.Contract.ContractorId }, transaction: t }
      ),
      Job.update(
        { paid: true, paymentDate: Date.now() },
        { where: { id: jobId }, transaction: t }
      ),
    ]);
  });
};

const getBestProfession = async (startDate, endDate) => {
  return Job.findOne({
    where: {
      paymentDate: { [Op.between]: [startDate, endDate] },
      paid: true,
    },
    order: [['totalEarned', 'DESC']],
    attributes: [
      [fn('sum', col('price')), 'totalEarned'],
      'Contract.Contractor.profession',
    ],
    include: [
      {
        model: Contract,
        as: 'Contract',
        attributes: [],
        include: [
          {
            attributes: [],
            model: Profile,
            as: 'Contractor',
          },
        ],
      },
    ],
    group: ['Contract.Contractor.profession'],
    raw: true,
  });
};

const getBestClients = async (startDate, endDate, limit) => {
  const data = await Job.findAll({
    where: {
      paymentDate: { [Op.between]: [startDate, endDate] },
      paid: true,
    },
    order: [['paid', 'DESC']],
    attributes: [
      [fn('sum', col('price')), 'paid'],
      'Contract.Client.id',
      'Contract.Client.firstName',
      'Contract.Client.lastName',
    ],
    include: [
      {
        model: Contract,
        as: 'Contract',
        attributes: [],
        include: [
          {
            model: Profile,
            as: 'Client',
            attributes: ['id', 'firstName', 'lastName'],
            where: {
              type: PROFILE_TYPE.CLIENT,
            },
          },
        ],
      },
    ],
    group: ['Contract.Client.id'],
    limit,
    nest: true,
    raw: true,
  });

  return data.map((client) => {
    return {
      id: client.Contract?.Client?.id,
      fullName: `${client.Contract?.Client?.firstName || ''} ${
        client.Contract?.Client?.lastName || ''
      }`,
      paid: client.paid,
    };
  });
};

module.exports = {
  getActiveJobsByProfileId,
  getJobById,
  payForJob,
  getJobsTotalPriceByProfileId,
  getBestProfession,
  getBestClients,
};
