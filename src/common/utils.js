function extractDateFromReq(req) {
  const monthMilliseconds = 24 * 60 * 60 * 1000 * 30;
  const currentDate = Date.now();
  const fallbackStartDate = currentDate - monthMilliseconds;

  return {
    start: req.query.start ? Number(req.query.start) : fallbackStartDate,
    end: req.query.end ? Number(req.query.end) : currentDate,
  };
}

module.exports = {
  extractDateFromReq,
};
