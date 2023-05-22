const jobsService = require('../services/jobs');
const { extractDateFromReq } = require('../common/utils');

const getBestProfession = async (req, res) => {
  const { start, end } = extractDateFromReq(req);

  const data = await jobsService.getBestProfession(start, end);
  res.json(data);
};

const getBestClients = async (req, res) => {
  const { start, end, limit } = extractDateFromReq(req);

  const data = await jobsService.getBestClients(start, end, limit ? Number(limit) : 2);
  res.json(data);
};

module.exports = {
  getBestProfession,
  getBestClients,
};
