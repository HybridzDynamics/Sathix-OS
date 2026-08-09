const startScraper = async (req, res, next) => {
  try {
    res.json({ message: 'Scraper start endpoint is not implemented yet' });
  } catch (error) {
    next(error);
  }
};

const getStatus = async (req, res, next) => {
  try {
    res.json({ status: 'idle' });
  } catch (error) {
    next(error);
  }
};

module.exports = { startScraper, getStatus };
