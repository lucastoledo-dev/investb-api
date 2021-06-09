


export default async (req, res) => {
  res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate');
  const { fii } = req.query
  const url = "https://www.fundsexplorer.com.br/funds/"+fii;
  const model = {
    fii: '#head > div > div > div > div.ticker-wrapper > h1 ($ | trim)'
  }

  const scrapy = require('node-scrapy')
  const fetch = require('node-fetch')

  return fetch(url)
    .then((res) => res.text())
    .then((body) => {
      const result = scrapy.extract(body, model)
      if (!result) {
        res.status(404);
        res.json({
          message: 'IES Não encontrada',
          type: 'IES_CODE_NOT_FOUND',
        });
          return;
      }else{
        res.json(result);
      }
  });
};


