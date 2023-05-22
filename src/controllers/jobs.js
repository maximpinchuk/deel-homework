const jobsService = require('../services/jobs');
const { PROFILE_TYPE } = require('../common/constants');

const getUnpaidJobsByProfileId = async (req, res) => {
  const profileId = req.profile.id;
  const jobs = await jobsService.getActiveJobsByProfileId(profileId, false);

  res.json(jobs);
};

const payForJob = async (req, res) => {
  if (req.profile.type !== PROFILE_TYPE.CLIENT) {
    return res.status(422).end('Only clients could pay for a job');
  }

  await jobsService.payForJob(req.profile, req.params.job_id);
  res.status(200).end('Successfull payment for a Job');
};

module.exports = {
  getUnpaidJobsByProfileId,
  payForJob,
};
